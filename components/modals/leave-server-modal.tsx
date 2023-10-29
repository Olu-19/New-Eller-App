"use client";

import axios from "axios";
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

const LeaveModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { server } = data;

  const isModalOpen = isOpen && type === "leaveServer";

  const onLeave = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
      
    } catch (error: any) {
      console.log(`Failed to leave server: ${error.message}`);
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave <span className="font-semibold text-rose-500">{server?.name}</span>
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
              onClick={onLeave}
            >
              Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveModal;
