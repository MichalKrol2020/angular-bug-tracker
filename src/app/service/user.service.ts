import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {CustomHttpResponse} from "../model/custom-http-response";
import {UserPageableResponse} from "../model/user-pageable-response";

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }


  public addUser(formData: FormData): Observable<User | HttpErrorResponse>
  {
    return this.httpClient.post<User>(`${this.host}/user`, formData)
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse>
  {
    return this.httpClient.put<User>(`${this.host}/user`, formData)
  }



  public sendResetPasswordEmail(email: string): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/user/account/email`, email);
  }

  public resetPassword(password: string, token: string): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/user/account/password?token=${token}`, password)
  }



  public activateAccount(token: string): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/user/account`, token)
  }



  public deleteUser(userId: number): Observable<any | HttpErrorResponse>
  {
    return this.httpClient.delete<User>(`${this.host}/user/${userId}`)
  }



  public getUsers(page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/users?page=${page}&size=${size}`)
  }


  public getUsersByFullName(fullName: string, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/users/name?fullName=${fullName}&page=${page}&size=${size}`)
  }


  public getUsersByRole(role: string, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/users/role?role=${role}&page=${page}&size=${size}`)
  }

  public getUsersByRoleAndFullName(role: string, fullName: string, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/users/role/name?role=${role}&fullName=${fullName}&page=${page}&size=${size}`)
  }

  public getUsersNotInProject(projectId: number, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/users/not-participants?projectId=${projectId}&page=${page}&size=${size}`)
  }

  public getUsersByFullNameAndNotInProject(fullName: string, projectId: number, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/users/name/not-participants?fullName=${fullName}&projectId=${projectId}&page=${page}&size=${size}`)
  }

  public getParticipantsByProjectId(projectId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/participants?projectId=${projectId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public getParticipantsByFullNameAndProjectId(fullName: string, projectId: number, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/participants/name?fullName=${fullName}&projectId=${projectId}&page=${page}&size=${size}`)
  }

  public getParticipantsByProjectIdAndExcludeParticipant(projectId: number, participantId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/participants/exclude?projectId=${projectId}&participantId=${participantId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public getParticipantsByFullNameAndProjectIdExcludeParticipant(fullName: string, projectId: number, participantId: number, page: number, size: number): Observable<UserPageableResponse>
  {
    return this.httpClient.get<UserPageableResponse>(`${this.host}/user/participants/name/exclude?fullName=${fullName}&projectId=${projectId}&participantId=${participantId}&page=${page}&size=${size}`)
  }

  public getUserById(userId: number): Observable<User>
  {
    return this.httpClient.get<User>(`${this.host}/user/${userId}`)
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse>
  {
    return this.httpClient.put<User>(`${this.host}/user`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData
  {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', profileImage);

    return formData;
  }

}

