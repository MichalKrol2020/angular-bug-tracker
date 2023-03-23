import { Injectable } from '@angular/core';
import {NotifierService} from "angular-notifier";
import {NotificationType} from "../enum/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class NotificationService
{
  constructor(private notifierService: NotifierService) { }

  public notify(type: NotificationType, message: string)
  {
    this.notifierService.notify(type, message);
  }

  public notifyAboutError()
  {
    this.notifierService.notify(NotificationType.ERROR, 'An error occurred! Please try again later.')
  }

  sendSuccessNotification(successMessage: string): void
  {
    this.notifierService.notify(NotificationType.SUCCESS, successMessage);
  }

  sendErrorNotification(errorMessage: string): void
  {
    if(errorMessage)
    {
      this.notifierService.notify(NotificationType.ERROR, errorMessage);
    } else
    {
      this.notifyAboutError();
    }
  }
}
