import BrownScroll from "@/components/BrownScroll";
import { blackHumour } from "@/constants/blackHumour";

export default function AnthologyOfBlackHumour() { 
  return (
    <BrownScroll 
      objectName="Ayris Beauty Machine"
      title="Anthology of Black Humour"
      artistName=""
      mainBody={blackHumour}
    />
  )
}
