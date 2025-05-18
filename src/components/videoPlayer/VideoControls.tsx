"use client"

// import { useState } from "react"
import { formatTime } from "./utils"

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  title: string
  artist: string
  artType: string
  onPlayPause: () => void
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  title,
  artist,
  artType,
  onPlayPause,
}: VideoControlsProps) {
  // const [isMuted, setIsMuted] = useState(false)

  // const toggleMute = () => {
  //   setIsMuted(!isMuted)
  // }

  return (
    <div className="bg-black border border-gray-700 text-white">
      {/* Main controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <button onClick={onPlayPause} className="w-8 h-8 flex items-center justify-center">
            {isPlaying ? (
              <div className="w-5 h-5 text-white flex items-center justify-center">⏸</div>
            ) : (
              <div className="w-5 h-5 text-white flex items-center justify-center">▶️</div>
            )}
          </button>

          <div className="text-xs font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* <div className="flex items-center space-x-4">
          <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center">
            {isMuted ? (
              <div className="w-5 h-5 text-white flex items-center justify-center">🔇</div>
            ) : (
              <div className="w-5 h-5 text-white flex items-center justify-center">🔊</div>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-gray-600"></div>
            <div className="w-4 h-4 border border-gray-600"></div>
          </div>
        </div> */}
      </div>

      {/* Artwork info */}
      <div className="bg-gray-800 p-4">
        <div className="text-center space-y-1">
          <div className="text-sm text-gray-300">{artType}</div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-sm text-gray-300">{artist}</div>
        </div>
      </div>
    </div>
  )
}
