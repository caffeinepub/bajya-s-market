import { createActorWithConfig } from '../config';
import { ConfigurationError } from '../lib/errors';

/**
 * Non-blocking runtime smoke check to verify backend connectivity
 * Logs results without throwing errors
 */
export async function runRuntimeSmokeCheck(): Promise<void> {
  try {
    console.log('[Smoke Check] Starting backend connectivity check...');
    
    const actor = await createActorWithConfig();
    
    // Attempt to fetch products as a basic connectivity test
    const products = await actor.getAllProducts();
    
    console.log(`[Smoke Check] ✓ Backend reachable. Found ${products.length} products.`);
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error('[Smoke Check] ✗ Configuration error:', error.message);
      console.error('[Smoke Check] The application cannot start without valid backend configuration.');
    } else {
      console.warn('[Smoke Check] ✗ Backend connectivity issue:', error);
    }
    // Don't throw - this is informational only
  }
}
