#!/usr/bin/env node

/**
 * Script para testar a conexão com o banco de dados
 * Identifica problemas com DATABASE_URL
 */

import { Pool } from 'pg';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

console.log('🔍 Testando conexão com banco de dados...\n');

// Verificar se DATABASE_URL está definido
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não está definido');
  process.exit(1);
}

// Mostrar formato da URL (sem senha)
const maskedUrl = databaseUrl.replace(/:[^:]*@/, ':***@');
console.log('📍 DATABASE_URL:', maskedUrl);

// Verificar se é Neon Database
if (databaseUrl.includes('neon.tech')) {
  console.log('✅ Usando Neon Database (recomendado para Vercel)');
} else if (databaseUrl.includes('localhost')) {
  console.log('⚠️  Usando banco local (não funcionará no Vercel)');
} else {
  console.log('ℹ️  Usando banco PostgreSQL externo');
}

// Testar conexão
const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: databaseUrl.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

try {
  console.log('\n🔌 Testando conexão...');
  
  // Testar conexão básica
  const client = await pool.connect();
  console.log('✅ Conexão estabelecida');
  
  // Testar query
  const result = await client.query('SELECT version()');
  console.log('✅ Query executada com sucesso');
  console.log('📊 Versão:', result.rows[0].version.substring(0, 50) + '...');
  
  // Testar tabelas
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  
  console.log('✅ Tabelas encontradas:', tables.rows.length);
  tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
  
  client.release();
  
  console.log('\n🎉 Banco de dados está funcionando corretamente!');
  
} catch (error) {
  console.error('\n❌ Erro ao conectar com banco:', error.message);
  
  // Diagnóstico do erro
  if (error.code === 'ECONNREFUSED') {
    console.log('🔧 Solução: Verificar se o banco está rodando');
  } else if (error.code === 'ENOTFOUND') {
    console.log('🔧 Solução: Verificar URL do banco');
  } else if (error.message.includes('timeout')) {
    console.log('🔧 Solução: Verificar conectividade ou firewall');
  } else if (error.message.includes('authentication')) {
    console.log('🔧 Solução: Verificar usuário e senha');
  }
  
  process.exit(1);
  
} finally {
  await pool.end();
}