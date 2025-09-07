# AyurSutra Backend Deployment Guide

## Quick Start (AWS Console)

### 1. Create Lambda Functions

Create 4 Lambda functions in AWS Console with Node.js 20.x runtime:

#### HTTP Functions (API Gateway)
- **Function Name**: `ayursutra-assistant`
- **Function Name**: `ayursutra-daily-report`

#### Scheduled Functions (CloudWatch Events)
- **Function Name**: `ayursutra-enqueue-reminders`
- **Function Name**: `ayursutra-send-notifications`

### 2. Set Environment Variables

Add these environment variables to each Lambda function:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
FCM_SERVER_KEY=your-firebase-server-key  # Only for send-notifications
```

### 3. Create API Gateway

1. Create HTTP API
2. Add routes:
   - `POST /assistant` → `ayursutra-assistant`
   - `POST /daily-report` → `ayursutra-daily-report`
3. Enable CORS
4. Deploy to stage

### 4. Create CloudWatch Schedules

#### Enqueue Reminders
- **Rule Name**: `ayursutra-enqueue-reminders`
- **Schedule**: `cron(0/5 * * * ? *)` (every 5 minutes)
- **Target**: `ayursutra-enqueue-reminders` Lambda

#### Send Notifications
- **Rule Name**: `ayursutra-send-notifications`
- **Schedule**: `cron(0/5 * * * ? *)` (every 5 minutes)
- **Target**: `ayursutra-send-notifications` Lambda

### 5. Copy Function Code

Copy the corresponding `index.js` from `lambda/<function-name>/index.js` as the handler code for each Lambda.

## Advanced Deployment (CDK)

### Prerequisites

```bash
# Install AWS CDK
npm install -g aws-cdk

# Configure AWS CLI
aws configure
```

### Deploy

```bash
cd backend

# Copy environment template
cp env.example .env
# Edit .env with your values

# Install dependencies
npm install

# Deploy
npm run deploy
```

### Environment Variables for CDK

Set these before deployment:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export OPENAI_API_KEY="your-openai-api-key"
export FCM_SERVER_KEY="your-firebase-server-key"
export CDK_DEFAULT_ACCOUNT="123456789012"
export CDK_DEFAULT_REGION="us-east-1"
```

## Testing

### Test HTTP Endpoints

```bash
# Test Assistant
curl -X POST https://your-api-gateway-url/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What should I eat before my therapy session?",
    "context": {
      "user_id": "user-123",
      "dosha": "vata"
    }
  }'

# Test Daily Report
curl -X POST https://your-api-gateway-url/daily-report \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "user_id": "user-123",
      "dosha": "pitta"
    }
  }'
```

### Test Scheduled Functions

1. Go to AWS Lambda Console
2. Select the function
3. Click "Test"
4. Use empty event `{}`
5. Check CloudWatch Logs for output

## Frontend Integration

After deployment, add these to your frontend `.env`:

```bash
VITE_ASSISTANT_URL=https://your-api-gateway-url/assistant
VITE_DAILY_REPORT_URL=https://your-api-gateway-url/daily-report
```

## Monitoring

### CloudWatch Logs

- `/aws/lambda/ayursutra-assistant`
- `/aws/lambda/ayursutra-daily-report`
- `/aws/lambda/ayursutra-enqueue-reminders`
- `/aws/lambda/ayursutra-send-notifications`

### CloudWatch Metrics

Monitor:
- Invocations
- Errors
- Duration
- Throttles

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API Gateway has CORS enabled
2. **Timeout Errors**: Increase Lambda timeout (max 15 minutes)
3. **Permission Errors**: Check IAM roles and policies
4. **Environment Variables**: Verify all required env vars are set

### Debug Steps

1. Check CloudWatch Logs
2. Test individual Lambda functions
3. Verify API Gateway integration
4. Check CloudWatch Events rules

## Cost Optimization

- Use provisioned concurrency for high-traffic functions
- Set appropriate memory sizes (128MB for scheduled, 256MB for HTTP)
- Monitor and adjust timeout values
- Use CloudWatch alarms for cost monitoring

