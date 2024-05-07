import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Position} from "../interfaces/position.interface";
import {Message} from "../interfaces/message.inteface";

@Injectable({
  providedIn: 'root'
})

export class PositionsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  fetch(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.baseUrl}/api/position/${categoryId}`);
  }

  create(position: Position): Observable<Position> {
    return this.http.post<Position>(`${this.baseUrl}/api/position`, position);
  }

  update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`${this.baseUrl}/api/position/${position._id}`, position);
  }

  delete(position: Position): Observable<Message> {
    return this.http.delete<Message>(`${this.baseUrl}/api/position/${position._id}`);
  }
}
