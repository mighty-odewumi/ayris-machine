import ScrollBottomLinks from "@/components/ScrollBottomLinks";
import { homePageText } from "@/constants/homePageText";

export default function HomePage() {
  return (
    <>
      <div id="home-intro">
        <article className="home-article brown-article">

          <p className="mt-20 whitespace-pre-line">
            {homePageText}
          </p>

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
