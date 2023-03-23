import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {LoaderService} from "../service/loader.service";

const methodsToIntercept: string[] = ["PUT", "POST"]

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests: number = 0;


  constructor(private loadingService: LoaderService) {}

  intercept(request: HttpRequest<unknown>, httpHandler: HttpHandler): Observable<HttpEvent<unknown>>
  {
    if(!methodsToIntercept.includes(request.method))
    {
      return httpHandler.handle(request);
    }

    this.totalRequests++;
    this.loadingService.setLoading(true);
    return httpHandler.handle(request).pipe(
      finalize(() =>
      {
        this.totalRequests--;
        if (this.totalRequests == 0)
        {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
