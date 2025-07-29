import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeHeroImage() {
  const inputPath = path.join(__dirname, '../attached_assets/From tortillas with Love   photo credit @andersson_samd_1751272348650.jpg');
  const outputDir = path.join(__dirname, '../public/images');
  
  // Criar diretório se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Versão desktop WebP (1920x1080)
    await sharp(inputPath)
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'hero-desktop.webp'));
    
    // Versão mobile WebP (768x432) - 50% menor
    await sharp(inputPath)
      .resize(768, 432, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'hero-mobile.webp'));
    
    // Versão fallback JPG desktop
    await sharp(inputPath)
      .resize(1920, 1080, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(path.join(outputDir, 'hero-desktop.jpg'));
    
    // Versão fallback JPG mobile
    await sharp(inputPath)
      .resize(768, 432, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(path.join(outputDir, 'hero-mobile.jpg'));
    
    // Placeholder tiny base64
    const placeholder = await sharp(inputPath)
      .resize(20, 11, { fit: 'cover' })
      .blur(2)
      .webp({ quality: 20 })
      .toBuffer();
    
    const base64 = `data:image/webp;base64,${placeholder.toString('base64')}`;
    
    // Salvar placeholder
    fs.writeFileSync(
      path.join(outputDir, 'hero-placeholder.txt'),
      base64
    );
    
    console.log('✅ Imagens otimizadas com sucesso!');
    console.log('📁 Arquivos gerados:');
    console.log('   - hero-desktop.webp (1920x1080)');
    console.log('   - hero-mobile.webp (768x432)');
    console.log('   - hero-desktop.jpg (fallback)');
    console.log('   - hero-mobile.jpg (fallback)');
    console.log('   - hero-placeholder.txt (base64)');
    
  } catch (error) {
    console.error('❌ Erro ao otimizar imagens:', error);
  }
}

optimizeHeroImage();