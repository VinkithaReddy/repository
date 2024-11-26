import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const RECORDS_FILE = path.join(process.cwd(), 'data', 'records.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const { id } = req.query

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const data = await fs.readFile(RECORDS_FILE, 'utf8')
    const records = JSON.parse(data)

    const record = records.find((r: any) => r.id === id && r.userId === decoded.userId)
    if (!record) {
      return res.status(404).json({ message: 'Record not found' })
    }

    const file = await fs.readFile(record.path)
    res.setHeader('Content-Type', record.fileType)
    res.setHeader('Content-Disposition', `attachment; filename=${record.filename}`)
    res.send(file)
  } catch (error) {
    console.error('Download error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

