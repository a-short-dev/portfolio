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
                  <FormLabel className='text-sm font-medium text-amber-200 mb-2 block flex items-center gap-2'>
                    <span className='text-yellow-400 animate-rune-glow'>ᚾ</span>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      className='norse-glass w-full h-12 px-4 bg-slate-900/60 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:shadow-lg focus:shadow-amber-500/20 transition-all duration-300 hover:border-amber-400/50'
                      placeholder='Enter your name, warrior'
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby='name-error'
                    />
                  </FormControl>
                  <FormMessage id='name-error' className='text-red-300 text-sm mt-1 flex items-center gap-1'>
                    <span className='text-red-400'>⚠</span>
                  </FormMessage>
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
                  <FormLabel className='text-sm font-medium text-amber-200 mb-2 block flex items-center gap-2'>
                    <span className='text-yellow-400 animate-rune-glow'>ᛖ</span>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      className='norse-glass w-full h-12 px-4 bg-slate-900/60 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:shadow-lg focus:shadow-amber-500/20 transition-all duration-300 hover:border-amber-400/50'
                      placeholder='Your ravens will find you here'
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby='email-error'
                    />
                  </FormControl>
                  <FormMessage id='email-error' className='text-red-300 text-sm mt-1 flex items-center gap-1'>
                    <span className='text-red-400'>⚠</span>
                  </FormMessage>
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
                <FormLabel className='text-sm font-medium text-amber-200 mb-2 block flex items-center gap-2'>
                  <span className='text-yellow-400 animate-rune-glow'>ᛗ</span>
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='norse-glass w-full min-h-[120px] px-4 py-3 bg-slate-900/60 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-400/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:shadow-lg focus:shadow-amber-500/20 transition-all duration-300 resize-none hover:border-amber-400/50'
                    placeholder='Share your quest, and let us forge something legendary together...'
                    aria-invalid={!!form.formState.errors.message}
                    aria-describedby='message-error'
                    rows={4}
                  />
                </FormControl>
                <FormMessage id='message-error' className='text-red-300 text-sm mt-1 flex items-center gap-1'>
                  <span className='text-red-400'>⚠</span>
                </FormMessage>
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
            className='asgard-border w-full h-14 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group'
            disabled={isSubmitting}
          >
            {/* Norse rune decorations */}
            <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-rune-glow'>ᚠ</div>
            <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-300 opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-rune-glow'>ᚱ</div>
            
            {/* Glowing background effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-asgard-glow' />
            
            <span className='relative z-10'>
              {isSubmitting ? (
                <div className='flex items-center gap-3'>
                  <div className='w-5 h-5 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin'></div>
                  <span>Sending to Asgard...</span>
                  <span className='text-yellow-300 animate-rune-glow'>ᛟ</span>
                </div>
              ) : (
                <div className='flex items-center gap-3'>
                  <span>⚔️</span>
                  <span>Send Message</span>
                  <span>🛡️</span>
                </div>
              )}
            </span>
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
