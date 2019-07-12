import { Subscription } from 'rxjs';
import { LoginService } from './../login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { pluck, switchMap, tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  public userId: string;
  public cart: TCart = {
    items: [],
    countOfItems: 0,
    totalPriceOfItems: 0,
  };
  public noItemsMassageIsShown: boolean = false;

  private _sub: Subscription;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this._sub = this._route.queryParams
      .pipe(
        debounceTime(1000),
        pluck('id'),
        tap((id: string) => {
          this.userId = id;
        }),
        switchMap((id: string) => this._loginService.getUserInfoFromDb$(id)),
      )
      .subscribe((user) => {
        if (user && user.cart.items) {
          this.cart.items = Object.values(user.cart.items);

          if (this.cart.items) {
            this.cart.countOfItems = this.cart.items.length;
            this.cart.totalPriceOfItems = this._loginService.countTotalPriceOfItemsInCart(
              this.cart.items,
            );
          }
        }

        if (!this.cart.items.length) {
          this.noItemsMassageIsShown = true;
        }
      });
  }

  public logout() {
    this._loginService.logoutFromFB();
  }

  public deleteItemsFromCart(item?) {
    arguments.length && this.cart.items.length > 1
      ? this.cart.items.splice(this.cart.items.indexOf(item), 1)
      : (this.cart.items = []);

    this._loginService.deleteItemsFromUserCart(this.userId, this.cart.items);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
