import BrownScroll from "@/components/BrownScroll";
import { bibleNewTestament } from "@/constants/bibleNewTestament";


export default function BibleNewTestament() {
  return (
    <BrownScroll 
      objectName="The Project Gutenberg eBook of The King James Version of the Bible"
      header="The New Testament of the King James Version of the Bible"
      mainBody={bibleNewTestament}
    />
  )
}