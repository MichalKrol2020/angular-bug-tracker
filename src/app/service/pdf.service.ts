import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  private generatePdf(userId: number)
  {
    return this.httpClient.get<Blob>(`${this.host}/pdf/${userId}`,
      {
        responseType: 'blob' as 'json',
        observe: 'response'
      });
  }

  public downloadPdf(projectLeaderId: number)
  {
    this.generatePdf(projectLeaderId).subscribe((response: any) =>
    {
      let blob = new Blob([response.body], {type: 'application/pdf'});

      let downloadUrl = window.URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = downloadUrl;

      let contentDisposition = response.headers.get('Content-Disposition')
      link.download = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
      link.click();
    })
  }
}

