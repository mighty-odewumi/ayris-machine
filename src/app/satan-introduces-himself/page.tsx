import BrownScroll from "@/components/BrownScroll";
import { satanIntroducesHimself } from "@/constants/satanIntroducesHimself";

export default function SatanIntroducesHimselfPage() {
  return (
    <>
      <BrownScroll 
        title="Satan Introduces Himself"
        artistName="MARQUIS DE SADE"
        objectName="PROVOCATIVE BOOK"
        mainBody={satanIntroducesHimself}
      />
    </>
  )
}