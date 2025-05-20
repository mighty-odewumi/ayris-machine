import { nasa } from "./constants/nasa";

export type bulletinDataType = {
  id: number;
  body: string;
  image: string;
  alt: string;
  title: string;
};

export const bulletinData: bulletinDataType[] = [
  {
    id: 1,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin1.png",
    alt: "Ayris Sub Bulletin 1",
    title: "Ayris Sub Bulletin 1",
  },
  {
    id: 2,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin2.png",
    alt: "Ayris Sub Bulletin 2",
    title: "Ayris Sub Bulletin 2",
  },
  {
    id: 3,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin3.png",
    alt: "Ayris Sub Bulletin 3",
    title: "Ayris Sub Bulletin 3",
  },
  {
    id: 4,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin4.png",
    alt: "Ayris Sub Bulletin 4",
    title: "Ayris Sub Bulletin 4",
  },
  {
    id: 5,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin5.png",
    alt: "Ayris Sub Bulletin 5",
    title: "Ayris Sub Bulletin 5",
  },
  {
    id: 6,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin6.png",
    alt: "Ayris Sub Bulletin 6",
    title: "Ayris Sub Bulletin 6",
  },
  {
    id: 7,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin7.png",
    alt: "Ayris Sub Bulletin 7",
    title: "Ayris Sub Bulletin 7",
  },
  {
    id: 8,
    body: nasa,
    image: "/assets/bulletins/ayrisSubBulletin8.png",
    alt: "Ayris Sub Bulletin 8",
    title: "Ayris Sub Bulletin 8",
  },
]