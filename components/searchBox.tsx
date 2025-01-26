import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export default function SearchInput({ searchTerm, setSearchTerm }:any) {
  // Listen for the "Ctrl + K" shortcut
  useEffect(() => {
    const handleShortcut = (e: { ctrlKey: any; metaKey: any; key: string; preventDefault: () => void; }) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="relative max-w-sm">
      <Input
        id="search-input"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-12"
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted rounded px-2 py-1">
        Ctrl + K
      </span>
    </div>
  );
}
