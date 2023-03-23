import {AuthenticationService} from "../../service/authentication.service";
import {BugService} from "../../service/bug.service";
import {NotificationService} from "../../service/notification.service";
import {UserService} from "../../service/user.service";

import {Bug} from "../../model/bug";
import {User} from "../../model/user";

import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {FormControl} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {UserPageableResponse} from "../../model/user-pageable-response";
import {UserSortOrderEnum} from "../../enum/user-sort-order.enum";


@Component({
  selector: 'app-assign-user-issue',
  templateUrl: './assign-user-bug.component.html',
  styleUrls: ['./assign-user-bug.component.css']})
export class AssignUserBugComponent implements OnInit
{
  public searchUserFormControl: FormControl = new FormControl('');

  private readonly currentAssignee: User | undefined;
  public selectedAssignee: User | undefined;
  private readonly bug: Bug;

  private readonly projectId: number | undefined;

  public workers: User[] = [];
  private page: number = 0;
  private readonly size: number = 4;
  private isEndOfPages: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private bugService: BugService,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<AssignUserBugComponent>,
              @Inject(MAT_DIALOG_DATA) private data: {content: Bug})
  {
    this.bug = this.data.content;
    this.currentAssignee = this.bug.assignee;
    this.projectId = this.bug.project?.id;
  }
  

  ngOnInit(): void
  {
    this.listWorkers();
  }
  

  listWorkers(): void
  {
    if(!this.projectId)
    {
      this.notificationService.notifyAboutError();
      this.dialogRef.close();
      return;
    }

    if(this.currentAssignee)
    {
      this.getParticipantsExcludeCurrentAssignee(this.projectId, this.currentAssignee.id);
    } else
    {
      this.getAllParticipants(this.projectId);
    }
  }

  private getParticipantsExcludeCurrentAssignee(projectId: number, participantToExcludeId: number)
  {
    this.subscriptions.push(
      this.userService.getParticipantsByProjectIdAndExcludeParticipant
      (projectId, participantToExcludeId, this.page, this.size, UserSortOrderEnum.FIRST_NAME, true).subscribe
      (this.processResponse()));
  }

  private getAllParticipants(projectId: number)
  {
    this.subscriptions.push(
      this.userService.getParticipantsByProjectId
      (projectId, this.page, this.size, UserSortOrderEnum.FIRST_NAME, true).subscribe
      (this.processResponse()));
  }


  onSelectAssignee(assignee: User): void
  {
    this.selectedAssignee = assignee;
  }
  

  onSubmit(): void
  {
    if(!this.selectedAssignee)
    {
      this.notificationService.notifyAboutError();
      this.dialogRef.close();
      return;
    }

    this.subscriptions.push(
    this.bugService.setAssignee(this.bug.id, this.selectedAssignee.id).subscribe(
      {
        next: this.onUserAssignedSuccessfully(this.bug),
        error: this.onError()
      }));
  }

  private onUserAssignedSuccessfully(bug: Bug): (response: CustomHttpResponse) => void
  {
    return (response: CustomHttpResponse) =>
    {
      bug.assignee = this.selectedAssignee;
      this.notificationService.sendSuccessNotification(response.message);
      this.dialogRef.close();
    }
  }

  private onError(): (errorResponse: HttpErrorResponse) => void
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }
  

  onSearchParticipants(): void
  {
    this.page = 0;
    this.workers = [];
    this.isEndOfPages = false;
    this.searchParticipants();
  }
  
  private searchParticipants(): void
  {
    const fullName = this.searchUserFormControl.value;

    if(!this.projectId)
    {
      this.notificationService.notifyAboutError();
      this.dialogRef.close();
      return;
    }

    if(this.currentAssignee)
    {
      this.searchParticipantsByFullNameExcludeCurrentAssignee(fullName, this.projectId, this.currentAssignee.id);
    } else
    {
      this.searchAllParticipantsByFullName(fullName, this.projectId);
    }
  }

  private searchParticipantsByFullNameExcludeCurrentAssignee(fullName: string, projectId: number, participantToExcludeId: number): void
  {
    this.subscriptions.push(
      this.userService.getParticipantsByFullNameAndProjectIdExcludeParticipant
      (fullName, projectId, participantToExcludeId, this.page, this.size).subscribe(this.processResponse()));
  }

  private searchAllParticipantsByFullName(fullName: string, projectId: number): void
  {
    this.subscriptions.push(
      this.userService.getParticipantsByFullNameAndProjectId
      (fullName, projectId, this.page, this.size).subscribe(this.processResponse()));
  }

  private processResponse()
  {
    return (data: UserPageableResponse) =>
    {
      this.workers.push(...data.content);
      this.page = data.pageable.pageNumber;
      this.isEndOfPages = this.page >= data.totalPages;
    }
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void
  {
    const target = event.target as HTMLElement
    const scrolled: boolean =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 1;

    if(scrolled && !this.isEndOfPages)
    {
      this.page++;
      if(this.searchUserFormControl.value)
      {
        this.searchParticipants();
      } else
      {
        this.listWorkers();
      }
    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) =>
      subscription.unsubscribe());
  }
}
