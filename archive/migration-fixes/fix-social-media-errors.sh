#!/bin/bash
# Fix all remaining social media V2 compilation errors

echo "🔧 Fixing social media compilation errors..."

# Fix all _v2 table references
find app/api/social-media app/app/\(dashboard\)/social-media-v2 -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  # Replace social_media_accounts_v2 with social_media_accounts
  sed -i 's/social_media_accounts_v2/social_media_accounts/g' "$file"
  
  # Replace social_media_posts_v2 with social_media_posts  
  sed -i 's/social_media_posts_v2/social_media_posts/g' "$file"
  
  # Replace social_media_platform_posts with social_media_posts
  sed -i 's/social_media_platform_posts/social_media_posts/g' "$file"
  
  # Replace PlatformType with SocialPlatform
  sed -i 's/PlatformType/Social Platform/g' "$file"
  
  # Replace db.church with db.churches
  sed -i 's/db\.church\./db.churches./g' "$file"
done

echo "✅ Fixed database table references"
echo "📝 Running TypeScript compilation check..."
npm run test:compile
