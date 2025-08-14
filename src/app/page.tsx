"use client";

import { useState } from "react";
import ScrollBottomLinks from "@/components/ScrollBottomLinks";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import { homePageText } from "@/constants/homePageText";
import Image from "next/image";
import { homeImages } from "@/utils/homeImages";

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(false);

  function handleShowVideo() {  
    setShowVideo(!showVideo);
  }

  return (
    <>
      <div id="home-intro">
        
        <article className="home-article brown-article">

          <div 
            className="relative flex items-center justify-center w-full h-20 bg-gray-400 mb-8"
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
              className="top-0 z-40 mb-8 shadow-lg" 
              // ref={videoRef} 
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                // title={"Ayris Beauty Machine"}
                // artist={"Ayris Beauty Machine"}
                // artType={"Ayris Beauty Machine"}
              />
            </div>
          )}

          <br />
          <br />
          <br />

          {homeImages.map((img) => {
            return (
              <div key={img.id}>
                <h2 className="font-bold text-2xl text-center mt-20"
                >
                  {img.heading}
                </h2>

                {(img.image != "") && <Image 
                  key={img.id}
                  src={img.image} 
                  alt={img.heading} 
                  width={100} 
                  height={100} 
                  className="mb-4"
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }} 
                />}
              </div>
            )
          })}

          <h2 className="text-3xl">
            AHMAHRASZEA THE FAERY PLANET
          </h2>
          <p className="mt-[-6rem] whitespace-pre-line">
            {homePageText}
          </p>

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
