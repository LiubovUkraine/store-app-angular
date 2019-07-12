import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './../login.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  public userId: string;
  public store: TItem[];
  public item: TItem;
  public buttonName: string = 'add item to cart';

  private _paramsIdSub: Subscription;
  private _storeSub: Subscription;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this._loginService.createStore();

    this._paramsIdSub = this._route.queryParams.subscribe((params) => {
      if (params) {
        this.userId = params.id;
      }
    });

    this._storeSub = this._loginService.getStoreItems$().subscribe((store) => {
      if (store) {
        this.store = store;
      }
    });
  }

  public logout() {
    this._loginService.logoutFromFB();
  }

  public goToCart() {
    this._router.navigate(['/cart'], {
      queryParams: { id: this.userId },
    });
  }

  public addItemToCart(item: TItem) {
    item.isAddedToCart = true;
    this._loginService.addItemToCart(this.userId, item);
  }

  ngOnDestroy() {
    this._paramsIdSub.unsubscribe();
    this._storeSub.unsubscribe();
  }
}
