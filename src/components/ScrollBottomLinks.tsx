import Link from "next/link";

export default function ScrollBottomLinks() {
  return (
    <aside className="my-6">
      <Link href="/entry" className="underline">Go to Home</Link>
      <br/>
      <Link href="/juliette" className="underline">Juliette</Link>
      <br/>
      <Link href="/paradiselost" className="underline">Paradise Lost</Link>
      <br/>
      <Link href="/openlettertotheneodecadentmovement" className="underline">Open Letter to the Neodecadent Movement</Link>
      <br/>
      <Link href="/biblenewtestament" className="underline">Bible New Testament</Link>
      <br/>
      <Link href="/bibleoldtestament" className="underline">Bible Old Testament</Link>
      <br/>
      <Link href="/anthologyofblackhumour" className="underline">Anthology of Black Humour</Link>
      <br/>
    </aside>
  )
}
