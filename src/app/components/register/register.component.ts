import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationValidators} from "../../validation/authentication-validators";
import {AuthenticationService} from "../../service/authentication.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {userSpecialitySelectData} from "../../const/user-speciality-select-data";
import {RegisterRequest} from "../../model/authentication/register-request";
import {CustomHttpResponse} from "../../model/custom-http-response";
import {HttpErrorResponse} from "@angular/common/http";
import {UserEnumMapper} from "../../enum/mapper/user-enum-mapper";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerFormGroup!: FormGroup;
  public showLoading: boolean = false;
  public readonly userSpecialities = userSpecialitySelectData;

  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit(): void
  {
    if(this.authenticationService.isLoggedIn())
    {
      this.router.navigateByUrl('/home');
    }

    this.createRegisterFormGroup();
  }

  private createRegisterFormGroup()
  {
    this.registerFormGroup = this.formBuilder.group
    (
      {
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        speciality: new FormControl('', [Validators.required]),
        matchingPassword: new FormControl('')
      },
      {
        validators: AuthenticationValidators.matchingPassword('password', 'matchingPassword')
      }
    );
  }

  onSubmit()
  {
    if(this.registerFormGroup.invalid)
    {
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    let request = new RegisterRequest();
    request.firstName = this.getFirstName()?.value;
    request.lastName = this.getLastName()?.value;
    request.email = this.getEmail()?.value;
    request.speciality = this.getUserSpecialityEnumName();
    request.password = this.getPassword()?.value;

    this.register(request);
  }

  private getUserSpecialityEnumName()
  {
    const speciality = this.getSpeciality()?.value;
    return UserEnumMapper.mapSpecialityToEnumName(speciality);
  }

  private register(request: RegisterRequest)
  {
    this.subscriptions.push(
      this.authenticationService.register(request).subscribe(
        {
          next: this.onRegisteredSuccessfully(),
          error: this.onError()
        }));
  }

  private onRegisteredSuccessfully()
  {
    return (response: CustomHttpResponse) =>
    {
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

  ngOnDestroy()
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }


  getFirstName()
  {
    return this.registerFormGroup.get('firstName');
  }

  getLastName()
  {
    return this.registerFormGroup.get('lastName');
  }

  getEmail()
  {
    return this.registerFormGroup.get('email');
  }

  getSpeciality()
  {
    return this.registerFormGroup.get('speciality');
  }

  getPassword()
  {
    return this.registerFormGroup.get('password');
  }

  getMatchingPassword()
  {
    return this.registerFormGroup.get('matchingPassword');
  }
}
