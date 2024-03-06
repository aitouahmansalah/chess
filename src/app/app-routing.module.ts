
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './platform/signin/signin.component';
import { IndexComponent } from './platform/dashboard/index/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'signin', component: SigninComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
