import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private _oktaAuth: OktaAuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler) : Promise<HttpEvent<any>>{

    //only add a access token for secured endpoint
    const theEndPoint = environment.luv2shopApiUrl + '/orders'
    const securedEndpoints = [theEndPoint];

    if(securedEndpoints.some(url => request.urlWithParams.includes(url))){
      // const access Token
      const accessToken = await this._oktaAuth.getAccessToken();
      // clone the request and add new header with access token
      request = request.clone({
        setHeaders : {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return next.handle(request).toPromise();
  }
}
