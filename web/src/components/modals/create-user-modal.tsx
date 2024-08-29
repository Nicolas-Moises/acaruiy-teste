/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UserAddIcon from "../icons/user-add-icon"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { onMediaSelected } from "@/utils/get-preview-url"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createUser } from "@/services/create-user"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { cellphoneMask, documentMask, phoneMask } from "@/utils/formats"
import UserIcon from "../icons/user-icon"
 
const createUserSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório"
  }).min(3, "O nome é obrigatório"),
  email: z.string({
    required_error: "O e-mail é obrigatório"
  }).email("Insira um e-mail inválido"),
  phone: z.string().min(11, 'Insira um telefone válido'),
  document: z.string({
    required_error: "O CPF é obrigatório"
  }).min(11, 'Insira um CPF válido'),
  cellphone: z.string({
    required_error: "O celular é obrigatório"
  }).min(11, 'Insira um celular válido'),
  avatar:z.custom<FileList>(),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>
export function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(undefined)

  const queryClient = useQueryClient()
  const { mutateAsync: handleCreateUserFn, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-users']})
      toast.success('Usuário criado com sucesso!')
      form.reset()
      setIsOpen(false)
    },
    onError: (error: any) => {
      if (error.response.status === 422) {
				if (error.response.data.errors.document) {
					toast.error(error.response.data.errors.document[0]);
				} else if (error.response.data.errors.email) {
					toast.error(error.response.data.errors.email[0]);
				} else if (error.response.data.errors.avatar) {
          toast.error(error.response.data.errors.avatar[0]);
        }
			}
    }
  })

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      document: '',
      cellphone: '',
    },
    mode: 'onBlur'
  })

  async function handleCreateUser(data: CreateUserFormValues) {
    await handleCreateUserFn({
      cellphone: data.cellphone,
      document: data.document,
      email: data.email,
      name: data.name,
      phone: data.phone,
      avatar: data.avatar,
    })
  }

  // masks
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <UserAddIcon className="size-5" />
          Adicionar novo usuário
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Adicionar usuário</SheetTitle>
          <SheetDescription>
            Preencha as informações do novo usuário abaixo:
          </SheetDescription>
        </SheetHeader>
        <div className="py-10">
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleCreateUser)}>
              <div className="flex w-full items-center gap-4">
                <div
                  className={cn(
                    'flex size-14 items-center justify-center overflow-hidden rounded-full border border-input bg-card',
                    {
                      'border-destructive': form.formState?.errors.avatar?.message,
                    },
                  )}
                >
                  {preview ? (
                    <img
                      src={preview}
                      className="object-cover size-full rounded-full"
                      alt="Preview image"
                    />
                  ) : (
                    <UserIcon className="size-6 text-muted-foreground" />
                  )}
                </div>
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
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o CPF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o e-mail" {...field} />
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
                      <Input placeholder="Insira o telefone" {...field} />
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
                      <Input placeholder="Insira o celular" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting || isPending}>
                Salvar
                {form.formState.isSubmitting || isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <UserAddIcon className="size-5" />
                )}
              </Button>
            </form>
          </Form>
        </div>  
      </SheetContent>
    </Sheet>
  )
}