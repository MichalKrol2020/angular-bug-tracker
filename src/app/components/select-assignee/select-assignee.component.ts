import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Project} from "../../model/project";
import {User} from "../../model/user";
import {mergeMap, Observable, of, Subscription} from "rxjs";
import {UserPageableResponse} from "../../model/user-pageable-response";
import {UserSortOrderEnum} from "../../enum/user-sort-order.enum";

@Component({
  selector: 'app-select-assignee',
  templateUrl: './select-assignee.component.html',
  styleUrls: ['./select-assignee.component.css']
})
export class SelectAssigneeComponent implements OnInit
{
  @Output() assigneeSelectedEvent: EventEmitter<User> = new EventEmitter<User>();
  @Input() projectSelected$: Observable<Project> = new Observable<Project>();

  public currentProject: Project | undefined;
  public disableButton: boolean = true;

  public participants: User[] = [];
  private page: number = 0;
  private readonly size: number = 5;
  private endOfPages: boolean = false;

  public selectedAssignee: User | undefined;

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService)
  {}


  ngOnInit(): void
  {
    this.onProjectSelected();
  }

  private onProjectSelected()
  {
    this.subscriptions.push(
    this.projectSelected$.pipe(mergeMap((project: Project) =>
    {
      this.disableButton = !project;
      this.currentProject = project;
      this.selectedAssignee = undefined;
      this.resetParticipants();

      return this.getParticipantsIfProjectExists(project);
    })).subscribe(this.processResults()));
  }

  private getParticipantsIfProjectExists(project: Project)
  {
    if(project)
    {
      return this.getParticipants(project.id);
    }

    return of(undefined);
  }

  private getParticipants(projectId: number)
  {
    return this.userService.getParticipantsByProjectId(projectId, this.page, this.size, UserSortOrderEnum.FIRST_NAME, true);
  }


  private resetParticipants()
  {
    this.selectedAssignee = undefined;
    this.participants = [];
    this.page = 0;
    this.endOfPages = false;
  }

  onSelectAssignee(participant: User | undefined)
  {
    this.selectedAssignee = participant;
    this.assigneeSelectedEvent.emit(this.selectedAssignee);
  }

  private processResults()
  {
    return (data: UserPageableResponse | undefined) =>
    {
      if(data)
      {
        this.participants.push(...data.content)
        this.page = data.pageable.pageNumber;
        this.endOfPages = this.page >= data.totalPages;
      }
    }
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: Event)
  {
    if(!this.currentProject)
    {
      return;
    }

    const target = event.target as HTMLElement;
    let scrolled: boolean = target.scrollTop + target.offsetHeight >= target.scrollHeight - 1;
    if(scrolled && !this.endOfPages)
    {
      this.page++;
      this.subscriptions.push(
      this.getParticipants(this.currentProject.id).subscribe
      (this.processResults()));
    }
  }

  ngOnDestroy()
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
