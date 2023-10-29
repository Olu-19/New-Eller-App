"use client";

import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal-store";

const DeleteMessageModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "deleteMessage";

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })

      await axios.delete(url);

      onClose();
      
    } catch (error: any) {
      console.log(`Failed to delete channel: ${error.message}`);
      return new NextResponse("Internal error", { status: 500 } );
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-o overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            This message will be deleted permanently.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
