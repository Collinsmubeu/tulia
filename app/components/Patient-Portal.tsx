'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PatientPortal() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    insuranceId: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        router.push('/patient/dashboard')
      }
    } catch (error) {
      console.error('Registration failed', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Patient Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Insurance ID"
          value={formData.insuranceId}
          onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Emergency Contact Name"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="tel"
            placeholder="Emergency Phone"
            value={formData.emergencyPhone}
            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  )
}