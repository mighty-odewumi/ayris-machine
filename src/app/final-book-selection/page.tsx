import BrownScroll from "@/components/BrownScroll";
import { finalBookSelection } from "@/constants/finalBookSelection";

export default function FinalBookSelection() {
  return (
    <>
      <BrownScroll 
        title="Final Book Selection"
        mainBody={finalBookSelection}
      />
    </>
  )
}