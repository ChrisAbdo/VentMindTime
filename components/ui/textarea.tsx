import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-[#333] bg-transparent px-3 py-2 text-sm ring-offset-[#333] placeholder:text-[#999] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        rows={1}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
