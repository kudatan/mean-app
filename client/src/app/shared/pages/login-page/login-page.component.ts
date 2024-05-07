import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {takeUntil} from "rxjs";
import {DestroySubscription} from "../../helpers/destroy-subscription";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../../helpers/material.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent extends DestroySubscription implements OnInit {
  loginForm!: FormGroup;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }


  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Now you can use login');
      } else if (params['accessDenied']) {
        MaterialService.toast('First login in system');
      } else if (params['sessionFailed']){
        MaterialService.toast('Token expired. PLease login again');
      }
    })
  }

  onSubmit() {
    this.loginForm.disable();
    this.auth.login(this.loginForm.value).pipe(takeUntil(this.destroyStream$)).subscribe(
      () => {
        this.router.navigate(['/overview']);
      },
      error => {
        MaterialService.toast(error.error.message);
        console.warn(error);
        this.loginForm.enable();
      }
    )
  }
}
