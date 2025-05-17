"use client";

import dynamic from "next/dynamic";

export default function Entry() {
  const MyMap = dynamic(
    () => import("@/components/responsiveMap"),
    { ssr: false }
  );

  return (
    <main className={`container bg-[url("../../public/assets/background-edit1.png")]`}>
      <MyMap />
    </main>
  )
}