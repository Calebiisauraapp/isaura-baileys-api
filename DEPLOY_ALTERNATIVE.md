# 🚀 Guia de Deploy - Render.com (Como Fizemos e Deu Certo!)

Este é o guia **EXATO** de como fizemos o deploy que funcionou perfeitamente!

## ✅ O Que Você Precisa Ter

- ✅ **Conta no GitHub** (gratuita)
- ✅ **Conta no Render.com** (gratuita)
- ✅ **Supabase** configurado
- ✅ **Google AI API Key** disponível

---

## 📁 PASSO 1: Colocar o Código no GitHub

### **1.1 - Criar Repositório no GitHub**

**O QUE FAZER:** Abrir o navegador e ir no GitHub

1. **Abra o navegador** (Chrome, Firefox, etc.)
2. **Vá para:** https://github.com
3. **Faça login** na sua conta GitHub
4. **Clique no botão verde** "New" ou "New repository"
5. **Preencha:**
   - **Repository name:** `isaura-baileys-api`
   - **Description:** `API WhatsApp para Isaura`
   - **Deixe marcado:** "Public" (mais fácil)
6. **Clique em "Create repository"**

### **1.2 - Fazer Upload dos Arquivos**

**O QUE FAZER:** Usar o terminal para enviar os arquivos

**IMPORTANTE:** Execute **UM COMANDO POR VEZ** e aguarde terminar antes do próximo!

```bash
# COMANDO 1: Entrar na pasta do projeto
cd baileys-api
```

**Aguarde** e depois execute:

```bash
# COMANDO 2: Inicializar o Git
git init
```

**Aguarde** e depois execute:

```bash
# COMANDO 3: Adicionar todos os arquivos
git add .
```

**Aguarde** e depois execute:

```bash
# COMANDO 4: Fazer o primeiro commit
git commit -m "coloque uma descrição da alteração aqui"
```

**Aguarde** e depois execute:

```bash
# COMANDO 5: Renomear a branch principal
git branch -M main
```

**Aguarde** e depois execute:

```bash
# COMANDO 6: Conectar com o GitHub (SUBSTITUA SEU_USUARIO pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/isaura-baileys-api.git
```

**Aguarde** e depois execute:

```bash
# COMANDO 7: Enviar para o GitHub
git push -u origin main
```

**O QUE VAI ACONTECER:**
- Vai pedir seu usuário e senha do GitHub
- Vai fazer upload de todos os arquivos
- Vai mostrar progresso no terminal

---

## 🔑 PASSO 1.5: Criar Token do GitHub (IMPORTANTE!)

**O QUE FAZER:** Criar token de acesso pessoal para evitar problemas de permissão

1. **No GitHub** (logado na conta que criou o repositório)
2. **Clique no seu avatar** → **Settings**
3. **Clique em "Developer settings"** (no final da lista)
4. **Clique em "Personal access tokens"** → **Tokens (classic)**
5. **Clique em "Generate new token"** → **Generate new token (classic)**
6. **Preencha:**
   - **Note:** `Render Deploy`
   - **Expiration:** `No expiration`
   - **Scopes:** Marque `repo` (todas as opções de repo)
7. **Clique em "Generate token"**
8. **COPIE o token** (você só verá uma vez!)

**EXEMPLO DO TOKEN:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **1.6 - Usar Token para Push**

**O QUE FAZER:** Configurar o Git para usar o token

```bash
# COMANDO 8: Configurar com token (SUBSTITUA SEU_TOKEN pelo token que você copiou)
git remote set-url origin https://SEU_TOKEN@github.com/SEU_USUARIO/isaura-baileys-api.git
```

**Aguarde** e depois execute:

```bash
# COMANDO 9: Fazer push com token
git push -u origin main
```

**O QUE VAI ACONTECER:**
- Não vai pedir senha
- Vai fazer upload automaticamente
- Vai mostrar "Enumerating objects..." e depois "Writing objects..."

---

## 🌐 PASSO 2: Criar Serviço no Render.com

### **2.1 - Acessar o Render**

**O QUE FAZER:** Abrir o site do Render

1. **Abra uma nova aba** no navegador
2. **Vá para:** https://render.com
3. **Faça login** na sua conta Render
4. **Clique em "New +"** (botão azul no canto superior direito)

### **2.2 - Conectar com GitHub**

**O QUE FAZER:** Permitir que o Render acesse seus repositórios

1. **Clique em "Web Service"**
2. **Clique em "Connect"** ao lado do GitHub
3. **Autorize o Render** quando pedir
4. **Selecione o repositório:** `isaura-baileys-api`

### **2.3 - Configurar o Serviço**

**O QUE FAZER:** Preencher as informações do serviço

**Preencha EXATAMENTE assim:**

- **Name:** `isaura-baileys-api`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node api/server.js`
- **Plan:** `Free`

**Clique em "Create Web Service"**

---

## ⚙️ PASSO 3: Configurar Variáveis de Ambiente

**O QUE FAZER:** Adicionar as configurações secretas

### **3.1 - Abrir Configurações**

1. **No dashboard do serviço** (que acabou de criar)
2. **Clique em "Environment"** (aba lateral)
3. **Clique em "Add Environment Variable"**

### **3.2 - Adicionar Cada Variável**

**IMPORTANTE:** Adicione **UMA POR VEZ** e clique em "Save" após cada uma!

**VARIÁVEL 1:**
- **Key:** `SUPABASE_URL`
- **Value:** `https://auyjantqdiacpsyznikw.supabase.co`
- **Clique em "Save"**

**VARIÁVEL 2:**
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eWphbnRxZGlhY3BzeXpuaWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjIyNzgsImV4cCI6MjA2ODE5ODI3OH0.jV-FktGEV6mdv0B9dIY-LXodXEa0oeRs5EULup5pWRA`
- **Clique em "Save"**

**VARIÁVEL 3:**
- **Key:** `GOOGLE_AI_API_KEY`
- **Value:** `AIzaSyCRkE-VspFSF_x-WC4hXTaEGEeDraU6KI`
- **Clique em "Save"**

**VARIÁVEL 4:**
- **Key:** `GOOGLE_AI_MODEL`
- **Value:** `gemini-2.0-flash-exp`
- **Clique em "Save"**

**VARIÁVEL 5:**
- **Key:** `FIREBASE_SERVER_KEY`
- **Value:** `AIzaSyBngB37P3fWX0j8cVjXuX9AIXs_Y_3pQxM`
- **Clique em "Save"**

**VARIÁVEL 6:**
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Clique em "Save"**

**VARIÁVEL 7:**
- **Key:** `PORT`
- **Value:** `3001`
- **Clique em "Save"**

---

## 🚀 PASSO 4: Fazer o Deploy

**O QUE FAZER:** Aguardar o Render fazer o deploy automaticamente

### **4.1 - Deploy Automático**

1. **O Render vai começar automaticamente**
2. **Vá para a aba "Events"**
3. **Você verá o progresso em tempo real**
4. **Aguarde até ver "Deploy successful"** (pode demorar 2-5 minutos)

### **4.2 - Verificar Logs**

1. **Vá para a aba "Logs"**
2. **Clique em "View logs"**
3. **Verifique se não há erros em vermelho**

**LOGS ESPERADOS:**
```
🚀 API Baileys rodando na porta 3001
📱 Endpoints disponíveis:
- POST /api/qrcode (gerar QR Code)
- GET /api/status/:userId (verificar status)
- POST /api/send (enviar mensagem)
- POST /api/disconnect (desconectar)
- GET /health (health check)
```

---

## ✅ PASSO 5: Testar se Deu Certo

**O QUE FAZER:** Verificar se a API está funcionando

### **5.1 - Testar Endpoint Raiz**

1. **Abra uma nova aba** no navegador
2. **Cole a URL:** `https://isaura-baileys-api.onrender.com`
3. **Pressione Enter**

**RESPOSTA ESPERADA:**
```json
{
  "message": "API Baileys WhatsApp - Isaura",
  "version": "1.0.0",
  "status": "online",
  "endpoints": {
    "POST /api/qrcode": "Gerar QR Code para conectar WhatsApp",
    "GET /api/status/:userId": "Verificar status da conexão",
    "POST /api/send": "Enviar mensagem WhatsApp",
    "POST /api/disconnect": "Desconectar WhatsApp",
    "GET /health": "Health check da API"
  }
}
```

### **5.2 - Testar Health Check**

1. **Acesse:** `https://isaura-baileys-api.onrender.com/health`
2. **Pressione Enter**

**RESPOSTA ESPERADA:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sessions": 0
}
```

**Se aparecer isso = SUCESSO! 🎉**

---

## 🔍 Verificação Completa

### **Teste 1 - Endpoint Raiz**
```
https://isaura-baileys-api.onrender.com
```

### **Teste 2 - Health Check**
```
https://isaura-baileys-api.onrender.com/health
```

### **Teste 3 - QR Code (No App Flutter)**
- Vá em **Configurações** → **Conectar WhatsApp**
- Deve gerar QR Code automaticamente

---

## 🛠️ Como Gerenciar Depois

### **Verificar Status:**
- **Dashboard** → Seu serviço → **Status**
- Deve mostrar "Live" quando funcionando

### **Ver Logs:**
- **Dashboard** → Seu serviço → **Logs**
- Clique em "View logs" para ver logs em tempo real

### **Fazer Novo Deploy:**
- **Dashboard** → Seu serviço → **Manual Deploy**
- Clique em "Deploy latest commit"

### **Atualizar Variáveis:**
- **Dashboard** → Seu serviço → **Environment**
- Edite as variáveis e clique em "Save Changes"

---

## 🚨 Se Algo Der Errado

### **Se o Deploy Falhar:**

1. **Verificar logs:**
   - Dashboard → **Logs**
   - Procure por erros em **vermelho**

2. **Verificar variáveis:**
   - Dashboard → **Environment**
   - Confirme se **todas as 7 variáveis** estão configuradas

3. **Verificar código:**
   - Confirme se `api/server.js` existe
   - Confirme se `package.json` está correto

### **Se a API Não Responder:**

1. **Verificar status:**
   - Dashboard → **Status**
   - Deve mostrar "Live"

2. **Verificar logs:**
   - Dashboard → **Logs**
   - Procure por erros de inicialização

3. **Testar localmente:**
   ```bash
   npm install
   node api/server.js
   ```

### **Se o QR Code Não Funcionar:**

1. **Verificar logs da API:**
   - Dashboard → **Logs**
   - Procure por "QR Code recebido" ou "QR Code convertido"

2. **Testar endpoint manualmente:**
   ```bash
   curl -X POST https://isaura-baileys-api.onrender.com/api/qrcode \
     -H "Content-Type: application/json" \
     -d '{"userId": "test-user"}'
   ```

---

## 📊 Monitoramento

### **Métricas Disponíveis:**
- ✅ **Uptime:** Disponível no dashboard
- ✅ **Build Status:** Sucesso/Falha
- ✅ **Deploy Status:** Ativo/Inativo
- ✅ **Logs:** Erros e informações

### **Alertas:**
- O Render envia emails quando há problemas
- Você pode configurar webhooks para notificações

---

## 🔄 Como Fazer Atualizações

### **Fazer Deploy de Mudanças:**

1. **Atualizar código:**
   ```bash
   git add .
   git commit -m "Update code"
   git push origin main
   ```

2. **Deploy automático:**
   - O Render detecta mudanças automaticamente
   - Faz deploy da nova versão

### **Deploy Manual:**
- **Dashboard** → Manual Deploy
- Clique em "Deploy latest commit"

---

## 🔐 Segurança

### **Boas Práticas:**
- ✅ Variáveis sensíveis em environment variables
- ✅ Logs sem dados sensíveis
- ✅ HTTPS automático
- ✅ Sessões isoladas por usuário

### **Backup:**
- Exporte as variáveis de ambiente
- Mantenha backup do código no GitHub

---

## 📞 Suporte

### **Recursos:**
- **Documentação:** https://render.com/docs
- **Suporte:** https://render.com/support
- **Status:** https://status.render.com

---

## 🎉 **SUCESSO! Sua API está pronta!**

### **URL da API:** `https://isaura-baileys-api.onrender.com`

### **Próximos Passos:**
1. ✅ API está funcionando
2. ✅ Configure o app Flutter para usar esta URL
3. ✅ Teste a conexão WhatsApp
4. ✅ A IA funcionará automaticamente!

### **Para testar no app Flutter:**
- Vá em **Configurações** → **Conectar WhatsApp**
- A API deve responder e gerar QR Code
- A IA estará pronta para funcionar!

**🎯 Tudo configurado e funcionando!** 🚀 