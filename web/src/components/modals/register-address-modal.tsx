/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { zipCodeMask } from "@/utils/formats"
import LocationIcon from "../icons/location-icon"
import axios from "axios"
import { registerAddress } from "@/services/register-address"
import { useParams } from "react-router-dom"
import { Checkbox } from "../ui/checkbox"
 
const registerAddressSchema = z.object({
  zipcode: z.string({
    required_error: "O CEP é obrigatório"
  }).min(8, 'Insira um CEP válido'),
  street: z.string({
    required_error: "A rua é obrigatória"
  }).min(3, 'A rua é obrigatória'),
  number: z.string({
    required_error: "O número é obrigatório"
  }).min(1, 'O número é obrigatório'),
  city: z.string({
    required_error: "A cidade é obrigatória"
  }).min(3, 'A cidade é obrigatória'),
  state: z.string({
    required_error: "O estado é obrigatório"
  }).min(2, 'A UF é obrigatória').max(2, 'Digite uma UF válida'),
  complement: z.string().optional(),
  district: z.string({
    required_error: "O bairro é obrigatório"
  }).min(3, 'O bairro é obrigatório'),
  main_address: z.boolean().optional().default(false),
})

type ViaCepProps = {
  bairro: string
  localidade: string
  logradouro: string
  uf: string
}

type RegisterAddressFormValues = z.infer<typeof registerAddressSchema>
export function RegisterAddressModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { userId } = useParams<{ userId: string }>()

  const queryClient = useQueryClient()
  const { mutateAsync: handleRegisterAddressFn, isPending } = useMutation({
    mutationFn: registerAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-addresses']})
      toast.success('Endereço cadastrado com sucesso!')
      form.reset()
      setIsOpen(false)
    },
    onError: (error: any) => {
      console.log(error)
      toast.error('Houve um erro ao cadastrar o endereço.')
    }
  })

  const form = useForm<RegisterAddressFormValues>({
    resolver: zodResolver(registerAddressSchema),
    defaultValues: {
      city: '',
      complement: '',
      district: '',
      number: '',
      state: '',
      street: '',
      zipcode: '',
      main_address: false,
    },
    mode: 'onBlur'
  })

  async function handleRegisterAddress(data: RegisterAddressFormValues) {
    const { city, complement, district, main_address, number, state, street, zipcode } = data
   await handleRegisterAddressFn({
    city,
    district, 
    main_address,
    number,
    state,
    street,
    complement,
    zipcode,
    userId: userId!,
   })
  }

  const handleSetAddress = useCallback(
    (data: ViaCepProps) => {
      form.setValue('city', data.localidade)
      form.setValue('street', data.logradouro)
      form.setValue('district', data.bairro)
      form.setValue('state', data.uf)
    },
    [form.setValue],
  )

  const handleFetchAddress = useCallback(
    async (zipCode: string) => {
      try {
        const { data } = await axios.get(
          `https://viacep.com.br/ws/${zipCode}/json`,
        )
        handleSetAddress(data)
      } catch (error: any) {
        console.log(error)
        toast.error('Cep não encontrado')
      }
    },
    [handleSetAddress],
  )

  // masks
  const zipCode = form.watch('zipcode')

  useEffect(() => {
    form.setValue('zipcode', zipCodeMask(zipCode))
    if (zipCode.length !== 9) return
    handleFetchAddress(zipCode)
  }, [zipCode])


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' className="ml-auto">
          <LocationIcon className="size-5" />
          <span>Adicionar endereço</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Adicionar endereço</SheetTitle>
          <SheetDescription>
            Preencha as informações abaixo para adicionar um novo endereço:
          </SheetDescription>
        </SheetHeader>
        <div className="py-10">
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleRegisterAddress)}>
              <FormField 
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o CEP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira a rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira a cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira a UF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="main_address"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Endereço principal?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button disabled={form.formState.isSubmitting || isPending}>
                Salvar
                {form.formState.isSubmitting || isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <LocationIcon className="size-5" />
                )}
              </Button>
            </form>
          </Form>
        </div>  
      </SheetContent>
    </Sheet>
  )
}