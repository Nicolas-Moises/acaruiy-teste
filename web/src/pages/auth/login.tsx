/* eslint-disable @typescript-eslint/no-explicit-any */
import SquareLockIcon from "@/components/icons/square-lock-icon";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

const loginSchema = z.object({
  email: z.string({
    required_error: 'O e-mail é obrigatório.'
  }).email({
    message: 'Insira um endereço de email válido'
  }),
  password: z.string({
    required_error: 'A senha é obrigatória.'
  }).min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const { setUserFn, csrfToken } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function handleLogin(data: LoginFormValues) {

    const { email, password } = data

    await csrfToken();

    try {
			const resp = await api.post('/login', {
        email,
        password,
      });
			if (resp.status === 200) {
				setUserFn(resp.data.user);
				return <Navigate to="/" />;
			}
		} catch (error: any) {
			if (error.response.status === 401) {
        toast.error(error.response.data.message)
			} else {
        toast.error('Ops! Verifique os dados inseridos e tente novamente.')
      }
		}

  }
  return (
    <>
      <Helmet title="Acessar conta" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Bem vindo de volta</h1>
        <p className="text-muted-foreground">
          Novo aqui?
          <Link className="text-primary font-medium hover:underline" to='/sign-up'> Criar conta</Link>
        </p>
      </div>
      <Form {...form}>
        <form className="w-full space-y-4" onSubmit={form.handleSubmit(handleLogin)}>
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
            <span>Acessar</span>
            {form.formState.isSubmitting ? <Spinner className="size-5" /> : <SquareLockIcon className="size-5" />}
          </Button>
        </form>
      </Form>
    </>
  )
}