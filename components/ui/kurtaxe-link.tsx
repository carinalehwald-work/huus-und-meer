import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function KurtaxeLink({ href, ...props }: Props) {
  return <Link href={href === "/suchen-und-buchen" ? "/kurtaxe-ostseecard" : href} {...props} />;
}
