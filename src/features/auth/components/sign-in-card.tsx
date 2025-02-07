'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/features/auth/schema'
import { useLogin } from '@/features/auth/api/use-login'
import { Loader } from 'lucide-react'

const SignInCard = () => {
  const { mutate, isPending } = useLogin()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values)
  }

  return (
    <Card className="h-full w-full shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Email Address" type="email" disabled={isPending} {...field} />
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
                    <Input placeholder="Enter Password" type="password" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" disabled={isPending} className="w-full">
              {isPending ? <Loader className="size-4 animate-spin text-muted-foreground" /> : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-col gap-4 p-7">
        <Button
          variant="outline"
          type="submit"
          disabled={isPending}
          size="lg"
          className="flex w-full items-center justify-center">
          <FaGoogle className="mr-2 size-5" />
          Login With Google
        </Button>
        <Button
          variant="outline"
          type="submit"
          disabled={isPending}
          size="lg"
          className="flex w-full items-center justify-center">
          <FaGithub className="mr-2 size-5" />
          Login With Github
        </Button>
      </CardContent>
    </Card>
  )
}

export default SignInCard
