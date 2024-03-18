
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/platform/dashboard/index/index.component';
import { SigninComponent } from './components/platform/signin/signin.component';
import { GameOnlineComponent } from './components/platform/game-interface/game-online/game-online.component';
import { ProfileComponent } from './components/platform/profile/profile.component';
import { SignupComponent } from './components/platform/signup/signup.component';
import { BlogComponent } from './components/platform/social/blog/blog.component';
import { BlogPageComponent } from './components/platform/social/blog/blog-page/blog-page.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'login', component: SigninComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'game-online', component: GameOnlineComponent,canActivate:[AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent,canActivate:[AuthGuard] },
  { path: 'blog', component: BlogComponent ,canActivate:[AuthGuard]},
  { path: 'blog/:user/:post', component: BlogPageComponent,canActivate:[AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
