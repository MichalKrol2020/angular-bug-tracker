import {AuthenticationService} from "../../service/authentication.service";
import {BugService} from "../../service/bug.service";
import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";

import {Bug} from "../../model/bug";
import {Project} from "../../model/project";

import {ActivatedRoute} from "@angular/router";
import {BugClassificationSelectData} from "../../const/bug-classification-select-data";
import {BugSeveritySelectData} from "../../const/bug-severity-select-data";
import {Component, Inject, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {
  EDIT_BUG_DIALOG_EXPANDED_HEIGHT,
  EDIT_BUG_DIALOG_HEIGHT,
  EDIT_BUG_DIALOG_WIDTH,
  PX
} from "../../const/dialog-const";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {NotificationType} from "../../enum/notification-type.enum";
import {BugStatusProjectLeaderSelectData} from "../../const/bug-status-select-data";
import {BugEnumMapper} from "../../enum/mapper/bug-enum-mapper";


@Component({
  selector: 'app-edit-issue',
  templateUrl: './edit-issue.component.html',
  styleUrls: ['./edit-issue.component.css']
})
export class EditIssueComponent implements OnInit
{
  private readonly currentUserId: number;
  public readonly isProjectLeader: boolean;
  public readonly isUser: boolean;

  public editIssueFormGroup!: FormGroup;
  public readonly classificationOptions = BugClassificationSelectData;
  public readonly severityOptions = BugSeveritySelectData;
  public readonly statusOptions = BugStatusProjectLeaderSelectData;

  private selectedProject: Project | undefined;
  public readonly currentBug: Bug;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private bugService: BugService,
              private projectService: ProjectService,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<EditIssueComponent>,
              @Inject(MAT_DIALOG_DATA) private data: {content: Bug})
  {
    this.currentBug = this.data.content;
    this.currentUserId = this.authenticationService.getUserFromLocalCache().id;
    this.isProjectLeader = this.authenticationService.isProjectLeader();
    this.isUser = this.authenticationService.isUser();
    this.selectedProject = this.currentBug.project;
  }

  ngOnInit(): void
  {
    this.createEditBugFormGroup();
  }

  private createEditBugFormGroup()
  {
    this.editIssueFormGroup = this.formBuilder.group
    ({
      name: new FormControl(this.currentBug.name,
        [Validators.required, Validators.minLength(5), Validators.maxLength(38)]),
      classification: this.currentBug.classification,
      severity: this.currentBug.severity,
      status: this.currentBug.status,
      project: this.currentBug.project,
      description: new FormControl(this.currentBug.description,
        [Validators.required, Validators.minLength(10), Validators.maxLength(300)])
    });
  }

  onProjectSelected(project: Project): void
  {
    this.selectedProject = project;
    this.updateHeightIfProjectChanged(project);
  }

  private updateHeightIfProjectChanged(project: Project)
  {
    if(!this.isProjectLeader)
    {
      return;
    }

    const dialogHeight =
      this.currentBug.project?.id != project.id ?
        EDIT_BUG_DIALOG_EXPANDED_HEIGHT : EDIT_BUG_DIALOG_HEIGHT;

    this.dialogRef.updateSize(EDIT_BUG_DIALOG_WIDTH + PX, dialogHeight + PX);
  }

  onSubmit(): void
  {
    if(this.editIssueFormGroup.invalid)
    {
      this.editIssueFormGroup.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.getBugName()?.value);
    formData.append('classification', this.getBugClassificationValue());
    formData.append('severity', this.getBugSeverityValue());
    formData.append('status', this.getBugStatusValue());
    formData.append('description', this.getBugDescription()?.value);

    this.updateBug(formData);
  }

  private getBugClassificationValue(): string
  {
    const classification: string = this.getBugClassification()?.value;
    return BugEnumMapper.mapClassificationToEnumName(classification);
  }

  private getBugStatusValue(): string
  {
    const status: string = this.getBugStatus()?.value;
    return BugEnumMapper.mapStatusToEnumName(status);
  }

  private getBugSeverityValue()
  {
    const severity: string = this.getBugSeverity()?.value;
    return BugEnumMapper.mapSeverityToEnumName(severity);
  }


  private updateBug(formData: FormData): void
  {
    if(!this.selectedProject)
    {
      this.notificationService.notifyAboutError();
      return;
    }

    this.subscriptions.push(
    this.bugService.update(this.currentBug.id, this.currentUserId, this.selectedProject.id, formData).pipe(mergeMap((response: Bug) =>
    {
      this.notifyAboutEditingBug();
      this.mapUpdatedBugToCurrentBug(response);

      return this.unassignWorkerIfProjectChanged(response);
    })).subscribe(
      {
        next: this.onBugUpdatedSuccessfully(),
        error: this.onError()
      }));
  }

  private notifyAboutEditingBug(): void
  {
    this.notificationService.notify(
      NotificationType.SUCCESS,
      'Bug: ' + this.currentBug.name + ' edited successfully!');
  }


  private mapUpdatedBugToCurrentBug(bug: Bug): void
  {
    if(this.currentBug)
    {
      this.currentBug.name = bug.name;
      this.currentBug.classification = bug.classification;
      this.currentBug.status = bug.status;
      this.currentBug.severity = bug.severity;
      this.currentBug.description = bug.description;
      this.currentBug.assignee = bug.assignee;
      this.currentBug.project = bug.project;
    }
  }


  private unassignWorkerIfProjectChanged(editedBug: Bug): Observable<CustomHttpResponse | undefined>
  {
    if((this.currentBug.project?.id != this.selectedProject?.id) &&
      this.currentBug.assignee)
    {
      return this.bugService.unassignWorkerFromBug(editedBug.id);
    }

    return of(undefined);
  }

  disableSubmitIfFieldsMatching(): boolean
  {
    const newBugName = this.getBugName()?.value;
    const newBugDescription = this.getBugDescription()?.value


    return this.currentBug.name === newBugName.trimEnd() &&
           this.currentBug.description === newBugDescription.trimEnd() &&
           this.currentBug.classification === this.getBugClassification()?.value &&
           this.currentBug.severity === this.getBugSeverity()?.value &&
           this.currentBug.status === this.getBugStatus()?.value &&
           this.currentBug.project?.id === this.selectedProject?.id;
  }


  private onBugUpdatedSuccessfully(): (response: CustomHttpResponse | undefined) => void
  {
    return (response: CustomHttpResponse | undefined) =>
    {
      if(response)
      {
        this.onAssigneeUnassignedSuccessfully(response);
      }
      this.dialogRef.close();
    }
  }

  private onAssigneeUnassignedSuccessfully(response: CustomHttpResponse): void
  {
    this.currentBug.assignee = undefined;
    this.notificationService.sendSuccessNotification(response.message);
  }

  private onError(): (errorResponse: HttpErrorResponse) => void
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }


  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  private getBugName()
  {
    return this.editIssueFormGroup.get('name');
  }

  private getBugClassification()
  {
    return this.editIssueFormGroup.get('classification');
  }

  private getBugSeverity()
  {
    return this.editIssueFormGroup.get('severity');
  }

  private getBugStatus()
  {
    return this.editIssueFormGroup.get('status');
  }

  private getBugDescription()
  {
    return this.editIssueFormGroup.get('description');
  }
}
