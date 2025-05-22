"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"  // Uncomment this
import { signup } from "../actions"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    repeatEmail: "",
    password: "",
    repeatPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Uncomment and use the schema
  const formSchema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Please enter a valid email"),
      repeatEmail: z.string().email("Please enter a valid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      repeatPassword: z.string(),
    })
    .refine((data) => data.email === data.repeatEmail, {
      message: "Emails do not match",
      path: ["repeatEmail"],
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Passwords do not match",
      path: ["repeatPassword"],
    })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function clientAction(formData: FormData) {
    setIsSubmitting(true);

    try {
      // Extract form data for client-side validation
      const formValues = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        repeatEmail: formData.get('repeatEmail') as string,
        password: formData.get('password') as string,
        repeatPassword: formData.get('repeatPassword') as string,
      };

      // Validate with Zod before submitting
      const validationResult = formSchema.safeParse(formValues);
      
      if (!validationResult.success) {
        // Handle validation errors with alerts
        const errors = validationResult.error.errors;
        if (errors.length > 0) {
          alert(errors[0].message);
        }
        return;
      }

      // If validation passes, proceed with signup
      const result = await signup(formData);

      if (result.success) {
        alert(result.message || "Registration successful! Please check your email to confirm your account.");
        router.push("/register2"); // Navigate to next step or confirmation page
      } else if (result.errors) {
        // Handle server-side validation errors
        const firstError = Object.values(result.errors)[0];
        if (firstError) {
          alert(firstError);
        } else {
          alert(result.message || "Registration failed");
        }
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An unexpected error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full max-w-[1200px] aspect-[1200/900]">
        <Image
          src="/assets/ayris-register.png"
          alt="Registration form background"
          fill
          priority
          className="object-contain"
        />

        {/* Form overlaid on the background */}
        <form action={clientAction} className="absolute inset-0 flex flex-col items-center">
          {/* Username field - positioned exactly over the red box at the top */}
          <div className="absolute top-[34.5%] left-[51%] transform -translate-x-1/2 w-[40px] md:w-[86px]">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full bg-transparent border-none text-red-600 font-medieval text-center text-xl placeholder:text-red-800/70 focus:outline-none focus:ring-0 overflow-hidden whitespace-nowrap"
              aria-label="Username"
              style={{ caretColor: "red" }}
            />
          </div>

          {/* Email fields - left side */}
          <div className="absolute top-[58.5%] left-[27.5%] md:top-[64.8%] md:left-[27.5%] transform -translate-x-1/2 flex flex-col" style={{ }}>
            <div className="w-[40px] md:w-[90px] md:mb-[.5rem]">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-Mail"
                className="w-full bg-transparent border-none text-gray-300 font-medieval text-center text-xs placeholder:text-gray-500 focus:outline-none focus:ring-0 overflow-hidden whitespace-nowrap"
                aria-label="Email"
                style={{ caretColor: "gray" }}
              />
            </div>

            <div className="w-[40px] md:w-[90px]">
              <input
                type="email"
                name="repeatEmail"
                value={formData.repeatEmail}
                onChange={handleChange}
                placeholder="Repeat E-Mail"
                className="w-full bg-transparent border-none text-gray-300 font-medieval text-center text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0 overflow-hidden whitespace-nowrap"
                aria-label="Repeat Email"
                style={{ caretColor: "gray" }}
              />
            </div>
          </div>

          {/* Password fields - right side */}
          <div className="absolute top-[58.5%] left-[74.5%] md:top-[67.5%] md:left-[71.5%] transform -translate-x-1/2 flex flex-col" style={{  }}>
            <div className="w-[40px] md:w-[90px] md:mb-[.5rem]">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent border-none text-gray-300 font-medieval text-center text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0 overflow-hidden whitespace-nowrap"
                aria-label="Password"
                style={{ caretColor: "gray" }}
              />
            </div>

            <div className="w-[40px] md:w-[90px]">
              <input
                type="password"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                placeholder="Repeat Password"
                className="w-full bg-transparent border-none text-gray-300 font-medieval text-center text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0 overflow-hidden whitespace-nowrap"
                aria-label="Repeat Password"
                style={{ caretColor: "gray" }}
              />
            </div>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="register absolute top-[66.5%] left-[51%] md:top-[65.4%] transform -translate-x-1/2 w-1/4 h-1/8 bg-transparent text-white font-medieval text-sm md:text-lg hover:text-red-500 transition-colors focus:outline-none disabled:opacity-70 disabled:hover:text-white"
            aria-label="Register"
          >
            {isSubmitting ? "..." : "Register"}
          </button>

          {/* Main Page link */}
          <Link
            href="/"
            className="absolute bottom-[8.5%] left-1/2 transform -translate-x-1/2 text-red-600 font-medieval text-lg hover:text-red-400 transition-colors"
          >
            Main Page
          </Link>
        </form>
      </div>
    </div>
  )
}