"use client";

import { useState } from "react";
import ScrollBottomLinks from "./ScrollBottomLinks";
// import VideoPlayer from "./videoPlayer/VideoPlayer";
import Image from "next/image";
import Bulletin from "@/components/bulletins/Bulletin";

export default function BrownScroll(
  { title, 
    artistName, 
    objectName = "Ayris Beauty Machine", 
    mainBody, 
  }: { 
  title: string; 
  artistName?: string; 
  objectName?: string; 
  mainBody: string;
}) {

  const [showVideo, setShowVideo] = useState(false);

  // Handle top bar click to show video
  const handleShowVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <>
      <div id="home-intro">
        <article className="brown-article">
          <div 
            className="scroll-top flex flex-col mt-[-8rem] cursor-pointer relative"
          >
            <time data-align="center" className="brown-top uppercase text-xs">{title}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{objectName}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{artistName}</time>
          </div>

          <div 
            className="relative flex items-center justify-center w-full h-20 mt-20 bg-gray-400"
            onClick={handleShowVideo}
          > 
            Tap here to {showVideo == true ? "close" : "play"} Video
            <Image 
              src={"/assets/ayris-cursor-draggable-100x100.png"}
              width={500}
              height={500}
              alt="Ayris Beauty Machine Video"
              className="w-24 h-24"
            />
          </div>

          {showVideo && (
            <div className="top-0 z-40 mb-8 mt-4 shadow-lg" onClick={e => e.stopPropagation()}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/krmX-bk3eHg"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
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
