"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu as MenuIcon } from "lucide-react";

export function Menu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-4 w-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} showCloseButton={false}>
        <div className="grid justify-items-center gap-4">
          <Link href="/" onClick={close}>
            Home
          </Link>
          <Separator />
          <Link href="/dayoftheweek" onClick={close}>
            Day Of The Week
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
