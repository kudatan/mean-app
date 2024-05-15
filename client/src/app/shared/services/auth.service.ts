import {Injectable} from "@angular/core";
import {AuthInterface} from "../interfaces/auth.interface";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private token: string | null = localStorage.getItem('auth-token');
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

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
            this.setToken(token);
            this.authStatus.next(this.isAuthenticated());
          }
        )
      );
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth-token', token);
    } else {
      localStorage.removeItem('auth-token');
    }
    this.token = token;
    this.authStatus.next(this.isAuthenticated());
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthStatusListener() {
    return this.authStatus.asObservable();
  }

  logout() {
    this.setToken(null);
    this.authStatus.next(this.isAuthenticated());
    localStorage.removeItem('auth-token');
    localStorage.clear();
  }
}
