'use client'

import { SignupData } from "@/types/signup"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { auth } from "@/api"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Signup() {
  const formValidation = z.object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
  })
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
    resolver: zodResolver(formValidation),
  })  

  const { signup } = auth
    const [serverError, setServerError] = useState<string | null>(null)
    const router = useRouter()
    const onSubmit = async (data: SignupData) => {
      setServerError(null)
      try {
        const response = await signup(data)
        if(response){
          router.push("/dashboard")
        }
      } catch (error: any) {
          console.log(error)
        setServerError(error?.response?.data?.message || "Signup failed")
      }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Glassy Card */}
      <div className="flex flex-col items-center w-[400px] p-6 rounded-2xl border border-white/20 bg-[#FAFAFA]/10 backdrop-blur-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-white w-full text-left border-b border-white/20 pb-4">
          Sign in to Digital Signage
        </h1>

        <form className="w-full mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="first_name" className="text-sm font-semibold text-white/80">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              className="w-full border border-white/20 bg-[#FAFAFA]/10 text-white placeholder-white/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="last_name" className="text-sm font-semibold text-white/80">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
              className="w-full border border-white/20 bg-[#FAFAFA]/10 text-white placeholder-white/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-white/80">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full border border-white/20 bg-[#FAFAFA]/10 text-white placeholder-white/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-white/80">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full border border-white/20 bg-[#FAFAFA]/10 text-white placeholder-white/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-teal-500/80 text-white px-4 py-2 rounded-lg mt-2 w-full font-semibold hover:bg-teal-500 focus:ring-2 focus:ring-teal-400 transition"
          >
            Sign Up
          </button>

          {/* Already have an account */}
          <Link href="/login" className="text-xs text-teal-300/80 mt-1 hover:underline cursor-pointer text-center">
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  )
}
