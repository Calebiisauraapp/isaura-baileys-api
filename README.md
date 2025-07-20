# Isaura Baileys API

API para integração WhatsApp com IA automática para o sistema Isaura.

## 🚀 Funcionalidades

- **Conexão WhatsApp Business** via QR Code
- **IA Automática** que responde mensagens
- **Criação automática** de clientes e agendamentos
- **Lembretes automáticos** de pagamentos e agendamentos
- **Integração completa** com Supabase e Google AI

## 🛠️ Tecnologias

- **Node.js** + Express
- **@whiskeysockets/baileys** para WhatsApp
- **Google AI Studio** (Gemini) para IA
- **Supabase** para banco de dados
- **node-cron** para automações

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Render.com
- Supabase configurado
- Google AI API Key

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```env
# Supabase Configuration
SUPABASE_URL=https://auyjantqdiacpsyznikw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eWphbnRxZGlhY3BzeXpuaWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjIyNzgsImV4cCI6MjA2ODE5ODI3OH0.jV-FktGEV6mdv0B9dIY-LXodXEa0oeRs5EULup5pWRA

# Google AI Studio (Gemini)
GOOGLE_AI_API_KEY=AIzaSyCRkE-VspFSF_x-WC4hXTaEGEeDraU6KI
GOOGLE_AI_MODEL=gemini-2.0-flash-exp

# Server Configuration
PORT=3001
NODE_ENV=production

# API Configuration
API_TOKEN=isaura_baileys_api_token_2024
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Rodar Localmente

```bash
npm run api
```

## 🚀 Deploy no Render.com

### 1. Criar Novo Serviço

1. Acesse [Render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub

### 2. Configurar Serviço

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node api/server.js
```

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GOOGLE_AI_API_KEY`
- `GOOGLE_AI_MODEL`
- `NODE_ENV=production`

### 3. Configurações Avançadas

**Health Check Path:**
```
/health
```

**Auto-Deploy:** Enabled

## 📡 Endpoints da API

### Health Check
```
GET /health
```

### Gerar QR Code
```
POST /api/qrcode
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

### Verificar Status
```
GET /api/status/:userId
```

### Enviar Mensagem
```
POST /api/send
Content-Type: application/json

{
  "userId": "user_id_here",
  "phone": "5511999999999",
  "message": "Olá! Esta é uma mensagem de teste."
}
```

### Desconectar
```
POST /api/disconnect
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

## 🤖 Funcionalidades da IA

### Resposta Automática
- Processa mensagens recebidas
- Gera respostas contextuais
- Salva histórico no Supabase

### Criação Automática
- **Clientes:** Cria automaticamente quando não existem
- **Agendamentos:** Extrai dados e cria agendamentos
- **Pagamentos:** Gera registros de pagamento

### Automações
- **Lembretes:** Envia lembretes 1h antes dos agendamentos
- **Cobranças:** Envia cobranças no dia do vencimento
- **Confirmações:** Confirma presença automaticamente

## 🔄 Fluxo de Funcionamento

1. **Cliente envia mensagem** para WhatsApp do salão
2. **API recebe** a mensagem via Baileys
3. **IA processa** a mensagem com contexto completo
4. **IA responde** automaticamente
5. **Sistema cria** clientes/agendamentos se necessário
6. **Automações** enviam lembretes e cobranças

## 📊 Monitoramento

### Logs
- Todas as mensagens são logadas
- Erros são capturados e reportados
- Status da API disponível em `/health`

### Métricas
- Número de sessões ativas
- Mensagens processadas
- Agendamentos criados automaticamente

## 🔧 Troubleshooting

### Problemas Comuns

**QR Code não aparece:**
- Verifique se a API está rodando
- Confirme as variáveis de ambiente
- Verifique logs do Render.com

**IA não responde:**
- Confirme Google AI API Key
- Verifique conexão com Supabase
- Teste endpoint `/health`

**Mensagens não chegam:**
- Verifique status da conexão WhatsApp
- Confirme se o número está conectado
- Verifique logs da API

## 📝 Logs Importantes

```bash
# API iniciada
🚀 API Baileys rodando na porta 3001

# QR Code gerado
QR Code gerado para usuário: user_id

# Mensagem processada
Mensagem recebida de 5511999999999: Olá, quero agendar

# Cliente criado
Novo cliente criado: {id: "client_id", name: "João"}

# Agendamento criado
Agendamento criado automaticamente: {id: "appointment_id"}
```

## 🔐 Segurança

- Autenticação por token
- Sessões isoladas por usuário
- Dados criptografados no Supabase
- Logs seguros sem dados sensíveis

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs no Render.com
2. Teste o endpoint `/health`
3. Confirme as variáveis de ambiente
4. Verifique a conexão com Supabase

---

**Desenvolvido para o sistema Isaura - Gestão Inteligente de Salões** 🎨
