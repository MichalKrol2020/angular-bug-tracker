import {AuthenticationService} from "../../service/authentication.service";
import {UserNotificationService} from "../../service/user-notification.service";

import {Notification} from "../../model/notification";

import {ActivatedRoute, Params} from "@angular/router";
import {Component, HostListener, OnInit} from '@angular/core';
import {DateUtils} from "../../utils/date-utils";
import {mergeMap, Subscription} from "rxjs";
import {NotificationPageableResponse} from "../../model/notification-pageable-response";
import {PageUtils} from "../../utils/page-utils";

@Component({
  selector: 'app-user-notification-page',
  templateUrl: './user-notification-page.component.html',
  styleUrls: ['./user-notification-page.component.css']
})
export class UserNotificationPageComponent implements OnInit
{
  private currentNotificationId: number | undefined;
  public notifications: Notification[] = [];
  private readonly receiverId: number;

  public readonly maxPagesNumberToShow = 6;

  public pageNumber: number = 1;
  public readonly minPageSize: number = 3;
  public pageSize: number;
  public totalElements!: number;

  public isAnimationEnd: boolean | undefined;

  private currentPageHeight: number;
  private readonly divider: number = 200;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private userNotificationService: UserNotificationService)
  {
    this.receiverId = this.authenticationService.getUserFromLocalCache().id;
    this.pageSize = PageUtils.calculatePageSize(this.divider, this.minPageSize);
    this.currentPageHeight = window.innerHeight;
  }

  ngOnInit(): void
  {
    this.listNotifications();
  }

  private listNotifications(): void
  {
    const hasNotificationId: boolean = this.route.snapshot.paramMap.has('notificationId');
    const hasIndex: boolean = this.route.snapshot.paramMap.has('index');

    if(!hasNotificationId || !hasIndex)
    {
      this.getNotificationsByReceiver();
    } else
    {
      this.getNotificationsPageWithSelectedNotification();
    }
  }


  private getNotificationsPageWithSelectedNotification(): void
  {
    this.subscriptions.push(
    this.route.params.pipe(mergeMap((response: Params) =>
    {
      const notificationId: number = Number(response['notificationId']);
      const index: number = Number(response['index']);

      if(!isNaN(notificationId) && !isNaN(index))
      {
        if(notificationId >= 0 && index >= 0)
        {
          this.isAnimationEnd = false;
          this.currentNotificationId = notificationId;
          const pageNumberOfSelectedNotification = this.getNotificationPageNumber(response);
          return this.userNotificationService.getNotificationsByReceiver(this.receiverId, pageNumberOfSelectedNotification - 1, this.pageSize)
        }
      }

      return this.userNotificationService.getNotificationsByReceiver(this.receiverId, this.pageNumber - 1, this.pageSize)
    })).subscribe(this.processResults()));
  }


  private getNotificationPageNumber(response: Params): number
  {
    const index = Number(response['index']);
    return Math.floor(index / this.pageSize) + 1;
  }

  public getNotificationsByReceiver(): void
  {
    this.isAnimationEnd = true;
    this.subscriptions.push(
    this.userNotificationService.getNotificationsByReceiver(this.receiverId, this.pageNumber - 1, this.pageSize).subscribe
    (this.processResults()));
  }

  public getAnimationClass(notification: Notification): string
  {
    const animateNotification: boolean = this.currentNotificationId == notification.id && !this.isAnimationEnd;
    return animateNotification ? 'blink_me' : '';
  }

  @HostListener('window:resize', ['$event'])
  private onResize(): void
  {
    const countedSize = PageUtils.calculatePageSizeWithPrevention
    (this.currentPageHeight, window.innerHeight, this.divider, this.minPageSize, this.pageSize);
    if(countedSize == -1)
    {
      return;
    }

    this.setPageData(countedSize);
    this.getNotificationsByReceiver();
  }

  private setPageData(countedSize: number): void
  {
    this.pageSize = countedSize;
    this.currentPageHeight = window.innerHeight;
    this.pageNumber = 1;
  }

  public getTimeSinceSendDate(notification: Notification): string
  {
    return DateUtils.getRelativeTimeSince(notification.sendDate);
  }

  private processResults()
  {
    return (data: NotificationPageableResponse | undefined) =>
    {
      if(data)
      {
        this.notifications = data.content;
        this.pageNumber = data.pageable.pageNumber + 1;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
      }

    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}
