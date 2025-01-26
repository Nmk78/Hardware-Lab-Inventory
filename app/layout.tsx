import "./globals.css";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignUp
} from "@clerk/nextjs";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hardware Lab Inventory",
  description: "Hardware lab inventory",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
        <SignedOut>
            {/* SignUp shown for unauthenticated users */}
            <div className="flex h-screen items-center justify-center">
              <SignUp routing="hash"  />
            </div>
          </SignedOut>
          <SignedIn>
            {/* Authenticated user layout */}
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex h-screen w-full flex-col md:flex-row md:overflow-hidden">
                <Sidebar />
                <div className="relative flex-grow md:overflow-y-auto md:px-12 py-6">
                  {children}
                </div>
              </div>
            </SidebarProvider>
          </SignedIn>



          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
