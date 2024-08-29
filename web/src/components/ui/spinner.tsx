import LoadingIcon from "../icons/loading-icon";
import { cn } from "@/lib/utils";

export function Spinner({ className }: {className?: string}) {
  return (
    <LoadingIcon className={cn("size-4 animate-spin", className)} />
  )
}