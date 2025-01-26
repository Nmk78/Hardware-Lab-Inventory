"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Clock,
  AlertCircle,
  UserPlus,
  CircuitBoard,
  ChevronsRightLeft,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  // { name: 'Add Item', href: '/add-item', icon: PlusCircle },
  { name: "Invite User", href: "/invite", icon: UserPlus },
];

export function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user } = useUser();
  console.log("🚀 ~ Sidebar ~ user:", user);
  return (
    <div className="relative overflow-visible z-40">
      <div className="absolute -right-6 top-20 overflow-hidden">
        {" "}
        <button
          onClick={toggleSidebar}
          className="p-1.5 border border-l-0 rounded-r-md bg-white z-10"
        >
          <ChevronsRightLeft className="w-3" />
        </button>
      </div>
      <ShadcnSidebar>
        <SidebarHeader className="border-b flex flex-row justify-center items-center p-4">
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
            <CircuitBoard className="size-6 text-white" />
          </div>
          <div className="grid flex-1 text-left text-xl leading-tight">
            <span className="truncate font-bold">Hardware Lab</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon size={5} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex jussify-start items-center gap-4">
            <UserButton /> {user?.fullName}
          </div>

          <p className="text-sm truncate text-gray-500">© 2025 Hardware Lab</p>
        </SidebarFooter>
        <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
      </ShadcnSidebar>
    </div>
  );
}
