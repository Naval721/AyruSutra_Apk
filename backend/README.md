# AyurSutra Backend (AWS Lambda + Supabase)

This backend provides serverless functions for AI and automation while keeping Supabase for auth, data, and RLS.

## Functions

### HTTP APIs (API Gateway)
- **assistant**: Answers patient questions using OpenAI, tailored by dosha/context
- **daily-report**: Generates daily wellness tip based on patient profile

### Scheduled Functions (CloudWatch Events)
- **enqueue-reminders**: Enqueues notification jobs into Supabase (runs every 5 minutes)
- **send-notifications**: Sends FCM notifications and marks jobs sent (runs every 5 minutes)

## Environment Variables

Set these in each Lambda function's configuration:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
FCM_SERVER_KEY=your-firebase-server-key  # Only for send-notifications
```

## Quick Deploy (AWS Console)

### 1. Create Lambda Functions
Create 4 Lambda functions with Node.js 20.x runtime:

- `ayursutra-assistant` (HTTP API)
- `ayursutra-daily-report` (HTTP API) 
- `ayursutra-enqueue-reminders` (Scheduled)
- `ayursutra-send-notifications` (Scheduled)

### 2. Set Environment Variables
Add the environment variables above to each function.

### 3. Create API Gateway (for HTTP functions)
- Create HTTP API
- Add routes: `/assistant` → `ayursutra-assistant`, `/daily-report` → `ayursutra-daily-report`
- Enable CORS
- Deploy to stage

### 4. Create CloudWatch Schedules (for scheduled functions)
- **enqueue-reminders**: `cron(0/5 * * * ? *)` (every 5 minutes)
- **send-notifications**: `cron(0/5 * * * ? *)` (every 5 minutes)

### 5. Copy Function Code
Copy the corresponding `index.js` from `lambda/<function-name>/index.js` as the handler code.

## Advanced Deploy (CDK)

Use the provided CDK template for infrastructure as code:

```bash
cd backend
npm install
npx cdk deploy
```

## Local Development

```bash
cd backend
npm install
npm run build  # Creates deployment packages
```

## Testing

### HTTP Functions
```bash
curl -X POST https://your-api-gateway-url/assistant \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What should I eat before therapy?", "context": {"dosha": "vata"}}'
```

### Scheduled Functions
Test via AWS Console Lambda test events or CloudWatch Logs.

## Architecture

```
Frontend (React) 
    ↓ (API calls)
API Gateway → Lambda (assistant, daily-report)
    ↓ (data)
Supabase (auth, profiles, therapies, feedback)

CloudWatch Events → Lambda (enqueue-reminders, send-notifications)
    ↓ (notifications)
Firebase FCM → Mobile devices
```

## Security

- Service role key is never exposed to frontend
- RLS policies protect Supabase data
- API Gateway handles CORS and rate limiting
- Lambda functions have minimal IAM permissions

