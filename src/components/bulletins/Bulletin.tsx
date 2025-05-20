"use client";

import { useState, useRef } from "react";
import backgroundImage from "../../../public/assets/bulletins/ayrisBulletinBg.png";
import Image from "next/image";
import { bulletinData, bulletinDataType } from "./bulletinData";

export default function Bulletin() {
  const [activeItems, setActiveItems] = useState<Record<number, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: number) => {
    setActiveItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Scroll carousel left
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll carousel right
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div 
        className="bg-cover bg-center bg-no-repeat w-full h-screen flex flex-col items-center justify-center relative" 
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        {/* Carousel container with navigation */}
        <div className="w-full max-w-4xl relative px-10">
          {/* Carousel navigation buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white w-8 h-8 flex items-center justify-center rounded-full"
            aria-label="Scroll left"
          >
            ←
          </button>
          
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white w-8 h-8 flex items-center justify-center rounded-full"
            aria-label="Scroll right"
          >
            →
          </button>
          
          {/* Carousel items */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
            style={{
              scrollbarWidth: 'none', // Firefox
              scrollBehavior: 'smooth',
            }}
          >
            {bulletinData.map((bulletin: bulletinDataType) => (
              <div 
                key={bulletin.id}
                className="flex-shrink-0 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
                style={{ 
                  width: '360px', 
                  height: activeItems[bulletin.id] ? '200px' : '360px',
                }}
                onClick={() => toggleItem(bulletin.id)}
              >
                {!activeItems[bulletin.id] ? (
                  // Show image when not active
                  <div className="w-full h-full relative">
                    <Image
                      alt={bulletin.alt}
                      src={bulletin.image}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain"
                      sizes="360px"
                    />
                  </div>
                ) : (
                  // Show content when active
                  <div className="w-full h-full bg-white/90 p-3 overflow-y-auto rounded shadow-md text-left">
                    <h2 className="text-sm font-bold mb-1">{bulletin.title}</h2>
                    <p className="text-xs">{bulletin.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}