"use client";

import { useState, useEffect, useRef } from "react";
import ScrollBottomLinks from "./ScrollBottomLinks";
import VideoPlayer from "./videoPlayer/VideoPlayer";
import Image from "next/image";
import Bulletin from "@/components/bulletins/Bulletin";

export default function BrownScroll(
  { title, 
    artistName, 
    objectName = "Ayris Beauty Machine", 
    mainBody, 
  }: { 
  title: string; 
  artistName: string; 
  objectName: string; 
  mainBody: string;
}) {

  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  // const topBarRef = useRef<HTMLDivElement>(null);

  // Handle top bar click to show video
  const handleShowVideo = () => {
    setShowVideo(!showVideo);
  };

  // Close video when clicking outside
  useEffect(() => {
    // const handleClickOutside = (event: MouseEvent) => {
    //   if (
    //     showVideo && 
    //     videoRef.current && 
    //     !(videoRef.current.contains(event.target as Node)) &&
    //     !(event.target === videoRef.current)
    //   ) {
    //     setShowVideo(false);
    //   }
    // };

    // document.addEventListener("mousedown", handleClickOutside);
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  }, [showVideo]);

  return (
    <>
      <div id="home-intro">
        <article className="brown-article">
          <div 
            // onClick={handleShowVideo} 
            // ref={topBarRef}
            className="scroll-top flex flex-col mt-[-8rem] cursor-pointer relative"
          >
            <time data-align="center" className="brown-top uppercase text-xs">{title}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{objectName}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{artistName}</time>
          </div>

          <div 
            className="relative flex items-center justify-center w-full h-20 bg-gray-400"
            onClick={handleShowVideo}
          > 
            Tap here to play Video
            <Image 
              src={"/assets/ayris-cursor-draggable-100x100.png"}
              width={500}
              height={500}
              alt="Ayris Beauty Machine Video"
              className="w-24 h-24"
            />
          </div>

          {showVideo && (
            <div 
              className="top-0 z-40 mb-4 shadow-lg" 
              ref={videoRef} 
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                title={title}
                artist={artistName}
                artType={objectName}
              />
            </div>
          )}

          <section 
            className="formatted-text" 
            dangerouslySetInnerHTML={{ __html: mainBody }} 
          />

          <Bulletin />

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
