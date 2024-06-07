"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Button } from "@/components/ui/button";
interface SocialProps {
  socialsLabel: string | undefined;
}

export const Social = ({ socialsLabel }: SocialProps) => {
  const onClick = () => {
    signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center w-full gap-2 text-slate-900">
      <Button
        size={"lg"}
        className="w-full font-semibold bg-[#16171C] border"
        onClick={() => onClick()}
      >
        <FcGoogle className="h-5 w-5 mr-3" /> {socialsLabel} with Google
      </Button>
    </div>
  );
};
