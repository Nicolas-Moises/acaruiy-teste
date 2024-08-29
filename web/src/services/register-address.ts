import { api } from "@/lib/api";

type RegisterAddressProps = {
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  zipcode: string
  userId: string
  main_address: boolean
}
export async function registerAddress(data: RegisterAddressProps) {
  const { street, number, complement, district, city, state, zipcode, userId, main_address } = data;
  await api.post(`/users/${userId}/addresses`, {
    state,
    street,
    number,
    complement,
    district,
    city,
    zipcode,
    main_address,
  })
}