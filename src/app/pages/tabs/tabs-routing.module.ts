import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TabsPage} from './tabs.page';

import {ClientGuard} from "../../services/client.guard";
import {RoleGuard} from "../../services/role.guard";

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        canActivate:[RoleGuard],
        children: [
            {
                path: '',
                redirectTo: '/tabs/myAds',
                pathMatch: 'full'
            },
            {
                path: 'myAds',
                canActivate: [ClientGuard],
                loadChildren: () => import('./my-ads/my-ads.module').then(m => m.MyAdsPageModule)
            },
            {
                path: 'sellers',
                canActivate: [ClientGuard],
                loadChildren: () => import('./sellers/sellers.module').then( m => m.SellersPageModule)
            },
            {
                path: 'allAds',
                loadChildren: () => import('./all-ads/all-ads.module').then( m => m.AllAdsPageModule)
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
