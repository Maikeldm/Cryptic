import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { fileURLToPath } from 'url'
import { makeWASocket } from '../lib/simple.js'

const { exec } = await import('child_process')
const { CONNECTING } = ws

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"

let drm1 = ""
let drm2 = ""

let rtx =
`『 *𝑪𝒓𝒚𝒑𝒕𝒊𝒄𝑴𝒂𝒔𝒕𝒆𝒓 && Subbot* 』 

 *Escanea el QR desde tu WhatsApp:*  
⋮ > *Dispositivos vinculados* > *Escanear código*  

⏳ *El QR caducara en 45 segundoá ..* ⚔️  
  `

let rtx2 =
`『 *𝑪𝒓𝒚𝒑𝒕𝒊𝒄𝑴𝒂𝒔𝒕𝒆𝒓 && SubBot*   

 *Usa este Código para convertirte en un ✧ Sub-Bot Temporal *  

 *Vinculación Manual:*  
> 1 » Pulsa los ⋮ *tres puntos* en la esquina superior derecha de WhatsApp  
> 2 » Selecciona *Dispositivos Vinculados* 
> 3 » Elige *Vincular con número de teléfono* 
> 4 » Introduce el
`

const maxSubBots = 500

let blackJBOptions = {}

if (!global.conns) global.conns = []

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60)
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s '
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`El Comando *${command}* está desactivado temporalmente.`)
  }

  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date() - global.db.data.users[m.sender].Subs < 120000) {
    return conn.reply(m.chat, ` Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
  }

  const subBots = [...new Set(
    global.conns.filter(c =>
      c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED
    ).map(c => c)
  )]

  const subBotsCount = subBots.length

  if (subBotsCount >= maxSubBots) {
    return m.reply(`No se han encontrado espacios para *Sub-Bots* disponibles.`)
  }

  const availableSlots = maxSubBots - subBotsCount

  // Línea eliminada 
  // await m.reply(`🤖 *Sub-Bots conectados:* ${subBotsCount} / ${maxSubBots}\n🟢 *Espacios disponibles:* ${availableSlots}`)

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split('@')[0]}`
  let pathblackJadiBot = path.join(`./blackJadiBot/`, id)

  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }

  blackJBOptions.pathblackJadiBot = pathblackJadiBot
  blackJBOptions.m = m
  blackJBOptions.conn = conn
  blackJBOptions.args = args
  blackJBOptions.usedPrefix = usedPrefix
  blackJBOptions.command = command
  blackJBOptions.fromCommand = true

  await blackJadiBot(blackJBOptions)

  global.db.data.users[m.sender].Subs = new Date() * 1

  // Línea eliminada 
  // await m.reply(`🥷🏻 Gracias por ser parte de la familia Black Clover ⚔️`)
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']

export default handler

export async function blackJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, usedPrefix, command } = options
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim())
    ? true
    : args[1] && /(--code|code)/.test(args[1].trim())
      ? true
      : false
  let txtCode, codeBot, txtQR
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  try {
    if (args[0] && args[0] != undefined) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'))
    }
  } catch {
    conn.reply(m.chat, `⚠️ Use correctamente el comando » ${usedPrefix + command}`, m)
    return
  }

  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    const { version } = await fetchLatestBaileysVersion()
    const msgRetry = () => { }
    const msgRetryCache = new NodeCache()
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathblackJadiBot)

    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetry,
      msgRetryCache,
      browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
      version: version,
      generateHighQualityLinkPreview: true
    }

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true
    let connectionTimer

    // Reconexión agresiva e indefinida para subbots
    let reconnectingSubbot = false
    async function aggressiveReconnectSubbot() {
      if (reconnectingSubbot) return
      reconnectingSubbot = true
      let intentos = 0
      while (!sock?.user) {
        intentos++
        console.log(chalk.bold.yellowBright(`[RECONNECT-SUBBOT] Intentando reconectar subbot (${path.basename(pathblackJadiBot)})... intento #${intentos}`))
        try {
          await creloadHandler(true)
          if (sock?.user) {
            console.log(chalk.bold.greenBright(`[RECONNECT-SUBBOT] Reconexión subbot (${path.basename(pathblackJadiBot)}) exitosa en intento #${intentos}`))
            reconnectingSubbot = false
            break
          }
        } catch (e) {
          console.error(`[RECONNECT-SUBBOT] Error en reconexión subbot (${path.basename(pathblackJadiBot)}):`, e)
        }
        await new Promise(res => setTimeout(res, 2000))
      }
      reconnectingSubbot = false
    }

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update

      if (connection === 'connecting') {
        console.log(chalk.bold.yellowBright(`\n╭─────────────────────────\n│ ⏳ Conectando... (+${path.basename(pathblackJadiBot)})\n╰─────────────────────────`))
        connectionTimer = setTimeout(() => {
          console.log(chalk.bold.redBright(`\n╭─────────────────────────\n│ ⌛ La conexión para (+${path.basename(pathblackJadiBot)}) tardó demasiado. Reiniciando...\n╰─────────────────────────`))
          creloadHandler(true).catch(console.error)
        }, 15000)
      }

      if (isNewLogin) sock.isInit = false
      if (qr && !mcode) {
        if (m?.chat) {
          txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
        } else {
          return
        }
        if (txtQR && txtQR.key) {
          setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
        }
        return
      }
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split('@')[0]))
        secret = secret.match(/.{1,4}/g)?.join("-")
        txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
        codeBot = await m.reply(secret)
        console.log(secret)
      }
      if (txtCode && txtCode.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
      }
      if (codeBot && codeBot.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
      }
      const endSesion = async (loaded) => {
        if (!loaded) {
          try {
            sock.ws.close()
          } catch { }
          sock.ev.removeAllListeners()
          let i = global.conns.indexOf(sock)
          if (i < 0) return
          delete global.conns[i]
          global.conns.splice(i, 1)
        }
      }

      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (connection === 'close') {
        clearTimeout(connectionTimer)
        // Elimina cualquier reply/mensaje al usuario
        // Solo log, sin reply
        switch (reason) {
          case DisconnectReason.loggedOut:
            console.log(chalk.bold.redBright(`\n╭─────────────────────────\n│ ⚠︎ Sesión cerrada para (+${path.basename(pathblackJadiBot)}). Limpiando...\n╰─────────────────────────`))
            try {
              fs.rmSync(pathblackJadiBot, { recursive: true, force: true })
            } catch (error) {
              console.error(chalk.bold.red(`Error al limpiar la sesión para +${path.basename(pathblackJadiBot)}:`, error))
            }
            return
          case 428:
          case 408:
          case 440:
          case 405:
          case 401:
          case 500:
          case 515:
          case 403:
            console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Reconexión automática para la sesión (+${path.basename(pathblackJadiBot)})\n╰─────────────────────────`))
            setTimeout(async () => {
              try {
                await creloadHandler(true)
              } catch (e) {
                console.error('Error en reconexión automática subbot:', e)
              }
            }, 2000)
            break
          default:
            // Reconexión automática para cualquier otro motivo
            setTimeout(async () => {
              try {
                await creloadHandler(true)
              } catch (e) {
                console.error('Error en reconexión automática subbot:', e)
              }
            }, 2000)
            break
        }
        // Reconexión agresiva e indefinida para subbots
        if (sock?.ws?.socket === null || connection === 'close') {
          aggressiveReconnectSubbot()
        }
      }
      if (connection == 'open') {
        clearTimeout(connectionTimer)
        console.log(chalk.bold.greenBright(`\n✅ Conexión abierta para la sesión (+${path.basename(pathblackJadiBot)})`))
        if (!global.db.data) loadDatabase()
        if (!global.db.data?.users) loadDatabase()
        let userName = sock.authState.creds.me.name || 'Anónimo'
        let userJid = sock.authState.creds.me.jid || `${path.basename(pathblackJadiBot)}@s.whatsapp.net`
        console.log(chalk.bold.cyanBright(`\n❒────────────【• SUB-BOT •】────────────❒\n│\n│ 🟢 ${userName} (+${path.basename(pathblackJadiBot)}) conectado exitosamente.\n│\n❒────────────【• CONECTADO •】────────────❒`))
        sock.isInit = true
        global.conns.push(sock)
        // Elimina cualquier reply/mensaje al usuario sobre reconexión
      }
    }

    setInterval(async () => {
      if (!sock.user) {
        try { sock.ws.close() } catch { }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)
        if ( i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000,)

    let handler = await import('../handler.js')
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler

      } catch (e) {
        console.error('⚠️ Nuevo error: ', e)
      }
      if (restatConn) {
        const oldChats = sock.chats
        try { sock.ws.close() } catch { }
        sock.ev.removeAllListeners()
        sock = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
      }
      if (!isInit) {
        sock.ev.off("messages.upsert", sock.handler)
        sock.ev.off("connection.update", sock.connectionUpdate)
        sock.ev.off('creds.update', sock.credsUpdate)
      }

      sock.handler = handler.handler.bind(sock)
      sock.connectionUpdate = connectionUpdate.bind(sock)
      sock.credsUpdate = saveCreds.bind(sock, true)
      sock.ev.on("messages.upsert", sock.handler)
      sock.ev.on("connection.update", sock.connectionUpdate)
      sock.ev.on("creds.update", sock.credsUpdate)
      isInit = false
      return true
    }
    creloadHandler(false)
  })
}
