import { SiteClient } from 'datocms-client'

export default async (req, res) => {
  if (req.method === 'POST') {
    const TOKEN = process.env.DATOCMS_TOKEN
    // Validar os dados, antes de sair cadastrando
    const client = new SiteClient(TOKEN)
    const registroCriado = await client.items.create({
      itemType: '1050058',
      ...req.body
    })
    res.json({
      registroCriado
    })
    return
  }
  res.status(404).json({ msg: 'Ainda não temos nada no GET, mas no POST tem!' })
}