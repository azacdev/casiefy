import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";
interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

const Phone = ({ className, imgSrc, dark = false, ...props }: PhoneProps) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <Image
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        className="pointer-events-none z-50 select-none"
        width={1000}
        height={1000}
        alt="phone-image"
      />
      <div className="absolute -z-10 inset-0">
        <Image
          src={imgSrc}
          className="object-cover min-w-full min-h-full"
          alt="overlaying-phone-image"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};

export default Phone;
