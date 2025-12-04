# Deployment Guide - RecruitAI

This guide covers deploying the RecruitAI platform to free hosting services.

## 🎯 Deployment Overview

- **Frontend:** Vercel (Free tier)
- **Backend:** Render (Free tier)
- **Database:** Railway PostgreSQL (Free tier)

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Railway account (sign up at railway.app) OR Render account (render.com)

## 🗄️ Step 1: Deploy Database

### Option A: Railway PostgreSQL

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Provision PostgreSQL"
3. Once created, click on the PostgreSQL service
4. Go to "Connect" tab and copy the `DATABASE_URL`
5. Go to "Data" tab → "Query" and run the schema:

```bash
# Copy the contents of BE/src/db/schema.sql and paste in the Query tab
```

6. (Optional) Seed data:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed
railway run npm run seed --dir BE
```

### Option B: Supabase PostgreSQL

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Wait for database to be ready
4. Go to "SQL Editor" → "New Query"
5. Paste contents of `BE/src/db/schema.sql` and run
6. Go to "Settings" → "Database" and copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password

### Option C: Render PostgreSQL

1. Go to [Render](https://render.com)
2. Click "New +" → "PostgreSQL"
3. Choose free tier
4. Once created, copy the "Internal Database URL"
5. Connect using a PostgreSQL client and run `BE/src/db/schema.sql`

## 🚀 Step 2: Deploy Backend

### Option A: Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Add variables" and add:
   ```
   DATABASE_URL=<your-database-url-from-step-1>
   JWT_SECRET=<generate-random-string>
   NODE_ENV=production
   PORT=4000
   ```
5. Go to "Settings":
   - Root Directory: `BE`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Click "Deploy"
7. Once deployed, go to "Settings" → "Networking" → "Generate Domain"
8. Copy the domain URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `recruitai-backend`
   - Root Directory: `BE`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=<your-database-url-from-step-1>
   JWT_SECRET=<generate-random-string>
   NODE_ENV=production
   PORT=4000
   ```
6. Choose "Free" plan
7. Click "Create Web Service"
8. Wait for deployment (first deploy takes 5-10 minutes)
9. Copy the service URL (e.g., `https://recruitai-backend.onrender.com`)

### Verify Backend Deployment

Visit `https://your-backend-url/health` - you should see:
```json
{"status": "ok"}
```

## 🎨 Step 3: Deploy Frontend

### Vercel Deployment

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `FE`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url-from-step-2>
   ```
   Example: `https://recruitai-backend.railway.app`
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy the deployment URL (e.g., `https://recruitai.vercel.app`)

### Verify Frontend Deployment

1. Visit your Vercel URL
2. You should see the RecruitAI homepage
3. Click "Start Searching" and try a search
4. If it works, deployment is successful!

## 🔧 Step 4: Post-Deployment Configuration

### Update CORS Settings (Backend)

If you get CORS errors, update `BE/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}));
```

Redeploy the backend after this change.

### Update Environment Variables

If you need to change environment variables:

**Railway:**
1. Go to your project → Service → Variables
2. Update the variable
3. Service will automatically redeploy

**Render:**
1. Go to your service → Environment
2. Update the variable
3. Click "Save Changes"
4. Manually trigger redeploy if needed

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Update the variable
3. Redeploy from Deployments tab

## 📊 Step 5: Seed Sample Data (Optional)

### Using Railway CLI:
```bash
railway login
railway link
railway run npm run seed --dir BE
```

### Using Render:
```bash
# SSH into your Render service
# (Available in paid plans only)
```

### Manual Seeding:
1. Connect to your database using a PostgreSQL client
2. Run the seed queries manually from `BE/src/seed.ts`

## 🔍 Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- Check logs in Railway/Render dashboard
- Verify DATABASE_URL is correct
- Ensure all environment variables are set
- Check if database schema is initialized

**Problem:** Database connection fails
- Verify DATABASE_URL format
- Check if database is running
- Ensure IP whitelist includes Railway/Render IPs (if applicable)

**Problem:** 502 Bad Gateway
- Backend might be starting up (wait 1-2 minutes)
- Check if PORT environment variable is set correctly
- Review application logs for errors

### Frontend Issues

**Problem:** API calls fail
- Verify NEXT_PUBLIC_API_URL is correct
- Check browser console for CORS errors
- Ensure backend is deployed and healthy
- Test backend health endpoint directly

**Problem:** Build fails
- Check Vercel build logs
- Verify all dependencies are in package.json
- Ensure TypeScript has no errors
- Check if environment variables are set

**Problem:** 404 on routes
- Ensure Next.js App Router structure is correct
- Check if all pages are in `src/app` directory
- Verify dynamic routes are properly named

## 🔒 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update DATABASE_URL password
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Review rate limiting settings
- [ ] Set up database backups
- [ ] Enable error monitoring (Sentry, LogRocket)
- [ ] Review and remove any console.logs with sensitive data

## 📈 Monitoring

### Railway
- View logs: Project → Service → Logs
- View metrics: Project → Service → Metrics
- Set up alerts: Project → Service → Settings → Alerts

### Render
- View logs: Service → Logs
- View metrics: Service → Metrics
- Set up alerts: Service → Settings → Alerts

### Vercel
- View logs: Project → Deployments → [Deployment] → Logs
- View analytics: Project → Analytics
- Set up monitoring: Project → Settings → Monitoring

## 🎉 Success!

Your RecruitAI platform should now be fully deployed and accessible at:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app` or `https://your-backend.onrender.com`

## 📝 Update README

Don't forget to update the README.md with your live URLs:

```markdown
## 🚀 Live Demo

**Frontend:** https://your-app.vercel.app
**Backend API:** https://your-backend.railway.app
```

## 🔄 Continuous Deployment

All platforms support automatic deployments:

- **Push to main branch** → Automatic deployment
- **Pull requests** → Preview deployments (Vercel)
- **Rollback** → One-click rollback to previous deployment

## 💰 Cost Considerations

### Free Tier Limits:

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Railway:**
- $5 free credit/month
- ~500 hours of runtime
- 1 GB RAM, 1 vCPU

**Render:**
- 750 hours/month (enough for 1 service 24/7)
- 512 MB RAM
- Spins down after 15 min of inactivity

---

Need help? Check the logs first, then review this guide. Most issues are related to environment variables or database connectivity.
