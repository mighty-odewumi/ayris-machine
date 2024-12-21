"use client";

import Image from "next/image";
// @ts-expect-error No types available
import imageMapResize from "image-map-resizer";
import { useEffect } from "react";

const ImgMap = () => {

  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>("img[useMap]");
    if (img) {
      img.onload = () => imageMapResize();
    }
  }, [])

  return (
    <div>
      <Image
        src="/assets/welcome-home-edit1.png"
        alt="Interactive Map"
        useMap="#map"
        width={960}
        height={679}
        className="w-full h-auto"
      />

      <map name="map">
        <area
          shape="rect"
          coords="240, 121, 341, 147"
          alt="Build"
          href="/build"
        />
        <area
          shape="rect"
          coords="623, 122, 720, 148"
          alt="Search"
          href="/search"
        />
        <area
          shape="rect"
          coords="868, 125, 921, 150"
          alt="Register"
          href="/register"
        />
      </map>

    </div>
  );
};

export default ImgMap;
