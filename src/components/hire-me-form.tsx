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

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string().max(350),
});
export default function HireMeForm() {
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
    try {
      await fetch("/api/send/", {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          form.reset();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-5"
      >
        <div className="flex flex-wrap w-full text-white gap-5 font-sans">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-full placeholder:text-sm text-black"
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="w-full placeholder:text-sm text-black"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full placeholder:text-sm text-blacke"
                    placeholder="Type your message here"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full bg-transparent text-white text-base font-sans font-medium"
          variant="outline"
        >
          Hire Me!
        </Button>
      </form>
    </Form>
  );
}
