import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    currency: string;
    category: string;
    price: number;
}
export interface backendInterface {
    addProduct(productInput: {
        inStock: boolean;
        name: string;
        description: string;
        imageUrl: string;
        currency: string;
        category: string;
        price: number;
    }): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getProductsSortedByPrice(): Promise<Array<Product>>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    seedSampleProducts(): Promise<void>;
    toggleProductStock(id: bigint, inStock: boolean): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
