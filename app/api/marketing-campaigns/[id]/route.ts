
import { db as prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
// Get single marketing campaign
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    });
    if (!user?.churchId) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 });
    const campaign = await prisma.marketing_campaigns.findUnique({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      include: {
        marketing_campaign_posts: {
          select: { 
            id: true, 
            postId: true, 
            accountId: true, 
            status: true, 
            scheduledAt: true,
            publishedAt: true 
          }
        },
        _count: {
          select: { marketing_campaign_posts: true }
        }
      }
    });
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    return NextResponse.json(campaign);
  } // END OF TRY BLOCK
  catch (error) {
    console.error('Error fetching marketing campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Update marketing campaign
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { 
      name, 
      description, 
      objectives, 
      targetAudience, 
      budget, 
      currency, 
      startDate, 
      endDate, 
      status, 
      platforms, 
      tags 
    } = await request.json();
    const campaign = await prisma.marketing_campaigns.update({
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(objectives !== undefined && { objectives: Array.isArray(objectives) ? JSON.stringify(objectives) : null }),
        ...(targetAudience !== undefined && { targetAudience: targetAudience ? JSON.stringify(targetAudience) : null }),
        ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
        ...(currency !== undefined && { currency }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(status !== undefined && { status }),
        ...(platforms !== undefined && { platforms: Array.isArray(platforms) ? JSON.stringify(platforms) : JSON.stringify([]) }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? JSON.stringify(tags) : null }),
          select: { id: true, postId: true, accountId: true, status: true, scheduledAt: true }
    console.error('Error updating marketing campaign:', error);
// Delete marketing campaign
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await prisma.marketing_campaigns.delete({
    return NextResponse.json({ message: 'Campaign deleted successfully' });
    console.error('Error deleting marketing campaign:', error);
