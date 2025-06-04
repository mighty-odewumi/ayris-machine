"use client"
import { login } from '../actions';
import Image from "next/image"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import PageWithSidebars from '@/components/PageWithSidebars';
import SuccessPopup from '@/components/SuccessPopup';

export default function Login() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    email: ""
  })
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetPassword = () => {
    console.log("Reset password clicked")
    // Add reset password logic here
  }

  // Custom form action to handle the login
  async function handleLogin(formData: FormData) {
    setIsSubmitting(true);
    try {
      // Call the server action
      await login(formData);
      
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        router.push("/home");
      }, 3000);
      
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const content = (
    <div className="vp-login-container">
      {/* Login Interface Background */}
      <div className="vp-login-background">
        <Image src="/assets/login-form.png" alt="Gothic login interface" fill className="object-contain" />
      </div>

      {/* Login Form Elements Positioned Over the Ornate Design */}
      <form action={handleLogin} className="vp-login-form">
        {/* Username Input - Top area of the cross */}
        <div className="vp-login-username">
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
        <button 
          type="submit" 
          className="vp-login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "..." : "Login"}
        </button>

        {/* Reset Password Button - Bottom right of the cross */}
        <button 
          type="button" 
          onClick={handleResetPassword} 
          className="vp-reset-button"
          disabled={isSubmitting}
        >
          New Password
        </button>
      </form>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup 
          message="Login successful! Redirecting you to your dashboard..." 
          onClose={() => setShowSuccessPopup(false)}
          autoCloseTime={4000}
        />
      )}
    </div>
  );

  return (
    <>
      <PageWithSidebars centerContent={content} />
    </>
  )
}
