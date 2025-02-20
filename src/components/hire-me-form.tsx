"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you're using Sonner for notifications

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(350, "Message must be under 350 characters"),
});

export default function HireMeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Something went wrong");

      toast.success("Message sent successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full space-y-6 font-marlish'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-white'>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-sm'>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    className='w-full placeholder:text-sm text-black'
                    placeholder='Enter your name'
                    aria-invalid={!!form.formState.errors.name}
                    aria-describedby='name-error'
                  />
                </FormControl>
                <FormMessage id='name-error' />
              </FormItem>
            )}
          />

          <FormField
            name='email'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-sm'>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    className='w-full placeholder:text-sm text-black'
                    placeholder='Enter your email'
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby='email-error'
                  />
                </FormControl>
                <FormMessage id='email-error' />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name='message'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-sm text-white'>Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='w-full placeholder:text-sm text-black'
                  placeholder='Type your message here'
                  aria-invalid={!!form.formState.errors.message}
                  aria-describedby='message-error'
                  rows={4}
                />
              </FormControl>
              <FormMessage id='message-error' />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full bg-gray-900 text-white text-base font-sans font-medium hover:bg-gray-700 transition-all duration-300'
          variant='outline'
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Hire Me!"}
        </Button>
      </form>
    </Form>
  );
}
