import { createActorWithConfig } from '../config';
import { ConfigurationError } from '../lib/errors';

/**
 * Non-blocking runtime smoke check to verify backend connectivity
 * Logs results without throwing errors
 */
export async function runRuntimeSmokeCheck(): Promise<void> {
  console.log('[Smoke Check] ═══════════════════════════════════════════════');
  console.log('[Smoke Check] Starting deployment verification...');
  console.log('[Smoke Check] Timestamp:', new Date().toISOString());
  
  try {
    console.log('[Smoke Check] Step 1: Loading runtime configuration...');
    
    const actor = await createActorWithConfig();
    
    console.log('[Smoke Check] ✓ Configuration loaded successfully');
    console.log('[Smoke Check] Step 2: Testing backend connectivity...');
    
    // Attempt to fetch products as a basic connectivity test
    const products = await actor.getAllProducts();
    
    console.log('[Smoke Check] ✓ Backend reachable and responding');
    console.log(`[Smoke Check] ✓ Found ${products.length} products in the store`);
    console.log('[Smoke Check] ═══════════════════════════════════════════════');
    console.log('[Smoke Check] ✅ All checks passed - Application is ready');
    console.log('[Smoke Check] ═══════════════════════════════════════════════');
  } catch (error) {
    console.log('[Smoke Check] ═══════════════════════════════════════════════');
    
    if (error instanceof ConfigurationError) {
      console.error('[Smoke Check] ❌ CONFIGURATION ERROR');
      console.error('[Smoke Check] ═══════════════════════════════════════════════');
      console.error('[Smoke Check] Error:', error.message);
      console.error('[Smoke Check]');
      console.error('[Smoke Check] This indicates that the runtime configuration (env.json) is:');
      console.error('[Smoke Check]   • Missing from the deployment');
      console.error('[Smoke Check]   • Contains a placeholder instead of actual canister ID');
      console.error('[Smoke Check]   • Not accessible due to network/CORS issues');
      console.error('[Smoke Check]');
      console.error('[Smoke Check] Required fix:');
      console.error('[Smoke Check]   1. Verify env.json exists at: https://<canister-id>.icp0.io/env.json');
      console.error('[Smoke Check]   2. Check that BACKEND_CANISTER_ID is set to actual IC mainnet canister ID');
      console.error('[Smoke Check]   3. Ensure DFX_NETWORK is set to "ic" for production');
      console.error('[Smoke Check]   4. Redeploy with correct configuration');
      console.error('[Smoke Check] ═══════════════════════════════════════════════');
    } else {
      console.error('[Smoke Check] ❌ BACKEND CONNECTIVITY ERROR');
      console.error('[Smoke Check] ═══════════════════════════════════════════════');
      console.error('[Smoke Check] Error:', error);
      console.error('[Smoke Check]');
      console.error('[Smoke Check] This indicates that:');
      console.error('[Smoke Check]   • The backend canister is not responding');
      console.error('[Smoke Check]   • The canister ID in env.json is incorrect');
      console.error('[Smoke Check]   • Network connectivity issues to IC mainnet');
      console.error('[Smoke Check]   • The backend canister is not deployed or stopped');
      console.error('[Smoke Check]');
      console.error('[Smoke Check] Troubleshooting:');
      console.error('[Smoke Check]   1. Verify backend canister is deployed: dfx canister status <canister-id> --network ic');
      console.error('[Smoke Check]   2. Test backend directly: dfx canister call <canister-id> getAllProducts --network ic');
      console.error('[Smoke Check]   3. Check IC dashboard: https://dashboard.internetcomputer.org/canister/<canister-id>');
      console.error('[Smoke Check] ═══════════════════════════════════════════════');
    }
    
    // Don't throw - this is informational only
  }
}
