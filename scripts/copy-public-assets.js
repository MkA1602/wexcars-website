const fs = require('fs');
const path = require('path');

async function copyPublicAssets() {
  console.log('📁 Copying public assets for Netlify deployment...');
  
  const publicDir = path.join(process.cwd(), 'public');
  const nextDir = path.join(process.cwd(), '.next');
  
  // Check if directories exist
  if (!fs.existsSync(publicDir)) {
    console.error('❌ Public directory not found:', publicDir);
    return;
  }
  
  if (!fs.existsSync(nextDir)) {
    console.error('❌ Next.js build directory not found:', nextDir);
    return;
  }
  
  console.log('📂 Public directory exists:', publicDir);
  console.log('📂 Next.js build directory exists:', nextDir);
  
  // List contents of public directory
  try {
    const publicContents = fs.readdirSync(publicDir, { withFileTypes: true });
    console.log('📋 Public directory contents:');
    publicContents.forEach(item => {
      console.log(`  ${item.isDirectory() ? '📁' : '📄'} ${item.name}`);
    });
    
    // Copy files recursively
    copyRecursive(publicDir, nextDir);
    
    console.log('✅ Public assets copied successfully!');
    
    // Verify the copy
    console.log('🔍 Verifying copied assets...');
    verifyAssets(nextDir);
    
  } catch (error) {
    console.error('❌ Error copying public assets:', error.message);
    process.exit(1);
  }
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Copy all contents
    const contents = fs.readdirSync(src);
    contents.forEach(item => {
      copyRecursive(path.join(src, item), path.join(dest, item));
    });
  } else {
    // Copy file
    fs.copyFileSync(src, dest);
    console.log(`📄 Copied: ${path.relative(process.cwd(), dest)}`);
  }
}

function verifyAssets(buildDir) {
  const requiredAssets = [
    'wexcars-logo-new.png',
    'white-sports-car-hero.jpeg',
    'inspections-01.png',
    'category-images/suv-land-rover-01.png',
    'category-images/sedan-330e-01.png',
    'category-images/coupe-mercedes-01.png',
    'category-images/convert-mercedes-01.png'
  ];
  
  requiredAssets.forEach(asset => {
    const assetPath = path.join(buildDir, asset);
    if (fs.existsSync(assetPath)) {
      console.log(`✅ ${asset} - Found`);
    } else {
      console.log(`❌ ${asset} - Missing`);
    }
  });
}

// Run the script
copyPublicAssets().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 