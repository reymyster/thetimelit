"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/glass-panel";
import { useToast } from "@/components/ui/use-toast";
import { useGetSingleQuote, useEditQuoteMutation } from "@/lib/db/admin/hooks";
import { type Quote } from "@/dbschema/interfaces";
import { SaveQuoteSchema } from "@/lib/db/admin/schemas";
import { cn } from "@/lib/utils";
import {
  getNumberFromTimeString,
  getTimeStringFromNumber,
} from "@/lib/times/functions";

const daysOfTheWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function EditQuote({ id }: { id: string }) {
  const [tab, setTab] = useState("txt");
  const { toast } = useToast();
  const { status, data: quote } = useGetSingleQuote(id);
  const editMutation = useEditQuoteMutation();
  const [dayPopoverOpen, setDayPopoverOpen] = useState(false);

  const defaultValues = {
    id,
    text: quote?.text ?? "",
    author: quote?.auth?.id ?? "",
    src: quote?.src?.id ?? "",
    proposedAuthor: quote?.proposedAuthor ?? "",
    proposedSource: quote?.proposedSource ?? "",
    day: quote?.day ?? -1,
    timeLower: getTimeStringFromNumber(quote?.time?.period?.lower) ?? "",
    timeUpper: getTimeStringFromNumber(quote?.time?.period?.upper) ?? "",
    timeSpecific: quote?.time?.specific ?? false,
  };

  const form = useForm<z.infer<typeof SaveQuoteSchema>>({
    resolver: zodResolver(SaveQuoteSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof SaveQuoteSchema>) {
    console.log({ values });
    await editMutation.mutateAsync(values);
    toast({
      title: "Saved successfully.",
      description: "Quote has been successfully saved.",
    });
  }

  const {
    setValue,
    getValues,
    formState: { errors },
  } = form;

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
      const opts = {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      };
      setValue("text", quote.text, opts);
      setValue("proposedAuthor", quote.proposedAuthor ?? "", opts);
      setValue("proposedSource", quote.proposedSource ?? "", opts);
      setValue("author", quote.auth?.id ?? "", opts);
      setValue("src", quote.src?.id ?? "", opts);
      setValue("highlight", quote.highlight || undefined, opts);
      setValue("day", quote.day ?? -1, opts);
      if (quote.time == null) {
        setValue("timeLower", "");
        setValue("timeUpper", "");
        setValue("timeSpecific", false);
      } else {
        setValue("timeLower", getTimeStringFromNumber(quote.time.period.lower));
        setValue("timeUpper", getTimeStringFromNumber(quote.time.period.upper));
        setValue("timeSpecific", quote.time.specific);
      }
    }
  }, [status, setValue, quote]);

  if (status === "pending")
    return <GlassPanel className="p-8 lg:p-12">Loading...</GlassPanel>;

  const fvHighlight = getValues("highlight");
  const fvText = getValues("text");

  const handleHighlight = () => {
    if (fvHighlight) return; // wrong mode

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range) return; // no range found

    setValue(
      "highlight",
      { startOffset: range.startOffset, endOffset: range.endOffset },
      { shouldTouch: true, shouldDirty: true },
    );

    selection?.removeAllRanges();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <GlassPanel className="p-8 lg:p-12">
          <h1 className="-mt-2 mb-8 text-2xl">
            Edit Quote{" "}
            <span className="flow-root max-w-lg truncate">
              {fvText || quote?.text}
            </span>
          </h1>
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="w-[80svw] lg:w-[800px] xl:w-[960px] 2xl:w-[1180px]"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="txt">Text</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="highlight">Highlight</TabsTrigger>
              <TabsTrigger value="time">Time Period</TabsTrigger>
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
                        <FormLabel>Proposed Author</FormLabel>
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
                        <FormLabel>Proposed Source</FormLabel>
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
            <TabsContent value="highlight">
              <Card>
                <CardHeader>
                  <CardTitle>Highlight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="mt-4 bg-background p-4 text-2xl text-foreground"
                    onMouseUp={handleHighlight}
                  >
                    {fvHighlight ? (
                      highlightedText({
                        text: fvText,
                        highlight: fvHighlight,
                      })
                    ) : (
                      <>{fvText}</>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    disabled={!fvHighlight}
                    onClick={() =>
                      setValue("highlight", undefined, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                  >
                    Reset
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="time">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Time Period
                    {fvHighlight && fvText ? (
                      <>
                        {" "}
                        for:{" "}
                        <span className="ml-2 rounded-md bg-accent p-3 text-4xl text-primary">
                          {fvText.slice(
                            fvHighlight.startOffset,
                            fvHighlight.endOffset,
                          )}
                        </span>
                      </>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Day
                          <br />
                        </FormLabel>
                        <Popover
                          open={dayPopoverOpen}
                          onOpenChange={setDayPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  typeof field.value === "undefined"
                                    ? "text-muted-foreground"
                                    : null,
                                )}
                                type="button"
                              >
                                {daysOfTheWeek.find(
                                  (d) => d.value === field.value,
                                )?.label ?? "Select Day of the Week"}
                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search day..." />
                              <CommandList>
                                <CommandEmpty>No day found.</CommandEmpty>
                                <CommandGroup>
                                  {daysOfTheWeek.map((day) => (
                                    <CommandItem
                                      value={day.label}
                                      key={day.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "day",
                                          field.value === day.value
                                            ? -1
                                            : day.value,
                                        );
                                        setDayPopoverOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 size-4",
                                          day.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {day.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Day of the Week</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid max-w-96 grid-cols-3 gap-8">
                    <FormField
                      control={form.control}
                      name="timeLower"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lower</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeUpper"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upper</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeSpecific"
                      render={({ field }) => (
                        <FormItem className="mt-1.5 flex flex-col gap-4">
                          <FormLabel>Specific</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => {
                      var opts = { shouldDirty: true, shouldTouch: true };
                      setValue("day", -1);
                      setValue("timeLower", "");
                      setValue("timeUpper", "");
                      setValue("timeSpecific", false);
                    }}
                  >
                    Clear
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-2 flex justify-end gap-2 lg:mt-4 lg:gap-4">
            <Button variant={"outline"} asChild>
              <Link href="/manage/quotes" prefetch={false}>
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

function highlightedText(quote?: Pick<Quote, "text" | "highlight"> | null) {
  if (!quote || !quote.text) return null;

  if (!quote.highlight) return <>{quote.text}</>;

  const before = quote.text.slice(0, quote.highlight.startOffset);
  const target = quote.text.slice(
    quote.highlight.startOffset,
    quote.highlight.endOffset,
  );
  const after = quote.text.slice(quote.highlight.endOffset);

  return (
    <>
      {before}
      <span className="bg-yellow-500/50 p-2">{target}</span>
      {after}
    </>
  );
}
