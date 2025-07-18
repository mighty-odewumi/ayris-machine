"use client"
import PageWithSidebars from "@/components/PageWithSidebars"

export default function MainNav() {

  const content = (
    <div className="vp-center">
      <h1 className="text-4xl font-medieval text-gray-300 mb-2">Welcome</h1>
      <h2 className="text-xl font-medieval text-gray-400">To The</h2>
      <h3 className="text-2xl font-medieval text-yellow-600 mt-2">Ayris Beauty Machine</h3>
    </div>
  );

  return (
    <PageWithSidebars centerContent={content}/>
  )
}
