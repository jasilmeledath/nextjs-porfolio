// Test CSS compilation
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');

async function testCSS() {
  try {
    const css = fs.readFileSync('./src/styles/globals.css', 'utf8');
    console.log('Input CSS length:', css.length);
    
    const result = await postcss([
      tailwindcss('./tailwind.config.js'),
      autoprefixer,
    ]).process(css, { from: './src/styles/globals.css' });
    
    console.log('Output CSS length:', result.css.length);
    console.log('First 500 chars:', result.css.substring(0, 500));
    
    // Write test output
    fs.writeFileSync('./test-output.css', result.css);
    console.log('✅ CSS compilation successful! Check test-output.css');
    
  } catch (error) {
    console.error('❌ CSS compilation failed:', error.message);
  }
}

testCSS();