# 🚀 Deploy Capital Dark - Nova Interface

Este guia explica como fazer o deploy da nova interface moderna mantendo seu backend funcionando.

## 📋 Pré-requisitos

1. **GitHub Actions** habilitado no repositório
2. **Conta Netlify** configurada
3. **Backup do projeto atual**

## 🔧 Configuração Inicial

### 1. Configurar Secrets no GitHub

Vá em `Settings > Secrets and variables > Actions` do seu repositório e adicione:

```
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
```

**Como obter os tokens:**
- `NETLIFY_AUTH_TOKEN`: Netlify Dashboard → User Settings → Applications → Personal access tokens
- `NETLIFY_SITE_ID`: Site Settings → General → Site information → Site ID

### 2. Estrutura do Projeto

```
Capital-Daark/
├── .github/workflows/     # ✅ Workflows GitHub Actions
├── src/                   # ✅ Frontend React/TypeScript
├── public/               # ✅ Assets públicos
├── backend/              # 🔒 Mantido intocado
├── server/               # 🔒 Mantido intocado
├── database/             # 🔒 Mantido intocado
├── netlify.toml          # ✅ Configuração Netlify
└── package.json          # ✅ Atualizado para build
```

## 🚀 Deploy Automático

### Como Funciona

1. **Push para main/nova-interface** → Triggers GitHub Actions
2. **Build do frontend** → Cria arquivos estáticos
3. **Deploy Netlify** → Site atualizado automaticamente
4. **Backend continua** → Render mantém API funcionando

### Comando para Deploy

```bash
# 1. Criar branch nova interface
git checkout -b nova-interface

# 2. Adicionar arquivos do Lovable
# (Copiar src/, public/, vite.config.ts, etc.)

# 3. Commit e push
git add .
git commit -m "feat: nova interface moderna neon"
git push origin nova-interface

# 4. GitHub Actions faz o resto! 🎉
```

## 🔄 Fluxo de Trabalho

### Desenvolvimento
```bash
# Trabalhar na branch nova-interface
git checkout nova-interface

# Fazer mudanças no frontend
# (Lovable sincroniza automaticamente se conectado)

# Testar localmente
npm run dev

# Deploy automático quando fizer push
git push origin nova-interface
```

### Produção
```bash
# Quando estiver satisfeito, merge para main
git checkout main
git merge nova-interface
git push origin main

# Deploy automático para produção!
```

## 🛠️ Scripts Úteis

### Deploy Manual (se necessário)
```bash
# Executar script de deploy
node scripts/sync-frontend.js

# Ou deploy direto
npm run build
netlify deploy --prod --dir=dist
```

### Backup de Segurança
```bash
# Criar backup antes de mudanças importantes
git checkout -b backup-$(date +%Y%m%d_%H%M%S)
git push origin backup-$(date +%Y%m%d_%H%M%S)
```

## 🌐 URLs do Projeto

- **Frontend (Netlify)**: `https://capitaldaark.netlify.app`
- **Backend (Render)**: `https://seu-backend.render.com`
- **Domínio Principal**: `https://capitaldaark.com.br`

## ⚡ Monitoramento

### GitHub Actions
- Vá em `Actions` no seu repositório
- Monitore builds e deploys em tempo real
- Receba notificações de falhas

### Netlify Dashboard
- Veja deploys e preview builds
- Configure domínio personalizado
- Monitore performance

## 🚨 Troubleshooting

### Build Falha
```bash
# Verificar logs no GitHub Actions
# Comum: dependências desatualizadas
npm install
npm audit fix
```

### Deploy não Atualiza
```bash
# Limpar cache Netlify
netlify sites:list
netlify api clearCache --site-id YOUR_SITE_ID
```

### Backend Offline
```bash
# Verificar Render dashboard
# Backend continua independente do frontend
```

## 📞 Suporte

Se algo der errado:
1. Verifique GitHub Actions logs
2. Confira Netlify deploy logs  
3. Backend Render continua funcionando normalmente
4. Restaure backup se necessário: `git checkout backup-YYYYMMDD`

---

**🎉 Após configurar:** Toda mudança no frontend será deployada automaticamente mantendo seu backend seguro no Render!