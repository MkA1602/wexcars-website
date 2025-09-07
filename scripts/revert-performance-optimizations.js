const fs = require('fs')
const path = require('path')

function revertPerformanceOptimizations() {
  try {
    console.log('🔄 Reverting Performance Optimizations')
    console.log('=' .repeat(70))
    
    console.log('\n📦 Restoring original files...')
    
    const originalPagePath = path.join(__dirname, '../app/collections/page.tsx')
    const originalCarListingPath = path.join(__dirname, '../components/car-listing/car-listing-page.tsx')
    const originalCarGridPath = path.join(__dirname, '../components/car-listing/car-grid.tsx')
    
    const backupPagePath = path.join(__dirname, '../app/collections/page.tsx.backup')
    const backupCarListingPath = path.join(__dirname, '../components/car-listing/car-listing-page.tsx.backup')
    const backupCarGridPath = path.join(__dirname, '../components/car-listing/car-grid.tsx.backup')
    
    // Restore backups
    if (fs.existsSync(backupPagePath)) {
      fs.copyFileSync(backupPagePath, originalPagePath)
      console.log('✅ Restored app/collections/page.tsx')
    }
    
    if (fs.existsSync(backupCarListingPath)) {
      fs.copyFileSync(backupCarListingPath, originalCarListingPath)
      console.log('✅ Restored components/car-listing/car-listing-page.tsx')
    }
    
    if (fs.existsSync(backupCarGridPath)) {
      fs.copyFileSync(backupCarGridPath, originalCarGridPath)
      console.log('✅ Restored components/car-listing/car-grid.tsx')
    }
    
    console.log('\n🎉 Successfully reverted to original files!')
    console.log('\n📝 Note: Backup files are still available if needed')
    
  } catch (error) {
    console.error('❌ Error reverting optimizations:', error.message)
  }
}

// Run the revert
revertPerformanceOptimizations()
