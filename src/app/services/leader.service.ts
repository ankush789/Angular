import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { of, Observable  } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-http-msg.service';


@Injectable({
  providedIn: 'root',
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>( baseURL + 'leadership')
     .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getDish(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedDish(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'Leadership?featured=true').pipe(map(leadership => leadership[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }


}
