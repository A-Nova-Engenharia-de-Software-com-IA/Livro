import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'

const lockFile = path.join(process.cwd(), '.wwebjs_auth', 'session', 'SingletonLock')
if (fs.existsSync(lockFile)) {
  fs.unlinkSync(lockFile)
  console.log('SingletonLock removido.')
}

export const whatsappClient = new Client({
  authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
})

whatsappClient.on('qr', (qr: string) => {
  console.log('\nEscaneie o QR Code abaixo com o WhatsApp:')
  console.log('(WhatsApp > Dispositivos vinculados > Vincular um dispositivo)\n')
  qrcode.generate(qr, { small: true })
})

whatsappClient.on('authenticated', () => {
  console.log('WhatsApp autenticado com sucesso.')
})

whatsappClient.on('ready', () => {
  console.log('WhatsApp pronto.')
})

whatsappClient.on('auth_failure', (msg: string) => {
  console.error('Falha na autenticação do WhatsApp:', msg)
})

whatsappClient.on('disconnected', (reason: string) => {
  console.warn('WhatsApp desconectado:', reason, '— reconectando em 5s...')
  setTimeout(() => whatsappClient.initialize(), 5000)
})

const AUTHORIZED_NUMBER = '554899999999@lid'

whatsappClient.on('message', async (message) => {
  console.log(`[WhatsApp] Mensagem de ${message.from}: ${message.body}`)
  if (message.from !== AUTHORIZED_NUMBER) return

  try {
    const { orquestAgent } = await import('../agents/orquest-agent')
    const response = await orquestAgent.generate(
      [{ role: 'user', content: message.body }],
      { memory: { resource: message.from, thread: message.from } },
    )
    await message.reply(response.text)
  } catch (err) {
    console.error('[WhatsApp] Erro ao processar mensagem com orquestrador:', err)
    await message.reply('Desculpe, ocorreu um erro ao processar sua mensagem.')
  }
})

export function initWhatsApp() {
  whatsappClient.initialize()
}
