import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { StockComponent } from './pages/stock/stock.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { AuthguardService } from './services/auth-jwt-services/authguard.service';
import { PartListComponent } from './pages/part-list/part-list.component';

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'stock',
    component: StockComponent,
    canActivate: [ AuthguardService ]
  },
  {
    path:'tasks',
    component: TasksComponent,
    canActivate: [ AuthguardService ]
  },
  {
    path:'plans',
    component: PartListComponent,
    canActivate: [ AuthguardService ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }