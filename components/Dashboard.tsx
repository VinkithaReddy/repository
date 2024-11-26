import React from 'react'
import FileUpload from './FileUpload'
import RecordsList from './RecordsList'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Personal Health Record Dashboard</h1>
      <FileUpload />
      <RecordsList />
    </div>
  )
}

