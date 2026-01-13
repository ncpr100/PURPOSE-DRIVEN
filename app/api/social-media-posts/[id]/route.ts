
import { db as prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
// Get single social media post
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
    const post = await prisma.social_media_posts.findUnique({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      include: {
        marketing_campaigns: {
          select: { id: true, name: true }
        }
      }
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching social media post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
// Update social media post
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { 
      title, 
      content, 
      mediaUrls, 
      platforms, 
      accountIds, 
      status, 
      scheduledAt, 
      hashtags, 
      mentions, 
      campaignId 
    } = await request.json();
    const post = await prisma.social_media_posts.update({
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(mediaUrls !== undefined && { mediaUrls: Array.isArray(mediaUrls) ? JSON.stringify(mediaUrls) : null }),
        ...(platforms !== undefined && { platforms: Array.isArray(platforms) ? JSON.stringify(platforms) : platforms }),
        ...(accountIds !== undefined && { accountIds: Array.isArray(accountIds) ? JSON.stringify(accountIds) : accountIds }),
        ...(status !== undefined && { status }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(hashtags !== undefined && { hashtags: Array.isArray(hashtags) ? JSON.stringify(hashtags) : null }),
        ...(mentions !== undefined && { mentions: Array.isArray(mentions) ? JSON.stringify(mentions) : null }),
        ...(campaignId !== undefined && { campaignId: campaignId || null }),
    console.error('Error updating social media post:', error);
// Delete social media post
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await prisma.social_media_posts.delete({
    return NextResponse.json({ message: 'Post deleted successfully' });
    console.error('Error deleting social media post:', error);
