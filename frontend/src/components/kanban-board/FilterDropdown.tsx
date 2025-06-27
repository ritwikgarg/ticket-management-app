import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority } from "@/enums/ticket/Priority";
import { useState } from "react";

export function FilterDropdown({ onChange }: { onChange: (value: Priority | undefined) => void }) {
  const [priority, setPriority] = useState<Priority | undefined>(undefined);

  const handleChange = (value: string) => {
    if (value === "clear") {
      setPriority(undefined);
      onChange(undefined);
    } else {
      const selected = value as Priority;
      setPriority(selected);
      onChange(selected);
    }
  };

  return (
    <div className="w-full">
      <Select value={priority ?? ""} onValueChange={handleChange}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Filter by Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="clear">None</SelectItem>
          {Object.values(Priority).map((p) => (
            <SelectItem key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

