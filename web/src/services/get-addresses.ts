import { Address } from "@/_types/address";
import { api } from "@/lib/api";

export async function getAddresses(userId: string): Promise<Address[]> {
  const res = await api.get(`/users/${userId}/addresses`)
  return res.data.data
}