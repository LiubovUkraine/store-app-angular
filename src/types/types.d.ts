type TUser = {
  id: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
  cart: TCart;
};

type TCart = {
  items: TItem[];
  countOfItems: number;
  totalPriceOfItems: number;
};

type TItem = {
  id: number;
  name: string;
  price: number;
  isAddedToCart: boolean;
};
