import Link from "next/link";

export default function BrownScroll({objectName, header, mainBody}: {objectName: string, header: string, mainBody: string}) {
  return (
    <>
      <div id="home-intro">
        <article>

          <time data-align="center">{objectName}</time>

          <h1 id="home-intro-header">
            {header}
          </h1>

          {/* <pre className="text-justify text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl formatted-text">
            {mainBody}
          </pre> */}

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

          <aside className="my-8">
            <Link href="/entry" className="underline">Go to Home</Link>
          </aside>
        </article>
      </div>
    </>
  )
}
