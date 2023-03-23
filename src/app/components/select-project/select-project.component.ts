import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Project} from "../../model/project";
import {ProjectService} from "../../service/project.service";
import {AuthenticationService} from "../../service/authentication.service";
import {Observable, Subscription} from "rxjs";
import {ProjectPageableResponse} from "../../model/project-pageable-response";
import {ProjectSortOrderEnum} from "../../enum/project-sort-order.enum";

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.css']
})
export class SelectProjectComponent implements OnInit
{
  @Output() projectSelectedEvent: EventEmitter<Project> = new EventEmitter<Project>();

  @Input() formSubmitted$: Observable<boolean> = new Observable<boolean>();
  @Input() currentProject: Project | undefined;

  private readonly isProjectLeader: boolean;
  private readonly isUser: boolean;
  private readonly currentUserId: number;

  public invalid: boolean = false;

  public projects: Project[] = [];
  private page: number = 0;
  private readonly size: number = 5;
  private endOfPages: boolean = false;

  public selectedProject: Project | undefined;

  private subscriptions: Subscription[] = [];

  constructor(private projectService: ProjectService,
              private authenticationService: AuthenticationService)
  {
    this.isProjectLeader = this.authenticationService.isProjectLeader();
    this.isUser = this.authenticationService.isUser();
    this.currentUserId = this.authenticationService.getUserFromLocalCache().id;
  }

  ngOnInit(): void
  {
    if(this.currentProject)
    {
      this.selectedProject = this.currentProject;
    }

    this.listProjects();
    this.onFormSubmitted();
  }

  private onFormSubmitted(): void
  {
    this.subscriptions.push(
    this.formSubmitted$.subscribe((submit) =>
    {
      const isSubmitSuccess = submit;
      const isSubmitFailed = !submit;

      this.invalid = isSubmitFailed && !this.selectedProject;
      if(isSubmitSuccess)
      {
        this.selectedProject = undefined;
        this.projectSelectedEvent.emit(undefined);
      }
    }));
  }

  listProjects(): void
  {
    if(this.isProjectLeader)
    {
      this.subscriptions.push(
      this.projectService.getProjectsByProjectLeaderId
      (this.currentUserId, this.page, this.size, ProjectSortOrderEnum.NAME, true).subscribe
      (this.processResponse()));
      return;
    }

    if(this.isUser)
    {
      this.subscriptions.push(
      this.projectService.getProjectsByParticipantId
      (this.currentUserId, this.page, this.size, ProjectSortOrderEnum.NAME, true).subscribe
      (this.processResponse()));
    }
  }

  onSelectProject(project: Project | undefined): void
  {
    this.selectedProject = project;
    this.invalid = false;
    this.projectSelectedEvent.emit(this.selectedProject);
  }

  private processResponse()
  {
    return (data: ProjectPageableResponse) =>
    {
      this.projects.push(...data.content);
      this.page = data.pageable.pageNumber;
      this.endOfPages = this.page >= data.totalPages;
    }
  }

  showWarningIfProjectChangeDetected(): boolean
  {
    if(!this.isProjectLeader)
    {
      return false;
    }

    if(!this.selectedProject || !this.currentProject)
    {
      return false;
    }

    return this.selectedProject.id != this.currentProject.id;
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void
  {
    const target = event.target as HTMLElement;
    const scrolled: boolean = target.scrollTop + target.offsetHeight >= target.scrollHeight - 1;
    if(scrolled && !this.endOfPages)
    {
      this.page++;
      this.listProjects();
    }
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}


