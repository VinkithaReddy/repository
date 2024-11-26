import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

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
    const data = await fs.readFile(USERS_FILE, 'utf8')
    const users = JSON.parse(data)

    const user = users.find((u: any) => u.id === decoded.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ id: user.id, email: user.email })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

