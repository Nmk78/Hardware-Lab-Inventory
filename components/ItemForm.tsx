"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./CategoryForm";
import { ProductForm } from "./ProductForm";
import { toast } from "@/hooks/use-toast";
export interface Field {
  name: string;
  type: string;
  required: boolean;
}

export interface Category {
  id: string;
  name: string;
  fields: Field[];
}

export interface ProductFormValues {
  name: string;
  categoryId: string;
  attributes: Record<string, string>;
}

export default function ItemForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSaveCategory = async (newCategory: Omit<Category, "id">) => {
    try {
      const response = await axios.post("/api/category", newCategory);
      setCategories([...categories, response.data]);
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category.",
        variant: "destructive",
      });
    }
  };



  const handleCreateProduct = async (data: ProductFormValues) => {
    try {
      await axios.post("/api/products", data);
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {!showCategoryForm ? (
        <>
          <ProductForm setShowCategoryForm={setShowCategoryForm} categories={categories} onSubmit={handleCreateProduct} />


        </>
      ) : (
        // <Card>
        //   <CardHeader>
        //     <CardTitle>Create New Category</CardTitle>
        //   </CardHeader>
        //   <CardContent className="space-y-4">
        <>
          <CategoryForm onSave={handleSaveCategory} />
          <Button onClick={() => setShowCategoryForm(false)} variant="outline">
            Back to Product Creation
          </Button>
        </>
        //   </CardContent>
        // </Card>
      )}
    </div>
  );
}
