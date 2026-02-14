#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/workspaces/PURPOSE-DRIVEN')

print("🚀 ENTERPRISE DEPLOYMENT PROTOCOL")
print("="*60)

try:
    # Git add
    print("\n📝 Staging changes...")
    result = subprocess.run(['git', 'add', '-A'], capture_output=True, text=True, check=True)
    print("✅ Files staged")
    
    # Git commit
    print("\n💾 Committing...")
    commit_msg = """CRITICAL: Enhanced database logging & connection testing

- Added detailed error logging in lib/auth.ts
- Added pgbouncer validation in lib/db.ts
- Added startup connection test
- Enabled production warning logs
- Removed fallback auth references

AUDIT: Database verified, 2 users confirmed"""
    
    result = subprocess.run(['git', 'commit', '-m', commit_msg], capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Commit created")
        print(f"   {result.stdout.strip()}")
    elif 'nothing to commit' in result.stdout:
        print("⚠️  Nothing to commit (already committed)")
    else:
        print(f"❌ Commit failed: {result.stderr}")
        sys.exit(1)
    
    # Git push
    print("\n🌐 Pushing to GitHub...")
    result = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True, check=True)
    print("✅ Pushed successfully")
    print(f"   {result.stderr.strip()}")
    
    print("\n" + "="*60)
    print("✅ DEPLOYMENT COMPLETE!")
    print("\n⏳ Vercel will rebuild (ETA: 2-3 minutes)")
    print("\n📋 NEXT: Test login at https://khesed-tek-cms-org.vercel.app/auth/signin")
    print("   Credentials: admin@iglesiacentral.com / password123")
    
except subprocess.CalledProcessError as e:
    print(f"\n❌ ERROR: {e}")
    print(f"   stdout: {e.stdout}")
    print(f"   stderr: {e.stderr}")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ UNEXPECTED ERROR: {e}")
    sys.exit(1)
