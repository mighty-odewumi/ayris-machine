import BrownScroll from "@/components/BrownScroll";
import { blackHumour } from "@/constants/blackHumour";

export default function AnthologyOfBlackHumour() { 
  return (
    <BrownScroll 
      objectName="Ayris Beauty Machine"
      header="Anthology of Black Humour"
      mainBody={blackHumour}
    />
  )
}
