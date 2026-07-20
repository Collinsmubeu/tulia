'use client'
import { useState, useEffect } from 'react'

interface Patient {
  id: string
  name: string
  age: number
  condition: string
  waitTime: string
}

interface Prescription {
  medication: string
  dosage: string
  frequency: string
  duration: string
}

interface DoctorDashboardProps {
  userId: string
  providerServices: string[]
}

// The service id that unlocks this dashboard. Update if you add a
// dedicated "Medical Consultation" entry to services.json.
const MEDICAL_SERVICE_ID = 's1'

export default function DoctorDashboard({ userId, providerServices }: DoctorDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [prescription, setPrescription] = useState<Prescription>({
    medication: '',
    dosage: '',
    frequency: '',
    duration: ''
  })
  const [revenue, setRevenue] = useState({ today: 0, consultations: 0 })

  const offersMedical = providerServices?.includes(MEDICAL_SERVICE_ID)

  useEffect(() => {
    if (!offersMedical) return

    fetch(`/api/doctors/opd-queue?doctorId=${userId}`)
      .then(res => res.json())
      .then(data => setPatients(data))

    fetch(`/api/doctors/revenue?doctorId=${userId}`)
      .then(res => res.json())
      .then(data => setRevenue(data))
  }, [userId, offersMedical])

  const handlePrescribe = async () => {
    if (!selectedPatient) return
    try {
      await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: userId, patientId: selectedPatient, ...prescription })
      })
      alert('Prescription sent to pharmacy')
    } catch (error) {
      console.error('Failed to send prescription', error)
    }
  }

  if (!offersMedical) {
    return (
      <div className="p-6">
        <p className="text-gray-600">
          You haven&apos;t enabled Medical services yet. Go to your profile to link this service.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Today&apos;s Revenue</h3>
          <p className="text-2xl font-bold">${revenue.today}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Consultations</h3>
          <p className="text-2xl font-bold">{revenue.consultations}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Waiting Patients</h3>
          <p className="text-2xl font-bold">{patients.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">OPD Queue</h2>
          <ul className="space-y-2">
            {patients.map(patient => (
              <li
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className={`p-3 rounded cursor-pointer ${selectedPatient === patient.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{patient.name}</span>
                  <span className="text-sm text-gray-500">{patient.waitTime}</span>
                </div>
                <div className="text-sm text-gray-600">{patient.age} yrs • {patient.condition}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Write Prescription</h2>
          {selectedPatient ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Medication Name"
                value={prescription.medication}
                onChange={(e) => setPrescription({ ...prescription, medication: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Dosage (e.g., 500mg)"
                value={prescription.dosage}
                onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Frequency (e.g., Twice daily)"
                value={prescription.frequency}
                onChange={(e) => setPrescription({ ...prescription, frequency: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 7 days)"
                value={prescription.duration}
                onChange={(e) => setPrescription({ ...prescription, duration: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handlePrescribe}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Send to Pharmacy
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Select a patient to prescribe</p>
          )}
        </div>
      </div>
    </div>
  )
}