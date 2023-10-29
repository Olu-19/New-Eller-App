import { Hash, Mic, Video } from "lucide-react";

import MobileToggle from "@/components/mobile-toggle";
import UserAvatar from "@/components/user-avatar";
import SocketIndicator from "@/components/socket-indicator";
import ChatVideoButton from "@/components/chat/ChatVideoButton";
import ChatVoiceButton from "@/components/chat/ChatVoiceButton";
import { Channel } from "@prisma/client";
import { channel } from "diagnostics_channel";

interface ChatHeaderProps {
    channel: Channel;
    serverId: string;
    name: string;
    type?: "channel" | "conversation";
    imgUrl?: string;
}

const ChatHeader = ({
    channel,
    serverId,
    name,
    type,
    imgUrl
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} />
            {type === "channel" && channel.type === "TEXT" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "channel" && channel.type === "AUDIO" && (
                <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "channel" && channel.type === "VIDEO" && (
                <Video className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar
                  src={imgUrl}
                  className="w-8 h-8 md:w-8 md:h-8 mr-2"
                />
            )}
            <p className="text-md font-semibold text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type === "conversation" && (
                    <ChatVoiceButton />
                )}
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                {/* <SocketIndicator /> */}
            </div>
        </div>
    );
}
 
export default ChatHeader;