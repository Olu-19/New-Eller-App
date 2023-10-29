"use client";

import * as z from "zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import axios from "axios"

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});

const MessageFileModal = () => {

  const router = useRouter();

  const { onClose, isOpen, type, data } = useModal();

  const { apiUrl, query } = data;

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl
      });

      form.reset();
      router.refresh();
      handleClose();
    } catch (error: any) {
      throw new NextResponse(`Failed to upload file: ${error.message}`);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-o overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Send an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 px-6">
                    <div className="flex justify-center items-center text-center">
                        <FormField
                          control={form.control}
                          name="fileUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileUpload
                                  endPoint="messageFile"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                    </div>
                </div>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <Button variant="primary" disabled={isLoading}>
                        Send
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
