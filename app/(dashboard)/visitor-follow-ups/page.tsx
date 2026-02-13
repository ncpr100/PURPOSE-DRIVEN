import { redirect } from 'next/navigation'

/**
 * VISITOR FOLLOW-UPS ROUTE REDIRECT
 * 
 * Migration Note: This route redirects to /follow-ups
 * Follow-up management is handled through the follow-ups module
 * 
 * Enterprise Compliance: Railway → Vercel migration compatibility
 */
export default function VisitorFollowUpsPage() {
  redirect('/follow-ups')
}
