// import { clerkClient, createClerkClient } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   // if (!session) {
//   //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   // }

//   const { email } = await req.json();

//   if (!email) {
//     return NextResponse.json({ message: "Email is required" }, { status: 400 });
//   }

//   // Process the email as needed
//   // For example, save it to the database or send a confirmation email
//   console.log("🚀 ~ POST ~ message: Email received", email);
  
//   let apiKey = process.env.CLERK_SECRET_KEY;
//   if(!apiKey){
//     return
//   }
//   const clerk = createClerkClient({
//     apiKey,
//   })
//   return NextResponse.json(
//     { message: "Email received", email },
//     { status: 200 }
//   );
// }

// export function middleware(req: NextRequest) {
//   if (req.method !== "POST") {
//     return NextResponse.json(
//       { message: "Method not allowed" },
//       { status: 405 }
//     );
//   }
// }
