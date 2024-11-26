'use client'

import React, { useState } from 'react'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 16 * 1024 * 1024 // 16MB

      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload PDF, JPG, PNG, or DOC files only.')
        setFile(null)
      } else if (selectedFile.size > maxSize) {
        setError('File size exceeds 16MB limit.')
        setFile(null)
      } else {
        setFile(selectedFile)
        setError(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setSuccess('File uploaded successfully!')
        setFile(null)
        ;(e.target as HTMLFormElement).reset()
      } else {
        const data = await res.json()
        setError(data.message || 'An error occurred while uploading the file.')
      }
    } catch (err) {
      setError('An error occurred while uploading the file.')
    }
  }

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Health Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            Select file (PDF, JPG, PNG, or DOC, max 16MB)
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
            onChange={handleFileChange}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!file}
        >
          Upload
        </button>
      </form>
    </div>
  )
}

