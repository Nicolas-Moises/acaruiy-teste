import UserEditIcon from "@/components/icons/user-edit";
import UserIcon from "@/components/icons/user-icon";
import { DeleteUserModal } from "@/components/modals/delete-user-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { UsersAddresses } from "@/components/users-addresses";
import { getUserDetails } from "@/services/get-user-details";
import { updateUser } from "@/services/update-user";
import { cellphoneMask, documentMask, phoneMask } from "@/utils/formats";
import { onMediaSelected } from "@/utils/get-preview-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string(),
  email: z.string().email("Insira um e-mail inválido"),
  phone: z.string(),
  document: z.string(),
  cellphone: z.string(),
  avatar:z.custom<FileList>().optional(),
})

type UpdateUserFormValues = z.infer<typeof updateUserSchema>

export function UserInformation() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()

  const { mutateAsync: handleUpdateUserFn, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['get-user'] })
    },
    onError: () => {
      toast.error('Ocorreu um erro ao atualizar o usuário')
    }
  })

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['get-user', userId],
    queryFn: async () => await getUserDetails(userId as string),
    refetchOnWindowFocus: false,
  })

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    values: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      document: user?.document ?? '',
      cellphone: user?.cellphone ?? '',
    }
  })

  const cellphone = form.watch('cellphone')
  const document = form.watch('document')
  const phone = form.watch('phone')

  useEffect(() => {
    form.setValue('cellphone', cellphoneMask(cellphone))
  }, [cellphone])

  useEffect(() => {
    form.setValue('phone', phoneMask(phone))
  }, [phone])

  useEffect(() => {
    form.setValue('document', documentMask(document))
  }, [document])
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user details</div>;
  }


  async function handleUpdateUser(data: UpdateUserFormValues) {
    const { email, avatar, cellphone, phone} = data

    await handleUpdateUserFn({
      avatar,
      cellphone,
      email,
      phone,
      userId: userId!,
    })
  }

  return (
    <>
      <Helmet title={user?.name} />
      <div className="py-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Link to={'..'} className="flex text-xs text-muted-foreground hover:text-foreground gap-2 items-center">
              <ArrowLeft className="size-3" />
              <span>Voltar</span>
            </Link>
            <h1 className="text-xl font-bold">Manutenção de cadastro pessoal</h1>
          </div>
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdateUser)}>
            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="w-full max-w-[384px] space-y-4">
                <h4 className="font-semibold">Dados pessoais</h4>
                <p className="text-sm text-zinc-500">
                  Você pode manter sua foto de perfil atualizada.
                </p>
              </div>
              <div className="max-w-[672px] flex-1 space-y-4">
                <div className="flex flex-col gap-10">
                  <div className="flex w-full items-center gap-6">
                    <Avatar className="h-24 w-24 bg-card rounded-full">
                      <AvatarImage src={preview ?? user?.avatar} className="object-cover" />
                      <AvatarFallback className="rounded-xl bg-card">
                        <UserIcon className="size-10 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={() => (
                        <FormItem className="">
                          <FormMessage />
                          <FormLabel className={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}>
                            Foto de perfil
                          </FormLabel>
                          <FormControl>
                            <input
                              type="file"
                              className="invisible h-0 w-0"
                              {...form.register('avatar', {
                                onChange: (e) => {
                                  const previewURL = onMediaSelected(e)
                                  setPreview(previewURL)
                                },
                              })}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField 
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input {...field} disabled readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} disabled readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="w-full max-w-[384px] space-y-4">
                <h4 className="font-semibold">Informações para contato</h4>
                <p className="text-sm text-zinc-400">
                  Edite suas informações para contato do usuário caso haja necessidade.
                </p>
              </div>
              <div className="max-w-[672px] flex-1 space-y-4">
                <FormField 
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Adicionar telefone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField 
                  control={form.control}
                  name="cellphone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <Input placeholder="Adicionar Celular" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            

            <div className="flex flex-col gap-10 lg:flex-row pt-10">
              <div className="w-full max-w-[384px] space-y-4">
                <h4 className="font-semibold">Ações</h4>
              </div>
            
              <div className="flex gap-2 justify-end w-full max-w-[672px]">
                <DeleteUserModal 
                  user_id={userId!} 
                  onDelete={() => navigate('/')}
                >
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-fit"
                  >
                    <span>Excluir usuário</span>
                  </Button>
                </DeleteUserModal>
                <Button
                  type="submit"
                  className="w-fit"
                  disabled={isPending || form.formState.isSubmitting}
                >
                  <span>Salvar informações</span>
                  {form.formState.isSubmitting || isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <UserEditIcon className="size-5" />
                )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <Separator />
        <UsersAddresses />
      </div>
    </>
  );
}

