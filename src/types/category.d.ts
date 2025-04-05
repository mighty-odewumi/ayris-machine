// src/types/category.d.ts
export interface Category {
    id: string
    name: string
    group_name: string
  }
  
  export interface CategoryGroup {
    title: string
    categories: Category[]
  }