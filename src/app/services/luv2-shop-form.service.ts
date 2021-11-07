import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = environment.luv2shopApiUrl + '/countries';
  private stateUrl = environment.luv2shopApiUrl + '/states';

  constructor(private _httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this._httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string) : Observable<State[]>{
    // search url
    const searchStateUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this._httpClient.get<GetResponseState>(searchStateUrl).pipe(
      map(response=> response._embedded.states)
    )
  }

  getCreditCardMonths(startMonth: number):Observable<number[]> {
    let data: number[] = [];
    // build an array for "month" dropdownlist
    // start at current month and loop
    var theMonth: number = 0;
    for(theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears() : Observable<number[]> {
    let data: number[] = [];
    // build an array for "year" dropdownlist list
    // start at current year and loop for next 10 year
    const startYear:number = new Date().getFullYear(); // get current Year
    const endYear: number = startYear + 10;
    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}

interface GetResponseCountries{
   _embedded: {
     countries : Country[];
   }
}

interface GetResponseState{
  _embedded: {
    states : State[];
  }
}
