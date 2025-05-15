import BrownScroll from "@/components/BrownScroll";
import { text, formatBibleText } from "@/constants/bibleNewTestament";

export default function BibleNewTestament() {
  // console.log(bibleNewTestament);

  console.log(formatBibleText(text));
  
  return (
    <BrownScroll 
      title="Bible"
      objectName="Sacred Text"
      artistName="APOSTLES, PROPHETS, AND POETS"
      mainBody={formatBibleText(text)}
    />
  )
}