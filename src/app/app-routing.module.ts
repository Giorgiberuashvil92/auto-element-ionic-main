import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

import {RoleGuard} from "./services/role.guard";
import {AuthGuard} from "./services/auth.guard";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'tabs',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
    },
    {
        path: 'languages',
        loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesPageModule)
    },
    {
        path: 'auth',
        canActivate: [RoleGuard],
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
    },
    {
        path: 'sellers/edit',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/edit-seller/edit-seller.module').then(m => m.EditSellerPageModule)
    },
    {
        path: 'state',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/state-repair/state-repair.module').then(m => m.StateRepairPageModule)
    },
    {
        path: 'subscriptions',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/subscriptions/subscription-list/subscription-list.module').then(m => m.SubscriptionListPageModule)
    },
    {
        path: 'subscriptions/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/subscriptions/subscription-detail/subscription-detail.module').then(m => m.SubscriptionDetailPageModule)
    },
    {
        path: 'agreement',
        loadChildren: () => import('./pages/agreement/agreement.module').then(m => m.AgreementPageModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
    },
    {
        path: 'tabs',
        canActivate: [AuthGuard],
        //resolve: [StitchResolver],
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'addAds',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/add-ads/add-ads.module').then(m => m.AddAdsPageModule)
    },
    {
        path: 'detail/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailPageModule)
    },
    {
        path: 'seller/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/detail-seller/detail-seller.module').then(m => m.DetailSellerPageModule)
    },
    {
        path: 'seller/:ad/:offer/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/detail-seller/detail-seller.module').then(m => m.DetailSellerPageModule)
    },
    {
        path: 'messages/:ad/:offer/:to',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule)
    },
    {
        path: 'rating',
        loadChildren: () => import('./pages/rating-info/rating-info.module').then(m => m.RatingInfoPageModule)
    },
//   {
//     path: 'promo-offers',
//     loadChildren: () => import('./pages/promo-offers/promo-offers.module').then( m => m.PromoOffersPageModule)
//   }



];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
