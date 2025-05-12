import BrownScroll from "@/components/BrownScroll";
import { text, formatBibleText } from "@/constants/bibleNewTestament";

export default function BibleNewTestament() {
  // console.log(bibleNewTestament);

  console.log(formatBibleText(text));
  
  return (
    <BrownScroll 
      // objectName=""
      header="Bible New Testament"
      mainBody={formatBibleText(text)}
    />
  )
}