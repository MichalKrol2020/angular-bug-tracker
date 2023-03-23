import {AuthenticationService} from "../../service/authentication.service";
import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";

import {Project} from "../../model/project";

import {AddParticipantsComponent} from "../add-particiapnts/add-participants.component";
import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {DialogUtils} from "../../utils/dialog-utils";
import {EditProjectComponent} from "../edit-project/edit-project.component";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {NotificationType} from "../../enum/notification-type.enum";
import {scale} from "../../const/animations";
import {ProjectsModEnum} from "../../enum/projects-mod-enum";
import {ProjectConst} from "../../const/project-const";
import {WarningDialogComponent} from "../warning-dialog/warning-dialog.component";

import {
  ADD_PARTICIPANTS_DIALOG_HEIGHT,
  ADD_PARTICIPANTS_DIALOG_WIDTH,
  DELETE_BUTTON_TEXT,
  DELETE_PROJECT_DIALOG_TITLE,
  DOT,
  EDIT_PROJECT_DIALOG_HEIGHT,
  EDIT_PROJECT_DIALOG_WIDTH,
  NEXT_LINE,
  PARTICIPANTS_UNASSIGNED_AUTOMATICALLY,
  THIS_CANNOT_BE_UNDONE,
  TRYING_TO_DELETE_PROJECT
} from "../../const/dialog-const";


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  animations: [scale]
})
export class ProjectComponent implements OnInit
{
  @Output() reloadProjectsRequestedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() modSelectedChanged$: Observable<string> = new Observable<string>();
  @Input() project: Project | undefined;

  public readonly isProjectLeader: boolean;

  public projectExpandedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isProjectExpanded: boolean = false;

  public modSelected: string = ProjectsModEnum.ISSUES;

  public readonly modIssues = ProjectsModEnum.ISSUES;
  public readonly modParticipants = ProjectsModEnum.PARTICIPANTS;

  private subscriptions: Subscription[] = [];

  constructor(private projectService: ProjectService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              private zone: NgZone)
  {
    this.isProjectLeader = this.authenticationService.isProjectLeader();
  }

  ngOnInit(): void
  {
    this.onSelectedModChanged();
  }

  private onSelectedModChanged(): void
  {
    this.subscriptions.push(
    this.modSelectedChanged$.subscribe((modSelected) =>
    {
      this.modSelected = modSelected;
      this.isProjectExpanded = false;
      this.projectExpandedEvent.emit(false);
    }));
  }


  onExpandProject(): void
  {
    this.isProjectExpanded = !this.isProjectExpanded;
    this.projectExpandedEvent.emit(this.isProjectExpanded);
  }

  openEditProjectDialog(project: Project): void
  {
    const dialogConfig = DialogUtils.createDialogConfig
    (EDIT_PROJECT_DIALOG_WIDTH, EDIT_PROJECT_DIALOG_HEIGHT, project);
    DialogUtils.openDialog(this.zone, this.dialog, dialogConfig, EditProjectComponent);
  }

  public onAddParticipants(project: Project): void
  {
    const dialogRef = this.openAddParticipantsDialog(project);

    this.subscriptions.push(
    dialogRef.afterClosed().subscribe((participantsAdded: boolean) =>
    {
      if(participantsAdded)
      {
        this.reloadProjectsRequestedEvent.emit();
      }
    }));
  }

  private openAddParticipantsDialog(project: Project): MatDialogRef<AddParticipantsComponent>
  {
    const dialogConfig = DialogUtils.createDialogConfig
    (ADD_PARTICIPANTS_DIALOG_WIDTH, ADD_PARTICIPANTS_DIALOG_HEIGHT, project);
    return DialogUtils.openDialog(this.zone, this.dialog, dialogConfig, AddParticipantsComponent);
  }


  onDeleteProject(project: Project): void
  {
    const dialogRef = this.openDeleteProjectDialog(project);

    this.subscriptions.push(
    dialogRef.afterClosed().pipe(mergeMap((confirmed: boolean) =>
    {
      if(confirmed)
      {
        return this.projectService.deleteProject(project.id);
      }

      return of(undefined);
    })).subscribe(
      {
        next: this.onDeleteProjectDialogClosed(),
        error: this.onError()
      }));
  }

  private openDeleteProjectDialog(project: Project): MatDialogRef<WarningDialogComponent>
  {
    const title = DELETE_PROJECT_DIALOG_TITLE;
    const description = TRYING_TO_DELETE_PROJECT + project.name + DOT + NEXT_LINE +
                        THIS_CANNOT_BE_UNDONE + NEXT_LINE +
                        PARTICIPANTS_UNASSIGNED_AUTOMATICALLY;
    const dialogData = DialogUtils.createWarningDialogData(title, description, DELETE_BUTTON_TEXT);

    return DialogUtils.openWarningDialog(dialogData, this.zone, this.dialog);
  }

  private onDeleteProjectDialogClosed(): (response: Project | undefined) => void
  {
    return (response: Project | undefined) =>
    {
      if(response)
      {
        this.onProjectDeletedSuccessfully(response);
      }
    }
  }

  private onProjectDeletedSuccessfully(response: Project): void
  {
    this.reloadProjectsRequestedEvent.emit();
    this.notificationService.notify
    (NotificationType.SUCCESS, ProjectConst.PROJECT + response.name + ProjectConst.DELETED_SUCCESSFULLY);
  }

  private onError(): (errorResponse: HttpErrorResponse) => void
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.notify
      (NotificationType.ERROR, errorResponse.error.message);
    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
