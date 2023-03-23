import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthenticationRequest} from "../model/authentication/authentication-request";
import {RegisterRequest} from "../model/authentication/register-request";
import {CustomHttpResponse} from "../model/custom-http-response";
import {UserRole} from "../enum/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService
{
  public host = environment.apiUrl;
  private token = '';
  private loggedInUsername = '';
  private jwtHelperService = new JwtHelperService();

  constructor(private httpClient: HttpClient) {}



  public login(request: AuthenticationRequest): Observable<HttpResponse<User>>
  {
    return this.httpClient.post<User>(`${this.host}/authentication/login`, request, {observe: `response`});
  }



  public register(request: RegisterRequest): Observable<CustomHttpResponse>
  {
    return this.httpClient.post<CustomHttpResponse>
    (`${this.host}/authentication/register`, request)
  }



  public logOut(): void
  {
    this.token = '';
    this.loggedInUsername = '';

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }



  // -saves token in the local storage
  public saveToken(token: string): void
  {
    this.token = token!;

    localStorage.setItem('token', token!);
  }



  public addUserToLocalStorage(response: User | null): void
  {
    localStorage.setItem('user', JSON.stringify(response));
  }


  public getUserFromLocalCache(): User
  {
    return JSON.parse(localStorage.getItem('user')!);
  }

  public isUser()
  {
    return this.getUserFromLocalCache().role == UserRole.ROLE_USER;
  }

  public isProjectLeader()
  {
    return this.getUserFromLocalCache().role == UserRole.ROLE_PROJECT_LEADER;
  }

  public loadToken(): void
  {
    this.token = localStorage.getItem('token')!;
  }



  getToken(): string
  {
    return this.token;
  }



  public isLoggedIn(): boolean
  {
    this.loadToken();

    if(this.token != null && this.token !== '')
    {
      if(this.jwtHelperService.decodeToken(this.token).sub != null || '')
      {
        if(!this.jwtHelperService.isTokenExpired(this.token))
        {
          this.loggedInUsername = this.jwtHelperService.decodeToken(this.token).sub;
          return true;
        }
      }
    }else
    {
      this.logOut();
    }

    return false;
  }
}
