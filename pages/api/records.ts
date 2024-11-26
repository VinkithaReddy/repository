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

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const data = await fs.readFile(RECORDS_FILE, 'utf8')
    const records = JSON.parse(data)

    const userRecords = records
      .filter((record: any) => record.userId === decoded.userId)
      .map((record: any) => ({
        id: record.id,
        filename: record.filename,
        uploadDate: record.uploadDate,
        fileType: record.fileType,
      }))

    res.status(200).json(userRecords)
  } catch (error) {
    console.error('Records fetch error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

