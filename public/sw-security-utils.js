// Service Worker Security Utilities
// Kḥesed-tek Church Management Systems

/**
 * Validates response security before caching
 * Prevents cache poisoning attacks
 */
function validateResponseSecurity(response, request) {
  // Check response status
  if (response.status < 200 || response.status >= 400) {
    console.warn('Blocking suspicious response status:', response.status)
    return false
  }

  // Validate Content-Type header
  const contentType = response.headers.get('content-type')
  const allowedContentTypes = [
    'image/',
    'application/json',
    'text/css',
    'application/javascript',
    'text/javascript',
    'application/manifest+json',
    'text/plain'
  ]

  if (contentType && !allowedContentTypes.some(type => contentType.includes(type))) {
    console.warn('Blocking suspicious content type:', contentType)
    return false
  }

  // Validate origin - only allow same-origin requests
  try {
    const responseUrl = new URL(response.url)
    const requestUrl = new URL(request.url)
    
    if (responseUrl.origin !== self.location.origin) {
      console.warn('Blocking cross-origin response:', responseUrl.origin)
      return false
    }
  } catch (error) {
    console.warn('Invalid URL in response:', error)
    return false
  }

  // Check for suspicious headers
  const suspiciousHeaders = response.headers.get('x-frame-options')
  if (suspiciousHeaders && suspiciousHeaders.toLowerCase() === 'allowall') {
    console.warn('Blocking response with suspicious headers')
    return false
  }

  // Validate file extensions for static assets
  const url = new URL(response.url)
  const pathname = url.pathname.toLowerCase()
  
  if (pathname.includes('/icons/') || pathname.includes('/_next/static/')) {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.js', '.css', '.json']
    const hasValidExtension = allowedExtensions.some(ext => pathname.endsWith(ext))
    
    if (!hasValidExtension) {
      console.warn('Blocking file with invalid extension:', pathname)
      return false
    }
  }

  return true
}

/**
 * Validates notification data to prevent XSS and malicious content
 */
function validateNotificationData(data) {
  if (!data || typeof data !== 'object') {
    return null
  }

  // Sanitize text content
  const title = sanitizeText(data.title || 'Kḥesed-tek Church')
  const body = sanitizeText(data.body || 'Nueva notificación')

  // Validate icon URLs
  const icon = validateIconUrl(data.icon) ? data.icon : '/icons/icon-192.png'
  const badge = validateIconUrl(data.badge) ? data.badge : '/icons/badge-72.png'

  // Validate notification URL
  const url = validateNotificationUrl(data.url) ? data.url : '/'

  // Validate tag
  const tag = sanitizeText(data.tag || 'khesed-notification')

  return {
    title: title.substring(0, 100), // Limit length
    body: body.substring(0, 300),   // Limit length
    icon,
    badge,
    url,
    tag: tag.substring(0, 50),
    notificationId: data.notificationId || generateSecureId()
  }
}

/**
 * Sanitizes text content to prevent XSS
 */
function sanitizeText(text) {
  if (typeof text !== 'string') return ''

  // Remove HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .trim()
}

/**
 * Validates icon URLs for notifications
 */
function validateIconUrl(url) {
  if (!url || typeof url !== 'string') return false

  try {
    const urlObj = new URL(url, self.location.origin)
    
    // Only allow same-origin icons
    if (urlObj.origin !== self.location.origin) {
      return false
    }
    
    // Check file extension
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico']
    const hasValidExtension = allowedExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    )
    
    return hasValidExtension
  } catch {
    return false
  }
}

/**
 * Validates notification URLs
 */
function validateNotificationUrl(url) {
  if (!url || typeof url !== 'string') return false

  try {
    const urlObj = new URL(url, self.location.origin)
    
    // Only allow same-origin URLs
    if (urlObj.origin !== self.location.origin) {
      return false
    }
    
    // Block dangerous protocols
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * Generates a secure ID for notifications
 */
function generateSecureId() {
  return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Creates a secure error response
 */
function createSecureErrorResponse(message, status = 403) {
  return new Response(
    JSON.stringify({ error: message, timestamp: Date.now() }),
    {
      status,
      statusText: 'Security Policy Violation',
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    }
  )
}

// Export for use in service worker
if (typeof self !== 'undefined') {
  self.validateResponseSecurity = validateResponseSecurity
  self.validateNotificationData = validateNotificationData
  self.sanitizeText = sanitizeText
  self.validateIconUrl = validateIconUrl
  self.validateNotificationUrl = validateNotificationUrl
  self.generateSecureId = generateSecureId
  self.createSecureErrorResponse = createSecureErrorResponse
}