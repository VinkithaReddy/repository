import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
    let users = []
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8')
      users = JSON.parse(data)
    } catch (error) {
      // If file doesn't exist, we'll create it
    }

    const existingUser = users.find((user: any) => user.email === email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { id: Date.now().toString(), email, password: hashedPassword }
    users.push(newUser)

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

