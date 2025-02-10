import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Category, ProductFormValues } from "@/lib/type";




interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: ProductFormValues) => void;
  setShowCategoryForm: (show: boolean) => void;
}

const getProductSchema = (fields: { name: string; type: string }[]) => {
  console.log("🚀 ~ fields:", fields);

  return z.object({
    name: z.string().min(2, "Product name is required"),
    categoryId: z.string().min(1, "Category is required"),
    attributes: z.record(z.string().optional()),
  });
};

export function ProductForm({
  categories,
  onSubmit,
  setShowCategoryForm,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(getProductSchema([])),
    defaultValues: { name: "", categoryId: "", attributes: {} },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="categoryId">Category</Label>
          <Button
            onClick={() => setShowCategoryForm(true)}
            variant="outline"
            size="sm"
          >
            <Plus />
            New
          </Button>
        </div>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {selectedCategory && (
        <div className="space-y-4">
          <h3 className="font-semibold">Attributes</h3>
          {selectedCategory.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`attributes.${field.name}`}>{field.name}</Label>
              <Controller
                name={`attributes.${field.name}` as const}
                control={control}
                render={({ field: inputProps }) => (
                  <Input
                    id={`attributes.${field.name}`}
                    {...inputProps}
                    type={field.type}
                    placeholder={`Enter ${field.name}`}
                  />
                )}
              />
            </div>
          ))}
        </div>
      )}

      <Button type="submit">Create Product</Button>
    </form>
  );
}
