import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    currency : Text;
    category : Text;
    imageUrl : Text;
    inStock : Bool;
  };

  module Product {
    public func compareByPrice(p1 : Product, p2 : Product) : Order.Order {
      if (p1.price < p2.price) {
        #less;
      } else if (p1.price > p2.price) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  type ProductInput = {
    name : Text;
    description : Text;
    price : Float;
    currency : Text;
    category : Text;
    imageUrl : Text;
    inStock : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  // Admin-only: Seed sample products
  public shared ({ caller }) func seedSampleProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };
    ignore addProductToStore(
      "Reusable Water Bottle",
      "Eco-friendly water bottle, BPA-free.",
      19.99,
      "USD",
      "Home",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=480&h=480&q=80",
      true,
    );
    ignore addProductToStore(
      "LED Desk Lamp",
      "Energy-efficient LED lamp with touch control.",
      29.95,
      "USD",
      "Office",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=480&h=480&q=80",
      true,
    );
    ignore addProductToStore(
      "Bluetooth Speaker",
      "Portable wireless speaker, water-resistant.",
      49.99,
      "USD",
      "Electronics",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=facearea&w=480&h=480&q=80",
      true,
    );
    ignore addProductToStore(
      "Yoga Mat",
      "Non-slip, eco-friendly yoga mat.",
      25.00,
      "USD",
      "Fitness",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=480&h=480&q=80",
      true,
    );
  };

  func addProductToStore(name : Text, description : Text, price : Float, currency : Text, category : Text, imageUrl : Text, inStock : Bool) : ?Nat {
    let product : Product = {
      id = nextId;
      name;
      description;
      price;
      currency;
      category;
      imageUrl;
      inStock;
    };
    if (products.containsKey(product.id)) {
      return null;
    };
    products.add(product.id, product);
    let currentId = nextId;
    nextId += 1;
    ?currentId;
  };

  // Public: Anyone can view products (including guests)
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Public: Anyone can search products (including guests)
  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text(searchTerm.toLower()));
      }
    );
    filtered;
  };

  // Public: Anyone can view sorted products (including guests)
  public query ({ caller }) func getProductsSortedByPrice() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  // Admin-only: Add new product
  public shared ({ caller }) func addProduct(productInput : ProductInput) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let product : Product = {
      id = nextId;
      name = productInput.name;
      description = productInput.description;
      price = productInput.price;
      currency = productInput.currency;
      category = productInput.category;
      imageUrl = productInput.imageUrl;
      inStock = productInput.inStock;
    };
    if (products.containsKey(product.id)) {
      return null;
    };
    products.add(product.id, product);
    let currentId = nextId;
    nextId += 1;
    ?currentId;
  };

  // Admin-only: Update existing product
  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  // Admin-only: Delete product
  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(id);
  };

  // Admin-only: Toggle product stock status
  public shared ({ caller }) func toggleProductStock(id : Nat, inStock : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle product stock");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct : Product = { product with inStock };
        products.add(id, updatedProduct);
      };
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
