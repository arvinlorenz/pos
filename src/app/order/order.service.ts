import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { TokenService } from "../shared/token.service";

@Injectable({providedIn:'root'})
export class OrderService{
    processCount = 0;
    private processCountUpdated = new Subject<number>();

    returnResponse:{message:any,orderId:string};
    private returnResponseUpdated = new Subject<any>();


   

    constructor(private http: HttpClient, private router: Router, private tokenService: TokenService){}
    
    incrementProcessCount(){
        this.processCount++;
        this.processCountUpdated.next(this.processCount);
    }
    
    getProcessCountUpdateListener(){
        return this.processCountUpdated.asObservable();
    }



    setReturnResponse(message,orderId){
        this.returnResponse = {message,orderId};
        console.log(this.returnResponse)
        this.returnResponseUpdated.next(this.returnResponse);
    }

    getReturnResponseUpdateListener(){
        return this.returnResponseUpdated.asObservable();
    }

    
  
    processOrder(orderId:string){
      
        let url = `https://as-ext.linnworks.net/api/Orders/ProcessOrderByOrderOrReferenceId`;
        let params = {
            request:{
                "OrderOrReferenceId": orderId,
                "LocationId": "00000000-0000-0000-0000-000000000000",
                "ScansPerformed": true,
                "OrderProcessingNotesAcknowledged": true
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    addTrackingNumber(orderId:string, trackingNumber: string){
        console.log(orderId, trackingNumber)
        let url = `https://as-ext.linnworks.net/api/Orders/SetOrderShippingInfo`;
        let params = {
            orderID: orderId,
            info:{
                "PostalServiceId": "00000000-0000-0000-0000-000000000000",
                "TrackingNumber": trackingNumber,
                "ManualAdjust": true
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    searchProcessedOrders(orderId:string){
        let url = `https://as-ext.linnworks.net/api/ProcessedOrders/SearchProcessedOrders`;
        let params = {
            request:{
                "SearchTerm": orderId,
                "PageNumber": 1,
                "ResultsPerPage": 20,
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    
}