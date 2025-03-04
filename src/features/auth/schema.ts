import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, '姓名必须至少2个字符'),
    email: z.string().trim().email('请输入正确的邮箱'),
    phone: z.string().trim().min(11, '请输入正确的手机号'),
    password: z.string().trim().min(4, '密码必须至少4个字符'),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })
