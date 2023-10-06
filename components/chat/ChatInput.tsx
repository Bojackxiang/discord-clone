"use client";
import React from "react";
import { useForm } from "react-hook-form";
import z, { TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import axios from "axios";
import queryString from "query-string";
import { useModal } from "@/hooks/use-modal";
import { EmojiPicker } from "./EmojiPicker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = (params: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: params.apiUrl,
        query: params.query,
      });

      await axios.post(url, values);
      form.reset();
      router.refresh()

    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            console.log(field);
            return (
              <div>
                <FormItem>
                  <FormControl>
                    <div className="relative p-4 pb-6">
                      <button
                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                        type="button"
                        onClick={() => onOpen("FILE_UPLOAD")}
                      >
                        <Plus className="text-white dark:text-[#313338]" />
                      </button>
                      <Input
                        disabled={loading}
                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                        placeholder={`Message ${
                          params.type === "conversation" ? params.name : "#" + params.name
                        }`}
                        {...field}
                      />
                      <div className="absolute top-7 right-8">
                        <EmojiPicker
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                        />
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              </div>
            );
          }}
        ></FormField>
      </form>
    </Form>
  );
};

export default ChatInput;
