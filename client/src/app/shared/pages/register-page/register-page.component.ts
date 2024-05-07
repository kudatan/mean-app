import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DestroySubscription} from "../../helpers/destroy-subscription";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {takeUntil} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {MaterialService} from "../../helpers/material.service";

@Component({
  selector: 'app-register-page',
  standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,
        NgClass
    ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent extends DestroySubscription implements OnInit {
  registerForm!: FormGroup;
  minLengthPassword = 5;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(this.minLengthPassword)])
    });
  }

  onSubmit() {
    this.registerForm.disable();
    this.auth.register(this.registerForm.value).pipe(takeUntil(this.destroyStream$)).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        });
      },
      error => {
        MaterialService.toast(error.error.message);
        this.registerForm.enable();
      }
    )
  }
}
