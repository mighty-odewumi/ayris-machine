"use client";

// import ImgMap from "@/components/responsiveMap";
import dynamic from "next/dynamic";

export default function Home() {

  const MyMap = dynamic(
    () => import('@/components/responsiveMap'),
    { ssr: false }
  )

  return (
    <main className={`container bg-[url("../../public/assets/background-edit1.png")]`}>
      <MyMap />
    </main>
  );
}
