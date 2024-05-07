import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Category} from "../interfaces/category.interface";
import {Observable} from "rxjs";
import {Message} from "../interfaces/message.inteface";

@Injectable({
  providedIn: 'root'
})

export class CategoriesService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {

  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/api/category`);
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/api/category/${id}`);
  }

  create(name: string, image?: File): Observable<Category> {
    const formData = new FormData();

    if (image) {
      formData.append('image', image, image.name)
    }

    formData.append('name', name)

    return this.http.post<Category>(`${this.baseUrl}/api/category`, formData)
  }

  update(id: string | undefined, name: string, image?: File): Observable<Category> {
    const formData = new FormData();

    if (image) {
      formData.append('image', image, image.name);
    }

    formData.append('name', name);

    return this.http.patch<Category>(`${this.baseUrl}/api/category/${id}`, formData)
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`${this.baseUrl}/api/category/${id}`)
  }
}
