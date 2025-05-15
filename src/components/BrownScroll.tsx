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

          <div className="scroll-top flex flex-col mt-[-8rem]">
            <time data-align="center" className="brown-top uppercase text-xs">{title}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{objectName}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{artistName}</time>
          </div>

          <section 
            className="formatted-text" 
            dangerouslySetInnerHTML={{ __html: mainBody }} 
          />

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
