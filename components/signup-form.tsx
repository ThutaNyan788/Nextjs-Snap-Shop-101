"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Github, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { signUpSchema } from "@/type/typeSchema"
import { registerUser } from "@/server/register-action"
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner"



// Define the form data type from the schema
type LoginFormValues = z.infer<typeof signUpSchema>

export default function SignUpForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { execute, result } = useAction(registerUser);


    // Initialize react-hook-form with zod resolver
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // Handle form submission
    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        setError(null)

        try {
            // Here you would typically call your authentication API
            execute(data);
            

            if (result?.data?.success) {
                toast.success(result?.data?.success);
            }else if(result?.data?.failure){
                toast.error(result?.data?.failure);

            }
            // Reset form values after successful submission
            if (result?.data?.success) {
                reset();
            }

        } catch (err) {
            setError("Failed to login. Please check your credentials and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle social login
    const handleSocialLogin = async (provider: "github" | "google") => {
        setIsLoading(true)
        setError(null)

        try {

            await signIn(provider, {
                redirectTo: "/"
            })
        } catch (err) {
            setError(`Failed to login with ${provider}. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
                <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="yourname" {...register("name")} disabled={isLoading} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={isLoading} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <Input id="password" type="password" {...register("password")} disabled={isLoading}
                            placeholder="*******" />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("github")}
                        disabled={isLoading}
                        className="w-full"
                    >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("google")}
                        disabled={isLoading}
                        className="w-full"
                    >
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Google
                    </Button>
                </div>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <a href="/auth/signin" className="font-medium text-primary hover:underline">
                        Sign Up
                    </a>
                </div>
            </CardContent>
        </Card>
    )
}
