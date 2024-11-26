'use client'

import React, { useState, useEffect } from 'react'

interface Record {
  id: string
  filename: string
  uploadDate: string
  fileType: string
}

export default function RecordsList() {
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/records')
        if (res.ok) {
          const data = await res.json()
          setRecords(data)
        }
      } catch (err) {
        console.error('Error fetching records:', err)
      }
    }
    fetchRecords()
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Health Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.filename}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.uploadDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.fileType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={`/api/download/${record.id}`} className="text-indigo-600 hover:text-indigo-900">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

