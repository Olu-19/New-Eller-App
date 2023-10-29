"use client";

import * as z from "zod";
import axios from "axios"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextResponse } from "next/server";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";

import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormLabel,
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/file-upload";


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  imgUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

const EditServerModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const { server } = data;

  const isModalOpen = isOpen && type === "editServer";

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imgUrl", server.imgUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);

      form.reset();
      router.refresh();
      onClose();

    } catch (error: any) {
      throw new NextResponse(`Failed to create server: ${error.message}`);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-o overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. This can
            always be changed later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 px-6">
                    <div className="flex justify-center items-center text-center">
                        <FormField
                          control={form.control}
                          name="imgUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileUpload
                                  endPoint="serverImage"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Server name
                            </FormLabel>
                            <FormControl>
                                <Input
                                  disabled={isLoading}
                                  className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                  placeholder="Enter server name"
                                  {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <Button variant="primary" disabled={isLoading}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
