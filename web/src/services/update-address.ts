import { api } from "@/lib/api";

type updateAddressProps = {
  street?: string
  number?: string
  complement?: string
  district?: string
  city?: string
  state?: string
  zipcode?: string
  userId: string
  addressId: string
  main_address?: boolean
}
export async function updateAddress(data: updateAddressProps) {
  const { street, number, complement, district, city, state, zipcode, userId, main_address, addressId } = data;
  await api.put(`/users/${userId}/addresses/${addressId}`, {
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