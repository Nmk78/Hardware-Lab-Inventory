"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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

interface Field {
  name: string;
  type: string;
  required: boolean;
}

export default function ItemForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);

  // Fetch categories
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  // Create form instance for product
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

  // Submit handler for product form
  const onSubmitProduct = async (data: ProductFormValues) => {
    console.log("Submitting:", data);
    try {
      await axios.post("/api/products", data);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  // Handlers for category form
  const addField = () => {
    setFields([...fields, { name: "", type: "text", required: false }]);
  };

  const updateField = (index: number, key: keyof Field, value: any) => {
    const updated = [...fields];
    //@ts-ignore
    updated[index][key] = value;
    setFields(updated);
  };

  const saveCategory = async () => {
    const newCategory = { name: "New Category", fields };
    const response = await axios.post("/api/category", newCategory);
    setCategories([...categories, response.data]);
    setSelectedCategory(response.data);
    setShowProductForm(true);
  };

  return (
    <div>
      {!showProductForm ? (
        <div>
          <h2>Select or Create Category</h2>
          <select onChange={(e) => setSelectedCategory(JSON.parse(e.target.value))}>
            <option>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={JSON.stringify(cat)}>
                {cat.name}
              </option>
            ))}
          </select>
          <button onClick={() => setShowProductForm(true)}>Next</button>
          <h2>Create Category</h2>
          <button onClick={addField}>+ Add Field</button>
          {fields.map((field, i) => (
            <div key={i}>
              <input
                type="text"
                placeholder="Field Name"
                value={field.name}
                onChange={(e) => updateField(i, "name", e.target.value)}
              />
              <select
                value={field.type}
                onChange={(e) => updateField(i, "type", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </select>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(i, "required", e.target.checked)}
              />
            </div>
          ))}
          <button onClick={saveCategory}>Save Category</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmitProduct)} className="p-4 border rounded shadow">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded"
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Category Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Category</label>
            <select {...register("categoryId")} className="w-full p-2 border rounded">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
          </div>

          {/* Dynamic Fields */}
          {selectedCategory && (
            <div className="mt-4">
              <h3 className="font-semibold">Attributes</h3>
              {selectedCategory.fields.map((field, index) => (
                <div key={index} className="mt-2">
                  <label className="block text-sm font-medium">{field.label}</label>
                  <Controller
                    name={`attributes.${field.label}` as const}
                    control={control}
                    render={({ field: inputProps }) => (
                      <input
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
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Create Product
          </button>
        </form>
      )}
    </div>
  );
}