import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationValidators} from "../../validation/authentication-validators";
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {CustomHttpResponse} from "../../model/custom-http-response";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit
{
  public passwordFormGroup!: FormGroup;
  public captcha: string | undefined;

  private subscription: Subscription | undefined;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void
  {
    if(this.authenticationService.isLoggedIn())
    {
      this.router.navigateByUrl('/login');
    }

    this.createResetPasswordFormGroup();
  }

  private createResetPasswordFormGroup()
  {
    this.passwordFormGroup = this.formBuilder.group
    ({
        password: new FormControl('',[Validators.required, Validators.minLength(8)]),
        matchingPassword: new FormControl('', [Validators.required])
      },
      {
        validator: AuthenticationValidators.matchingPassword('password', 'matchingPassword')
      });
  }

  onSubmit()
  {
    if(this.passwordFormGroup.invalid)
    {
      this.passwordFormGroup.markAllAsTouched();
      return;
    }

    const token = this.route.snapshot.paramMap.get('token')!;
    if(token == null)
    {
      this.notificationService.notifyAboutError();
      return;
    }

    const password = this.getPassword()?.value;

    this.resetPassword(password, token);
  }

  private resetPassword(newPassword: string, token: string)
  {
    this.subscription =
      this.userService.resetPassword(newPassword, token).subscribe
      ({
        next: this.onPasswordChangedSuccessfully(),
        error: this.onError()
      });
  }

  private onPasswordChangedSuccessfully()
  {
    return (response: CustomHttpResponse) =>
    {
      this.passwordFormGroup.reset();
      this.notificationService.notify(NotificationType.SUCCESS, response.message);
    }
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.passwordFormGroup.reset();
      this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
    }
  }

  resolved(captchaResponse: string)
  {
    this.captcha = captchaResponse;
  }

  getPassword()
  {
    return this.passwordFormGroup.get('password');
  }

  getMatchingPassword()
  {
    return this.passwordFormGroup.get('matchingPassword');
  }

  ngOnDestroy()
  {
    this.subscription?.unsubscribe();
  }
}
