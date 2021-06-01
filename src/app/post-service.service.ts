import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {

  constructor(private http:HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
    })
  };

  apiKeyParams = (apiKey: string, action: string)=>{
    return new HttpParams().set('key',apiKey).set('ACTION', action);
  };

  

  apiBaseUrl = 'https://cdn-api.co-vin.in/api/v2/admin/location/';
  postData(data,backendUrl,apiKey, action):Observable<any> {
    return this.http.post(backendUrl, data ,{
      params:this.apiKeyParams(apiKey, action)
    });
  }

  getStates(): any {
    return this.http.get(`${this.apiBaseUrl}states/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getDistricts(stateId: string): any {
    return this.http.get(`${this.apiBaseUrl}districts/${stateId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  unsubscribe(data, backendUrl, apiKey, action): Observable<any>  {
    return this.http.post(backendUrl, data ,{
      params:this.apiKeyParams(apiKey, action)
    });
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }
}
