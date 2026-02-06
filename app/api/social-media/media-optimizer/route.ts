/**
 * MEDIA OPTIMIZATION API
 * 
 * Handles media optimization for social media platforms
 * Resizes images and optimizes videos for platform requirements
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { SocialPlatform } from '@/types/social-media-v2'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

// Platform-specific media requirements
const PLATFORM_REQUIREMENTS = {
  FACEBOOK: {
    image: {
      feed: { width: 1200, height: 630, aspectRatio: '16:9' },
      story: { width: 1080, height: 1920, aspectRatio: '9:16' },
      profile: { width: 180, height: 180, aspectRatio: '1:1' }
    },
    video: {
      maxSize: 4000000000, // 4GB
      maxDuration: 240, // 240 minutes
      minResolution: { width: 720, height: 405 },
      maxResolution: { width: 4096, height: 2304 },
      formats: ['MP4', 'MOV']
    }
  },
  INSTAGRAM: {
    image: {
      feed: { width: 1080, height: 1080, aspectRatio: '1:1' },
      story: { width: 1080, height: 1920, aspectRatio: '9:16' },
      reel: { width: 1080, height: 1920, aspectRatio: '9:16' }
    },
    video: {
      maxSize: 4000000000, // 4GB
      maxDuration: 60, // 60 seconds for feed, 90s for reels
      minResolution: { width: 720, height: 720 },
      maxResolution: { width: 1920, height: 1920 },
      formats: ['MP4', 'MOV']
    }
  },
  YOUTUBE: {
    image: {
      thumbnail: { width: 1280, height: 720, aspectRatio: '16:9' },
      banner: { width: 2560, height: 1440, aspectRatio: '16:9' }
    },
    video: {
      maxSize: 256000000000, // 256GB
      maxDuration: 43200, // 12 hours
      minResolution: { width: 640, height: 480 },
      maxResolution: { width: 7680, height: 4320 }, // 8K
      formats: ['MP4', 'MOV', 'AVI', 'WMV', 'FLV', 'WebM']
    }
  }
} as const

// POST: Optimize media for multiple platforms
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const platforms = JSON.parse(formData.get('platforms') as string) as SocialPlatform[]
    const mediaType = formData.get('mediaType') as 'image' | 'video'
    const contentType = formData.get('contentType') as 'feed' | 'story' | 'reel' | 'thumbnail' | 'banner'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB for upload)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 100MB allowed.' },
        { status: 413 }
      )
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name
    const fileExtension = fileName.split('.').pop()?.toLowerCase()

    if (mediaType === 'image') {
      const optimizedImages = await optimizeImageForPlatforms(
        fileBuffer,
        platforms,
        contentType,
        fileExtension
      )

      return NextResponse.json({
        success: true,
        data: {
          originalFile: {
            name: fileName,
            size: file.size,
            type: file.type
          },
          optimizedImages
        }
      })
    } else {
      const optimizedVideos = await optimizeVideoForPlatforms(
        fileBuffer,
        platforms,
        fileName,
        fileExtension
      )

      return NextResponse.json({
        success: true,
        data: {
          originalFile: {
            name: fileName,
            size: file.size,
            type: file.type
          },
          optimizedVideos
        }
      })
    }

  } catch (error) {
    console.error('Error optimizing media:', error)
    return NextResponse.json(
      { error: 'Failed to optimize media' },
      { status: 500 }
    )
  }
}

/**
 * Optimize image for multiple platforms
 */
async function optimizeImageForPlatforms(
  imageBuffer: Buffer,
  platforms: SocialPlatform[],
  contentType: string,
  originalExtension?: string
) {
  const results = []

  for (const platform of platforms) {
    try {
      const requirements = PLATFORM_REQUIREMENTS[platform]?.image
      if (!requirements) {
        continue
      }

      const spec = requirements[contentType as keyof typeof requirements] as { width: number; height: number; aspectRatio: string } | undefined
      if (!spec) {
        continue
      }

      const { width, height } = spec

      // Optimize image with Sharp
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 85,
          progressive: true
        })
        .toBuffer()

      // Generate optimized filename
      const optimizedFileName = `${platform.toLowerCase()}_${contentType}_${width}x${height}.jpg`

      // In production, upload to cloud storage (S3, Cloudinary, etc.)
      const optimizedUrl = await uploadToStorage(optimizedBuffer, optimizedFileName)

      results.push({
        platform,
        contentType,
        originalSize: imageBuffer.length,
        optimizedSize: optimizedBuffer.length,
        dimensions: { width, height },
        aspectRatio: spec.aspectRatio,
        url: optimizedUrl,
        fileName: optimizedFileName,
        compressionRatio: Math.round((1 - optimizedBuffer.length / imageBuffer.length) * 100)
      })

    } catch (error) {
      console.error(`Failed to optimize image for ${platform}:`, error)
      results.push({
        platform,
        contentType,
        error: error.message,
        success: false
      })
    }
  }

  return results
}

/**
 * Optimize video for multiple platforms (placeholder)
 */
async function optimizeVideoForPlatforms(
  videoBuffer: Buffer,
  platforms: SocialPlatform[],
  originalFileName: string,
  originalExtension?: string
) {
  const results = []

  for (const platform of platforms) {
    try {
      const requirements = PLATFORM_REQUIREMENTS[platform]?.video
      if (!requirements) {
        continue
      }

      // Video optimization would require FFmpeg integration
      // For now, we'll return metadata and validation
      const upperExtension = originalExtension?.toUpperCase() || ''
      const isValidFormat = requirements.formats.includes(upperExtension as any)
      const isValidSize = videoBuffer.length <= requirements.maxSize

      results.push({
        platform,
        originalSize: videoBuffer.length,
        maxAllowedSize: requirements.maxSize,
        isValidFormat,
        isValidSize,
        supportedFormats: requirements.formats,
        maxDuration: requirements.maxDuration,
        minResolution: requirements.minResolution,
        maxResolution: requirements.maxResolution,
        needsOptimization: !isValidFormat || !isValidSize,
        // In production, this would include the optimized video URL
        optimizedUrl: null
      })

    } catch (error) {
      console.error(`Failed to validate video for ${platform}:`, error)
      results.push({
        platform,
        error: error.message,
        success: false
      })
    }
  }

  return results
}

/**
 * Upload optimized media to storage (mock implementation)
 */
async function uploadToStorage(buffer: Buffer, fileName: string): Promise<string> {
  // In production, this would upload to:
  // - AWS S3
  // - Cloudinary
  // - Google Cloud Storage
  // - Or similar service
  
  // For demo purposes, return a mock URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api/media/${fileName}?t=${Date.now()}`
}

// GET: Get platform requirements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') as SocialPlatform
    const mediaType = searchParams.get('mediaType') as 'image' | 'video'

    if (platform && mediaType) {
      const requirements = PLATFORM_REQUIREMENTS[platform]?.[mediaType]
      
      if (!requirements) {
        return NextResponse.json(
          { error: `No requirements found for ${platform} ${mediaType}` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          platform,
          mediaType,
          requirements
        }
      })
    }

    // Return all requirements
    return NextResponse.json({
      success: true,
      data: {
        platforms: Object.keys(PLATFORM_REQUIREMENTS),
        requirements: PLATFORM_REQUIREMENTS
      }
    })

  } catch (error) {
    console.error('Error fetching media requirements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requirements' },
      { status: 500 }
    )
  }
}