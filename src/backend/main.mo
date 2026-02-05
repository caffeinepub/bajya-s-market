import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
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

  let products = Map.empty<Nat, Product>();
  var nextId = 1;

  public shared ({ caller }) func seedSampleProducts() : async () {
    ignore addProductToStore("Reusable Water Bottle", "Eco-friendly water bottle, BPA-free.", 19.99, "USD", "Home", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=480&h=480&q=80", true);
    ignore addProductToStore("LED Desk Lamp", "Energy-efficient LED lamp with touch control.", 29.95, "USD", "Office", "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=480&h=480&q=80", true);
    ignore addProductToStore("Bluetooth Speaker", "Portable wireless speaker, water-resistant.", 49.99, "USD", "Electronics", "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=facearea&w=480&h=480&q=80", true);
    ignore addProductToStore("Yoga Mat", "Non-slip, eco-friendly yoga mat.", 25.00, "USD", "Fitness", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=480&h=480&q=80", true);
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

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text(searchTerm.toLower()));
      }
    );
    filtered;
  };

  public query ({ caller }) func getProductsSortedByPrice() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  public shared ({ caller }) func addProduct(productInput : ProductInput) : async ?Nat {
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

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(id);
  };

  public shared ({ caller }) func toggleProductStock(id : Nat, inStock : Bool) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct : Product = { product with inStock };
        products.add(id, updatedProduct);
      };
    };
  };
};
