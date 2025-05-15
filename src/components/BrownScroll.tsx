import ScrollBottomLinks from "./ScrollBottomLinks";

export default function BrownScroll(
  { title, 
    artistName, 
    objectName = "Ayris Beauty Machine", 
    mainBody, 
  }: { 
  title: string; 
  artistName: string; 
  objectName: string; 
  mainBody: string;
}) {
  return (
    <>
      <div id="home-intro">
        <article className="brown-article">

          {/* <time data-align="center" className="brown-time">{objectName}</time> */}
          <div className="scroll-top flex flex-col mt-[-60px]">
            <time data-align="center" className="brown-top uppercase mt-2">{title}</time>
            <time data-align="center" className="brown-top uppercase mt-2">{objectName}</time>
            <time data-align="center" className="brown-top uppercase mt-2">{artistName}</time>
          </div>

          {/* <h1 id="home-intro-header">
            {header}
          </h1> */}

          <section 
            className="formatted-text" 
            dangerouslySetInnerHTML={{ __html: mainBody }} 
          />

          {/* <aside>
            <span className="font-extrabold">
              ARTIST: 
            </span>

            <span className="font-semibold">
              &nbsp;Tristithea Ellen De Ellendeh 
            </span>
          </aside> */}

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
