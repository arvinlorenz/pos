import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { TokenService } from "../shared/token.service";

@Injectable({providedIn:'root'})
export class InventoryService{

    skuResponse;
    private skuResponseUpdated = new Subject<any>();
    skuDetails;

    constructor(private http: HttpClient, private router: Router, private tokenService: TokenService){}
    
    setSkuDetails(skuDetails){
        this.skuResponse = skuDetails;
        this.skuResponseUpdated.next(this.skuResponse);
      }
    
    getSkuDetailsUpdateListener(){
        return this.skuResponseUpdated.asObservable();
    }

    getSkuDetails(sku:string){
        let url = `https://as-ext.linnworks.net/api/Stock/GetStockItemsByKey`;
        let params = {
            stockIdentifier:{
                "Key": sku,
                "LocationId": "00000000-0000-0000-0000-000000000000"
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    
    setQuantity(sku:string,quantity:string){
        let url = `https://as-ext.linnworks.net/api/Stock/SetStockLevel`;
        let params = {
            stockLevels:[{
                "SKU": sku,
                "LocationId": "00000000-0000-0000-0000-000000000000",
                "Level": quantity
              }]
            };
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
}