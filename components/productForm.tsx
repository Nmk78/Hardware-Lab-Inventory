"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
// Define the Category type
type Category = {
  id: string;
  name: string;
  fields: { label: string; type: string }[];
};

// Define the dynamic form schema
const getProductSchema = (fields: { label: string; type: string }[]) =>
  z.object({
    name: z.string().min(2, "Product name is required"),
    categoryId: z.string().min(1, "Category is required"),
    attributes: z.record(z.string().optional()),
  });

type ProductFormValues = {
  name: string;
  categoryId: string;
  attributes: Record<string, string>;
};

export default function ProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Fetch categories
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  // Create form instance
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(getProductSchema(selectedCategory?.fields || [])),
    defaultValues: { name: "", categoryId: "", attributes: {} },
  });

  // Watch category selection
  const selectedCategoryId = watch("categoryId");

  // Update selected category when category changes
  useEffect(() => {
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    setSelectedCategory(category || null);
    reset({ name: "", categoryId: selectedCategoryId, attributes: {} });
  }, [selectedCategoryId, categories, reset]);

  // Submit handler
  const onSubmit = async (data: ProductFormValues) => {
    console.log("Submitting:", data);
    try {
      await axios.post("/api/products", data);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow">
      {/* Product Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <Input
          {...register("name")}
          className="w-full p-2 border rounded"
          placeholder="Enter product name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <Select {...register("categoryId")}>
        {/* <Select {...register("categoryId")} className="w-full p-2 border rounded"> */}
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
      </div>

      {/* Dynamic Fields */}
      {selectedCategory && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Attributes</h3>
          {selectedCategory.fields.map((field, index) => (
            <div key={index} className="mb-2">
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              <Controller
                name={`attributes.${field.label}` as const}
                control={control}
                render={({ field: inputProps }) => (
                  <Input
                    {...inputProps}
                    className="w-full p-2 border rounded"
                    type={field.type}
                    placeholder={`Enter ${field.label}`}
                  />
                )}
              />
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Create Product
      </Button>
    </form>
  );
}
