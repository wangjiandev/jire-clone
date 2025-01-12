'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FaGoogle } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { loginSchema } from '@/features/auth/schemas'
import { useLogin } from '@/features/auth/api/use-login'

const SignInCard = () => {
  const { mutate } = useLogin()

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ json: values })
  }
  return (
    <Card className="h-full w-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Sign in on your account</CardDescription>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter Email Address" />
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
                    <Input {...field} type="password" placeholder="Enter Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={false} size="lg" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="flex flex-col gap-2 p-7">
        <Button variant="outline" className="w-full">
          <FaGoogle className="mr-2 size-5" />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Continue with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignInCard
