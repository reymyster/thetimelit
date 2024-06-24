"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
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
import { GlassPanel } from "@/components/glass-panel";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  text: z
    .string()
    .min(5, { message: "Quote text must be at least 5 characters." }),
  proposedAuthor: z.string().optional(),
  proposedSource: z.string().optional(),
});

export function EditQuote({ id }: { id: string }) {
  const [tab, setTab] = useState("txt");
  const { toast } = useToast();
  const { status, data: quote } = trpc.admin.quotes.getSingle.useQuery(id);

  const defaultValues = {
    text: quote?.text ?? "",
    proposedAuthor: quote?.proposedAuthor ?? "",
    proposedSource: quote?.proposedSource ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
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

  useEffect(() => {
    if (status === "success" && quote) {
      form.setValue("text", quote.text);
      form.setValue("proposedAuthor", quote.proposedAuthor ?? "");
      form.setValue("proposedSource", quote.proposedSource ?? "");
    }
  }, [status, form, quote]);

  if (status === "pending") return <div>Loading...</div>;

  console.log({ quote });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <GlassPanel className="p-8 lg:p-12">
          <h1 className="-mt-2 mb-8 text-2xl">Edit Quote {id}</h1>
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="w-[80svw] lg:w-[800px] xl:w-[960px] 2xl:w-[1180px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="txt">Text</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>
            <TabsContent value="txt">
              <Card>
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
                          <Textarea {...field} className="min-h-[4lh]" />
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
              <Card>
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
          <div className="mt-2 flex justify-end gap-2 lg:mt-4 lg:gap-4">
            <Button variant={"outline"} asChild>
              <Link href="/manage" prefetch={false}>
                Close
              </Link>
            </Button>
            <Button variant={"default"} type="submit">
              Save
            </Button>
          </div>
        </GlassPanel>
      </form>
    </Form>
  );
}
