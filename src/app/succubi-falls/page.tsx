import BrownScroll from "@/components/BrownScroll";
import { succubiFalls } from "@/constants/succubiFallsForSatan";

export default function SuccubiFalls() {
  return (
    <>
      <BrownScroll 
        title="Succubi Falls for Satan"
        mainBody={succubiFalls}
      />
    </>
  )
}