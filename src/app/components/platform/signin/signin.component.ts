/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import {Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'jv-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private auth:AuthService,private router:Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) 
    this.router.navigate(['/'])
  }

  login(){
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.auth.login(formData.email,formData.password)
      console.log(formData);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
