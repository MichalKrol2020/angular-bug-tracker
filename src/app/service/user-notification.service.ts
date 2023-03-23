import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {NotificationPageableResponse} from "../model/notification-pageable-response";

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService
{
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getNotificationsByReceiver(receiverId: number, page: number, size: number): Observable<NotificationPageableResponse>
  {
    return this.httpClient.get<NotificationPageableResponse>(`${this.host}/notification?receiverId=${receiverId}&page=${page}&size=${size}`)
  }

  public getCountNotificationsUnseen(receiverId: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/notification/${receiverId}/unseen`)
  }

  public getIndexOfNotificationRecord(notificationId: number, receiverId: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/notification/index/${notificationId}/${receiverId}`)
  }

  public setNotificationSeen(notificationId: number): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/notification/${notificationId}/seen`, null);
  }
}

