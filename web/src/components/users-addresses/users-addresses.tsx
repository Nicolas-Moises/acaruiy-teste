/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import {
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectGroup, 
  SelectLabel
} from "../ui/select";
import { RegisterAddressModal } from "../modals/register-address-modal";
import { useParams } from "react-router-dom";
import { Address } from "@/_types/address";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import LocationIcon from "../icons/location-icon";
import { Checkbox } from "../ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAddresses } from "@/services/get-addresses";
import { Skeleton } from "../ui/skeleton";
import { normalizeAddress } from "@/utils/normalize-address";
import { updateAddress } from "@/services/update-address";
import { toast } from "sonner";

type Props = React.HTMLAttributes<HTMLDivElement>;

const updateAddressSchema = z.object({
  zipcode: z.string().min(8, 'Insira um CEP válido').optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional(),
  district: z.string(),
  main_address: z.boolean().optional(),
})

type UpdateAddressFormValues = z.infer<typeof updateAddressSchema>

export function UsersAddresses({ className, ...props }: Props) {
  const { userId } = useParams<{ userId: string }>()

  const { data: addresses,  isLoading } = useQuery({
    queryKey: ['get-addresses'],
    queryFn: async () => await getAddresses(userId!)
  })

  const INITIAL_ADDRESS: Address | undefined = addresses &&
  addresses.find((address) => address.main_address === true)
  
  const defaultValues: Address = {
    zipcode: '',
    city: '',
    complement: '',
    district: '',
    number: '',
    id: '',
    state: '',
    street: '',
    main_address: false,
  }
  const [selectedAddress, setSelectedAddress] = useState<Address>(INITIAL_ADDRESS ?? defaultValues)

  const queryClient = useQueryClient()
  const { mutateAsync: handleUpdateAddressFn, isPending } = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-addresses']})
      toast.success('Endereço atualizado com sucesso!')
    },
    // TODO: correctly type throws errors
    onError: (error: any) => {
      console.log(error)
      toast.error('Houve um erro ao atualizar o endereço.')
    }
  })

  const form = useForm<UpdateAddressFormValues>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: normalizeAddress(defaultValues),
    values: normalizeAddress(selectedAddress),
  })

  async function handleUpdateAddress(data: UpdateAddressFormValues) {
    const { zipcode, district, city, complement, main_address, number, state, street } = data;

    await handleUpdateAddressFn({
      addressId: selectedAddress.id,
      userId: userId!,
      street,
      number,
      state,
      complement,
      district,
      city,
      zipcode,
      main_address,
    })
  }

  return (
    <div className={cn('flex flex-col gap-10 lg:flex-row', className)} {...props}>
      <div className="w-full max-w-[384px] space-y-4">
        <h4 className="font-semibold">Localização</h4>
        <p className="text-sm text-zinc-400">
          Endereços cadastrados
        </p>
      </div>
      <div className="max-w-[672px] flex-1 space-y-4">
        {addresses && (
          <Select 
            defaultValue={INITIAL_ADDRESS?.id} 
            onValueChange={(addressId) => {
              const address = addresses?.find((address) => address.id === addressId)

              setSelectedAddress(address!)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Endereços</SelectLabel>
                {isLoading && (
                  <Skeleton className="h-5 w-full"/>
                )}
                {!isLoading && addresses && 
                  addresses.length > 0 ? 
                    addresses?.map((address) => (
                    <SelectItem 
                      key={address.id} 
                      value={address.id}
                    >       
                      {address.zipcode} - {address.street}, {address.number} - {address.city}, {address.state}
                    </SelectItem>
                  )) : (
                  <div className="py-4 flex items-center flex-col justify-center gap-2">
                    <LocationIcon className="size-6 text-muted-foreground" />
                    <h4 className="font-medium tracking-tight text-muted-foreground">Nenhum endereço cadastrado</h4>
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <RegisterAddressModal />

        <Separator />

        <div className="py-10">
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleUpdateAddress)}>
              
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
              <div className="flex flex-col md:flex-row gap-4">
                <FormField 
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
                      <FormLabel isRequired>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira o bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
             
              <div className="flex flex-col md:flex-row gap-4">
                <FormField 
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
                      <FormLabel isRequired>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira a UF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

              <Button 
                className="w-fit ml-auto" 
                disabled={form.formState.isSubmitting || isPending}
              >
                Salvar alterações
                {form.formState.isSubmitting ? (
                  <Spinner className="size-5" />
                ) : (
                  <LocationIcon className="size-5" />
                )}
              </Button>
            </form>
          </Form>
        </div>  
      </div>

    </div>
  );
}