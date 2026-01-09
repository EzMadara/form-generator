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

### 1. Set Up PostgreSQL Database (Neon)

**Note:** Vercel Postgres has been deprecated. Vercel now offers Neon through their Storage/Marketplace.

SQLite doesn't work on Vercel's serverless platform. You need a PostgreSQL database.

**Recommended: Neon via Vercel (Easiest)**
1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create New**
3. Select **Neon**
4. Connect it to your Vercel project
5. Vercel automatically creates the database and adds environment variables (`DATABASE_URL`, `POSTGRES_URL`)
6. Free tier: 3 GB storage, unlimited compute

**Alternative: Set up Neon separately**
1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Create a new project
3. Copy the connection string
4. Manually add it to Vercel as `DATABASE_URL` environment variable

**Other Providers:**
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - Free tier available

### 2. Configure Environment Variables in Vercel

**If you created Neon through Vercel Storage:**
- Environment variables are automatically added! (`DATABASE_URL`, `POSTGRES_URL`)
- You can verify in **Settings** → **Environment Variables**

**If you set up Neon separately:**
- Go to **Settings** → **Environment Variables**
- Add `DATABASE_URL` with your Neon connection string
- Format: `postgresql://user:password@host:port/database?sslmode=require`

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

