import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:3333/api'

  user !: User;
  
  constructor(private http: HttpClient,private router:Router) {
  
  }

  login(email:string,password:string){
      this.http.post<{access_token: string}>(this.apiUrl+'/auth/signin',{email,password}).subscribe(
        token => {
          localStorage.setItem('access_token', token.access_token );
          this.getUserFromToken(token.access_token);
        }
      )
  }

  signup(email:string,password:string,username:string){
    this.http.post<{access_token: string}>(this.apiUrl+'/auth/signup',{email,password,username}).subscribe(
      token => {
        localStorage.setItem('access_token', token.access_token );
        this.getUserFromToken(token.access_token);
      }
    )
  }

  isLoggedIn():boolean{
     const token = localStorage.getItem('access_token')
     console.log(this.user)
    return  !!token
  }

  logout(){
    localStorage.removeItem('access_token')
    window.location.reload();
  }

  autoLogin(){
    const token = localStorage.getItem('access_token')
    if(token)
    this.getUserFromToken(token)
    //this.router.navigate(['../'])
  }


  getUserFromToken(token: string) {
    this.http.get<User>(this.apiUrl+'/users/token/'+token).subscribe(user => {
      this.user = user ;
      if(user) this.router.navigate(['/'])
      console.log(user);
    });
  }

  getAccessToken(){
    return localStorage.getItem('access_token')
  }

  getUserFromName(name: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${name}`);
  }


}
  

