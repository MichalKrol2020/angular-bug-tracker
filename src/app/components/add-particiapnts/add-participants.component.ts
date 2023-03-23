import {AuthenticationService} from "../../service/authentication.service";
import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";
import {UserService} from "../../service/user.service";

import {User} from "../../model/user";

import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {FormControl} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Project} from "../../model/project";
import {Subscription} from "rxjs";
import {UserPageableResponse} from "../../model/user-pageable-response";

@Component({
  selector: 'app-assign-users-project',
  templateUrl: './add-participants.component.html',
  styleUrls: ['./add-participants.component.css']
})
export class AddParticipantsComponent implements OnInit
{
  public searchUserFormControl: FormControl = new FormControl('');

  public workers: User[] = [];
  private page: number = 0;
  private readonly size: number = 4;
  private isEndOfPages: boolean = false;

  public project: Project;
  public participants: User[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private projectService: ProjectService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private dialogRef: MatDialogRef<AddParticipantsComponent>,
              @Inject(MAT_DIALOG_DATA) private data: {content: Project})
  {
    this.project = this.data.content;
  }

  ngOnInit(): void
  {
    this.listWorkersNotInProject();
  }

  private listWorkersNotInProject(): void
  {
    this.subscriptions.push(
      this.userService.getUsersNotInProject
      (this.project.id, this.page, this.size).subscribe
      (this.processResults()));
  }

  private processResults()
  {
    return (data: UserPageableResponse) =>
    {
      this.workers.push(...data.content);
      this.page = data.pageable.pageNumber;
      this.isEndOfPages = this.page >= data.totalPages;
    }
  }

  onSubmit(): void
  {
    this.subscriptions.push(
    this.projectService.addParticipants(this.project.id, this.participants).subscribe(
      {
        next: this.onParticipantsAddedSuccessfully(),
        error: this.onError()
      }));
  }

  private onParticipantsAddedSuccessfully()
  {
    return (response: CustomHttpResponse) =>
    {
      this.notificationService.sendSuccessNotification(response.message);
      this.dialogRef.close(true);
    }
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }

  onSearchWorkers(): void
  {
    this.page = 0;
    this.workers = [];
    this.isEndOfPages = false;
    this.searchWorkersNotInProject();
  }



  private searchWorkersNotInProject(): void
  {
    const fullName = this.searchUserFormControl.value;
    this.subscriptions.push(
      this.userService.getUsersByFullNameAndNotInProject(fullName, this.project.id, this.page, this.size).subscribe
      (this.processResults()));
  }

  onCheckboxChange(event: any, worker: User): void
  {
    if(event.target.checked)
    {
      this.participants.push(worker);
    } else
    {
      this.participants = this.participants.filter
      ((participant) => participant !== worker);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void
  {
    const target = event.target as HTMLElement;
    const scrolled: boolean =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 1;

    if(scrolled && !this.isEndOfPages)
    {
      this.page++;
      if(this.searchUserFormControl.value)
      {
        this.searchWorkersNotInProject();
      } else
      {
        this.listWorkersNotInProject();
      }
    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach
    ((subscription) => subscription.unsubscribe());
  }
}


