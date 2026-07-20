import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 
          "bg-[#2563EB] text-white hover:bg-[#2563EB]/90 shadow-sm",
        destructive:
          "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
        outline:
          "border border-white/[0.06] bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/[0.12]",
        secondary:
          "bg-[#1E293B] text-white hover:bg-[#2A3A4F] border border-white/[0.06]",
        ghost: 
          "text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]",
        link: 
          "text-[#2563EB] underline-offset-2 hover:underline",
        accent: 
          "bg-[#00C2A8]/10 text-[#00C2A8] hover:bg-[#00C2A8]/20 border border-[#00C2A8]/20",
        gold: 
          "bg-[#F4B000]/10 text-[#F4B000] hover:bg-[#F4B000]/20 border border-[#F4B000]/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
