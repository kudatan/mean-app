import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Order, OrderResponse} from "../interfaces/order.interface";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class OrdersService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/api/order`, order);
  }

  fetch(params: any): Observable<OrderResponse> {
    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

    return this.http.get<OrderResponse>(`${this.baseUrl}/api/order?${queryString}`);
  }
}
