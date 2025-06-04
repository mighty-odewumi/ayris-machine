"use client"
import { login } from '../actions';

import Image from "next/image"
import type React from "react"

import { useState } from "react"
import PageWithSidebars from '@/components/PageWithSidebars';

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    email: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetPassword = () => {
    console.log("Reset password clicked")
    // Add reset password logic here
  }

  const content = (
    <div className="vp-login-container">
      {/* Login Interface Background */}
      <div className="vp-login-background">
        <Image src="/assets/login-form.png" alt="Gothic login interface" fill className="object-contain" />
      </div>

      {/* Login Form Elements Positioned Over the Ornate Design */}
      <form className="vp-login-form">
        {/* Username Input - Top area of the cross */}
        <div className="vp-login-username">
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="gothic-input"
            required
          />
        </div>

        <div className="vp-login-email">
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="gothic-input"
            required
          />
        </div>

        {/* Password Input - Center area of the cross */}
        <div className="vp-login-password">
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="gothic-input"
            required
          />
        </div>

        {/* Login Button - Bottom left of the cross */}
        <button type="submit" formAction={login} className="vp-login-button">
          Login
        </button>

        {/* Reset Password Button - Bottom right of the cross */}
        <button type="button" onClick={handleResetPassword} className="vp-reset-button">
          New Password
        </button>
      </form>
    </div>
  );

  return (
    <>
      <PageWithSidebars centerContent={content} />
    </>
  )
}
