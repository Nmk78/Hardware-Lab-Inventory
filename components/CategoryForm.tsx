import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export interface Field {
  name: string;
  type: "text" | "number" | "select";
  required: boolean;
}

export interface Category {
  name: string;
  fields: Field[];
}

interface CategoryFormProps {
  onSave: (category: Omit<Category, "id">) => void;
}

export function CategoryForm({ onSave }: CategoryFormProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [categoryName, setCategoryName] = useState("");

  const addField = () => {
    setFields([...fields, { name: "", type: "text", required: false }]);
  };

  const updateField = (index: number, key: keyof Field, value: string | boolean) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const saveCategory = () => {
    onSave({ name: categoryName, fields });
    setCategoryName("");
    setFields([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <Button onClick={addField} variant="outline">
            + Add Field
          </Button>
          {fields.map((field, i) => (
            <div key={i} className="space-y-2">
              <div className=" flex">
                <Input
                  className="rounded-r-none"
                  placeholder="Field Name"
                  value={field.name}
                  onChange={(e) => updateField(i, "name", e.target.value)}
                />
                <Select
                  value={field.type}
                  onValueChange={(value) => updateField(i, "type", value)}
                >
                  <SelectTrigger className="rounded-l-none w-1/3" >
                    <SelectValue
                      placeholder="Select field type"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${i}`}
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateField(i, "required", checked as boolean)
                  }
                />
                <Label htmlFor={`required-${i}`}>Required</Label>
              </div>
            </div>
          ))}
          <Button onClick={saveCategory}>Save Category</Button>
        </div>
      </CardContent>
    </Card>
  );
}
