import { Routes } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contactus', component: ContactComponent},
    { path: 'dishdetail/:id', component: DishdetailComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent }
];