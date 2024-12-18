import Image from "next/image";

export default function Home() {
  return (
    <div className={`bg-[url("../../public/assets/background.png")] bg-cover w-full h-full cursor-pointer`}>
      <Image 
        src="/assets/welcome-home.png"
        alt="Home page"
        className="w-full h-full"
        width={1900}
        height={3000}
      />
    </div>
  );
}
