// UUID detection
export function isUUID(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidPattern.test(str)
}

// Clean category names for display
export function formatCategoryName(name: string): string | null {
  if (!name) return null
  
  if (isUUID(name)) return null
  
  if (name.startsWith('legacy-')) {
    return name.substring(7).replace(/-/g, ' ')
  }
  
  return name
}

// Deduplicate categories by name
export function deduplicateCategories(categories: any[]) {
  return Array.from(
    new Map(
      categories.map(({ category }) => [category.name, category])
    ).values()
  )
}