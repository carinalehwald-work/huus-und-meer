import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonTone = "guest" | "owner";
export type ButtonVariant = "solid" | "outline";

type ButtonClassOptions = {
  tone: ButtonTone;
  variant?: ButtonVariant;
  className?: string;
};

const base = "group inline-flex min-h-12 items-center justify-center rounded-[0.2rem] border px-5 py-3 text-sm font-bold outline outline-1 outline-offset-[3px] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  guest: {
    solid: "border-red bg-red text-linen outline-red/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-red)_16%,transparent)] hover:bg-sand hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-red)_20%,transparent)] active:shadow-none",
    outline: "border-red bg-linen text-red outline-red/35 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-red)_10%,transparent)] hover:bg-sand hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-red)_16%,transparent)] active:shadow-none",
  },
  owner: {
    solid: "border-brand bg-brand text-ice outline-brand/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-brand)_16%,transparent)] hover:bg-ice hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-brand)_20%,transparent)] active:shadow-none",
    outline: "border-brand bg-ice text-brand outline-brand/35 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-brand)_10%,transparent)] hover:bg-mist hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-brand)_16%,transparent)] active:shadow-none",
  },
};

export function buttonClassName({ tone, variant = "solid", className }: ButtonClassOptions) {
  return [base, styles[tone][variant], className].filter(Boolean).join(" ");
}

export const buttonArrowClassName = "ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonClassOptions & { children: ReactNode };

export function Button({ tone, variant, className, children, type = "button", ...props }: ButtonProps) {
  return <button className={buttonClassName({ tone, variant, className })} type={type} {...props}>{children}</button>;
}
