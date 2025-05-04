"use client"

import { BellRing, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { checkVerifyToken } from "@/server/tokens"
import { useEffect, useState } from "react"


export default  function page() {

    const router = useRouter()
    const token = useSearchParams().get("token")
    const [error,setError] = useState<string | null>(null)
    const [success,setSuccess] = useState<string | null>(null)


    useEffect(()=>{
        const verifyToken = async () => {
            const data = await checkVerifyToken(token!);
            
            if(data?.error){
                setError(data?.error);
                setSuccess(null)
            }else if(data?.success){
                setSuccess(data?.success);
                setError(null)
                router.push("/auth/signin")
            }
            
        }
        verifyToken()
    },[])
    
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className={cn("w-[380px]")}>
                <CardHeader className="text-center space-y-1">
                    <CardTitle>Verifying Email</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-center">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm text-muted-foreground">
                                {error ? error : success ? success : "Please wait while we verify your email."}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full cursor-pointer" onClick={() => router.push(`${error ? "/auth/signup" : success ? "/auth/signin" : "/"}`)} disabled={error ? false : success ? false : true}>
                        <Check /> {error ? "Go Back" : success ? "Go to Sign In" : "Verifying..."}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

