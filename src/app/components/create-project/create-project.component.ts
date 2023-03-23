import {AuthenticationService} from "../../service/authentication.service";
import {LoaderService} from "../../service/loader.service";
import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";
import {UserService} from "../../service/user.service";

import {Project} from "../../model/project";
import {User} from "../../model/user";

import {Component, HostListener, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {MatDialogRef} from "@angular/material/dialog";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {UserRole} from "../../enum/user-role.enum";
import {UserPageableResponse} from "../../model/user-pageable-response";

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit
{
  public searchUserFormControl: FormControl = new FormControl('');

  public workers: User[] = [];
  private page: number = 0;
  private readonly size: number = 4;
  private isEndOfPages: boolean = false;

  public createProjectFormGroup!: FormGroup;
  private participants: User[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private loadingService: LoaderService,
              private projectService: ProjectService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private dialogRef: MatDialogRef<CreateProjectComponent>)
  {}

  ngOnInit(): void
  {
    this.createCreateProjectFormGroup();
    this.listAllWorkers();
  }

  private createCreateProjectFormGroup(): void
  {
    this.createProjectFormGroup = this.formBuilder.group
    ({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
      description: new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      assignees: this.formBuilder.array([])
    });
  }

  private listAllWorkers(): void
  {
    this.subscriptions.push(
      this.userService.getUsersByRole(UserRole.ROLE_USER, this.page, this.size).subscribe
      (this.processResults()));
  }

  onSubmit(): void
  {
    if(this.createProjectFormGroup.invalid)
    {
      this.createProjectFormGroup.markAllAsTouched();
      return;
    }

    const projectLeaderId = this.authenticationService.getUserFromLocalCache().id;

    const project = new Project();
    project.name = this.getProjectName()?.value;
    project.description = this.getProjectDescription()?.value;

    this.addProject(projectLeaderId, project);
  }

  private addProject(projectLeaderId: number, project: Project): void
  {
    this.subscriptions.push(
    this.projectService.addProject(projectLeaderId, project).pipe(mergeMap((response: Project) =>
    {
      this.notifyAboutCreatingProject(response);
      return this.addParticipantsIfSelected(response);
    })).subscribe(
      {
        next: this.onProjectCreatedSuccessfully(),
        error: this.onError()
      }));
  }

  private notifyAboutCreatingProject(project: Project): void
  {
    this.notificationService.notify(NotificationType.SUCCESS, 'Project: ' + project.name + ' created successfully!');
  }

  private addParticipantsIfSelected(createdProject: Project): Observable<CustomHttpResponse | undefined>
  {
    if(this.participants.length != 0)
    {
      return this.projectService.addParticipants(createdProject.id, this.participants);
    }

    return of(undefined);
  }

  private onProjectCreatedSuccessfully()
  {
    return (response: CustomHttpResponse | undefined) =>
    {
      this.dialogRef.close(true);
      if(response)
      {
        this.onParticipantsAddedSuccessfully(response);
      }
    }
  }

  private onParticipantsAddedSuccessfully(response: CustomHttpResponse): void
  {
    this.notificationService.sendSuccessNotification(response.message);
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }

  onSearchWorker(): void
  {
    this.page = 0;
    this.workers = [];
    this.isEndOfPages = false;
    this.searchAllWorkers();
  }

  private searchAllWorkers(): void
  {
    const fullName = this.searchUserFormControl.value;
    this.subscriptions.push(
      this.userService.getUsersByRoleAndFullName(UserRole.ROLE_USER, fullName, this.page, this.size).subscribe
      (this.processResults()));
  }

  private processResults(): (data: UserPageableResponse) => void
  {
    return (data: UserPageableResponse) =>
    {
      this.workers.push(...data.content);
      this.page = data.pageable.pageNumber;
      this.isEndOfPages = this.page >= data.totalPages;
    }
  }

  onCheckboxChange(event: Event, worker: User): void
  {
    const target = event.target as HTMLInputElement;
    if(target.checked)
    {
      this.participants.push(worker);
    } else
    {
      this.participants.filter
      ((participant) => participant !== worker);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void
  {
    const target = event.target as HTMLElement;
    const scrolled: boolean = target.scrollTop + target.offsetHeight >= target.scrollHeight - 1
    if(scrolled && !this.isEndOfPages)
    {
      this.page++;
      if(this.searchUserFormControl.value)
      {
        this.searchAllWorkers();
      } else
      {
        this.listAllWorkers();
      }
    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getProjectName()
  {
    return this.createProjectFormGroup.get('name');
  }

  getProjectDescription()
  {
    return this.createProjectFormGroup.get('description');
  }
}



