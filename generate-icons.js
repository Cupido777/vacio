const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración de iconos PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 256, 384, 512];
const outputDir = path.join(__dirname, 'public', 'icons');

// Asegurar que el directorio existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✅ Directorio de iconos creado:', outputDir);
}

// SVG base como string (el mismo que arriba)
const svgString = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#D4AF37"/>
  <path d="M256 128C185.308 128 128 185.308 128 256C128 326.692 185.308 384 256 384C326.692 384 384 326.692 384 256C384 185.308 326.692 128 256 128Z" fill="#1E3A8A"/>
  <path d="M256 160C273.673 160 288 174.327 288 192C288 209.673 273.673 224 256 224C238.327 224 224 209.673 224 192C224 174.327 238.327 160 256 160Z" fill="#F8F4E9"/>
  <path d="M256 288C238.327 288 224 273.673 224 256C224 238.327 238.327 224 256 224C273.673 224 288 238.327 288 256C288 273.673 273.673 288 256 288Z" fill="#F8F4E9"/>
  <path d="M320 320C302.327 320 288 305.673 288 288C288 270.327 302.327 256 320 256C337.673 256 352 270.327 352 288C352 305.673 337.673 320 320 320Z" fill="#F8F4E9"/>
  <path d="M192 320C174.327 320 160 305.673 160 288C160 270.327 174.327 256 192 256C209.673 256 224 270.327 224 288C224 305.673 209.673 320 192 320Z" fill="#F8F4E9"/>
</svg>
`;

async function generateIcons() {
  console.log('🎨 Generando iconos PWA...');
  
  const promises = iconSizes.map(async (size) => {
    const filename = `icon-${size}x${size}.png`;
    const outputPath = path.join(outputDir, filename);
    
    try {
      await sharp(Buffer.from(svgString))
        .resize(size, size)
        .png({ 
          compressionLevel: 9,
          quality: 100,
          palette: true,
          effort: 10
        })
        .toFile(outputPath);
      
      console.log(`✅ ${filename} generado`);
      return { size, success: true };
    } catch (error) {
      console.error(`❌ Error generando ${filename}:`, error);
      return { size, success: false, error };
    }
  });

  const results = await Promise.all(promises);
  const successful = results.filter(r => r.success).length;
  
  console.log(`\n🎯 Iconos generados: ${successful}/${iconSizes.length}`);
  
  if (successful === iconSizes.length) {
    console.log('✨ Todos los iconos generados exitosamente!');
    
    // Generar también el favicon
    await generateFavicon();
  } else {
    console.log('⚠️ Algunos iconos no se pudieron generar');
  }
}

async function generateFavicon() {
  try {
    const faviconSizes = [16, 32, 48];
    
    for (const size of faviconSizes) {
      await sharp(Buffer.from(svgString))
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));
    }
    
    // Favicon ICO (para compatibilidad)
    await sharp(Buffer.from(svgString))
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, 'public', 'favicon.ico'));
    
    console.log('✅ Favicons generados');
  } catch (error) {
    console.log('⚠️ No se pudieron generar los favicons:', error.message);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = generateIcons;
