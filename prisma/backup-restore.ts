#!/usr/bin/env node

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'backup':
      await backup()
      break
    case 'restore':
      await restore()
      break
    case 'status':
      await status()
      break
    case 'fresh':
      await fresh()
      break
    default:
      console.log(`
🔧 Database Backup & Restore Utility

Usage:
  npx tsx prisma/backup-restore.ts <command>

Commands:
  backup    - Create a database backup
  restore   - Restore from backup (not implemented - use seed instead)
  status    - Show database status and record counts
  fresh     - Reset database and apply production seed

Examples:
  npx tsx prisma/backup-restore.ts status
  npx tsx prisma/backup-restore.ts fresh
      `)
  }
}

async function backup() {
  console.log('📦 Creating database backup...')
  
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment')
    process.exit(1)
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = `backup-${timestamp}.sql`
  
  try {
    // Extract database info from URL
    const url = new URL(databaseUrl)
    const dbName = url.pathname.slice(1)
    
    console.log(`📋 Backing up database: ${dbName}`)
    
    execSync(`pg_dump "${databaseUrl}" > ${backupFile}`, { stdio: 'inherit' })
    console.log(`✅ Backup created: ${backupFile}`)
  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  }
}

async function restore() {
  console.log('🔄 Database restore not implemented')
  console.log('💡 Use "npm run db:seed:production" to restore production data')
}

async function status() {
  console.log('📊 Database Status')
  console.log('==================')
  
  try {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.questionTemplate.count(),
      prisma.userAttempt.count(),
      prisma.guide.count(),
      prisma.guideCategory.count(),
      prisma.score.count(),
      prisma.achievement.count(),
    ])
    
    console.log(`👥 Users: ${stats[0]}`)
    console.log(`❓ Question Templates: ${stats[1]}`)
    console.log(`📝 User Attempts: ${stats[2]}`)
    console.log(`📚 Guides: ${stats[3]}`)
    console.log(`📖 Guide Categories: ${stats[4]}`)
    console.log(`🏆 Scores: ${stats[5]}`)
    console.log(`🎯 Achievements: ${stats[6]}`)
    
    // Check migration status
    console.log('\\n🔧 Migration Status:')
    execSync('npx prisma migrate status', { stdio: 'inherit' })
    
  } catch (error) {
    console.error('❌ Failed to get database status:', error)
  }
}

async function fresh() {
  console.log('🔄 Resetting database to fresh production state...')
  
  try {
    console.log('1️⃣ Resetting migrations...')
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' })
    
    console.log('\\n2️⃣ Applying production seed...')
    execSync('npm run db:seed:production', { stdio: 'inherit' })
    
    console.log('\\n✅ Database reset to fresh production state!')
    
    // Show final status
    await status()
    
  } catch (error) {
    console.error('❌ Fresh setup failed:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Command failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })