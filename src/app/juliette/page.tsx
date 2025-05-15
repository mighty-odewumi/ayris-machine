import BrownScroll from "@/components/BrownScroll";
import { juliette } from "@/constants/juliette";

export default function Juliette() {
  return (
    <>
      <BrownScroll 
        title="JULIETTE"
        artistName="MARQUIS DE SADE"
        objectName="PROVOCATIVE BOOK"
        mainBody={juliette}
      />
    </>
  )
}