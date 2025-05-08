import BrownScroll from "@/components/BrownScroll";
import { text, formatBibleText } from "@/constants/bibleNewTestament";

export default function BibleNewTestament() {
  // console.log(bibleNewTestament);

  console.log(formatBibleText(text));
  
  return (
    <BrownScroll 
      objectName="The Project Gutenberg eBook of The King James Version of the Bible"
      header="The New Testament of the King James Version of the Bible"
      mainBody={formatBibleText(text)}
    />
  )
}