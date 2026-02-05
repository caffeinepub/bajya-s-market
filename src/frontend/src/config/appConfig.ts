/**
 * Application configuration for deployment and runtime settings.
 * This file serves as the single source of truth for deployment-related configuration.
 */

/**
 * The deployment slug/domain for this application.
 * Must contain only letters, numbers, and hyphens, and be between 5-50 characters.
 */
export const APP_SLUG = 'bajyasmarketshop';

/**
 * Application metadata
 */
export const APP_CONFIG = {
  slug: APP_SLUG,
  name: "bajya's market",
  tagline: "Low prices, high quality",
} as const;
