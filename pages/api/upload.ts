import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import path from 'path'
import { promises as fs } from 'fs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const RECORDS_FILE = path.join(process.cwd(), 'data', 'records.json')

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const form = new formidable.IncomingForm()
    form.uploadDir = UPLOADS_DIR
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Upload error:', err)
        return res.status(500).json({ message: 'Error uploading file' })
      }

      const file = files.file as formidable.File
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const fileId = Date.now().toString()
      const newFilename = `${fileId}-${file.originalFilename}`
      const newPath = path.join(UPLOADS_DIR, newFilename)

      await fs.rename(file.filepath, newPath)

      let records = []
      try {
        const data = await fs.readFile(RECORDS_FILE, 'utf8')
        records = JSON.parse(data)
      } catch (error) {
        // If file doesn't exist, we'll create it
      }

      const newRecord = {
        id: fileId,
        userId: decoded.userId,
        filename: file.originalFilename,
        path: newPath,
        uploadDate: new Date().toISOString(),
        fileType: file.mimetype,
      }

      records.push(newRecord)
      await fs.writeFile(RECORDS_FILE, JSON.stringify(records, null, 2))

      res.status(200).json({ message: 'File uploaded successfully' })
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

