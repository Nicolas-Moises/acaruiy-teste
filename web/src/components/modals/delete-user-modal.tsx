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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUser } from "@/services/delete-user"
import { toast } from "sonner"
import { ReactNode } from "react"


export function DeleteUserModal({ 
  children,
  onDelete,
  user_id 
}: { 
  user_id: string 
  children: ReactNode
  onDelete?: () => void
}) {
  const queryClient = useQueryClient()
  const { mutateAsync: handleDeleteUser, isPending } = useMutation({
    mutationFn: async (user_id: string) => await deleteUser(user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-users'] })
      toast.success('Usuário excluído com sucesso!')
      if(onDelete) {
        onDelete()
      }
    },
    onError: () => {
      toast.error('Ocorreu um erro ao tentar excluir o usuário.')
    }
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir o usuário?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a
            conta desse usuário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive hover:bg-destructive/80"
            disabled={isPending}
            onClick={() => handleDeleteUser(user_id)}
          >
            Sim, quero excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}