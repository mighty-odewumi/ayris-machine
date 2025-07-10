"use client"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

export default function PageWithSidebars({ centerContent }: { centerContent: ReactNode }) {
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
          <Link href="/temple" className="vp-left-home">
            Temple Gate
          </Link> 
          <Link href="/dear" className="vp-left-dear">
            Dear
          </Link>
          <Link href="/era-style" className="vp-left-era">
            Era/Style
          </Link>
          <Link href="/location" className="vp-left-location">
            Location
          </Link>
          <Link href="/medium" className="vp-left-medium">
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
          <Link href="/dream-engine" className="vp-left-dream">
            Dream Engine
          </Link>
          <Link href="/etherith" className="vp-left-etherith">
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
          <Link href="http://webcam.hzs.be/" className="vp-footer-live">
            Live
          </Link>
          <Link href="/" className="vp-footer-home">
            Home
          </Link>
          <Link href="/edit-category" className="vp-footer-category">
            Edit Category
          </Link>

          {/* Center */}
          {centerContent}

          {/* Exit */}
          <Link href="/exit" className="vp-exit">
            Exit
          </Link>
        </div>
      </div>
    </div>
  )
}
