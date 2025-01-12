import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(1, 'Minimum 8 characters'),
})
