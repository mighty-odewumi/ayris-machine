import BrownScroll from "@/components/BrownScroll";
import { neodecadentMovement } from "@/constants/neodecadent";

export default function NeodecadentMovement() {

  return (
    <>
      <BrownScroll 
        objectName="POLEMIC WRITING"
        title="OPEN LETTER TO THE NEO-DECADENT MOVEMENT"
        artistName="TRISTITHEA ELLEN DE ELLENDEH"
        mainBody={neodecadentMovement}
      />
    </>
  )
}
