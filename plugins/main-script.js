const handler = async (m, { conn }) => {
  const texto = `
 *𝑪𝒓𝒚𝒑𝒕𝒊𝒄𝑴𝒂𝒔𝒕𝒆𝒓*

 *GRUPO OFICIAL:* https://chat.whatsapp.com/IrlMYf6R9YV5NBU6OgPm1v?mode=ems_copy_t
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler
