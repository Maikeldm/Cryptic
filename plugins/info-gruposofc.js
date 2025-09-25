import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const namegrupo = 'Grupo Oficial'
  const gp1 = 'https://chat.whatsapp.com/IrlMYf6R9YV5NBU6OgPm1v?mode=ems_copy_t'

  const namechannel = 'Canal Bot'
  const channel = 'https://whatsapp.com/channel/0029Vb2mDZ93bbUzSuMDJG1S'

  const dev = 'Owner: instagram.com/maikel.mp5_x'
  const catalogo = 'https://qu.ax/bSarD.jpg'
  const emojis = '〽️'

  let grupos = `
╭─⟪ *GRUPOS OFICIALES* ⟫
│
│ 🕷️ *${namegrupo}*
│ ${gp1}
│
│ ⚜️ *${namechannel}*
│ ${channel}
│
│ ${dev}
╰─────────────────╯
`

  await conn.sendMessage(m.chat, {
    image: { url: catalogo },
    caption: grupos.trim()
  }, { quoted: m })

  await m.react(emojis)
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler