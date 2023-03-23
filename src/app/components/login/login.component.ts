import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {NotificationService} from "../../service/notification.service";
import {Subscription} from "rxjs";
import {HeaderTypeEnum} from "../../enum/header-type.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpResponse} from "@angular/common/http";
import {AuthenticationRequest} from "../../model/authentication/authentication-request";
import {User} from "../../model/user";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy
{

  public showLoading: boolean = false;
  public loginFormGroup!: FormGroup;


  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void
  {
    if(this.authenticationService.isLoggedIn())
    {
      this.router.navigateByUrl('/home/cockpit');
    } else
    {
      this.router.navigateByUrl('/login');
    }

    this.createLoginFormGroup();
  }

  private createLoginFormGroup()
  {
    this.loginFormGroup = this.formBuilder.group
    (
      {
        email: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', [Validators.required, Validators.minLength(2)])
      }
    );
  }

  onSubmit(): void
  {
    if(this.loginFormGroup.invalid)
    {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.showLoading = true;
    let request = new AuthenticationRequest();
    request.email = this.loginFormGroup.get('email')?.value;
    request.password = this.loginFormGroup.get('password')?.value;
    this.onLogin(request);
  }


  onLogin(request: AuthenticationRequest): void
  {
    this.subscriptions.push
    (
      this.authenticationService.login(request).subscribe
      ({
        next: (response: HttpResponse<User>) =>
        {
          this.showLoading = false;

          const token = response.headers.get(HeaderTypeEnum.JWT_TOKEN);

          this.authenticationService.saveToken(token!);
          this.authenticationService.addUserToLocalStorage(response.body);

          this.router.navigateByUrl('/home/cockpit');
          },
        error: (httpErrorResponse) =>
        {
          this.showLoading = false;
          this.notificationService.sendErrorNotification(httpErrorResponse.error.message);
        }
      })
    );
  }


  ngOnDestroy(): void
  {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  getEmailFormControl()
  {
    return this.loginFormGroup.get('email');
  }

  getPasswordFormControl()
  {
    return this.loginFormGroup.get('password');
  }

}
