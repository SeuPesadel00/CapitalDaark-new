#!/usr/bin/env node

/**
 * Script para sincronizar apenas arquivos frontend do Lovable para o GitHub
 * Mantém o backend intocado e preserva configurações existentes
 */

const fs = require('fs').promises;
const path = require('path');

const FRONTEND_FILES = [
  // Arquivos principais
  'src/components/',
  'src/pages/',
  'src/hooks/',
  'src/lib/',
  'src/index.css',
  'src/App.tsx',
  'src/main.tsx',
  
  // Configurações de build
  'vite.config.ts',
  'tailwind.config.ts',
  'index.html',
  
  // Arquivos de UI
  'src/components/ui/',
  
  // Assets
  'public/favicon.ico',
  'public/robots.txt',
];

const BACKEND_FILES_TO_PRESERVE = [
  'backend/',
  'server/',
  'api/',
  '.env',
  '.env.local',
  'database/',
  'models/',
  'routes/',
  'controllers/',
  'middleware/',
  'config/database.js',
  'config/auth.js',
];

async function syncFrontend() {
  console.log('🚀 Iniciando sincronização do frontend...');
  console.log('📁 Arquivos que serão atualizados:');
  
  FRONTEND_FILES.forEach(file => {
    console.log(`   ✅ ${file}`);
  });
  
  console.log('\n🛡️  Arquivos do backend que serão preservados:');
  BACKEND_FILES_TO_PRESERVE.forEach(file => {
    console.log(`   🔒 ${file}`);
  });
  
  console.log('\n⚠️  ATENÇÃO: Faça backup dos arquivos importantes antes de continuar!');
  console.log('📋 Para prosseguir com a sincronização:');
  console.log('');
  console.log('1. Faça backup do seu projeto atual:');
  console.log('   git checkout -b backup-$(date +%Y%m%d)');
  console.log('');
  console.log('2. Crie uma branch para a nova interface:');
  console.log('   git checkout -b nova-interface');
  console.log('');
  console.log('3. Baixe os arquivos do Lovable (Dev Mode → Download)');
  console.log('');
  console.log('4. Copie apenas os arquivos frontend listados acima');
  console.log('');
  console.log('5. Teste localmente:');
  console.log('   npm install');
  console.log('   npm run dev');
  console.log('');
  console.log('6. Se tudo estiver funcionando, faça commit:');
  console.log('   git add .');
  console.log('   git commit -m "feat: nova interface moderna com design neon"');
  console.log('   git push origin nova-interface');
  console.log('');
  console.log('7. O GitHub Actions fará o deploy automático! 🎉');
}

// Função para criar configuração do Netlify
async function createNetlifyConfig() {
  const netlifyConfig = {
    build: {
      publish: "dist",
      command: "npm run build"
    },
    redirects: [
      {
        from: "/*",
        to: "/index.html",
        status: 200
      }
    ],
    headers: [
      {
        for: "/assets/*",
        values: {
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      }
    ]
  };
  
  try {
    await fs.writeFile('netlify.toml', 
      `[build]\n  publish = "dist"\n  command = "npm run build"\n\n[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200\n\n[[headers]]\n  for = "/assets/*"\n    [headers.values]\n    Cache-Control = "public, max-age=31536000, immutable"`
    );
    console.log('✅ Arquivo netlify.toml criado!');
  } catch (error) {
    console.error('❌ Erro ao criar netlify.toml:', error);
  }
}

// Função para criar script de deploy
async function createDeployScript() {
  const deployScript = `#!/bin/bash

# Script de deploy manual se precisar
echo "🚀 Fazendo deploy manual do frontend..."

# Build do projeto
echo "📦 Building projeto..."
npm run build

# Deploy para Netlify (se tiver CLI instalado)
if command -v netlify &> /dev/null; then
    echo "🌐 Fazendo deploy para Netlify..."
    netlify deploy --prod --dir=dist
else
    echo "⚠️  Netlify CLI não encontrado."
    echo "📁 Arquivos build estão em: ./dist"
    echo "🌐 Faça upload manual no dashboard do Netlify"
fi

echo "✅ Deploy concluído!"
`;

  try {
    await fs.writeFile('scripts/deploy.sh', deployScript);
    console.log('✅ Script de deploy criado em scripts/deploy.sh');
  } catch (error) {
    console.error('❌ Erro ao criar script de deploy:', error);
  }
}

async function main() {
  await syncFrontend();
  await createNetlifyConfig();
  await createDeployScript();
}

if (require.main === module) {
  main().catch(console.error);
}