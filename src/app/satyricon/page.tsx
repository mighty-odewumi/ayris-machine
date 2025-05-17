import { satyricon } from '@/constants/satyricon';
import BrownScroll from '@/components/BrownScroll';

export default function Satyricon() {
  return (
    <>
      <BrownScroll
        title="Black Metal Lyrics"
        artistName="Apostles of the Devil, Prophets, Poets"
        objectName="Sacred Text"
        mainBody={satyricon}
      />
    </>
  )
}