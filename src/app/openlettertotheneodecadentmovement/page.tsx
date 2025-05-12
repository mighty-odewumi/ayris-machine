import BrownScroll from "@/components/BrownScroll";
import { neodecadentMovement } from "@/constants/neodecadent";

export default function NeodecadentMovement() {

  return (
    <>
      <BrownScroll 
        objectName="OBJECT NAME: POLEMIC WRITING"
        header="OPEN LETTER TO THE NEO-DECADENT MOVEMENT"
        mainBody={neodecadentMovement}
      />
    </>
  )
}
