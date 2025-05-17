import BrownScroll from "@/components/BrownScroll";
import { bibleOldTestament } from "@/constants/bibleOldTestament";

export default function BibleOldTestament() {
  return (
    <BrownScroll 
      objectName="Old Testament - Sacred Text"
      title="Bible"
      artistName="Prophets, Poets, and Apostles"
      mainBody={bibleOldTestament}
    />
  )
}
