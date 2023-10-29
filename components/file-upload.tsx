"use client";

import { FileIcon, MusicIcon, Play, PlayIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
    endPoint: "messageFile" | "serverImage";
    value: string;
    onChange: (url?: string) => void;
}

const FileUpload = ({ endPoint, value, onChange }: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    if (value && fileType === "jpg" || fileType === "png" || fileType === "jpeg" || fileType === "gif") {
        return (
            <div className="relative w-20 h-20">
                <Image
                  src={value}
                  alt="Uploaded Image"
                  fill
                  className="w-[200px] h-[200px] rounded-lg"
                />
                <button 
                  onClick={() => onChange("")}
                  className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                  type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    if (value && fileType  === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="w-10 h-10 fill-purple-200 stroke-purple-400" />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-purple-500 dark:text-purple-400 hover:underline"
                >
                    {value}
                </a>
                <button 
                  onClick={() => onChange("")}
                  className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                  type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    if (value && fileType  === "mp3" || fileType === "ogg") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <MusicIcon className="w-10 h-10 fill-purple-200 stroke-purple-400" />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-purple-500 dark:text-purple-400 hover:underline"
                >
                    {value}
                </a>
                <button 
                  onClick={() => onChange("")}
                  className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                  type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    if (value && fileType === "mp4" || fileType === "avi" || fileType === "mkv") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <PlayIcon className="w-10 h-10 fill-purple-200 stroke-purple-400" />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener norefferer"
                  className="ml-2 text-sm text-purple-500 dark:text-purple-400 hover:underline"
                >
                    {value}
                </a>
                <button 
                  onClick={() => onChange("")}
                  className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                  type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    
    return (
        <UploadDropzone
           endpoint={endPoint}
           onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
           }}
           onUploadError={(error: Error) => {
            console.log(error)
           }}
        />
    );
}
 
export default FileUpload;