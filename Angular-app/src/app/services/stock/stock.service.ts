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
export class StockService {
  base_url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getStockData() {
    return this.http.get<any>(this.base_url + `/api/stock/customer`)
  }
  
  updateStockAll(updatedItems: any){
    return this.http.put(`${this.base_url}/api/stock/update/array`, {stockItems: updatedItems}, httpOptions)
  }

  updateStockItem(updatedItem: any){
    return this.http.put(`${this.base_url}/api/stock/${updatedItem.id}`,  updatedItem, httpOptions)
  }
}