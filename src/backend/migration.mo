import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextId : Nat;
  };

  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    currency : Text;
    category : Text;
    imageUrl : Text;
    inStock : Bool;
  };

  type OldUserProfile = {
    name : Text;
  };

  type ExternalSource = {
    #shopify;
    #manual;
    #other : Text;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    currency : Text;
    category : Text;
    imageUrl : Text;
    inStock : Bool;
    externalId : ?Text;
    externalSource : ?ExternalSource;
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          externalId = null;
          externalSource = null;
        };
      }
    );
    {
      old with
      products = newProducts
    };
  };
};
