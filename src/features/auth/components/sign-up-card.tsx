'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { registerSchema } from '@/features/auth/schema'
import { useRegister } from '@/features/auth/api/use-register'
import { Loader } from 'lucide-react'

const SignUpCard = () => {
  const { mutate, isPending } = useRegister()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate(values)
  }

  return (
    <Card className="h-full w-full shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">用户注册</CardTitle>
        <CardDescription>创建一个账户以开始使用</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请输入姓名" type="text" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请输入邮箱" type="email" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请输入手机号" type="text" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请输入密码" type="password" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请再次输入密码" type="password" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? <Loader className="size-4 animate-spin text-muted-foreground" /> : '注册并登录'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-col gap-4 p-7">
        <Button variant="outline" type="submit" size="lg" className="flex w-full items-center justify-center">
          <FaGoogle className="mr-2 size-5" />
          Sign Up With Google
        </Button>
        <Button variant="outline" type="submit" size="lg" className="flex w-full items-center justify-center">
          <FaGithub className="mr-2 size-5" />
          Sign Up With Github
        </Button>
      </CardContent>
    </Card>
  )
}

export default SignUpCard
