import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.luv2shopApiUrl + "/orders";

  constructor(private _httpClient: HttpClient) { }

  getOrderHistroy(theEmail: string) : Observable<GetResponseOrderHistory>{
    // need to build url based on the customer email
    const orderHistryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this._httpClient.get<GetResponseOrderHistory>(orderHistryUrl);
  }
}
interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}
