import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../service/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>>
  {
    if(httpRequest.url.includes(`${this.authenticationService.host}/authentication/login`))
    {
      return httpHandler.handle(httpRequest);
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/authentication/register`))
    {
      return httpHandler.handle(httpRequest);
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/user/account/email`))
    {
      return httpHandler.handle(httpRequest);
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/user/account/password`))
    {
      return httpHandler.handle(httpRequest);
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/user/account`))
    {
      return httpHandler.handle(httpRequest);
    }

    if(httpRequest.url.includes(`${this.authenticationService.host}/user/confirm`))
    {
      return httpHandler.handle(httpRequest);
    }

    this.authenticationService.loadToken();

    const token = this.authenticationService.getToken();
    const request = httpRequest.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return httpHandler.handle(request);
  }
}
