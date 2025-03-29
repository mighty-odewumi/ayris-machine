// scripts/generate-category-ids.js
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  try {
    // Use dynamic import
    const { categoryGroups } = await import('../src/constants/categories1.js')
    
    const withIds = categoryGroups.map(group => ({
      ...group,
      categories: group.categories.map(category => {
        // Handle both string and object formats
        const name = typeof category === 'string' ? category : category.name;
        
        return {
          id: uuidv4(),
          name: name,
          group_name: group.title
        }
      })
    }));

    const outputPath = path.join(__dirname, '../src/constants/categories1.js')
    fs.writeFileSync(
      outputPath,
      `// Auto-generated - DO NOT EDIT MANUALLY\n\nexport const categoryGroups = ${JSON.stringify(withIds, null, 2)}`
    )
    
    console.log('Category IDs regenerated!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Execute main function
main()