"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GlassPanel } from "@/components/glass-panel";
import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  text: z
    .string()
    .min(5, { message: "Quote text must be at least 5 characters." }),
  proposedAuthor: z.string().optional(),
  proposedSource: z.string().optional(),
});

export function CreateQuote() {
  const [tab, setTab] = useState("txt");
  //   const { status, data: quote } = trpc.public.quotes.getSingle()
  const createMutation = trpc.public.quotes.create.useMutation();
  const { toast } = useToast();

  const defaultValues = {
    text: "",
    proposedAuthor: "",
    proposedSource: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    const result = await createMutation.mutateAsync({
      text: values.text,
      proposedAuthor: values.proposedAuthor ? values.proposedAuthor : undefined,
      proposedSource: values.proposedSource ? values.proposedSource : undefined,
    });
    // console.log({ result });
    alert("New submission successful, you may now enter another new quote.");
    form.reset(defaultValues);
    toast({
      title: "Submission Successful",
      description:
        "New Quote is pending review and will be added to The Time Lit database.",
    });
  }

  const { errors } = form.formState;

  useEffect(() => {
    if (errors?.text) {
      setTab("txt");
      toast({
        variant: "destructive",
        title: "Please fix errors.",
        description: "Please fix issues with missing Quote Text",
      });
    }
  }, [errors, setTab, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <GlassPanel className="p-8 lg:p-12">
          <h1 className="-mt-2 mb-8 text-2xl">Submit a new Quote</h1>
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="w-[400px] max-w-[80svw] lg:w-[640px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="txt">Text</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>
            <TabsContent value="txt">
              <Card className="min-h-[275px]">
                <CardHeader>
                  <CardTitle>Text</CardTitle>
                  <CardDescription>
                    Quote that contains some time or date text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>Text of the quotation</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="source">
              <Card className="min-h-[275px]">
                <CardHeader>
                  <CardTitle>Source</CardTitle>
                  <CardDescription>Source of the Quote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="proposedAuthor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Author Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proposedSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Book Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-2 flex justify-end lg:mt-4">
            <Button
              variant="outline"
              type="submit"
              disabled={createMutation.isPending}
            >
              Submit
            </Button>
          </div>
        </GlassPanel>
      </form>
    </Form>
  );
}
