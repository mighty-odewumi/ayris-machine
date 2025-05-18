import ScrollBottomLinks from "./ScrollBottomLinks";
import VideoPlayer from "./videoPlayer/VideoPlayer";

export default function BrownScroll(
  { title, 
    artistName, 
    objectName = "Ayris Beauty Machine", 
    mainBody, 
  }: { 
  title: string; 
  artistName: string; 
  objectName: string; 
  mainBody: string;
}) {
  return (
    <>
      <div id="home-intro">
        <article className="brown-article">

          <div className="scroll-top flex flex-col mt-[-8rem]">
            <time data-align="center" className="brown-top uppercase text-xs">{title}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{objectName}</time>
            <time data-align="center" className="brown-top uppercase text-xs">{artistName}</time>
          </div>

          <div className="min-h-32 bg-black flex items-center justify-center mt-12 p-4">
            <VideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              title="HYLAS AND THE NYMPHS"
              artist="JOHN WILLIAM WATERHOUSE"
              artType="PAINTING"
            />
          </div>

          <section 
            className="formatted-text" 
            dangerouslySetInnerHTML={{ __html: mainBody }} 
          />

          <ScrollBottomLinks />
        </article>
      </div>
    </>
  )
}
