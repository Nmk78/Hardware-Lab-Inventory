"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

interface Field {
  name: string;
  type: string;
  required: boolean;
}

export default function CategoryForm() {
  const [fields, setFields] = useState<Field[]>([]);

  const addField = () => {
    setFields([...fields, { name: "", type: "text", required: false }]);
  };

  const updateField = (index: number, key: keyof Field, value: any) => {
    const updated = [...fields];
    //@ts-expect-error
    updated[index][key] = value;
    setFields(updated);
  };

  const saveCategory = async () => {
    await fetch("/api/category", {
      method: "POST",
      body: JSON.stringify({ name: "Electronics", fields }),
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Category</h2>
      <Button onClick={addField} className="mb-4">+ Add Field</Button>
      {fields.map((field, i) => (
        <div key={i} className="mb-4">
          <Input
            type="text"
            placeholder="Field Name"
            value={field.name}
            onChange={(e) => updateField(i, "name", e.target.value)}
            className="mb-2"
          />
          <Select
            value={field.type}
            //@ts-ignore
            onChange={(e) => updateField(i, "type", e.target.value)}
            className="mb-2"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
          </Select>
          <Checkbox
            checked={field.required}
            //@ts-ignore
            onChange={(e) => updateField(i, "required", e.target.checked)}
            className="mb-2"
          >
            Required
          </Checkbox>
        </div>
      ))}
      <Button onClick={saveCategory}>Save Category</Button>
    </div>
  );
}
