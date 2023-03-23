import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Project} from "../model/project";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {User} from "../model/user";
import {ProjectPageableResponse} from "../model/project-pageable-response";

@Injectable({
  providedIn: 'root'
})
export class ProjectService
{
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public addProject(projectLeaderId: number, project: Project): Observable<Project>
  {
    return this.httpClient.post<Project>(`${this.host}/project/${projectLeaderId}`, project)
  }

  public editProject(projectLeaderId: number, currentName: string, formData: FormData): Observable<Project>
  {
    return this.httpClient.put<Project>(`${this.host}/project/${projectLeaderId}`, formData)
  }

  public deleteProject(projectId: number): Observable<Project>
  {
    return this.httpClient.delete<Project>(`${this.host}/project/${projectId}`)
  }

  public addParticipants(projectId: number, participants: User[]): Observable<CustomHttpResponse>
  {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/project/${projectId}/participants`, participants);
  }

  public unassignParticipant(projectId: number, participantId: number): Observable<CustomHttpResponse>
  {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/project/${projectId}/${participantId}`)
  }

  public getProjectsByParticipantId(participantId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<ProjectPageableResponse>
  {
    return this.httpClient.get<ProjectPageableResponse>(`${this.host}/project/projects/participant?participantId=${participantId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }

  public getProjectsByProjectLeaderId(projectLeaderId: number, page: number, size: number, sortOrder: string, ascending: boolean): Observable<ProjectPageableResponse>
  {
    return this.httpClient.get<ProjectPageableResponse>(`${this.host}/project/projects/project-leader?projectLeaderId=${projectLeaderId}&page=${page}&size=${size}&sortOrder=${sortOrder}&ascending=${ascending}`)
  }
}

