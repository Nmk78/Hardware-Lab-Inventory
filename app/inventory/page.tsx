"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/tag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent, PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import SearchInput from "@/components/searchBox";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: string;
  tags: string[];
}

interface LeasingItem {
  id: number;
  itemId: number;
  name: string;
  borrower: string;
  dueDate: string;
}

// Mock data - in a real app, this would come from your backend
const initialInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Computer",
    quantity: 20,
    status: "Available",
    tags: ["computer", "portable"],
  },
  {
    id: 2,
    name: "Projector",
    category: "AV Equipment",
    quantity: 5,
    status: "In Use",
    tags: ["av", "presentation"],
  },
  {
    id: 3,
    name: "Arduino Kit",
    category: "Electronics",
    quantity: 15,
    status: "Available",
    tags: ["iot", "microcontroller"],
  },
  {
    id: 4,
    name: "VR Headset",
    category: "VR/AR",
    quantity: 3,
    status: "In Repair",
    tags: ["vr", "immersive"],
  },
  {
    id: 5,
    name: "3D Printer",
    category: "Fabrication",
    quantity: 2,
    status: "Available",
    tags: ["3d", "prototyping"],
  },
  {
    id: 6,
    name: "ESP32",
    category: "Electronics",
    quantity: 10,
    status: "Available",
    tags: ["iot", "wifi", "bluetooth"],
  },
  // Add more items to test pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 7,
    name: `Test Item ${i + 1}`,
    category: "Test",
    quantity: Math.floor(Math.random() * 20) + 1,
    status: ["Available", "In Use", "In Repair"][Math.floor(Math.random() * 3)],
    tags: ["test"],
  })),
];

const initialLeasingItems: LeasingItem[] = [
  {
    id: 1,
    itemId: 2,
    name: "Projector",
    borrower: "John Doe",
    dueDate: "2023-07-15",
  },
  {
    id: 2,
    itemId: 3,
    name: "Arduino Kit",
    borrower: "Jane Smith",
    dueDate: "2023-07-20",
  },
  {
    id: 3,
    itemId: 4,
    name: "VR Headset",
    borrower: "Mike Johnson",
    dueDate: "2023-06-18",
  },
  {
    id: 4,
    itemId: 6,
    name: "ESP32",
    borrower: "Emily Brown",
    dueDate: "2023-06-22",
  },
];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [leasingItems, setLeasingItems] = useState<LeasingItem[]>(initialLeasingItems);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLeaseDialogOpen, setIsLeaseDialogOpen] = useState<boolean>(false);
  const [isAddEditSheetOpen, setIsAddEditSheetOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [borrower, setBorrower] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("all");
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get("tag");
  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(inventoryItems.length / itemsPerPage);

  const filteredItems = inventoryItems.filter((item) => {
    if (activeTab === "leased")
      return leasingItems.some((leasedItem) => leasedItem.itemId === item.id);
    if (activeTab === "error") return item.status === "In Repair";
    return true;
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: inventoryItems.length,
    leased: leasingItems.length,
    error: inventoryItems.filter((item) => item.status === "In Repair").length,
  };

  useEffect(() => {
    let filtered = initialInventoryItems;

    if (tagFilter) {
      filtered = filtered.filter((item) => item.tags.includes(tagFilter));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setInventoryItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, tagFilter]);

  const handleLease = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsLeaseDialogOpen(true);
  };

  const submitLease = () => {
    if (selectedItem && borrower && dueDate) {
      const newLeasingItem = {
        id: leasingItems.length + 1,
        itemId: selectedItem.id,
        name: selectedItem.name,
        borrower,
        dueDate,
      };
      setLeasingItems([...leasingItems, newLeasingItem]);
      setInventoryItems(
        inventoryItems.map((item) =>
          item.id === selectedItem.id ? { ...item, status: "Leased" } : item
        )
      );
      setIsLeaseDialogOpen(false);
      setBorrower("");
      setDueDate("");
      toast({
        title: "Item Leased",
        description: `${selectedItem.name} has been leased to ${borrower}.`,
      });
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsAddEditSheetOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddEditSheetOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== itemId));
    toast({
      title: "Item Deleted",
      description: "The item has been removed from the inventory.",
    });
  };

  const handleSubmitItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newItem = {
      id: editingItem ? editingItem.id : inventoryItems.length + 1,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: parseInt(formData.get("quantity") as string),
      status: formData.get("status") as string,
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim()),
    };

    if (editingItem) {
      setInventoryItems(
        inventoryItems.map((item) =>
          item.id === editingItem.id ? newItem : item
        )
      );
      toast({
        title: "Item Updated",
        description: `${newItem.name} has been updated in the inventory.`,
      });
    } else {
      setInventoryItems([...inventoryItems, newItem]);
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to the inventory.`,
      });
    }

    setIsAddEditSheetOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Button onClick={handleAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between">
          {" "}
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="leased">Leased Items</TabsTrigger>
          </TabsList>
          <SearchInput />
        </div>
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="">Tags</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Leased</TableHead>
                    <TableHead className="text-center">Error</TableHead>
                    <TableHead className="text-right pr-5 bg-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">{item.name}</TableCell>
                      <TableCell className="text-center">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status}
                      </TableCell>
                      <TableCell>
                        <div className="truncate">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Tag key={tag} tag={tag} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right flex justify-end w-auto bg-white">
                        <div className="flex space-x-2 ml-auto">
                          <Button
                            onClick={() => handleLease(item)}
                            disabled={item.status !== "Available"}
                          >
                            Lease
                          </Button>
                          <Button
                            onClick={() => handleEditItem(item)}
                            variant="outline"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            variant="outline"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
        <TabsContent value="leased">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leasingItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={isOverdue(item.dueDate) ? "bg-red-100" : ""}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.borrower}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>
                      {isOverdue(item.dueDate) ? "Overdue" : "On Time"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isLeaseDialogOpen} onOpenChange={setIsLeaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lease Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="borrower" className="text-right">
                Borrower
              </Label>
              <Input
                id="borrower"
                value={borrower}
                onChange={(e) => setBorrower(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={submitLease}>Submit</Button>
        </DialogContent>
      </Dialog>
      <Sheet open={isAddEditSheetOpen} onOpenChange={setIsAddEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingItem ? "Edit Item" : "Add New Item"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmitItem} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingItem?.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                defaultValue={editingItem?.category}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={editingItem?.quantity}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={editingItem?.status || "Available"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="In Repair">In Repair</SelectItem>
                  <SelectItem value="Leased">Leased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={editingItem?.tags.join(", ")}
              />
            </div>
            <Button type="submit">
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
