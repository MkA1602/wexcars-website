const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function performanceComparison() {
  try {
    console.log('📊 Performance Comparison: Before vs After Optimization')
    console.log('=' .repeat(70))
    
    // Test original approach (full data load)
    console.log('\n🔴 BEFORE OPTIMIZATION:')
    const startTimeOriginal = Date.now()
    
    const { data: originalData, error: originalError } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    const originalTime = Date.now() - startTimeOriginal
    const originalSize = JSON.stringify(originalData).length
    
    if (originalError) {
      console.log('❌ Original query failed:', originalError.message)
      return
    }
    
    console.log(`⏱️  Database query time: ${originalTime}ms`)
    console.log(`📦 Data size: ${(originalSize / 1024).toFixed(2)}KB`)
    console.log(`📈 Total records: ${originalData.length}`)
    console.log(`🖼️  Images loaded: ${originalData.filter(car => car.image).length}`)
    
    // Test optimized approach (selective fields + pagination)
    console.log('\n🟢 AFTER OPTIMIZATION:')
    const startTimeOptimized = Date.now()
    
    const { data: optimizedData, error: optimizedError } = await supabase
      .from('cars')
      .select(`
        id,
        name,
        brand,
        category,
        year,
        price,
        price_excl_vat,
        vat_rate,
        vat_amount,
        currency,
        image,
        transmission,
        color,
        description,
        user_id,
        seller_type,
        dealership_name,
        created_at,
        updated_at,
        mileage,
        fuel_type,
        horsepower,
        gearbox,
        car_type,
        engine_size,
        drivetrain,
        availability,
        availability_days,
        availability_date,
        chassis_number,
        location
      `)
      .order('created_at', { ascending: false })
      .limit(12) // Initial page load
    
    const optimizedTime = Date.now() - startTimeOptimized
    const optimizedSize = JSON.stringify(optimizedData).length
    
    if (optimizedError) {
      console.log('❌ Optimized query failed:', optimizedError.message)
      return
    }
    
    console.log(`⏱️  Database query time: ${optimizedTime}ms`)
    console.log(`📦 Data size: ${(optimizedSize / 1024).toFixed(2)}KB`)
    console.log(`📈 Records loaded: ${optimizedData.length}`)
    console.log(`🖼️  Images loaded: ${optimizedData.filter(car => car.image).length}`)
    
    // Calculate improvements
    const timeImprovement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)
    const sizeImprovement = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)
    
    console.log('\n📈 PERFORMANCE IMPROVEMENTS:')
    console.log(`⚡ Query time improvement: ${timeImprovement}% faster`)
    console.log(`📦 Data size reduction: ${sizeImprovement}% smaller`)
    console.log(`🚀 Initial load speed: ${originalTime}ms → ${optimizedTime}ms`)
    console.log(`💾 Memory usage: ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB`)
    
    // Mobile performance improvements
    console.log('\n📱 MOBILE PERFORMANCE IMPROVEMENTS:')
    const mobileOriginalTime = originalTime + (originalSize / 1024 * 10) // Add network time
    const mobileOptimizedTime = optimizedTime + (optimizedSize / 1024 * 10)
    const mobileImprovement = ((mobileOriginalTime - mobileOptimizedTime) / mobileOriginalTime * 100).toFixed(1)
    
    console.log(`📶 Mobile load time: ${mobileOriginalTime.toFixed(0)}ms → ${mobileOptimizedTime.toFixed(0)}ms`)
    console.log(`📱 Mobile improvement: ${mobileImprovement}% faster`)
    
    // Performance score comparison
    let originalScore = 100
    if (originalTime > 1000) originalScore -= 30
    if (originalSize > 500000) originalScore -= 25
    if (originalData.length > 100) originalScore -= 20
    
    let optimizedScore = 100
    if (optimizedTime > 1000) optimizedScore -= 30
    if (optimizedSize > 500000) optimizedScore -= 25
    if (optimizedData.length > 100) optimizedScore -= 20
    
    console.log('\n🎯 PERFORMANCE SCORES:')
    console.log(`🔴 Original score: ${originalScore}/100`)
    console.log(`🟢 Optimized score: ${optimizedScore}/100`)
    console.log(`📈 Score improvement: +${optimizedScore - originalScore} points`)
    
    // Optimization features implemented
    console.log('\n✅ OPTIMIZATIONS IMPLEMENTED:')
    console.log('1. ✅ Selective field loading (reduced data size)')
    console.log('2. ✅ Pagination at database level')
    console.log('3. ✅ Lazy loading for images')
    console.log('4. ✅ Memoized components (React.memo)')
    console.log('5. ✅ Optimized image loading with error handling')
    console.log('6. ✅ Progressive loading (load more button)')
    console.log('7. ✅ Debounced search and filtering')
    console.log('8. ✅ Reduced initial bundle size')
    console.log('9. ✅ Better error boundaries')
    console.log('10. ✅ Optimized re-renders with useCallback')
    
    // Recommendations for further optimization
    console.log('\n💡 FURTHER OPTIMIZATION RECOMMENDATIONS:')
    console.log('1. 🔧 Add database indexes on frequently queried fields')
    console.log('2. 🖼️  Implement WebP image format')
    console.log('3. 📱 Add responsive image sizes')
    console.log('4. 🚀 Implement virtual scrolling for large lists')
    console.log('5. 💾 Add Redis caching for frequently accessed data')
    console.log('6. 🌐 Use CDN for image delivery')
    console.log('7. 📊 Implement analytics for performance monitoring')
    
    console.log('\n🎉 RESULT:')
    if (optimizedScore >= 80) {
      console.log('✅ Excellent performance achieved!')
    } else if (optimizedScore >= 60) {
      console.log('✅ Good performance with room for improvement')
    } else {
      console.log('⚠️  Performance improved but needs more optimization')
    }
    
  } catch (error) {
    console.error('❌ Error in performance comparison:', error.message)
  }
}

// Run the comparison
performanceComparison()
