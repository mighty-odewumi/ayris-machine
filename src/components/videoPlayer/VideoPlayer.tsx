"use client"

import { useState, useRef } from "react"
import VideoControls from "./VideoControls"
import VideoProgressBar from "./VideoProgressBar"
import { useClickOutsideForVideo } from "@/hooks/useClickOutsideForVideo"
import { cn } from "./utils"
import Image from "next/image"

interface VideoPlayerProps {
  src: string
  title?: string
  artist?: string
  artType?: string
}

export default function VideoPlayer({
  src,
  title = "HYLAS AND THE NYMPHS",
  artist = "JOHN WILLIAM WATERHOUSE",
  artType = "PAINTING",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isControlsOpen, setIsControlsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  // Handle click outside to close controls
  useClickOutsideForVideo(
    controlsRef,
    () => {
      if (isControlsOpen && !controlsRef.current?.contains(playerRef.current)) {
        setIsControlsOpen(false)
      }
    },
    [isControlsOpen],
  )

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Update time display
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  // Handle video end
  const handleVideoEnded = () => {
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // Seek to position
  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  // Toggle controls visibility
  const toggleControls = () => {
    setIsControlsOpen(!isControlsOpen)
  }

  return (
    <div
      ref={playerRef}
      className={`relative w-full max-w-4xl mx-auto ${isControlsOpen && "mt-12"}`}
      style={{
        backgroundImage: "url('/assets/ayris-vid-bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        aspectRatio: "1.5/1",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Main video container */}
        <div className="relative w-[50%] aspect-video bg-black flex items-center justify-center border-2">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 text-white">✱</div>
            </div>
          )}

          <video
            ref={videoRef}
            src={src}
            className={cn("w-full h-full object-contain", isLoading ? "opacity-0" : "opacity-100")}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onClick={togglePlay}
          />

          {!isPlaying && !isLoading && (
            <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center">
                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-red-600 ml-1"></div>
                </div>
              </div>
            </button>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0">
            <VideoProgressBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />
          </div>
        </div>

        {/* Bottom control bar */}
        <div
          className="w-[50%] h-10 mt-1 bg-gray-700 border border-gray-500 flex items-center justify-center cursor-pointer"
          onClick={toggleControls}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <div className="text-amber-300 text-sm">
              <Image
                src="/assets/ayris-cursor-draggable-100x100.png"
                width="100"
                height="100"
                alt="Ayris Beauty Machine"
              />
            </div>
          </div>
        </div>

        {/* Expanded controls */}
        {isControlsOpen && (
          <div ref={controlsRef} className="w-[50%]">
            <VideoControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              title={title}
              artist={artist}
              artType={artType}
              onPlayPause={togglePlay}
            />
          </div>
        )}
      </div>
    </div>
  )
}
