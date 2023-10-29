"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useEffect, useState } from "react";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { resolvedTheme } = useTheme();

    const [emoji, setEmoji] = useState(false);

    useEffect(() => {
        const handleEmoji = (e: KeyboardEvent) => {
            if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setEmoji((emoji) => !emoji);
            }
        };

        window.addEventListener("keydown", handleEmoji);

        return () => window.removeEventListener("keydown", handleEmoji);
    }, []);

    return (
        <Popover open={emoji} onOpenChange={setEmoji}>
            <PopoverTrigger>
                <Smile
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </PopoverTrigger>
            <PopoverContent
              side="right"
              sideOffset={40}
              className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                  theme={resolvedTheme}
                />
            </PopoverContent>
        </Popover>
    );
}
 
export default EmojiPicker;