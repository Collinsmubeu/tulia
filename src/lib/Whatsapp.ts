import axios from 'axios'

const WA_PHONE_NUMBER_ID = process.env.NEXT_PUBLIC_WA_PHONE_NUMBER_ID
const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN
const WA_API_URL = `https://graph.facebook.com/v21.0/${WA_PHONE_NUMBER_ID}/messages`

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: phoneNumber,
    type: 'text',
    text: {
      preview_url: false,
      body: message
    }
  }

  const headers = {
    'Authorization': `Bearer ${WA_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }

  try {
    const response = await axios.post(WA_API_URL, payload, { headers })
    return response.data
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    throw error
  }
}

export async function sendDailyCashReport(adminPhone: string, reportData: {
  date: string
  totalCash: number
  totalCard: number
  totalInsurance: number
  patientCount: number
}) {
  const message = `📊 Daily Cash Report - ${reportData.date}\n\n💰 Total Cash: $${reportData.totalCash}\n💳 Total Card: $${reportData.totalCard}\n🏥 Total Insurance: $${reportData.totalInsurance}\n👥 Patients Seen: ${reportData.patientCount}\n\nTotal Revenue: $${reportData.totalCash + reportData.totalCard + reportData.totalInsurance}`
  return sendWhatsAppMessage(adminPhone, message)
}

export async function sendAppointmentReminder(patientPhone: string, appointment: {
  date: string
  time: string
  doctorName: string
}) {
  const message = `🔔 Appointment Reminder\n\nHello! This is a reminder for your appointment:\n📅 Date: ${appointment.date}\n⏰ Time: ${appointment.time}\n👨‍⚕️ Doctor: ${appointment.doctorName}\n\nPlease arrive 15 minutes early.`
  return sendWhatsAppMessage(patientPhone, message)
}   