'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FaGoogle } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'

const SignInCard = () => {
  return (
    <Card className="h-full w-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <form className="space-y-4">
          <Input required type="email" value={''} onChange={() => {}} placeholder="enter email address" />
          <Input
            required
            type="password"
            value={''}
            onChange={() => {}}
            placeholder="enter password"
            disabled={false}
            max={256}
            min={8}
          />
          <Button disabled={false} size="lg" className="w-full">
            Login
          </Button>
        </form>
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
    </Card>
  )
}

export default SignInCard