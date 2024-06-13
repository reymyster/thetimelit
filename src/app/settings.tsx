"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Settings as SettingsIcon, RotateCcw as ResetIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";

export function Settings() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const settingsAreDefault = theme === "system";
  const resetSettings = () => {
    setTheme("system");
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Make changes to various site-wide settings here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-8">
          <div className="flex flex-row items-center justify-center">
            <SignedOut>
              <SignInButton>
                <Button variant="default" onClick={close}>
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton redirectUrl="/">
                <Button variant="default" onClick={close}>
                  Sign Out
                </Button>
              </SignOutButton>
            </SignedIn>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Label htmlFor="dark-mode" className="col-span-3">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              defaultChecked={resolvedTheme === "dark"}
              onCheckedChange={(dark) => setTheme(dark ? "dark" : "light")}
            />
          </div>
        </div>
        <SheetFooter>
          <Button
            variant="secondary"
            className="group"
            onClick={resetSettings}
            disabled={settingsAreDefault}
          >
            <ResetIcon className="mr-2 h-4 w-4 group-hover:animate-spin group-hover:direction-reverse" />
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
