import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    externalSource?: ExternalSource;
    inStock: boolean;
    externalId?: string;
    name: string;
    description: string;
    imageUrl: string;
    currency: string;
    category: string;
    price: number;
}
export type ExternalSource = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "shopify";
    shopify: null;
} | {
    __kind__: "manual";
    manual: null;
};
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    externalSource?: ExternalSource;
    inStock: boolean;
    externalId?: string;
    name: string;
    description: string;
    imageUrl: string;
    currency: string;
    category: string;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(productInput: ProductInput): Promise<bigint | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUpsertShopifyProducts(productsInput: Array<ProductInput>): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductsSortedByPrice(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    seedSampleProducts(): Promise<void>;
    toggleProductStock(id: bigint, inStock: boolean): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
