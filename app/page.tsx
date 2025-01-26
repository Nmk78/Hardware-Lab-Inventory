import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// Mock data - in a real app, this would come from your backend
const dashboardData = {
  totalItems: 245,
  availableItems: 18,
  itemsInError: 7,
  leasedItems: 12,
  overdueItems: 3,
};

const monthlyData = [
  { name: "Jan", total: 120 },
  { name: "Feb", total: 132 },
  { name: "Mar", total: 101 },
  { name: "Apr", total: 134 },
  { name: "May", total: 156 },
  { name: "Jun", total: 180 },
  { name: "Jul", total: 201 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/add-item">
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Link>
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* Cards for stats */}
        {Object.entries(dashboardData).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          {/* <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer> */}
        </CardContent>
      </Card>
    </div>
  );
}
