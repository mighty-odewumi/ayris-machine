export interface CategoryGroup {
  title: string;
  categories: string[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    title: "Era-Style",
    categories: [
      "Pyramid Eras",
      "Egyptian",
      "Sumerian",
      "Rococo",
      "Baroque",
      "Mesopotamian",
      "Aztec",
      "African",
      "Roman",
      "Greece",
      "Japan",
      "China",
      "Nordic",
      "Asian",
      "Medieval",
      "Renaissance",
      "Modern"
    ]
  },
  {
    title: "Mythology",
    categories: [
      "Greek",
      "Roman",
      "Norse",
      "Egyptian",
      "Celtic",
      "Hindu",
      "Chinese",
      "Japanese",
      "Native American",
      "African",
      "Aztec",
      "Mayan"
    ]
  },
  {
    title: "Location",
    categories: [
      "Temple",
      "Palace",
      "Garden",
      "Forest",
      "Mountain",
      "Desert",
      "Ocean",
      "Underground"
    ]
  },
  // Add other category groups as needed
]; 