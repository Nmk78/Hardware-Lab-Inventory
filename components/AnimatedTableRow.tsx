"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tag } from "./tag";
import Image from "next/image";

interface Item {
  [key: string]: any;
}

interface AnimatedTableRowProps {
  item: Item;
  onLease: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export function AnimatedTableRow({
  item,
  onLease,
  onEdit,
  onDelete,
}: AnimatedTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          cursor-pointer
          transition-colors
          duration-200
          hover:bg-gray-50
          h-5
          ${isExpanded ? "bg-gray-100 border-b-0" : ""}
        `}
      >
        <TableCell className="text-center">{item.name}</TableCell>
        <TableCell className="text-center">{item.category}</TableCell>
        <TableCell className="text-center">{item.status}</TableCell>
        <TableCell>
          <div className="truncate">
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag: string, idx: number) => (
                <Tag key={idx} tag={tag} />
              ))}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">{item.quantity}</TableCell>
        <TableCell className="text-center">{item.quantity}</TableCell>
        <TableCell className="text-center">{item.quantity}</TableCell>
        <TableCell className="text-right flex justify-end w-auto bg-white">
          <div className="flex space-x-2 ml-auto">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onLease(item);
              }}
              size="sm"
              disabled={item.status !== "Available"}
              className="transition-all duration-200 hover:scale-105"
            >
              Lease
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <TableRow className="overflow-hidden">
        <TableCell colSpan={8} className="p-0">
          <div
            className={`
              grid
              transition-all
              duration-300
              ease-in-out
              ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
            `}
          >
            <div className="overflow-hidden">
              <div className="p-4 flex gap-4 items-start">
                <img
                  src={`/images/${item.name.toLowerCase()}.jpg`}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-md
                           transition-transform duration-300 hover:scale-105"
                />
                <div className="flex flex-col space-y-2 opacity-0 animate-in fade-in duration-500">
                  <p>
                    <strong>Description:</strong> Detailed description of{" "}
                    {item.name}.
                  </p>
                  <p>
                    <strong>Additional Info:</strong> Any other relevant
                    information.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <strong>Price:</strong>
                      <span className="ml-1">${item.price}</span>
                    </div>
                    <div className="flex items-center">
                      <strong>Location:</strong>
                      <span className="ml-1">{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <strong>Condition:</strong>
                      <span className="ml-1">{item.condition}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
