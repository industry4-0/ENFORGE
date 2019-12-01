import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  base_url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getTasksByPlan(plan_id: string) {
    return this.http.get<any>(this.base_url + `/api/tasks/customer/${plan_id}`)
  }

  getPartList(plan_id){
    return this.http.get<any>(this.base_url + `/api/manufacturings/generatePlans/${plan_id}`)
  }
  getPlans(){
      return this.http.get<any>(this.base_url+'/api/manufacturings/customer/1')
  }
}