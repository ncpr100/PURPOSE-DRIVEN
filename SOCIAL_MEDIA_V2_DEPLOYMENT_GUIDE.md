# 🚀 SOCIAL MEDIA V2 DEPLOYMENT GUIDE

**GoHighLevel-style Social Media Management System**  
**Hybrid Architecture: Base (Free) + Premium AI (Paid Addon)**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ **1. Environment Variables Setup**
```bash
# OAuth Encryption (Required)
OAUTH_ENCRYPTION_KEY="your-32-character-encryption-key" # Must be 32 chars

# Platform OAuth Credentials (Required for each platform)
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

INSTAGRAM_CLIENT_ID="your-instagram-app-id" # Usually same as Facebook
INSTAGRAM_CLIENT_SECRET="your-instagram-app-secret"

YOUTUBE_CLIENT_ID="your-google-oauth-client-id"
YOUTUBE_CLIENT_SECRET="your-google-oauth-client-secret"

# AI Integration (Optional - for Premium tier)
OPENAI_API_KEY="sk-..." # For GPT-4 content generation

# Media Storage (Optional)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_S3_BUCKET="your-media-bucket"
```

### ✅ **2. Database Migration**
```bash
# Apply new schema models
npx prisma db push

# Or create formal migration
npx prisma migrate dev --name "add-social-media-v2-system"

# Regenerate Prisma client
npx prisma generate
```

### ✅ **3. Platform OAuth Applications Setup**

#### **Facebook/Instagram Setup:**
1. Go to [Facebook Developer Console](https://developers.facebook.com/)
2. Create new app or use existing
3. Add "Facebook Login" product
4. Configure redirect URI: `https://yourdomain.com/api/social-oauth/facebook/callback`
5. Add permissions: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`
6. Submit for review if publishing publicly

#### **YouTube Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Configure redirect URI: `https://yourdomain.com/api/social-oauth/youtube/callback`
5. Add scopes: `https://www.googleapis.com/auth/youtube`, `https://www.googleapis.com/auth/youtube.upload`

### ✅ **4. Dependencies Installation**
```bash
# Install required packages
npm install sharp  # Image optimization
npm install nanoid # ID generation
```

---

## 🔧 DEPLOYMENT STEPS

### **Step 1: Database Schema Update**
```bash
# Copy new models to main schema
cat prisma/social-media-v2-models.prisma >> prisma/schema.prisma

# Update churches model to include new relations:
# Add these lines to the churches model:
social_media_accounts_v2 social_media_accounts_v2[]
social_media_posts_v2    social_media_posts_v2[]
oauth_states             oauth_states[]

# Add to users model:
social_media_posts_v2_authored social_media_posts_v2[] @relation("AuthorPosts")
oauth_states                   oauth_states[]

# Push to database
npx prisma db push
```

### **Step 2: Create AI Addon Record**
```sql
-- Insert AI addon into subscription_addons table
INSERT INTO subscription_addons (
  id,
  key,
  name,
  description,
  "priceMonthly",
  "priceYearly",
  "billingType",
  "isActive"
) VALUES (
  'social-media-ai',
  'social-media-ai',
  'IA Premium para Redes Sociales',
  'Generación automática de contenido con GPT-4, hashtags inteligentes y optimización por plataforma',
  '19.99',
  '199.99',
  'MONTHLY',
  true
);
```

### **Step 3: Deploy Code Files**
```bash
# Commit all new files
git add .
git commit -m "feat: GoHighLevel-style social media V2 system with AI integration"

# Deploy to Railway (enterprise compliance)
git push origin main
```

### **Step 4: Verify Deployment**
```bash
# Check API endpoints
curl https://yourdomain.com/api/social-media/oauth
curl https://yourdomain.com/api/social-media/scheduler
curl https://yourdomain.com/api/social-media/analytics

# Test page access
curl https://yourdomain.com/social-media-v2
```

---

## 🎯 FEATURE ACTIVATION GUIDE

### **Base Tier (Free) Features:**
- ✅ Platform connections (Facebook, Instagram, YouTube)
- ✅ Manual post creation and scheduling
- ✅ Basic analytics sync
- ✅ Media optimization
- ✅ Multi-platform publishing

### **Premium AI Tier (Paid Addon) Features:**
- ⭐ GPT-4 content generation
- ⭐ Automatic hashtag optimization
- ⭐ Platform-specific content adaptation
- ⭐ Engagement optimization suggestions
- ⭐ Advanced analytics insights

### **Activating AI Premium for Church:**
```sql
-- Grant AI addon to specific church
INSERT INTO church_subscription_addons (
  id,
  "churchId",
  "addonId",
  "isActive",
  "activatedAt",
  "expiresAt"
) VALUES (
  'church-ai-addon-123',
  'church-id-here',
  'social-media-ai',
  true,
  NOW(),
  NOW() + INTERVAL '1 month'
);
```

---

## 🔍 TESTING PROCEDURES

### **1. OAuth Connection Testing:**
```bash
# Test Facebook connection
1. Navigate to /social-media-v2
2. Click "Conectar Facebook"
3. Complete OAuth flow
4. Verify account appears in dashboard

# Test Instagram connection
1. Click "Conectar Instagram" 
2. Complete OAuth (via Facebook)
3. Verify Business account detection

# Test YouTube connection
1. Click "Conectar YouTube"
2. Complete Google OAuth
3. Verify channel information
```

### **2. Post Creation Testing:**
```bash
# Test Base tier post
1. Go to "Crear Post" tab
2. Enter content: "Prueba de sistema V2"
3. Select connected platforms
4. Click "Publicar Ahora"
5. Verify post appears in Recent Posts

# Test AI Premium (if activated)
1. Enable "Mejorar contenido con IA"
2. Enter basic content
3. Publish and verify AI enhancement
```

### **3. Analytics Sync Testing:**
```bash
# Manual sync test
1. Go to "Analíticas" tab
2. Click "Sincronizar"
3. Verify metrics appear
4. Check platform breakdown
```

---

## 🚨 TROUBLESHOOTING

### **Common Issues:**

**Issue: OAuth connections failing**
- ✅ Check redirect URIs match exactly
- ✅ Verify client ID/secret in environment
- ✅ Ensure platform apps are in development/live mode
- ✅ Check HTTPS is enabled (required for OAuth)

**Issue: AI features not working**
- ✅ Verify church has active AI addon subscription
- ✅ Check OPENAI_API_KEY is set
- ✅ Confirm addon hasn't expired

**Issue: Posts not publishing**
- ✅ Verify OAuth tokens haven't expired
- ✅ Check platform permissions are granted
- ✅ Review error messages in database
- ✅ Test with simple text-only posts first

**Issue: Database errors**
- ✅ Ensure Prisma migration completed
- ✅ Check foreign key constraints
- ✅ Verify churchId scoping is working

### **Debugging Commands:**
```bash
# Check OAuth states
SELECT * FROM oauth_states WHERE "expiresAt" > NOW();

# Check connected accounts
SELECT * FROM social_media_accounts_v2 WHERE "isActive" = true;

# Check recent posts
SELECT * FROM social_media_posts_v2 ORDER BY "createdAt" DESC LIMIT 10;

# Check AI addon subscriptions
SELECT * FROM church_subscription_addons WHERE "addonId" = 'social-media-ai';
```

---

## 📊 ANALYTICS OVERVIEW

### **Key Metrics to Monitor:**
- OAuth connection success rate
- Post publishing success rate  
- AI content generation usage
- Platform engagement rates
- Error rates by platform
- User adoption of V2 system

### **Success Criteria:**
- ✅ 95%+ OAuth connection success rate
- ✅ 98%+ post publishing success rate
- ✅ <2% error rate across all operations
- ✅ 90%+ user satisfaction with new interface
- ✅ 50%+ engagement improvement over V1 system

---

## 🎉 POST-DEPLOYMENT VALIDATION

### **Final Checklist:**
- [ ] All OAuth platforms connect successfully
- [ ] Posts publish to all connected platforms
- [ ] Analytics sync and display correctly
- [ ] AI Premium features work (if activated)
- [ ] Media optimization processes correctly
- [ ] Error handling works gracefully
- [ ] UI is responsive on mobile devices
- [ ] All API endpoints return proper responses
- [ ] Database constraints prevent data corruption
- [ ] Security: OAuth tokens are encrypted in storage

### **Go-Live Communication:**
```
🎉 ¡NUEVA FUNCIÓN DISPONIBLE! 

Hemos lanzado nuestro sistema de Redes Sociales V2 con:
✨ Conexión automática con Facebook, Instagram y YouTube
✨ Publicación desde una sola plataforma
✨ IA Premium para optimización de contenido
✨ Analíticas unificadas de todas las plataformas

Accede desde el menú principal > Redes Sociales V2
```

---

**🚀 DEPLOYMENT COMPLETED SUCCESSFULLY**

The GoHighLevel-style social media V2 system is now live with hybrid Base + Premium AI architecture, providing churches with professional social media management capabilities while maintaining the accessibility of the base tier and monetizing advanced AI features through the Premium addon.

**Next Phase:** Monitor adoption metrics and prepare for Phase 4 mobile app integration.