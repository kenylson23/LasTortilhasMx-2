#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Building Las Tortilhas for Vercel...');

try {
  // Clear any existing dist directory
  console.log('Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Build with optimized settings for Vercel
  console.log('Building application with optimized settings...');
  execSync('vite build', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      // Optimize build performance
      NODE_OPTIONS: '--max-old-space-size=4096',
      // Reduce Vite build complexity 
      VITE_LEGACY: 'false'
    },
    timeout: 300000 // 5 minutes timeout
  });
  
  // Verify build output - checking both possible locations
  const distPath = path.join(__dirname, 'dist');
  const publicPath = path.join(distPath, 'public');
  const indexPath = fs.existsSync(publicPath) 
    ? path.join(publicPath, 'index.html')
    : path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('✓ Build completed successfully');
    
    // Copy public directory to dist
    const publicSourceDir = path.join(__dirname, 'public');
    if (fs.existsSync(publicSourceDir)) {
      const files = fs.readdirSync(publicSourceDir, { withFileTypes: true });
      files.forEach(file => {
        if (file.isDirectory()) {
          const srcDir = path.join(publicSourceDir, file.name);
          const destDir = path.join(distPath, file.name);
          fs.mkdirSync(destDir, { recursive: true });
          
          const subFiles = fs.readdirSync(srcDir);
          subFiles.forEach(subFile => {
            const src = path.join(srcDir, subFile);
            const dest = path.join(destDir, subFile);
            fs.copyFileSync(src, dest);
          });
        } else {
          const src = path.join(publicSourceDir, file.name);
          const dest = path.join(distPath, file.name);
          fs.copyFileSync(src, dest);
        }
      });
      
      console.log('✓ Public directory copied to dist');
    }
    
    // Show actual output directory structure
    const outputDir = fs.existsSync(publicPath) ? publicPath : distPath;
    const contents = fs.readdirSync(outputDir);
    
    console.log('✓ Output directory:', outputDir);
    console.log('✓ Generated files:', contents.filter(f => 
      f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css')
    ).join(', '));
    
  } else {
    throw new Error(`Build output not found. Expected: ${indexPath}`);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  if (error.code === 'ETIMEDOUT') {
    console.error('💡 Build timed out - this can happen with complex dependencies');
  }
  process.exit(1);
}