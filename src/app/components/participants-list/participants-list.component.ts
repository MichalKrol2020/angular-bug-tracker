import {Project} from "../../model/project";
import {User} from "../../model/user";

import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";
import {UserService} from "../../service/user.service";

import {Component, Input, NgZone, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {DialogUtils} from "../../utils/dialog-utils";
import {inOut} from "../../const/animations";
import {MatDialog} from "@angular/material/dialog";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {NotificationType} from "../../enum/notification-type.enum";
import {tableParticipantsData} from "../../const/table-headers-data";
import {UserPageableResponse} from "../../model/user-pageable-response";
import {UserSortOrderEnum} from "../../enum/user-sort-order.enum";

import {
  CONFIRM_BUTTON_TEXT,
  DOT,
  NEXT_LINE,
  PARTICIPANT_NOTIFIED,
  THIS_CANNOT_BE_UNDONE,
  TRYING_TO_UNASSIGN,
  UNASSIGN_PARTICIPANT_DIALOG_TITLE,
  WHITESPACE
} from "../../const/dialog-const";



@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.css'],
  animations: [inOut]
})
export class ParticipantsListComponent implements OnInit {

  @Input() project: Project | undefined;
  @Input() projectExpanded$: Observable<boolean> = new Observable<boolean>();

  public isProjectExpanded: boolean = false;

  public readonly tableData = tableParticipantsData;

  public participants: User[] = [];
  public pageNumber: number = 1;
  public pageSize: number = 5;
  public totalElements: number = 0;

  private orderBy: string = UserSortOrderEnum.FIRST_NAME;
  protected isAscending: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(private zone: NgZone,
              private dialog: MatDialog,
              private userService: UserService,
              private projectService: ProjectService,
              private notificationService: NotificationService)
  {}

  public ngOnInit(): void
  {
    this.onProjectExpanded();
    this.listParticipants();
  }

  private onProjectExpanded(): void
  {
    this.subscriptions.push(
    this.projectExpanded$.subscribe((response) =>
    {
      this.isProjectExpanded = response;
    }));
  }

  public listParticipants(): void
  {
    if(!this.project)
    {
      this.notificationService.notifyAboutError();
      return;
    }

    this.userService.getParticipantsByProjectId(this.project.id, this.pageNumber - 1, this.pageSize, this.orderBy, this.isAscending).subscribe
    (this.processResult());
  }

  public onUnassignParticipant(participant: User)
  {
    const dialogRef = this.openUnassignParticipantDialog(participant);

    this.subscriptions.push(
    dialogRef.afterClosed().pipe(mergeMap((confirmed: boolean) =>
    {
      if(!this.project)
      {
        return of(undefined);
      }

      if(confirmed)
      {
        return this.projectService.unassignParticipant(this.project.id, participant.id);
      }

      return of(undefined);
    })).subscribe(
      {
        next: this.onUnassignParticipantDialogClosed(),
        error: this.onError()
      }));
  }

  private openUnassignParticipantDialog(participant: User)
  {
    const title = UNASSIGN_PARTICIPANT_DIALOG_TITLE;
    const description = TRYING_TO_UNASSIGN +
                        participant.firstName + WHITESPACE + participant.lastName +
                        DOT + NEXT_LINE +
                        THIS_CANNOT_BE_UNDONE + PARTICIPANT_NOTIFIED;

    const dialogData = DialogUtils.createWarningDialogData(title, description, CONFIRM_BUTTON_TEXT);
    return DialogUtils.openWarningDialog(dialogData, this.zone, this.dialog);
  }

  private onUnassignParticipantDialogClosed()
  {
    return (response: CustomHttpResponse | undefined) =>
    {
      if(response)
      {
        this.onParticipantUnassignedSuccessfully(response);
      }
    }
  }

  private onParticipantUnassignedSuccessfully(response: CustomHttpResponse)
  {
    this.notificationService.notify(NotificationType.SUCCESS, response.message);
  }

  private onError()
  {
    return (errorResponse: any) =>
    {
      this.notificationService.notify(NotificationType.ERROR, errorResponse.message);
    }
  }

  public onChangeSortOrder(orderBy: string): void
  {
    if(this.orderBy != orderBy)
    {
      this.orderBy = orderBy;
      this.isAscending = true;
    } else
    {
      this.isAscending = !this.isAscending;
    }

    this.listParticipants();
  }

  public getTableHeaderClass(item: any)
  {
    const isFirstElement: boolean = this.tableData.indexOf(item) == 0;
    return isFirstElement ? 'headers-column-first' : '';
  }

  private processResult()
  {
    return (data: UserPageableResponse) =>
    {
      this.participants = data.content;
      this.pageNumber = data.pageable.pageNumber + 1;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    }
  }

  public ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
