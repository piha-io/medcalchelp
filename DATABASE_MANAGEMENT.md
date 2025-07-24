# Database Migration & Seeding System

## Overview

The database system has been completely restructured for production reliability. All migration conflicts have been resolved, and a comprehensive seeding system provides realistic demo data including fake users for populated leaderboards.

## Migration System

### Current State
- **Clean baseline migration**: Single migration `20250724033543_baseline_schema` 
- **No conflicts**: All enum value conflicts resolved
- **Production ready**: Builds succeed consistently

### Key Files
- `prisma/migrations/20250724033543_baseline_schema/`: Clean baseline migration
- `prisma/schema.prisma`: Source of truth for database schema
- `prisma/migrations/migration_lock.toml`: PostgreSQL provider lock

## Seeding System

### Production Seed (`seed-production.ts`)
**Purpose**: Complete production-ready data including realistic users and activity

**Contains**:
- ✅ **9 Question Templates** - Covering all medical math types
- ✅ **5 Guide Categories** - Organized learning paths  
- ✅ **10 Guide Concepts** - Key learning concepts
- ✅ **Sample Guides** - With proper mathematical notation
- ✅ **20 Fake Users** - Realistic names, emails, profiles
- ✅ **1000+ User Attempts** - Spanning 30 days for scoring
- ✅ **Realistic Scores** - Daily, weekly, monthly, all-time
- ✅ **Achievements** - Progress-based unlocks
- ✅ **Leaderboard Data** - Populated rankings

### Development Seed (`seed-dev.ts`)
**Purpose**: Extends production seed with development-specific data

**Adds**:
- ✅ **Test User**: `test@medcalchelp.com` / `testuser`
- ✅ **High Scores**: 1500 points for testing
- ✅ **Multiple Achievements**: For UI testing
- ✅ **Recent Activity**: For testing time-based features

### Legacy Seeds (Preserved)
- `seed.ts` - Original question templates
- `seed-guides.ts` - Comprehensive guides content
- Other seed files maintained for reference

## Database Management Commands

### Essential Commands

```bash
# Reset to clean production state
npm run db:reset                # Reset migrations and DB
npm run db:seed:production      # Apply production seed

# Development setup  
npm run db:seed:dev            # Production + development data

# Migration management
npm run db:migrate             # Apply pending migrations
npm run db:push                # Push schema changes (dev only)
npm run db:generate            # Regenerate Prisma client

# Utilities
npx tsx prisma/backup-restore.ts status  # Check database status
npx tsx prisma/backup-restore.ts fresh   # Full reset + seed
```

### Backup & Restore Utility

The `backup-restore.ts` script provides database management tools:

```bash
# Check database status and record counts
npx tsx prisma/backup-restore.ts status

# Reset to fresh production state
npx tsx prisma/backup-restore.ts fresh

# Create database backup (PostgreSQL only)
npx tsx prisma/backup-restore.ts backup
```

## Production Deployment Recovery

If you encounter database issues in production, follow these steps:

### Option 1: Quick Recovery (Recommended)
```bash
# Reset and restore production state
npm run db:reset
npm run db:seed:production
```

### Option 2: Manual Steps
```bash
# 1. Check current state
npx prisma migrate status

# 2. Reset if needed
npx prisma migrate reset --force

# 3. Apply production seed
npm run db:seed:production

# 4. Verify
npx tsx prisma/backup-restore.ts status
```

### Option 3: Using Utility Script
```bash
# One command to reset everything
npx tsx prisma/backup-restore.ts fresh
```

## Expected Database State After Seeding

```
📊 Database Status
==================
👥 Users: 20
❓ Question Templates: 9  
📝 User Attempts: 1000+
📚 Guides: 1+
📖 Guide Categories: 5
🏆 Scores: 20
🎯 Achievements: 30+

Migration Status: Up to date ✅
```

## Troubleshooting

### Common Issues

**Build fails with enum conflicts**
```bash
npm run db:reset
npm run db:seed:production
```

**Empty leaderboards**
```bash
npm run db:seed:production  # Adds 20 fake users with scores
```

**Missing question templates**
```bash
# Check if templates exist
npx tsx prisma/backup-restore.ts status

# If count is 0, reseed
npm run db:seed:production
```

**Migration out of sync**
```bash
npx prisma migrate status
npx prisma migrate resolve --applied <migration-name>  # If needed
```

### Database Connection Issues

1. **Check environment variables**:
   - `DATABASE_URL` is set correctly
   - Database server is running

2. **Test connection**:
   ```bash
   npx prisma db pull  # Test connection
   npx prisma studio   # Open database browser
   ```

## File Structure

```
prisma/
├── migrations/
│   └── 20250724033543_baseline_schema/  # Clean baseline
├── schema.prisma                        # Schema definition
├── seed-production.ts                   # Production seed ⭐
├── seed-dev.ts                         # Development seed ⭐
├── backup-restore.ts                   # Utility script ⭐
└── migrations-backup/                  # Old migrations (backup)
```

## Development Workflow

### Making Schema Changes
1. Edit `prisma/schema.prisma`
2. Create migration: `npm run db:migrate`
3. Update seed files if needed
4. Test: `npm run db:seed:production`

### Adding New Seed Data
1. Edit `seed-production.ts` for core data
2. Edit `seed-dev.ts` for development extras
3. Test changes: `npm run db:seed:production`

### Testing Migration Changes
```bash
# Test full reset cycle
npm run db:reset
npm run db:seed:production
npx tsx prisma/backup-restore.ts status
```

## Security Notes

- **Production**: Use `seed-production.ts` only
- **Development**: Use `seed-dev.ts` for extra test data
- **Fake data**: All generated users have realistic but fake information
- **Test account**: `test@medcalchelp.com` only exists in development seed

## Benefits Achieved

✅ **Clean Migration History** - Single baseline migration  
✅ **No Build Failures** - Enum conflicts resolved  
✅ **Populated Leaderboards** - 20+ realistic users with activity  
✅ **Realistic Demo Data** - 1000+ attempts, scores, achievements  
✅ **Easy Recovery** - Simple commands to restore production state  
✅ **Developer Experience** - Clear separation of dev vs production data  
✅ **Maintainable** - Well-documented utility scripts  

## Contact & Support

If you encounter issues:
1. Check this documentation first
2. Run `npx tsx prisma/backup-restore.ts status` to diagnose
3. Use `npx tsx prisma/backup-restore.ts fresh` for full reset
4. Review the troubleshooting section above