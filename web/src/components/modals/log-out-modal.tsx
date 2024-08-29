import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LogOutIcon from "../icons/log-out-icon"

export function LogOutModal({ handleLogout }: { handleLogout: () => Promise<void>}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className='relative w-full flex text-custom-error focus:text-custom-error cursor-default hover:bg-muted select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
          <LogOutIcon className="size-4" />
          <span className="ml-2">Sair</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
          <AlertDialogDescription>
            Saindo da plataforma, os items não salvos serão perdidos. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive hover:bg-destructive/80" 
            onClick={handleLogout}
          >
            Sim, quero sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}