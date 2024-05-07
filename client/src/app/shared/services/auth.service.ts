import {Injectable} from "@angular/core";
import {AuthInterface} from "../interfaces/auth.interface";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private token: string | null = null;

  constructor(private http: HttpClient) {
  }

  register(user: AuthInterface): Observable<AuthInterface> {
    return this.http.post<AuthInterface>(`${this.baseUrl}/api/auth/register`, user);
  }

  login(user: AuthInterface): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.baseUrl}/api/auth/login`, user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
          }
        )
      );
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth-token', token);
    }
    return this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);

    localStorage.clear();
  }
}
