import { env } from '@/config/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
})