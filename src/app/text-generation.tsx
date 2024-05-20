"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = `Welcome to The Time Lit, where every moment is illuminated by the wisdom of classical literature. Our innovative platform merges the functionality of a clock and calendar with the enriching experience of highlighted quotes from the great literary masters. Whether you're marking your schedule or simply checking the time, let the timeless words of Shakespeare, Austen, Dickens, and more inspire and guide you through your day. Step into a world where every tick of the clock and flip of the calendar brings a touch of literary elegance to your daily routine.`;

export function TextGeneration() {
  return <TextGenerateEffect words={words} className="text-justify" />;
}
