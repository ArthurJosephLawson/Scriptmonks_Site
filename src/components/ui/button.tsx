import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center border font-mono uppercase tracking-widest text-sm transition duration-150",
  {
    variants: {
      variant: {
        primary:
          "border-accent-coral bg-accent-coral text-dark shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-accent-coral-dim active:border-accent-coral-dim",
        secondary:
          "border-dark-border bg-transparent text-ink hover:border-accent-coral hover:text-accent-coral",
      },
      size: {
        default: "px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: ReactNode;
}

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonElementProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonLinkProps | ButtonElementProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, children, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const content = <span>[ {children} ]</span>;

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonLinkProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonElementProps;
  return (
    <button type="button" ref={ref} className={classes} {...buttonProps}>
      {content}
    </button>
  );
});
