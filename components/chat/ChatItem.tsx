"use client";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import { Member, MemberRole, Profile } from "@prisma/client";
import Image from "next/image";
import { NextResponse } from "next/server";
import { useRouter, useParams } from "next/navigation";
import {
  Edit,
  FileIcon,
  Play,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

import UserAvatar from "@/components/user-avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import EmojiPicker from "@/components/EmojiPicker";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const ChatItem = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const fileType = fileUrl?.split(".").pop();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwn = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwn);
  const canEditMessage = !deleted && isOwn && !fileUrl;

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage =
    fileType &&
    (fileType === "jpg" || fileType === "jpeg" || fileType === "gif") &&
    fileUrl;
  const isAudio =
    fileType && (fileType === "mp3" || fileType === "ogg") && fileUrl;
  const isVideo =
    fileType &&
    (fileType === "mp4" || fileType === "avi" || fileType === "mkv") &&
    fileUrl;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error: any) {
      console.log(`Failed to edit message: ${error.message}`);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  useEffect(() => {
    const handleEdit = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleEdit);

    return () => window.removeEventListener("keydown", handleEdit);
  }, []);

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
        return;
    }
    
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imgUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p 
                onClick={onMemberClick}
                className="text-sm font-semibold hover:underline cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary w-48 h-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover hover:scale-110 transition"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="w-10 h-10 fill-purple-200 stroke-purple-500" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-purple-500 dark:text-purple-400 hover:underline"
              >
                PDF file
              </a>
            </div>
          )}
          {isAudio && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <PlayCircle className="w-10 h-10 fill-purple-200 stroke-purple-500" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-purple-500 dark:text-purple-400 hover:underline"
              >
                Audio file
              </a>
            </div>
          )}
          {isVideo && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <Play className="w-10 h-10 fill-purple-200 stroke-purple-500" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-purple-500 dark:text-purple-400 hover:underline"
              >
                Video file
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 mt-1",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-2"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edit your message..."
                            {...field}
                          />
                          <div className="absolute top-2 right-3">
                            <EmojiPicker
                              onChange={(emoji: string) =>
                                field.onChange(`${field.value} ${emoji}`)
                              }
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400 ">
                Press escape to cancel, enter to save.
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteMessage", {
                apiUrl: `${socketUrl}/${id}`,
                query: socketQuery
              })}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
