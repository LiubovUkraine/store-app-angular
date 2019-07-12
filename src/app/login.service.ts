import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public user: TUser = {
    id: '',
    email: '',
    password: '',
    isLoggedIn: false,
    cart: {
      items: [],
      countOfItems: 0,
      totalPriceOfItems: 0,
    },
  };

  public store: TItem[] = [
    {
      id: 0,
      name: 'wine',
      price: 3.7,
      isAddedToCart: false,
    },
    {
      id: 1,
      name: 'beer',
      price: 2.4,
      isAddedToCart: false,
    },
    {
      id: 2,
      name: 'water',
      price: 9.3,
      isAddedToCart: false,
    },
    {
      id: 3,
      name: 'cider',
      price: 26.4,
      isAddedToCart: false,
    },
    {
      id: 4,
      name: 'lemonade',
      price: 2,
      isAddedToCart: false,
    },
    {
      id: 5,
      name: 'whisky',
      price: 2.4,
      isAddedToCart: false,
    },
    {
      id: 6,
      name: 'mohito',
      price: 8.9,
      isAddedToCart: false,
    },
    {
      id: 7,
      name: 'milk',
      price: 12.4,
      isAddedToCart: false,
    },
    {
      id: 8,
      name: 'juce',
      price: 6.4,
      isAddedToCart: false,
    },
    {
      id: 9,
      name: 'berliner luft',
      price: 17.3,
      isAddedToCart: false,
    },
  ];

  constructor(
    private db: AngularFireDatabase,
    private _authService: AuthService,
    public af: AngularFireAuth,
  ) {}

  public required(fieldName: string, formGroup: FormGroup) {
    return formGroup.get(fieldName).hasError('required') && formGroup.get(fieldName).touched;
  }

  public invalid(fieldName: string, formGroup: FormGroup) {
    return (
      formGroup.get(fieldName).hasError('invalidPassword') &&
      formGroup.get(fieldName).dirty &&
      !this.required(fieldName, formGroup) &&
      !this.wrongMinLength(fieldName, formGroup)
    );
  }

  public wrongMinLength(fieldName: string, formGroup: FormGroup) {
    return (
      formGroup.controls[fieldName].value !== '' &&
      formGroup.controls[fieldName].errors &&
      formGroup.controls[fieldName].errors.minlength
    );
  }

  public addUserInDb(formGroup: FormGroup): void {
    this.user.email = formGroup.controls['email'].value;
    this.user.isLoggedIn = true;
    this.user.password = formGroup.controls['password'].value;

    this.db.list('/users').set(`user${this.user.id}`, this.user);

    console.log('user added in FB');
    debugger;
  }

  public getUserInfoFromDb$(userId: string): Observable<TUser> {
    return this.db.object<TUser>(`/users/user${userId}`).valueChanges();
  }

  public createStore() {
    this.db.object('/store').update(this.store);
  }

  public getStoreItems$(): Observable<TItem[]> {
    return this.db.list<TItem>('/store').valueChanges();
  }

  public updateItemIsAddedToCard(item: TItem) {
    this.db.object('/store').update(item.isAddedToCart);
  }

  public isLoggedIn() {
    return this.af.authState.pipe(first());
  }

  public signupToFB(email: string, password: string) {
    this._authService.signup(email, password);
    email = password = '';
    if (this._authService.userDetails) {
      this.isLoggedIn()
        ? (this.user.id = this._authService.userDetails.uid)
        : console.log('Firebase auth error/// no login// no uid');
      console.log(this.user.id);
    }
  }

  public logoutFromFB() {
    this._authService.logout();
  }

  public addItemToCart(userId: string, item: TItem) {
    this.db.list('/users').update(`user${userId}/cart/items/item${item.id}`, item);
  }

  public countTotalPriceOfItemsInCart(items) {
    return items.reduce((sum, item) => (sum += item.price), 0);
  }
  public deleteItemsFromUserCart(userId: string, items: TItem[]) {
    let myItems = [];

    myItems = [...items] || items;
    this.db.list('/users').set(`user${userId}/cart/items`, items);
  }
}
