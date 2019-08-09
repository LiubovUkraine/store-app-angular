import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';
import { ResetComponent } from './reset/reset.component';
import { StoreComponent } from './store/store.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'store', component: StoreComponent, canActivate: [AuthGuard] },
  { path: 'store/: id', component: StoreComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'cart/: id', component: CartComponent },
  { path: '**', component: LoginComponent },
];
