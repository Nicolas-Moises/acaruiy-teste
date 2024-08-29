/* eslint-disable @typescript-eslint/no-explicit-any */

import UserAddIcon from "@/components/icons/user-add-icon";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input-password";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


const signUpSchema = z.object({
  name: z.string({
    required_error: 'O nome é obrigatório.'
  }).min(3, {
    message: 'O nome é obrigatório.'
  }),
  email: z.string({
    required_error: 'O e-mail é obrigatório.'
  }).email({
    message: 'Insira um endereço de email válido'
  }),
  password: z.string({
    required_error: 'A senha é obrigatória.'
  }).min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUp() {
  const { setUserFn } = useAuth()
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })

  async function handleSignUp(data: SignUpFormValues) {
    const { email, name, password } = data
    try {
      const res = await api.post(`/register`, { email, name, password })

      if(res.status === 200) {
        setUserFn(res.data.user);
				return <Navigate to="/" />
      }
    } catch (error: any) {
      if (error.response.status === 422) {
				if (error.response.data.errors.email) {
					toast.error(error.response.data.errors.email[0]);
				}
			}
    }
  }

  return (
    <>
      <Helmet title="Criar conta" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-muted-foreground">
          Já tem conta?
          <Link className="text-primary font-medium hover:underline" to='/login'> Acesse aqui</Link>
        </p>
      </div>
      <Form {...form}>
        <form className="w-full space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
          <FormField 
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Insira seu nome" {...field} />
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
                  <Input placeholder="Insira seu e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
           <FormField 
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Insira sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <Button className="w-full">
            <span>Criar conta</span>
            {form.formState.isSubmitting ? <Spinner className="size-5" /> : <UserAddIcon className="size-5" />}
          </Button>
        </form>
      </Form>
    </>
  )
}