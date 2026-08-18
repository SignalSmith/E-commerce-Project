export interface signUp {
     name: string,
     pasword: string,
     email: string
}

export interface Login {
     password: string,
     email: string
}

export interface productType {
     name: string,
     price?: number,
     color: string,
     description: string,
     image: string,
     id: string
     quantity: undefined | number;
}

export interface cart {
     name: string;
  price?: number;
  color: string;
  description: string;
  image: string;
  id?: string;
  quantity: undefined | number;
  userId: string;
  productId: string;
}

export interface priceSummary{ 
     price: number ; 
     discount : number ; 
     tax : number ; 
     delivery: number ; 
     total: number ;
}

export interface checkoutData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  payment: string;

  totalPrice: number;
  userId: string;
  id: string | undefined;

  // Product information
  productName?: string;
  price?: number;
  quantity?: number;
  description?: string;
  image?: string;

  // Order information
  date?: string;

  orderGroupId?: string;
}

export interface OrderGroup {
  orderGroupId: string;
  orderId: string;
  date?: string;
  totalPrice: number;
  products: checkoutData[];
}