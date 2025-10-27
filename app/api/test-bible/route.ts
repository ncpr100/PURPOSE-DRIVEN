import { NextRequest, NextResponse } from 'next/server'
import { freeBibleService, FREE_BIBLE_VERSIONS } from '@/lib/services/free-bible-service'

export const dynamic = 'force-dynamic'

interface TestResult {
  name: string
  status: 'success' | 'error'
  data?: any
  error?: string
}

export async function GET(request: NextRequest) {
  try {
    const results: { tests: TestResult[]; summary: any } = {
      tests: [],
      summary: {}
    }

    // Test 1: Check available Bible versions
    try {
      results.tests.push({
        name: 'Available Versions',
        status: 'success',
        data: {
          count: FREE_BIBLE_VERSIONS.length,
          sample: FREE_BIBLE_VERSIONS.slice(0, 5)
        }
      })
    } catch (error) {
      results.tests.push({
        name: 'Available Versions',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: Check Bible books
    try {
      const books = freeBibleService.getBibleBooks()
      results.tests.push({
        name: 'Bible Books',
        status: 'success',
        data: {
          count: books.length,
          first: books[0],
          last: books[books.length - 1]
        }
      })
    } catch (error) {
      results.tests.push({
        name: 'Bible Books',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: Test single verse lookup
    try {
      const verse = await freeBibleService.getVerse('John 3:16', 'RVR1960')
      if (verse) {
        results.tests.push({
          name: 'Single Verse Lookup (John 3:16)',
          status: 'success',
          data: {
            reference: verse.reference,
            text: verse.text,
            version: verse.version
          }
        })
      } else {
        results.tests.push({
          name: 'Single Verse Lookup (John 3:16)',
          status: 'error',
          error: 'Verse not found'
        })
      }
    } catch (error) {
      results.tests.push({
        name: 'Single Verse Lookup (John 3:16)',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 4: Test version comparison
    try {
      const comparison = await freeBibleService.compareVerses('1 John 4:8', ['RVR1960', 'NVI'])
      results.tests.push({
        name: 'Version Comparison (1 John 4:8)',
        status: 'success',
        data: {
          versionsCompared: comparison.length,
          results: comparison
        }
      })
    } catch (error) {
      results.tests.push({
        name: 'Version Comparison (1 John 4:8)',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 5: Test cross-references
    try {
      const crossRefs = await freeBibleService.getCrossReferences('John 3:16', 'love')
      results.tests.push({
        name: 'Cross References',
        status: 'success',
        data: {
          count: crossRefs.length,
          references: crossRefs.slice(0, 5)
        }
      })
    } catch (error) {
      results.tests.push({
        name: 'Cross References',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Generate summary
    const successCount = results.tests.filter((t: TestResult) => t.status === 'success').length
    const totalCount = results.tests.length
    
    results.summary = {
      total: totalCount,
      passed: successCount,
      failed: totalCount - successCount,
      success: successCount === totalCount
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Bible service test error:', error)
    return NextResponse.json(
      { 
        error: 'Test execution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        tests: [],
        summary: { total: 0, passed: 0, failed: 1, success: false }
      },
      { status: 500 }
    )
  }
}