import { Address } from "@/_types/address";

export const normalizeAddress = (address: Address): Address => ({
  zipcode: address.zipcode || '',
  street: address.street || '',
  number: address.number || '',
  city: address.city || '',
  state: address.state || '',
  complement: address.complement || '',
  district: address.district || '',
  id: address.id || '',
  main_address: address.main_address ?? false,
});