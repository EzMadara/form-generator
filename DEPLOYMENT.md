# Vercel Deployment Guide

## ✅ Changes Completed

1. **Updated `package.json`**:
   - ✅ Added `postinstall` script to generate Prisma client after npm install
   - ✅ Updated `build` script to run Prisma migrations before building

2. **Updated `prisma/schema.prisma`**:
   - ✅ Changed database provider from `sqlite` to `postgresql`
   - ✅ Added binary targets for Vercel's Linux environment (`linux-musl-openssl-3.0.x`)

3. **Created PostgreSQL Migration**:
   - ✅ Created migration file: `prisma/migrations/20260109150934_migrate_to_postgresql/migration.sql`
   - ✅ Updated `migration_lock.toml` to use PostgreSQL

4. **Regenerated Prisma Client**:
   - ✅ Prisma client regenerated with PostgreSQL support

5. **Updated `.gitignore`**:
   - ✅ Added SQLite database files to ignore list

## ⚠️ Required Actions Before Deployment

### 1. Set Up PostgreSQL Database

SQLite doesn't work on Vercel's serverless platform. You need a PostgreSQL database. Options:

**Option A: Vercel Postgres (Recommended)**
1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Create a new Postgres database
4. Copy the connection string (it will be automatically added as `POSTGRES_PRISMA_URL` or `DATABASE_URL`)

**Option B: External Providers**
- [Neon](https://neon.tech) - Free tier available, great for serverless
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - Free tier available

### 2. Configure Environment Variables in Vercel

In your Vercel project settings → Environment Variables, add:

- `DATABASE_URL`: Your PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?sslmode=require`
  - If using Vercel Postgres, use the `POSTGRES_PRISMA_URL` or `POSTGRES_URL_NON_POOLING` variable they provide

### 3. Test Locally (Optional but Recommended)

Before deploying, test with PostgreSQL locally:

1. Set up a local PostgreSQL database or use a cloud database
2. Create a `.env` file with: `DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"`
3. Run migrations: `npx prisma migrate deploy`
4. Test your app: `npm run dev`

## 🚀 Deployment Steps

1. **Push your changes to GitHub/GitLab/Bitbucket**

2. **Import project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

3. **Configure environment variables**:
   - Add `DATABASE_URL` in Vercel project settings
   - Make sure to add it for Production, Preview, and Development environments

4. **Deploy**:
   - Vercel will automatically detect Next.js and run the build script
   - The build script will:
     - Generate Prisma client (`prisma generate`)
     - Run migrations (`prisma migrate deploy`)
     - Build Next.js app (`next build`)

## 📝 Important Notes

- **Database Migrations**: The `prisma migrate deploy` command runs during build, which applies pending migrations to your production database
- **Prisma Client**: The `postinstall` script ensures Prisma client is generated after `npm install` on Vercel
- **Binary Targets**: Added Linux binary targets so Prisma works on Vercel's serverless environment

## 🔍 Troubleshooting

If you encounter issues:

1. **Build fails with Prisma errors**: 
   - Check that `DATABASE_URL` is set correctly in Vercel
   - Verify your database is accessible from the internet
   - Check Vercel build logs for specific error messages

2. **Migration errors**:
   - Ensure migrations are committed to your repository
   - Check that the database connection string is correct
   - Verify database permissions allow schema changes

3. **Runtime errors**:
   - Check Vercel function logs
   - Verify Prisma client is being generated correctly
   - Ensure all environment variables are set

## ✅ Checklist

- [x] Updated package.json with postinstall and build scripts
- [x] Changed Prisma schema to PostgreSQL
- [x] Created PostgreSQL migration
- [x] Regenerated Prisma client
- [ ] Set up PostgreSQL database (Vercel Postgres or external provider)
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Test locally with PostgreSQL (optional)
- [ ] Push changes to repository
- [ ] Deploy to Vercel
- [ ] Verify deployment works correctly

