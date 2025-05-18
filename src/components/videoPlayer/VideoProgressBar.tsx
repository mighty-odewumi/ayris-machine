"use client"

import type React from "react"

import { useRef } from "react"

interface VideoProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

export default function VideoProgressBar({ currentTime, duration, onSeek }: VideoProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null)

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const position = (e.clientX - rect.left) / rect.width
      const seekTime = position * duration
      onSeek(seekTime)
    }
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div ref={progressBarRef} className="w-full h-1 bg-gray-700 cursor-pointer" onClick={handleProgressClick}>
      <div className="h-full bg-white" style={{ width: `${progressPercentage}%` }} />
    </div>
  )
}
