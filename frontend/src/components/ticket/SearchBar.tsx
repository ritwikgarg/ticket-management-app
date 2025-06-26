import { Command } from "@/components/ui/command";
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
    const [input, setInput] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        onSearch(value);
    };

    return (
        <div className="flex-1">
            <Command className="rounded-lg border shadow-none">
                <div className="flex items-center px-3 py-2 border-b w-full space-x-4">
                    <input
                        type="text"
                        placeholder="Search tickets by Ticket ID, System ID, Hospital Name..."
                        className="w-full outline-none bg-transparent placeholder:text-muted-foreground text-sm truncate"
                        value={input}
                        onChange={handleChange}
                    />
                    <button onClick={() => onSearch(input)}>
                        <IconSearch className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </button>
                </div>
            </Command>
        </div>
    );
}
