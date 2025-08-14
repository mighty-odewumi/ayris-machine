import Link from "next/link";

export default function ScrollBottomLinks() {
  return (
    <aside className="my-6">
      <Link href="/home" className="underline bottom-links">Go to Home</Link>
      <br/>
      <Link href="/final-book-selection" className="underline bottom-links">Final Book Selection</Link>
      <br/>
      <Link href="/juliette" className="underline bottom-links">Juliette</Link>
      <br/>
      <Link href="/satyricon" className="underline bottom-links">Satyricon</Link>
      <br/>
      <Link href="/paradiselost" className="underline bottom-links">Paradise Lost</Link>
      <br/>
      <Link href="/openlettertotheneodecadentmovement" className="underline bottom-links">Open Letter to the Neodecadent Movement</Link>
      <br/>
      <Link href="/biblenewtestament" className="underline bottom-links">Bible New Testament</Link>
      <br/>
      <Link href="/bibleoldtestament" className="underline bottom-links">Bible Old Testament</Link>
      <br/>
      <Link href="/anthologyofblackhumour" className="underline bottom-links">Anthology of Black Humour</Link>
      <br/>
      <Link href="/satan-introduces-himself" className="underline bottom-links">Satan Introduces Himself</Link>
      <br/>
      <Link href="/succubi-falls" className="underline bottom-links">Succubi Falls for Satan</Link>
      <br/>
    </aside>
  )
}
