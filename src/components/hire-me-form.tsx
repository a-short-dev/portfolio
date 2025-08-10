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
import { toast } from "sonner";
import { motion } from "framer-motion";

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
      <motion.form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full space-y-8 font-marlish'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-white'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-sm font-medium text-gray-200 mb-2 block'>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      className='w-full h-12 px-4 bg-slate-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300'
                      placeholder='Enter your name'
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby='name-error'
                    />
                  </FormControl>
                  <FormMessage id='name-error' className='text-red-400 text-sm mt-1' />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-sm font-medium text-gray-200 mb-2 block'>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      className='w-full h-12 px-4 bg-slate-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300'
                      placeholder='Enter your email'
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby='email-error'
                    />
                  </FormControl>
                  <FormMessage id='email-error' className='text-red-400 text-sm mt-1' />
                </FormItem>
              )}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <FormField
            name='message'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-sm font-medium text-gray-200 mb-2 block'>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='w-full min-h-[120px] px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none'
                    placeholder='Type your message here'
                    aria-invalid={!!form.formState.errors.message}
                    aria-describedby='message-error'
                    rows={4}
                  />
                </FormControl>
                <FormMessage id='message-error' className='text-red-400 text-sm mt-1' />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            type='submit'
            className='w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-marlish font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                Sending...
              </div>
            ) : (
              "Send Message"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
