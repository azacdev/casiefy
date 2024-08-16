"use client";

import { toast } from "sonner";
import { Copy, Server } from "lucide-react";

import { Button } from "./button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to clipboard");
  };

  return (
    <Alert className="p-2 lg:p-4">
      {/* <Server className="h-4 w-4 hidden lg:block" /> */}
      <div className="!pl-0">
        <AlertTitle className="flex justify-between items-center gap-x-2">
          <div>
            {title}
            <Badge className="ml-2 mb-2" variant={variantMap[variant]}>
              {textMap[variant]}
            </Badge>
          </div>

          <Button variant={"outline"} size={"icon"} onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </AlertTitle>

        <AlertDescription className="mt-4 flex items-center justify-between">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs lg:text-sm font-semibold">
            {description}
          </code>
        </AlertDescription>
      </div>
    </Alert>
  );
};