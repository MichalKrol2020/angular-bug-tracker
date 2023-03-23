import {AuthenticationService} from "../../service/authentication.service";
import {UserNotificationService} from "../../service/user-notification.service";

import {Notification} from "../../model/notification";

import {Component, HostListener, OnInit} from '@angular/core';
import {DateUtils} from "../../utils/date-utils";
import {NotificationPageableResponse} from "../../model/notification-pageable-response";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.css']
})
export class UserNotificationComponent implements OnInit
{
  private currentUserId: number;

  public notifications: Notification[] = [];
  private page: number = 0;
  private readonly size: number = 4;
  private isEndOfPages: boolean = false;
  public countNotificationsUnseen: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(private userNotificationService: UserNotificationService,
              private authenticationService: AuthenticationService,
              private router: Router)
  {
    this.currentUserId = this.authenticationService.getUserFromLocalCache().id;
  }

  ngOnInit(): void
  {
    this.getNotificationsByReceiver();
    this.getNotificationsUnseenCount();
  }

  private getNotificationsByReceiver(): void
  {
    this.subscriptions.push(
      this.userNotificationService.getNotificationsByReceiver(this.currentUserId, this.page, this.size).subscribe
      (this.processResult()));
  }

  private getNotificationsUnseenCount(): void
  {
    this.subscriptions.push(
    this.userNotificationService.getCountNotificationsUnseen(this.currentUserId).subscribe
    ((response: number) => this.countNotificationsUnseen = response));
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void
  {
    const target = event.target as HTMLElement;
    const scrolled: boolean = target.scrollTop + target.offsetHeight >= target.scrollHeight - 1;
    if(scrolled && !this.isEndOfPages)
    {
      this.page++;
      this.getNotificationsByReceiver();
    }
  }

  getTimeSinceSendDate(notification: Notification): string
  {
    return DateUtils.getRelativeTimeSince(notification.sendDate);
  }

  onClickNotification(notification: Notification): void
  {
    this.setNotificationSeen(notification);
    this.navigateToSelectedNotificationPage(notification);
  }


  private setNotificationSeen(notification: Notification): void
  {
    if(notification.seen)
    {
      return;
    }

    this.subscriptions.push(
    this.userNotificationService.setNotificationSeen(notification.id).subscribe
    (() => {
      notification.seen = true;
      this.countNotificationsUnseen--;
    }));
  }

  private navigateToSelectedNotificationPage(notification: Notification): void
  {
    this.subscriptions.push(
      this.userNotificationService.getIndexOfNotificationRecord(notification.id, this.currentUserId).subscribe((index: number) =>
      {
        this.router.navigateByUrl(`/home/notifications/select/${notification.id}/${index}`)
      }));
  }

  private processResult()
  {
    return (data: NotificationPageableResponse) =>
    {
      this.notifications.push(...data.content);
      this.page = data.pageable.pageNumber;
      this.isEndOfPages = this.page >= data.totalPages;
    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach
    ((subscription) => subscription.unsubscribe());
  }
}
