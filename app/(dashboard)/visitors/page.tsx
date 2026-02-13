import { redirect } from 'next/navigation'

/**
 * VISITORS ROUTE REDIRECT
 * 
 * Migration Note: This route redirects to /check-ins
 * Visitor management is handled through the check-ins module
 * 
 * Enterprise Compliance: Railway → Vercel migration compatibility
 */
export default function VisitorsPage() {
  redirect('/check-ins')
}
