const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, isJidBroadcast, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');
const moment = require('moment');
require('dotenv').config();
const { randomBytes } = require('crypto');
const { unixTimestampSeconds } = require('@whiskeysockets/baileys/lib/Utils/generics');

// Logger para debug
const logger = {
  level: 'silent', // Desabilitar logs verbosos do Baileys
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: console.warn,
  error: console.error,
  fatal: console.error,
};

const app = express();
app.use(cors());
app.use(express.json());

// Configurações
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://auyjantqdiacpsyznikw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eWphbnRxZGlhY3BzeXpuaWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjIyNzgsImV4cCI6MjA2ODE5ODI3OH0.jV-FktGEV6mdv0B9dIY-LXodXEa0oeRs5EULup5pWRA';
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'AIzaSyDOJuXfE9qg__A9f_o0ylVIdoc2GPtLH6c';
const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash-exp';

// Gerenciador de sessões por usuário
const sessions = {};

// Função para conectar ao Supabase
async function supabaseRequest(endpoint, method = 'GET', data = null) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const config = {
      method,
      url,
      headers,
      data
    };

    console.log(`Supabase request: ${method} ${endpoint}`);
    const response = await axios(config);
    console.log(`Supabase response: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error('Erro Supabase:', error.response?.status, error.response?.data);
    
    // Se for erro de autenticação, tentar sem alguns headers
    if (error.response?.status === 401) {
      console.log('Tentando sem Prefer header...');
      try {
        const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
        const headers = {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        };

        const config = {
          method,
          url,
          headers,
          data
        };

        const response = await axios(config);
        return response.data;
      } catch (retryError) {
        console.error('Erro na segunda tentativa:', retryError.response?.status);
        // Para operações de leitura, retornar array vazio
        if (method === 'GET') {
          return [];
        }
        // Para operações de escrita, não falhar
        return null;
      }
    }
    
    // Para outros erros, retornar array vazio para leitura ou null para escrita
    if (method === 'GET') {
      return [];
    }
    return null;
  }
}

// Função para processar mensagem com IA
async function processMessageWithAI(message, userId, clientPhone) {
  try {
    console.log(`processMessageWithAI iniciado - userId: ${userId}, clientPhone: ${clientPhone}`);
    
    // Buscar informações do usuário (salão)
    console.log('Buscando informações do usuário...');
    let userData = [];
    try {
      userData = await supabaseRequest(`users?id=eq.${userId}&select=*`);
      console.log('Resultado da busca do usuário:', userData);
    } catch (error) {
      console.log('Erro ao buscar usuário, continuando sem dados do salão...');
    }
    
    let user = null;
    if (userData && userData.length > 0) {
      user = userData[0];
      console.log('Usuário encontrado:', user.salon_name);
    } else {
      console.log('Usuário não encontrado, usando configuração padrão');
    }

    // Buscar serviços disponíveis
    console.log('Buscando serviços...');
    let services = [];
    try {
      services = await supabaseRequest(`services?user_id=eq.${userId}&is_active=eq.true&select=*`) || [];
      console.log('Serviços encontrados:', services?.length || 0);
    } catch (error) {
      console.log('Erro ao buscar serviços, continuando sem serviços...');
    }

    // Buscar cliente existente
    console.log('Buscando cliente existente...');
    let existingClient = null;
    try {
      const clientData = await supabaseRequest(`clients?user_id=eq.${userId}&phone=eq.${clientPhone}&select=*`);
      existingClient = clientData && clientData.length > 0 ? clientData[0] : null;
      console.log('Cliente existente:', existingClient);
    } catch (error) {
      console.log('Erro ao buscar cliente, continuando sem dados do cliente...');
    }

    // Construir contexto para a IA
    const context = {
      salon_info: user,
      services: services || [],
      client_phone: clientPhone,
      existing_client: existingClient,
      message: message
    };

    console.log('Chamando Google AI...');
    // Chamar Google AI
    const aiResponse = await callGoogleAI(message, context);
    console.log('Resposta do Google AI:', aiResponse);
    
    // Tentar salvar mensagens no banco (não bloquear se falhar)
    try {
      await saveWhatsAppMessages(userId, clientPhone, message, aiResponse, existingClient?.id);
    } catch (error) {
      console.log('Erro ao salvar mensagens, continuando...');
    }

    // Processar ações automáticas baseadas na resposta da IA
    try {
      await processAutomaticActions(userId, clientPhone, message, aiResponse);
    } catch (error) {
      console.log('Erro ao processar ações automáticas, continuando...');
    }

    return aiResponse;
  } catch (error) {
    console.error('Erro ao processar mensagem com IA:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
  }
}

// Função para chamar Google AI
async function callGoogleAI(message, context) {
  try {
    console.log('callGoogleAI iniciado com mensagem:', message);
    console.log('Contexto:', JSON.stringify(context, null, 2));
    
    // Construir prompt baseado no contexto
    let prompt = '';
    
    if (context.salon_info) {
      prompt = `Você é o assistente virtual do salão "${context.salon_info.salon_name}". 
      
Informações do salão:
- Nome: ${context.salon_info.salon_name}
- Endereço: ${context.salon_info.address || 'Não informado'}
- Telefone: ${context.salon_info.phone || 'Não informado'}

Serviços disponíveis:
${context.services && context.services.length > 0 
  ? context.services.map(s => `- ${s.name}: R$ ${s.price} (${s.duration_minutes}min)`).join('\n')
  : 'Nenhum serviço cadastrado ainda'}

Cliente: ${context.client_phone}
${context.existing_client ? `Nome: ${context.existing_client.name || 'Não informado'}` : 'Novo cliente'}

Mensagem do cliente: "${message}"

Responda de forma natural, educada e profissional. Seja útil e ofereça ajuda com agendamentos, informações sobre serviços ou outras dúvidas sobre o salão.`;
    } else {
      // Fallback se não há dados do salão
      prompt = `Você é um assistente virtual amigável para um salão de beleza.

Mensagem do cliente: "${message}"

Responda de forma natural, educada e profissional. Seja útil e ofereça ajuda com agendamentos, informações sobre serviços ou outras dúvidas sobre o salão.

Exemplos de respostas:
- Para "oi", "olá": "Olá! Como posso ajudá-lo hoje? 😊"
- Para "agendar": "Claro! Posso ajudá-lo a agendar um horário. Que serviço você gostaria?"
- Para "preços": "Posso informar sobre nossos serviços e preços. Que tipo de serviço você tem interesse?"
- Para "horário": "Posso verificar nossa disponibilidade. Que dia e horário você prefere?"`;
    }

    console.log('Prompt construído:', prompt);

    // Chamar Google AI API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_AI_MODEL}:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    console.log('Resposta do Google AI:', response.status, response.data);

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const aiResponse = candidate.content.parts[0].text;
        console.log('Resposta da IA extraída:', aiResponse);
        return aiResponse;
      }
    }

    console.log('Resposta inválida da IA, usando fallback');
    return 'Olá! Como posso ajudá-lo hoje? 😊';
    
  } catch (error) {
    console.error('Erro ao chamar Google AI:', error.response?.status, error.response?.data);
    
    // Fallback para mensagens simples
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
      return 'Olá! Como posso ajudá-lo hoje? 😊';
    } else if (lowerMessage.includes('agendar') || lowerMessage.includes('marcar')) {
      return 'Claro! Posso ajudá-lo a agendar um horário. Que serviço você gostaria?';
    } else if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
      return 'Posso informar sobre nossos serviços e preços. Que tipo de serviço você tem interesse?';
    } else {
      return 'Olá! Como posso ajudá-lo hoje? 😊';
    }
  }
}

// Função para salvar mensagens WhatsApp
async function saveWhatsAppMessages(userId, phone, incomingMessage, aiResponse, clientId) {
  try {
    // Salvar mensagem recebida
    await supabaseRequest('whatsapp_messages', 'POST', {
      user_id: userId,
      client_id: clientId,
      phone: phone,
      message_type: 'incoming',
      content: incomingMessage,
      is_from_ai: false,
      created_at: new Date().toISOString()
    });

    // Salvar resposta da IA
    await supabaseRequest('whatsapp_messages', 'POST', {
      user_id: userId,
      client_id: clientId,
      phone: phone,
      message_type: 'outgoing',
      content: aiResponse,
      is_from_ai: true,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao salvar mensagens WhatsApp:', error);
  }
}

// Função para criar cliente automaticamente
async function createClientFromMessage(userId, phone, message) {
  try {
    // Extrair nome do cliente da mensagem (implementação básica)
    const nameMatch = message.match(/(?:meu nome é|sou|chamo-me|sou a)\s+([A-Za-zÀ-ÿ\s]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : null;

    const clientData = {
      user_id: userId,
      phone: phone,
      name: name,
      is_active: true,
      visit_count: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newClient = await supabaseRequest('clients', 'POST', clientData);
    return newClient[0];
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return null;
  }
}

// Função para criar agendamento automaticamente
async function createAppointmentFromMessage(userId, clientId, serviceId, date, time) {
  try {
    // Buscar informações do serviço
    const serviceData = await supabaseRequest(`services?id=eq.${serviceId}&select=*`);
    if (!serviceData || serviceData.length === 0) return null;

    const service = serviceData[0];

    const appointmentData = {
      user_id: userId,
      client_id: clientId,
      service_id: serviceId,
      scheduled_date: date,
      scheduled_time: time,
      duration_minutes: service.duration_minutes,
      price: service.price,
      status: 'confirmed',
      ai_created: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newAppointment = await supabaseRequest('appointments', 'POST', appointmentData);
    return newAppointment[0];
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return null;
  }
}

// Função para obter sessão Baileys
async function getSession(userId, onQR) {
  if (sessions[userId] && sessions[userId].sock) {
    return sessions[userId];
  }

  const authDir = path.join(__dirname, 'auth_info_baileys', userId);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  let qrCode = null;
  let qrCallback = null;
  let connectionAttempts = 0;
  const maxAttempts = 3;

  const createConnection = () => {
    console.log(`Tentativa de conexão ${connectionAttempts + 1}/${maxAttempts}`);
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ['Isaura WhatsApp', 'Chrome', '1.0.0'],
      connectTimeoutMs: 30000,
      qrTimeout: 30000,
      retryRequestDelayMs: 2000,
      maxRetries: 3,
      emitOwnEvents: false,
      shouldIgnoreJid: jid => isJidBroadcast(jid),
      // Configurações para evitar erro 515
      keepAliveIntervalMs: 25000,
      markOnlineOnConnect: false,
      syncFullHistory: false,
      fireInitQueries: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      patchMessageBeforeSending: (msg) => {
        const requiresPatch = !!(
          msg.buttonsMessage 
          || msg.templateMessage
          || msg.listMessage
        );
        if (requiresPatch) {
          msg = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceList: {
                    senderKeyHash: randomBytes(32),
                    senderTimestamp: unixTimestampSeconds(),
                    senderKeyIndexes: [0]
                  }
                }
              },
              ...msg
            }
          };
        }
        return msg;
      },
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      console.log('Status da conexão:', connection);
      
      if (qr) {
        console.log('QR Code recebido do WhatsApp');
        qrCode = qr;
        if (onQR) {
          qrCallback = onQR;
          onQR(qr);
        }
      }
      
      if (connection === 'close') {
        console.log('Conexão WhatsApp fechada');
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log('Código de desconexão:', statusCode);
        
        // Se for erro 515 e ainda não tentou o máximo de vezes
        if (statusCode === 515 && connectionAttempts < maxAttempts) {
          connectionAttempts++;
          console.log(`Erro 515 detectado. Tentativa ${connectionAttempts}/${maxAttempts}`);
          
          // Aguardar mais tempo antes de tentar novamente
          setTimeout(() => {
            console.log('Tentando nova conexão após erro 515...');
            // Limpar sessão atual
            if (sessions[userId]) {
              delete sessions[userId];
            }
            // Criar nova conexão
            const newSession = createConnection();
            sessions[userId] = newSession;
          }, 15000); // 15 segundos de espera
        } else {
          console.log('Não reconectando - máximo de tentativas atingido ou erro crítico');
          // Limpar sessão
          if (sessions[userId]) {
            delete sessions[userId];
          }
        }
      }

      if (connection === 'open') {
        console.log('Conexão WhatsApp estabelecida com sucesso!');
        // Resetar contador de tentativas
        connectionAttempts = 0;
        // Limpar QR code quando conectado
        qrCode = null;
        if (qrCallback) {
          qrCallback = null;
        }
      }

      if (connection === 'connecting') {
        console.log('Conectando ao WhatsApp...');
      }
    });

    // Listener para mensagens recebidas
    sock.ev.on('messages.upsert', async (msg) => {
      try {
        console.log('Mensagem recebida:', JSON.stringify(msg, null, 2));
        
        if (msg.type === 'notify' && msg.messages && msg.messages.length > 0) {
          for (const m of msg.messages) {
            if (m.message && m.key && m.key.remoteJid) {
              const phone = m.key.remoteJid.replace(/@s\.whatsapp\.net$/, '');
              const content = m.message.conversation || 
                            m.message.extendedTextMessage?.text || 
                            '[mensagem não suportada]';

              console.log(`Mensagem recebida de ${phone}: ${content}`);
              console.log(`Processando para usuário: ${userId}`);

              // Processar mensagem com IA
              console.log('Chamando processMessageWithAI...');
              const aiResponse = await processMessageWithAI(content, userId, phone);
              console.log('Resposta da IA:', aiResponse);
              
              // Enviar resposta
              console.log('Enviando resposta...');
              await sock.sendMessage(m.key.remoteJid, { text: aiResponse });
              console.log('Resposta enviada com sucesso');

              // Processar ações automáticas baseadas na resposta da IA
              await processAutomaticActions(userId, phone, content, aiResponse);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar mensagem recebida:', error);
      }
    });

    return { sock, qrCode, qrCallback };
  };

  const session = createConnection();
  sessions[userId] = session;
  return session;
}

// Função para processar ações automáticas
async function processAutomaticActions(userId, phone, message, aiResponse) {
  try {
    // Verificar se é um novo cliente
    const existingClient = await supabaseRequest(`clients?user_id=eq.${userId}&phone=eq.${phone}&select=*`);
    
    if (!existingClient || existingClient.length === 0) {
      // Criar novo cliente
      const newClient = await createClientFromMessage(userId, phone, message);
      if (newClient) {
        console.log('Novo cliente criado:', newClient);
        
        // Enviar notificação push
        await sendPushNotification(userId, {
          title: 'Novo Cliente Adicionado',
          body: `IA criou automaticamente o cliente ${newClient.name || 'Cliente'}`,
          data: {
            type: 'new_client_created',
            client_name: newClient.name || 'Cliente',
            phone: phone,
          }
        });
      }
    }

    // Verificar se a IA mencionou agendamento
    if (aiResponse.toLowerCase().includes('agendado') || 
        aiResponse.toLowerCase().includes('confirmado') ||
        aiResponse.toLowerCase().includes('agendamento')) {
      
      // Extrair informações do agendamento da mensagem
      const appointmentInfo = extractAppointmentInfo(message, aiResponse);
      if (appointmentInfo) {
        const appointment = await createAppointmentFromMessage(
          userId, 
          appointmentInfo.clientId, 
          appointmentInfo.serviceId, 
          appointmentInfo.date, 
          appointmentInfo.time
        );
        
        if (appointment) {
          console.log('Agendamento criado automaticamente:', appointment);
          
          // Enviar notificação push
          await sendPushNotification(userId, {
            title: 'Novo Agendamento Criado',
            body: `IA agendou ${appointmentInfo.serviceName} para ${appointmentInfo.clientName} em ${appointmentInfo.date} às ${appointmentInfo.time}`,
            data: {
              type: 'new_appointment_created',
              client_name: appointmentInfo.clientName,
              service_name: appointmentInfo.serviceName,
              date: appointmentInfo.date,
              time: appointmentInfo.time,
            }
          });
        }
      }
    }

    // Enviar notificação de mensagem processada
    await sendPushNotification(userId, {
      title: 'IA Processou Mensagem',
      body: `IA respondeu automaticamente para ${existingClient?.[0]?.name || 'Cliente'}`,
      data: {
        type: 'ai_message_processed',
        client_name: existingClient?.[0]?.name || 'Cliente',
        message_type: 'response',
      }
    });

  } catch (error) {
    console.error('Erro ao processar ações automáticas:', error);
  }
}

// Função para extrair informações de agendamento da mensagem
function extractAppointmentInfo(message, aiResponse) {
  try {
    // Implementação básica - pode ser melhorada com IA mais avançada
    const hasAppointmentKeywords = message.toLowerCase().includes('agendar') || 
                                 message.toLowerCase().includes('marcar') ||
                                 message.toLowerCase().includes('horário') ||
                                 message.toLowerCase().includes('appointment');
    
    if (hasAppointmentKeywords) {
      // Buscar informações básicas
      const clientName = extractClientName(message);
      const serviceName = extractServiceName(message, aiResponse);
      const date = extractDate(message);
      const time = extractTime(message);
      
      if (clientName && serviceName && date && time) {
        return {
          clientName: clientName,
          serviceName: serviceName,
          date: date,
          time: time,
          clientId: null, // Será buscado no banco
          serviceId: null, // Será buscado no banco
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao extrair informações de agendamento:', error);
    return null;
  }
}

// Funções auxiliares para extrair informações
function extractClientName(message) {
  // Implementação básica - pode ser melhorada
  const nameMatch = message.match(/(?:meu nome é|sou|chamo-me|sou a)\s+([A-Za-zÀ-ÿ\s]+)/i);
  return nameMatch ? nameMatch[1].trim() : 'Cliente';
}

function extractServiceName(message, aiResponse) {
  // Buscar por serviços mencionados
  const serviceKeywords = ['corte', 'escova', 'coloração', 'manicure', 'pedicure', 'maquiagem'];
  for (const keyword of serviceKeywords) {
    if (message.toLowerCase().includes(keyword) || aiResponse.toLowerCase().includes(keyword)) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
  }
  return 'Serviço';
}

function extractDate(message) {
  // Implementação básica - pode ser melhorada
  const dateMatch = message.match(/(\d{1,2}\/\d{1,2}\/\d{4})|(\d{1,2}\/\d{1,2})/);
  if (dateMatch) {
    return dateMatch[0];
  }
  return new Date().toISOString().split('T')[0]; // Data atual
}

function extractTime(message) {
  // Implementação básica - pode ser melhorada
  const timeMatch = message.match(/(\d{1,2}:\d{2})|(\d{1,2}h)/);
  if (timeMatch) {
    return timeMatch[0].replace('h', ':00');
  }
  return '10:00'; // Horário padrão
}

// Função para enviar notificação push
async function sendPushNotification(userId, notification) {
  try {
    // Buscar token FCM do usuário
    const userSettings = await supabaseRequest(`user_settings?user_id=eq.${userId}&setting_key=eq.fcm_token&select=*`);
    
    if (userSettings && userSettings.length > 0) {
      const fcmToken = userSettings[0].setting_value;
      
      if (fcmToken) {
        // Enviar notificação via Firebase
        await axios.post('https://fcm.googleapis.com/fcm/send', {
          to: fcmToken,
          notification: {
            title: notification.title,
            body: notification.body,
          },
          data: notification.data,
        }, {
          headers: {
            'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Notificação push enviada:', notification.title);
      }
    }
  } catch (error) {
    console.error('Erro ao enviar notificação push:', error);
  }
}

// Função para enviar lembretes automáticos
async function sendAutomaticReminders() {
  try {
    console.log('Verificando lembretes automáticos...');
    
    // Buscar agendamentos para hoje
    const today = moment().format('YYYY-MM-DD');
    const appointments = await supabaseRequest(`appointments?select=*,clients(*),services(*)&scheduled_date=eq.${today}&status=eq.confirmed`);
    
    for (const appointment of appointments) {
      const appointmentTime = moment(`${appointment.scheduled_date} ${appointment.scheduled_time}`);
      const now = moment();
      const hoursUntil = appointmentTime.diff(now, 'hours');
      
      // Enviar lembrete 1 hora antes
      if (hoursUntil === 1) {
        const client = appointment.clients;
        const service = appointment.services;
        
        if (client && client.phone) {
          const message = `Olá ${client.name}! 😊\n\nLembrete do seu agendamento:\n\n📅 **Hoje você tem:**\n• Serviço: ${service.name}\n• Horário: ${appointment.scheduled_time}\n\n📍 **Local:** Nosso salão\n⏰ **Chegada:** Recomendamos chegar 10 minutos antes\n\nEm caso de necessidade de reagendamento, entre em contato conosco.\n\nAguardamos você! 💚`;
          
          // Enviar mensagem via WhatsApp
          await sendWhatsAppMessage(userId, client.phone, message);
        }
      }
    }
    
    // Verificar pagamentos pendentes
    const pendingPayments = await supabaseRequest(`payments?select=*,clients(*),appointments(*)&status=eq.pending`);
    
    for (const payment of pendingPayments) {
      const dueDate = moment(payment.due_date);
      const now = moment();
      const daysUntilDue = dueDate.diff(now, 'days');
      
      // Enviar cobrança no dia do vencimento
      if (daysUntilDue === 0) {
        const client = payment.clients;
        
        if (client && client.phone) {
          const message = `Olá ${client.name}! 😊\n\nEsperamos que esteja bem!\n\nGostaríamos de lembrar que você tem um pagamento pendente de R$ ${payment.amount} com vencimento hoje.\n\nPara sua comodidade, você pode realizar o pagamento através de:\n• PIX\n• Cartão de crédito/débito\n• Dinheiro\n\nAgradecemos sua preferência! 💚\n\nEm caso de dúvidas, estamos à disposição.`;
          
          // Enviar mensagem via WhatsApp
          await sendWhatsAppMessage(userId, client.phone, message);
        }
      }
    }
    
  } catch (error) {
    console.error('Erro ao enviar lembretes automáticos:', error);
  }
}

// Função para enviar mensagem WhatsApp
async function sendWhatsAppMessage(userId, phone, message) {
  try {
    const session = sessions[userId];
    if (!session || !session.sock) {
      console.error('Sessão WhatsApp não encontrada para usuário:', userId);
      return;
    }

    const formattedPhone = phone.startsWith('55') ? phone : `55${phone}`;
    await session.sock.sendMessage(`${formattedPhone}@s.whatsapp.net`, { text: message });
    
    // Salvar mensagem enviada
    await saveWhatsAppMessages(userId, phone, '', message, null);
    
    console.log(`Mensagem enviada para ${phone}: ${message}`);
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
  }
}

// Agendar tarefas automáticas
cron.schedule('*/5 * * * *', sendAutomaticReminders); // A cada 5 minutos

// Endpoints da API

// Endpoint raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Baileys WhatsApp - Isaura',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      'POST /api/qrcode': 'Gerar QR Code para conectar WhatsApp',
      'GET /api/status/:userId': 'Verificar status da conexão',
      'POST /api/send': 'Enviar mensagem WhatsApp',
      'POST /api/disconnect': 'Desconectar WhatsApp',
      'GET /health': 'Health check da API'
    }
  });
});

// Gerar QR Code
app.post('/api/qrcode', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    console.log(`Gerando QR Code para usuário: ${userId}`);

    let qrBase64 = null;
    let qrGenerated = false;

    const session = await getSession(userId, async (qr) => {
      try {
        console.log('QR Code recebido, convertendo para base64...');
        qrBase64 = await qrcode.toDataURL(qr);
        qrGenerated = true;
        console.log('QR Code convertido com sucesso');
      } catch (error) {
        console.error('Erro ao converter QR Code:', error);
      }
    });

    // Aguardar um pouco para o QR Code ser gerado
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Se já estiver conectado
    if (session.sock.user) {
      console.log('Usuário já conectado');
      return res.json({ 
        success: true,
        status: 'conectado',
        userId: userId 
      });
    }

    // Se tem QR Code
    if (qrBase64 && qrGenerated) {
      console.log('QR Code gerado com sucesso');
      return res.json({ 
        success: true,
        qrCode: qrBase64,
        userId: userId 
      });
    }

    console.log('QR Code não foi gerado, tentando novamente...');
    
    // Tentar novamente se não foi gerado
    if (!qrGenerated) {
      return res.json({ 
        success: false,
        error: 'QR Code não foi gerado. Tente novamente em alguns segundos.',
        retry: true
      });
    }

    return res.json({ 
      success: false,
      error: 'Erro ao gerar QR Code' 
    });

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar status
app.get('/api/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const session = sessions[userId];
    
    if (session && session.sock && session.sock.user) {
      res.json({ 
        success: true,
        status: 'conectado',
        connected: true 
      });
    } else {
      res.json({ 
        success: true,
        status: 'desconectado',
        connected: false 
      });
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enviar mensagem
app.post('/api/send', async (req, res) => {
  try {
    const { userId, phone, message } = req.body;
    
    if (!userId || !phone || !message) {
      return res.status(400).json({ error: 'userId, phone e message são obrigatórios' });
    }

    await sendWhatsAppMessage(userId, phone, message);
    
    res.json({ 
      success: true,
      message: 'Mensagem enviada com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Desconectar
app.post('/api/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    console.log(`Desconectando usuário: ${userId}`);
    
    if (sessions[userId]) {
      try {
        if (sessions[userId].sock) {
          console.log('Fazendo logout da sessão...');
          await sessions[userId].sock.logout();
          console.log('Logout realizado com sucesso');
        }
      } catch (logoutError) {
        console.log('Erro no logout (pode ser normal):', logoutError.message);
        // Continua mesmo se o logout falhar
      }
      
      delete sessions[userId];
      console.log('Sessão removida da memória');
    } else {
      console.log('Nenhuma sessão encontrada para o usuário');
    }

    res.json({ 
      success: true,
      message: 'Desconectado com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao desconectar:', error);
    // Mesmo com erro, retorna sucesso pois a sessão foi removida
    res.json({ 
      success: true,
      message: 'Connection Closed' 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    sessions: Object.keys(sessions).length
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Baileys rodando na porta ${PORT}`);
  console.log('📱 Endpoints disponíveis:');
  console.log('- POST /api/qrcode (gerar QR Code)');
  console.log('- GET /api/status/:userId (verificar status)');
  console.log('- POST /api/send (enviar mensagem)');
  console.log('- POST /api/disconnect (desconectar)');
  console.log('- GET /health (health check)');
}); 