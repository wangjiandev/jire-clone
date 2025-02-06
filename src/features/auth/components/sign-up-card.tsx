'use client'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FaGithub, FaGoogle } from 'react-icons/fa'

const SignUpCard = () => {
  return (
    <Card className="h-full w-full shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-7">
        <form className="space-y-4">
          <Input placeholder="Enter Email Address" type="email" required value={''} onChange={() => {}} />
          <Input placeholder="Enter Password" type="password" min={4} required value={''} onChange={() => {}} />
          <Input placeholder="Enter Confirm Password" type="password" min={4} required value={''} onChange={() => {}} />
          <Button type="submit" size="lg" className="w-full">
            Sign Up
          </Button>
        </form>
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
