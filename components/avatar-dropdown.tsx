"use client"
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const AvatarDropdown = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRedirect = (page: "signin" | "signup") => {
    router.push(`/auth/${page}`)
  }

  const handleLogout = ()=>{
    signOut({
      callbackUrl: "/auth/signin",
      redirect: true,
    })
  }

  if (!session?.user) {
    return (
      <div className='space-x-2'>
        <Button variant={"outline"} className='cursor-pointer' onClick={() => handleRedirect("signin")}>Login</Button>
        <Button className='cursor-pointer' onClick={() => handleRedirect("signup")}>Register</Button>
      </div>
    )

  }

  return (
    <div>
      <p>{session?.user.name}</p>
      <Button variant={"outline"} className='cursor-pointer' onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default AvatarDropdown