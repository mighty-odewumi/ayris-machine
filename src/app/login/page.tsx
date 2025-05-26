"use client"
import { login } from '../actions';

import Image from "next/image"
import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", loginData)
    // Add login logic here
  }

  const handleResetPassword = () => {
    console.log("Reset password clicked")
    // Add reset password logic here
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      {/* Viewport Units with Fixed Aspect Ratio */}
      <div className="viewport-container">
        <Image
          src="/assets/ayrisPageStructure.jpg"
          alt="Ayris Machine navigation layout"
          fill
          priority
          className="object-contain"
        />

        <div className="viewport-overlay">
          {/* Header */}
          <Link href="/build" className="vp-header-build">
            Build
          </Link>
          <Link href="/search" className="vp-header-search">
            Search
          </Link>

          {/* Left Side */}
          <Link href="/" className="vp-left-home">
            Home
          </Link>
          <Link href="/den" className="vp-left-dear">
            Dear
          </Link>
          <Link href="/eat-sale" className="vp-left-era">
            Era/Style
          </Link>
          <Link href="/location" className="vp-left-location">
            Location
          </Link>
          <Link href="/alchemy" className="vp-left-medium">
            Medium
          </Link>
          <Link href="/philosophy" className="vp-left-philosophy">
            Philosophy
          </Link>
          <Link href="/mythology" className="vp-left-mythology">
            Mythology
          </Link>
          <Link href="/empresses" className="vp-left-empresses">
            Empresses
          </Link>
          <Link href="/dream-game" className="vp-left-dream">
            Dream Engine
          </Link>
          <Link href="/eternity" className="vp-left-etherith">
            Etherith
          </Link>
          <Link href="/manifesto" className="vp-left-manifesto">
            Manifesto
          </Link>

          {/* Right Side */}
          <Link href="/register" className="vp-right-register">
            Register
            <br />
            /Login
          </Link>
          <Link href="/banners" className="vp-right-banners">
            Banners
          </Link>
          <Link href="/heaven" className="vp-right-heaven">
            Heaven
          </Link>
          <Link href="/music" className="vp-right-music">
            Music
          </Link>
          <Link href="/library" className="vp-right-library">
            Library
          </Link>
          <Link href="/court" className="vp-right-court">
            Court
          </Link>
          <Link href="/empire" className="vp-right-empire">
            Empire
          </Link>
          <Link href="/army" className="vp-right-army">
            Army
          </Link>
          <Link href="/market" className="vp-right-market">
            Market
          </Link>
          <Link href="/treasury" className="vp-right-treasury">
            Treasury
          </Link>
          <Link href="/3d" className="vp-right-3d">
            3D
          </Link>

          {/* Footer */}
          <Link href="/edit-profile" className="vp-footer-profile">
            Edit Profile
          </Link>
          <Link href="/live" className="vp-footer-live">
            Live
          </Link>
          <Link href="/" className="vp-footer-home">
            Home
          </Link>
          <Link href="/edit-category" className="vp-footer-category">
            Edit Category
          </Link>

          {/* Gothic Login Interface - Replaces Center Content */}
          <div className="vp-login-container">
            {/* Login Interface Background */}
            <div className="vp-login-background">
              <Image src="/assets/login-form.png" alt="Gothic login interface" fill className="object-contain" />
            </div>

            {/* Login Form Elements Positioned Over the Ornate Design */}
            <form onSubmit={handleLogin} className="vp-login-form">
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

          {/* Exit */}
          <Link href="/exit" className="vp-exit">
            Exit
          </Link>
        </div>
      </div>
    </div>
  )
}



// export default function LoginPage() {
//   return (
//     <form className="flex flex-col items-center p-4 bg-blue-500 justify-center ">
//       <label htmlFor="email">Email:</label>
//       <input id="email" name="email" type="email" required />
//       <label htmlFor="password">Password:</label>
//       <input id="password" name="password" type="password" required />
//       <button 
//         formAction={login} 
//         className="bg-slate-200 text-blue-400"
//       >
//         Log in
//       </button>
//     </form>
//   )
// }
