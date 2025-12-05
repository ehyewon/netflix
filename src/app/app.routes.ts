import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { HomeMainComponent } from './components/home/main/home-main.component';
import { HomeWishlistComponent } from './components/home/wishlist/home-wishlist.component';
import { HomeSearchComponent } from './components/search/home-search.component';
import { HomePopularComponent } from './components/home/popular/home-popular.component';
import { MovieDetailComponent } from './views/movie-detail/movie-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeMainComponent
      },
      {
        path: 'popular',
        component: HomePopularComponent
      },
      {
        path: 'wishlist',
        component: HomeWishlistComponent
      },
      {
        path: 'search',
        component: HomeSearchComponent
      },
      {
        path: 'movie/:id',
        component: MovieDetailComponent
      }

    ]
  },
  {
    path: 'signin',
    component: SignInComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// auth.guard.ts


