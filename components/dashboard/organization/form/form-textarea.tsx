"use client";

import { KeyboardEventHandler, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FormErrors from "./form-errros";

interface FormTextareaProps {
   id: string;
   label?: string;
   placeholder?: string;
   required?: boolean;
   disabled?: boolean;
   errors?: Record<string, string[] | undefined>;
   className?: string;
   onBlur?: () => void;
   onClick?: () => void;
   onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
   defaultValue?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
   (
      {
         id,
         label,
         placeholder,
         required,
         disabled,
         errors,
         className,
         onBlur,
         onClick,
         onKeyDown,
         defaultValue,
      },
      ref
   ) => {

      const {pending} = useFormStatus();

      return (
         <div className="space-y-2 w-full">
            {label && (
               <Label
                  htmlFor={id}
                  className="text-xs font-semibold text-neutral-700"
               >
                  {label}
               </Label>
            )}
            <Textarea
               id={id}
               name={id}
               placeholder={placeholder}
               required={required}
               disabled={disabled || pending}
               onBlur={onBlur}
               onClick={onClick}
               onKeyDown={onKeyDown}
               defaultValue={defaultValue}
               className={cn(
                  "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm ",
                  className
               )}
               aria-describedby={`${id}-error`}
            />
            <FormErrors id={id} errors={errors} />
         </div>
      );
   }
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
