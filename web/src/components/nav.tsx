import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { getAcronym } from "@/utils/get-acronym";
import { Button } from "./ui/button";
import { LogOutModal } from "./modals/log-out-modal";

export function Nav() {
  return (
    <ul className="flex gap-2 flex-1">
      <li>
        <NavLink
          to="/"
          className={cn("text-sm font-medium text-muted-foreground aria-[current=page]:text-primary p-2 rounded-lg hover:bg-popover transition-colors duration-200")}
        >
          Lista de usuários
        </NavLink>
      </li>
    </ul>
  )
}

export function UserNav() {
  const { user, handleLogout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className="rounded-full size-8 text-xs font-bold">
          <span className="sr-only">Opções do usuário</span>
          {getAcronym(user?.name ?? '')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs text-muted-foreground py-0.5 font-normal">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LogOutModal handleLogout={handleLogout} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}