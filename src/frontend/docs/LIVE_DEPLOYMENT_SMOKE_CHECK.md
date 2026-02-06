# Live Deployment Smoke Check

This checklist helps verify that the frontend is correctly deployed and can communicate with the backend canister on the Internet Computer mainnet.

## Prerequisites

- The backend canister must be deployed to the IC mainnet
- You must have the backend canister ID
- The frontend must be built and deployed

## Deployment Configuration Checklist

### 1. Verify env.json Configuration

The `env.json` file must be present at the root of the deployed frontend with the correct values:

**Required format:**
