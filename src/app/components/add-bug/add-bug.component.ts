import {AuthenticationService} from "../../service/authentication.service";
import {BugService} from "../../service/bug.service";
import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";
import {UserService} from "../../service/user.service";

import {Bug} from "../../model/bug";
import {Project} from "../../model/project";
import {User} from "../../model/user";

import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {NotificationType} from "../../enum/notification-type.enum";
import {CustomHttpResponse} from "../../model/custom-http-response";
import {HttpErrorResponse} from "@angular/common/http";
import {BugClassificationSelectData} from "../../const/bug-classification-select-data";
import {BugSeveritySelectData} from "../../const/bug-severity-select-data";
import {BugEnumMapper} from "../../enum/mapper/bug-enum-mapper";

@Component({
  selector: 'app-add-bug',
  templateUrl: './add-bug.component.html',
  styleUrls: ['./add-bug.component.css']
})
export class AddBugComponent implements OnInit
{
  public projectSelectedEvent = new EventEmitter<Project>();
  public addBugFormSubmittedEvent = new EventEmitter<boolean>();

  public isProjectLeader: boolean;
  private currentUserId: number;

  public classificationOptions = BugClassificationSelectData;
  public severityOptions = BugSeveritySelectData;
  public addBugFormGroup!: FormGroup;

  private selectedProject: Project | undefined;
  private selectedAssignee: User | undefined;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private bugService: BugService,
              private projectService: ProjectService,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService)
  {
    this.isProjectLeader = this.authenticationService.isProjectLeader();
    this.currentUserId = this.authenticationService.getUserFromLocalCache().id;
  }

  ngOnInit(): void
  {
    this.createAddBugFormGroup();
  }


  private createAddBugFormGroup(): void
  {
    this.addBugFormGroup = this.formBuilder.group
    ({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(38)]),
      classification: ['', Validators.required],
      severity: ['', Validators.required],
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(300)])
    });
  }


  onProjectSelected(selectedProject: Project): void
  {
    this.selectedAssignee = undefined;
    this.selectedProject = selectedProject;
    this.projectSelectedEvent.emit(selectedProject);
  }


  onAssigneeSelected(assignee: User | undefined): void
  {
    this.selectedAssignee = assignee;
  }


  onSubmit(): void
  {
    if(this.addBugFormGroup?.invalid || this.selectedProject == undefined)
    {
      this.addBugFormGroup?.markAllAsTouched();
      this.addBugFormSubmittedEvent.emit(false);
      return;
    }

    let bug = new Bug();
    bug.name = this.getBugName()?.value;
    bug.classification = this.getBugClassificationValue();
    bug.severity = this.getBugSeverityValue();
    bug.description = this.getBugDescription()?.value;

    console.log(bug)
    this.addBug(bug);
  }

  private getBugClassificationValue(): string
  {
    const classification: string = this.getBugClassification()?.value;
    return BugEnumMapper.mapClassificationToEnumName(classification);
  }

  private getBugSeverityValue(): string
  {

    const severity: string = this.getBugSeverity()?.value;
    return BugEnumMapper.mapSeverityToEnumName(severity);
  }

  private addBug(bug: Bug): void
  {
    if(!this.selectedProject)
    {
      this.notificationService.notifyAboutError();
      return;
    }

    this.subscriptions.push(
    this.bugService.add(this.currentUserId, this.selectedProject.id, bug).pipe(mergeMap((createdBug: Bug) =>
    {
      this.notifyAboutCreatingBug(createdBug);
      return this.setAssigneeIfSelected(createdBug);
    })).subscribe(
      {
        next: this.onBugAddedSuccessfully(),
        error: this.onError()
      }));
  }


  private notifyAboutCreatingBug(createdBug: Bug): void
  {
    this.notificationService.notify(NotificationType.SUCCESS, 'Bug: ' + createdBug.name + ' added successfully!');
  }

  private setAssigneeIfSelected(createdBug: Bug): Observable<CustomHttpResponse | undefined>
  {
    if(this.selectedAssignee)
    {
      return this.bugService.setAssignee(createdBug.id, this.selectedAssignee.id)
    }

    return of(undefined);
  }


  private onBugAddedSuccessfully()
  {
    return (response: CustomHttpResponse | undefined) =>
    {
      this.resetFormGroup();
      if(response)
      {
        this.onWorkerAssignedSuccessfully(response);
      }
    }
  }

  private onWorkerAssignedSuccessfully(response: CustomHttpResponse): void
  {
    this.selectedAssignee = undefined;
    this.notificationService.sendSuccessNotification(response.message);
  }

  private onError(): (errorResponse: HttpErrorResponse) => void
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }

  private resetFormGroup(): void
  {
    this.getBugName()?.reset();
    this.getBugClassification()?.reset();
    this.getBugSeverity()?.reset();
    this.getBugDescription()?.reset();
    this.addBugFormSubmittedEvent.emit(true);
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private getBugName()
  {
    return this.addBugFormGroup.get('name');
  }

  private getBugClassification()
  {
    return this.addBugFormGroup.get('classification');
  }

  private getBugSeverity()
  {
    return this.addBugFormGroup.get('severity');
  }

  private getBugDescription()
  {
    return this.addBugFormGroup.get('description');
  }
}



