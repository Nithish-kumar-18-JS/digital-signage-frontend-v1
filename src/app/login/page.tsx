'use client'

import { LoginData } from "@/types"
import { useForm } from "react-hook-form"
import { auth } from "@/api"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { email } from "zod"

export default function Login() {
  const formValidation = z.object({
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<LoginData>({
    resolver: zodResolver(formValidation),
  })

  const { login } = auth
  const [serverError, setServerError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: LoginData) => {
    setServerError(null)
    try {
      const response = await login(data)
      if (response) {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
          localStorage.setItem("email", data.email)
          localStorage.setItem("password", data.password)
        } else {
          localStorage.removeItem("rememberMe")
          localStorage.removeItem("email")
          localStorage.removeItem("password")
        }
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.log(error)
      setServerError(error?.response?.data?.message || "Login failed")
    }
  }

  // Load saved credentials on mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true"
    let email = localStorage.getItem("email")
    let password = localStorage.getItem("password")
    if(!email){
      localStorage.setItem("email", getValues("email"))
    }
    if(!password){
      localStorage.setItem("password", getValues("password"))
    }

    email = localStorage.getItem("email") || ""
    password = localStorage.getItem("password") || ""

    if (remembered ) {
      setValue("email", email)
      setValue("password", password)
      setRememberMe(true)
    }
  }, [rememberMe])

  return (
    <div className="flex justify-center items-center min-h-screen custom-background">
      {/* Glassy Card */}
      <div className="flex flex-col items-center w-[400px] p-6 rounded-2xl border custom-border bg-[#FAFAFA]/10 backdrop-blur-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-white w-full text-left border-b custom-border pb-4">
          Sign in to Dashboard
        </h1>

        <form
          className="w-full mt-6 flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-white/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
              className={`w-full border custom-border bg-[#FAFAFA]/10 text-white placeholder-white/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition ${
                errors.email ? "border-red-500 focus:ring-red-400" : ""
              }`}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-xs text-red-400 mt-1"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-white/80"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-error"
              className={`w-full border custom-border bg-[#FAFAFA]/10 text-white placeholder-white/60 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition ${
                errors.password ? "border-red-500 focus:ring-red-400" : ""
              }`}
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-xs text-red-400 mt-1"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-white/80">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 accent-[#1d1d1d]/80"
              checked={rememberMe}
              onChange={(e) => {
                setRememberMe(e.target.checked)
                if(e.target.checked){
                  localStorage.setItem("rememberMe", "true")
                }else{
                  localStorage.removeItem("rememberMe")
                }
              }}
            />
            <label
              htmlFor="remember"
              className="text-xs font-semibold cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          {/* Server error */}
          {serverError && (
            <p className="text-red-400 text-sm mt-1 text-center">{serverError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1d1d1d]/80 text-white px-4 py-2 rounded-lg mt-2 w-full font-semibold hover:bg-[#1d1d1d]/80 focus:ring-2 focus:ring-white-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {/* Forgot password */}
          <p className="text-xs text-[#ffffff]/80 mt-1 hover:underline cursor-pointer text-center">
            Forgot password?
          </p>
          {/* Don't have an account */}
          <p
            onClick={() => router.push("/signup")}
            className="text-xs text-[#ffffff]/80 mt-1 hover:underline cursor-pointer text-center"
          >
            Don't have an account?
          </p>
        </form>
      </div>
    </div>
  )
}
