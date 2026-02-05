import { Actor, HttpAgent, type ActorSubclass } from '@icp-sdk/core/agent';
import { type backendInterface } from '../backend';
import { APP_SLUG } from './appConfig';

// Environment configuration
interface EnvConfig {
  canisterId: string;
  host: string;
  ii_derivation_origin?: string;
}

let cachedConfig: EnvConfig | null = null;

/**
 * Load configuration from environment
 * This function is used by the Internet Identity provider
 */
export async function loadConfig(): Promise<EnvConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Try to load from env.json (production)
    const response = await fetch('/env.json');
    if (response.ok) {
      const envData = await response.json();
      cachedConfig = {
        canisterId: envData.BACKEND_CANISTER_ID || envData.canisterId,
        host: envData.DFX_NETWORK === 'ic' ? 'https://icp-api.io' : 'http://localhost:4943',
        ii_derivation_origin: envData.II_DERIVATION_ORIGIN,
      };
      return cachedConfig;
    }
  } catch (error) {
    console.warn('Failed to load env.json, using fallback configuration');
  }

  // Fallback to environment variables (development)
  const isDevelopment = import.meta.env.DEV;
  cachedConfig = {
    canisterId: import.meta.env.VITE_BACKEND_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    host: isDevelopment ? 'http://localhost:4943' : 'https://icp-api.io',
    ii_derivation_origin: import.meta.env.VITE_II_DERIVATION_ORIGIN,
  };

  return cachedConfig;
}

/**
 * Actor creation options
 */
export interface ActorOptions {
  agentOptions?: {
    identity?: any;
    host?: string;
  };
}

/**
 * Create the IDL factory for the backend canister
 * This is a runtime interface definition for the canister methods
 */
function createIdlFactory() {
  return ({ IDL }: any) => {
    const ProductInput = IDL.Record({
      inStock: IDL.Bool,
      name: IDL.Text,
      description: IDL.Text,
      imageUrl: IDL.Text,
      currency: IDL.Text,
      category: IDL.Text,
      price: IDL.Float64,
    });
    const Product = IDL.Record({
      id: IDL.Nat,
      inStock: IDL.Bool,
      name: IDL.Text,
      description: IDL.Text,
      imageUrl: IDL.Text,
      currency: IDL.Text,
      category: IDL.Text,
      price: IDL.Float64,
    });
    const UserProfile = IDL.Record({
      name: IDL.Text,
    });
    const UserRole = IDL.Variant({
      admin: IDL.Null,
      user: IDL.Null,
      guest: IDL.Null,
    });
    return IDL.Service({
      addProduct: IDL.Func([ProductInput], [IDL.Opt(IDL.Nat)], []),
      assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
      deleteProduct: IDL.Func([IDL.Nat], [], []),
      getAllProducts: IDL.Func([], [IDL.Vec(Product)], ['query']),
      getCallerUserProfile: IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
      getCallerUserRole: IDL.Func([], [UserRole], ['query']),
      getProductsSortedByPrice: IDL.Func([], [IDL.Vec(Product)], ['query']),
      getUserProfile: IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
      isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
      saveCallerUserProfile: IDL.Func([UserProfile], [], []),
      searchProducts: IDL.Func([IDL.Text], [IDL.Vec(Product)], ['query']),
      seedSampleProducts: IDL.Func([], [], []),
      toggleProductStock: IDL.Func([IDL.Nat, IDL.Bool], [], []),
      updateProduct: IDL.Func([Product], [], []),
      _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    });
  };
}

/**
 * Create an actor for the backend canister with optional configuration
 * This is the main function used throughout the app to interact with the backend
 */
export async function createActorWithConfig(
  options?: ActorOptions
): Promise<ActorSubclass<backendInterface>> {
  const config = await loadConfig();
  const host = options?.agentOptions?.host || config.host;
  const identity = options?.agentOptions?.identity;

  const agent = await HttpAgent.create({
    host,
    identity,
  });

  // Fetch root key for local development
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
    }
  }

  const idlFactory = createIdlFactory();
  
  const actor = Actor.createActor(idlFactory as any, {
    agent,
    canisterId: config.canisterId,
  }) as ActorSubclass<backendInterface>;

  return actor;
}

/**
 * Get the backend canister ID
 */
export async function getCanisterId(): Promise<string> {
  const config = await loadConfig();
  return config.canisterId;
}

/**
 * Export app configuration
 */
export { APP_SLUG, APP_CONFIG } from './appConfig';
