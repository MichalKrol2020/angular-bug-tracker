import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Bug} from "../model/bug";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CustomHttpResponse} from "../model/custom-http-response";
import {BugPageableResponse} from "../model/bug-pageable-response";

@Injectable({
  providedIn: 'root'
})
export class BugService
{
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient)
  {}

  public add(creatorId: number, projectId: number, bug: Bug)
  {
    return this.httpClient.post<Bug>(`${this.host}/bug/${creatorId}/${projectId}`, bug);
  }

  public update(currentBugId: number, editorId: number, projectId: number, formData: FormData): Observable<Bug>
  {
    return this.httpClient.put<Bug>(`${this.host}/bug/${currentBugId}/${editorId}/${projectId}`, formData)
  }

  public setAssignee(bugId: number, assigneeId: number): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/bug/${bugId}/${assigneeId}/assignee`, null)
  }

  public unassignWorkerFromBug(bugId: number): Observable<CustomHttpResponse>
  {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/bug/${bugId}/assignee`);
  }

  public setStatus(bugId: number, status: string): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/bug/${bugId}/status`, status)
  }

  public getBugById(bugId: number): Observable<Bug>
  {
    return this.httpClient.get<Bug>(`${this.host}/${bugId}`)
  }

  public getBugsByProject(projectId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<BugPageableResponse>
  {
    return this.httpClient.get<BugPageableResponse>(`${this.host}/bug/bugs/project?projectId=${projectId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public getBugsByCreatorId(creatorId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<BugPageableResponse>
  {
    return this.httpClient.get<BugPageableResponse>(`${this.host}/bug/bugs/creator?creatorId=${creatorId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public getBugsByAssigneeId(assigneeId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<BugPageableResponse>
  {
    return this.httpClient.get<BugPageableResponse>(`${this.host}/bug/bugs/assignee?assigneeId=${assigneeId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public getBugsByProjectLeaderId(projectLeaderId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<BugPageableResponse>
  {
    return this.httpClient.get<BugPageableResponse>(`${this.host}/bug/bugs/project-leader?projectLeaderId=${projectLeaderId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public deleteBug(bugId: number, deleterId: number): Observable<CustomHttpResponse>
  {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/bug/${bugId}/${deleterId}`);
  }

  public getCount(): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count`);
  }

  public getCountByCreator(creatorId: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/creator/${creatorId}`);
  }

  public getCountByProjectLeader(projectLeaderId: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/project-leader/${projectLeaderId}`);
  }




  public getCountAddedAfter(days: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/date/${days}`);
  }

  public getCountByCreatorAndAddedAfter(creatorId: number, days: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/creator/date?creatorId=${creatorId}&days=${days}`);
  }

  public getCountByProjectLeaderAndAddedAfter(projectLeaderId: number, days: number): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/project-leader/date?projectLeaderId=${projectLeaderId}&days=${days}`);
  }




  public getCountByStatus(status: string): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/status/${status}`);
  }

  public getCountByAssigneeAndStatus(assigneeId: number, status: string): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/assignee/status?assigneeId=${assigneeId}&status=${status}`);
  }

  public getCountByProjectLeaderIdAndStatus(projectLeaderId: number, status: string): Observable<number>
  {
    return this.httpClient.get<number>(`${this.host}/bug/count/project-leader/status?projectLeaderId=${projectLeaderId}&status=${status}`);
  }
}


