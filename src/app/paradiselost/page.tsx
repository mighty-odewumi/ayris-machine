import BrownScroll from "@/components/BrownScroll";
import { paradiseLost } from "@/constants/paradiseLost";

export default function ParadiseLost() {
  return (
    <>
      <BrownScroll 
        title="Paradise Lost"
        objectName="Sacred Text"
        artistName="John Milton"
        mainBody={paradiseLost}
      />
    </>
  )
}
