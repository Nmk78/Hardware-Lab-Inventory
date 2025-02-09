import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient, User } from "@prisma/client";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);
  const clerk = await clerkClient();

  console.log("userData from webhook🔥🔥🔥🔥🔥🔥:", evt.data);

  switch (eventType) {
    case "user.created":
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      await clerk.users.updateUser(evt.data.id, {
        publicMetadata: {
          role: "7",
        },
      });
      const user = {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { imageUrl: image_url } : {})
      }
  
      await createUser(user as User)
      console.log("userId:", evt.data);

      break;
    case "user.updated":

      await clerk.users.updateUser(evt.data.id, {
        publicMetadata: {
          role: "user",
        },
      });
      UpdateUser(id, user as User);
      break;

    case "user.deleted":
      deleteUser(evt.data.id);
      break;

    default:
      break;
  }

  return new Response("Webhook received", { status: 200 });
}
const prisma = new PrismaClient();

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data });
    return { user };
  } catch (error) {
    return { error };
  }
}

// export async function getUserById({
//   id,
//   clerkUserId,
// }: {
//   id?: string;
//   clerkUserId?: string;
// }) {
//   try {
//     if (!id && !clerkUserId) {
//       throw new Error("id or clerkUserId is required");
//     }

//     const query = id ? { id } : { clerkUserId };

//     const user = await prisma.user.findUnique({ where: query });
//     return { user };
//   } catch (error) {
//     return { error };
//   }
// }

export async function UpdateUser(id: string, data: Partial<User>) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return { user };
  } catch (error) {
    return { error };
  }
}

async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
