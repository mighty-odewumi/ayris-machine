import ScrollBottomLinks from "@/components/ScrollBottomLinks";
import { homePageText } from "@/constants/homePageText";
// import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <div id="home-intro">
        
        <article className="home-article brown-article">
          {/* <Image 
            src="/assets/background.png" 
            sizes="100vw"
            alt="Background" 
            width="200"
            height="200"
            style={{
              width: '100%',
              height: 'auto',
            }} 
          /> */}

          <p className="mt-[-6rem] whitespace-pre-line">
            {homePageText}
          </p>

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
