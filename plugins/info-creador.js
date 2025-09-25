import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let nomorown = '593969533280' // Propietario
  let bio = (await conn.fetchStatus(nomorown + '@s.whatsapp.net').catch(_ => {}))?.status || 'Sin Biografía'
  let biobot = (await conn.fetchStatus(conn.user.jid).catch(_ => {}))?.status || 'Sin Biografía'

  await sendContactArray(conn, m.chat, [
    [`${nomorown}`, `Owner`, `𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘`, dev, correo, `MX`, `${global.yt}`, bio],
    [`${conn.user.jid.split('@')[0]}`, `El mejor bot👻`, `${packname}`, `📵 No Hacer Spam`, correo, `MX`, md, biobot],
    [`593980075358`, `𝑪𝒓𝒚𝒑𝒕𝒊𝒄𝑴𝒂𝒔𝒕𝒆𝒓`, `Bot`, 'Soporte', correo, `MX`, md, biobot]
  ], m)
}

handler.help = ["creador","owner"]
handler.tags = ["info"]
handler.command = ['owner','creador']
export default handler

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
  let contacts = []

  for (let [number, name, org, label, email, region, url, note] of data) {
    number = number.replace(/[^0-9]/g, '')
    
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:${name.replace(/\n/g, '\\n')};;;;
FN:${name.replace(/\n/g, '\\n')}
ORG:${org}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
EMAIL;type=INTERNET:${email}
ADR:;;${region};;;;
URL:${url}
NOTE:${note}
END:VCARD`.trim()
    
    contacts.push({ vcard, displayName: name })
  }

  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `${contacts.length} contactos` : contacts[0].displayName) || null,
      contacts,
    }
  },
  {
    quoted,
    ...options
  })
}