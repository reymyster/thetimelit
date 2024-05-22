"use client";
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

export function Settings() {
  const { resolvedTheme, theme, setTheme } = useTheme();

  const settingsAreDefault = theme === "system";
  const resetSettings = () => {
    setTheme("system");
  };
  return (
    <Sheet>
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
            <ResetIcon className="group-hover:direction-reverse mr-2 h-4 w-4 group-hover:animate-spin" />
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
