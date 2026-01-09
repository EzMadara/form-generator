# Fix Failed Migration Issue

## Problem
The migration failed because it used SQLite syntax (`DATETIME`) instead of PostgreSQL syntax (`TIMESTAMP`).

## ✅ What I Fixed
- Updated `prisma/migrations/20251210195908_init/migration.sql` to use PostgreSQL syntax
- Removed duplicate migration

## 🔧 How to Resolve the Failed Migration

You have two options:

### Option 1: Reset Database (Easiest - if database is empty/new)

If your Neon database is new and doesn't have important data:

1. **In Neon Dashboard:**
   - Go to your project
   - Delete the database (or drop all tables)
   - Create a fresh database

2. **Redeploy on Vercel:**
   - The migration will run fresh and should work now

### Option 2: Mark Migration as Applied (if table was created)

If the table was partially created, you can mark the migration as applied:

1. **Connect to your database** (via Neon dashboard SQL editor or psql)

2. **Check if the table exists:**
   ```sql
   SELECT * FROM "_prisma_migrations";
   ```

3. **If the Invoice table exists but migration failed:**
   - You can manually mark it as applied
   - Or drop the table and let migration recreate it

4. **Or use Prisma migrate resolve:**
   ```bash
   npx prisma migrate resolve --applied 20251210195908_init
   ```

### Option 3: Manual Fix (Recommended for Production)

1. **Connect to your Neon database** (via SQL editor in Neon dashboard)

2. **Check current state:**
   ```sql
   -- Check if Invoice table exists
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'Invoice';
   
   -- Check migration status
   SELECT * FROM "_prisma_migrations";
   ```

3. **If table doesn't exist, drop the failed migration record:**
   ```sql
   DELETE FROM "_prisma_migrations" WHERE migration_name = '20251210195908_init';
   ```

4. **Redeploy** - The fixed migration will run

5. **If table exists but is incomplete:**
   ```sql
   -- Drop the table
   DROP TABLE IF EXISTS "Invoice";
   
   -- Remove migration record
   DELETE FROM "_prisma_migrations" WHERE migration_name = '20251210195908_init';
   ```

6. **Redeploy** - Migration will recreate the table correctly

## 🚀 Quick Fix (Recommended)

Since you just set up the database, the easiest solution is:

1. **In Neon Dashboard:**
   - Go to your project → SQL Editor
   - Run this to check and clean up:
   ```sql
   -- Drop the Invoice table if it exists
   DROP TABLE IF EXISTS "Invoice" CASCADE;
   
   -- Remove failed migration record
   DELETE FROM "_prisma_migrations" WHERE migration_name = '20251210195908_init';
   ```

2. **Redeploy on Vercel:**
   - Push your code (with the fixed migration)
   - Vercel will run the build again
   - The migration should now succeed

## ✅ After Fixing

Once the migration succeeds, your deployment should work! The fixed migration file is now in your repository and will work correctly.

