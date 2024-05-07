import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AnalyticsPage, OverviewPage} from "../interfaces/analytics.interface";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getOverview(): Observable<OverviewPage> {
    return this.http.get<OverviewPage>(`${this.baseUrl}/api/analytics/overview`);
  }

  getAnalytics(): Observable<AnalyticsPage> {
    return this.http.get<AnalyticsPage>(`${this.baseUrl}/api/analytics/analytics`);
  }
}
