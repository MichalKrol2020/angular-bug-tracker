import {AuthenticationService} from "../../service/authentication.service";
import {NotificationService} from "../../service/notification.service";
import {UserService} from "../../service/user.service";

import {Component, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {FormControl, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.css']
})
export class ResetPasswordEmailComponent implements OnInit
{
  public emailFormControl!: FormControl;
  public captcha: string | undefined;

  private subscription: Subscription | undefined;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private userService: UserService,
              private router: Router)
  {}

  ngOnInit(): void
  {
    if(this.authenticationService.isLoggedIn())
    {
      this.router.navigateByUrl('/home');
    }

    this.emailFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  }

  onSubmit(): void
  {
    if(this.emailFormControl.invalid)
    {
      this.emailFormControl.markAllAsTouched();
      return;
    }

    const email = this.emailFormControl.value;
    this.sendResetPasswordEmail(email);
  }

  private sendResetPasswordEmail(email: string): void
  {
    this.subscription =
    this.userService.sendResetPasswordEmail(email).subscribe
    (
      {
        next: this.onEmailSentSuccessfully(),
        error: this.onError()
      }
    );
  }


  private onEmailSentSuccessfully()
  {
    return (response: CustomHttpResponse) =>
    {
      this.emailFormControl.reset();
      this.notificationService.notify(NotificationType.SUCCESS, response.message);
    }
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
    }
  }

  resolved(captchaResponse: string): void
  {
    this.captcha = captchaResponse;
  }

  ngOnDestroy(): void
  {
    this.subscription?.unsubscribe();
  }
}
