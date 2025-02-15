import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
})

export const registerSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
})
