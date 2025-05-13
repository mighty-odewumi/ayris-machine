import ScrollBottomLinks from "./ScrollBottomLinks";

export default function BrownScroll({objectName = "Ayris Beauty Machine", header, mainBody}: {objectName?: string, header?: string, mainBody: string}) {
  return (
    <>
      <div id="home-intro">
        <article className="brown-article">

          <time data-align="center" className="brown-time">{objectName}</time>

          <h1 id="home-intro-header">
            {header}
          </h1>

          <section 
            className="formatted-text" 
            dangerouslySetInnerHTML={{ __html: mainBody }} 
          />

          <aside>
            <span className="font-extrabold">
              ARTIST: 
            </span>

            <span className="font-semibold">
              &nbsp;Tristithea Ellen De Ellendeh 
            </span>
          </aside>

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
