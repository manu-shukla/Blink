"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";

import { CommentValidation } from "@/lib/validations/blink";
import Image from "next/image";
import { addCommentToBlink } from "@/lib/actions/blink.actions";

interface Props {
  blinkId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ blinkId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      blink: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToBlink(blinkId, values.blink, JSON.parse(currentUserId), pathname);

    form.reset();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="blink"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <Image src={currentUserImg} alt="Profile Image" width={48} height={48} className="rounded-full object-cover"/>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                    type="text"
                    placeholder="Comment...."
                  className="no-focus outline-none text-light-1"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
         Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
