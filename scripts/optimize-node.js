#!/usr/bin/env node

/**
 * Script de otimização para Node.js
 * Otimiza a performance e configurações do Node.js para o projeto Las Tortillas
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando otimização do Node.js...\n');

// Verificar versões do Node.js e npm
exec('node --version && npm --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao verificar versões:', error);
    return;
  }
  console.log('✅ Versões atuais:');
  console.log(stdout);
});

// Limpar cache do npm
exec('npm cache clean --force', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao limpar cache:', error);
    return;
  }
  console.log('✅ Cache do npm limpo');
});

// Verificar e otimizar dependências
console.log('📦 Verificando dependências...');
exec('npm ls --depth=0', (error, stdout, stderr) => {
  if (error) {
    console.log('⚠️  Algumas dependências podem precisar de correção');
  }
  
  // Verificar vulnerabilidades de segurança
  exec('npm audit --audit-level moderate', (error, stdout, stderr) => {
    if (error) {
      console.log('🔒 Vulnerabilidades encontradas - execute npm audit fix');
    } else {
      console.log('✅ Nenhuma vulnerabilidade crítica encontrada');
    }
  });
});

// Otimizar configurações do projeto
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Verificar se tem configurações de otimização
  if (!packageJson.engines) {
    packageJson.engines = {
      "node": ">=20.0.0",
      "npm": ">=10.0.0"
    };
  }
  
  // Adicionar configurações de performance
  if (!packageJson.config) {
    packageJson.config = {
      "node-options": "--max-old-space-size=4096"
    };
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Configurações de otimização adicionadas ao package.json');
}

// Verificar configuração do TypeScript
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (fs.existsSync(tsConfigPath)) {
  console.log('✅ Configuração TypeScript encontrada');
} else {
  console.log('⚠️  Configuração TypeScript não encontrada');
}

console.log('\n🎉 Otimização concluída!');
console.log('💡 Dicas para melhor performance:');
console.log('- Execute "npm run dev" para desenvolvimento');
console.log('- Use "npm run build" para produção');
console.log('- Monitore o uso de memória com "node --inspect"');
console.log('- Mantenha as dependências atualizadas com "npm update"');