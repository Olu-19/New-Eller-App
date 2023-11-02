"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Phone, PhoneOff } from "lucide-react";

import ActionTooltip from "@/components/action-tooltip";

const ChatVoiceButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isAudio = searchParams?.get("audio");

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                audio: isAudio ? undefined : true
            }
        }, { skipNull: true });

        router.push(url);
    }

    const Icon = isAudio ? PhoneOff : Phone;
    const tooltipLabel = isAudio ? "End voice call" : "Start voice call";

    return (
        <ActionTooltip
          side="bottom"
          label={tooltipLabel}
        >
            <button onClick={onClick} className="hover:opacity-75 transition">
                <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </button>
        </ActionTooltip>
    );
}
 
export default ChatVoiceButton;