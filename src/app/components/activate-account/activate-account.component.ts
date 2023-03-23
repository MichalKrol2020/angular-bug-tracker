import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {AuthenticationService} from "../../service/authentication.service";
import {CustomHttpResponse} from "../../model/custom-http-response";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit
{
  public isActivationSuccessful: boolean | undefined;

  private subscription: Subscription | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService
              ) {}

  ngOnInit(): void
  {
    if(this.authenticationService.isLoggedIn())
    {
      this.router.navigateByUrl('/home');
    }

    this.onActivateAccount();
  }

  private onActivateAccount()
  {
    const token = this.route.snapshot.paramMap.get('token');
    if(token == null)
    {
      this.notificationService.notifyAboutError();
      return;
    }

    this.activateAccount(token);
  }

  private activateAccount(token: string)
  {
    this.subscription =
    this.userService.activateAccount(token).subscribe
    ({
      next: this.onAccountActivatedSuccessfully(),
      error: this.onError()
    });
  }


  private onAccountActivatedSuccessfully()
  {
    return (response: CustomHttpResponse) =>
    {
      this.isActivationSuccessful = true;
      this.notificationService.notify(NotificationType.SUCCESS, response.message);
    }
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.isActivationSuccessful = false;
      this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
    }
  }

  ngOnDestroy()
  {
    this.subscription?.unsubscribe();
  }
}

