import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({providedIn:'root'})
export class OrderService{
    processCount = 0;
    private processCountUpdated = new Subject<number>();

    returnResponse;
    private returnResponseUpdated = new Subject<any>();

    token = '';
    tokenIsAvailable = false;
    ErrorAudio: HTMLAudioElement = new Audio('sounds/error.wav');
    SuccessAudio: HTMLAudioElement = new Audio('sounds/success.wav');

    constructor(private http: HttpClient, private router: Router){}
    
    incrementProcessCount(){
        this.processCount++;
        this.processCountUpdated.next(this.processCount);
    }
    
    getProcessCountUpdateListener(){
        return this.processCountUpdated.asObservable();
    }



    setReturnResponse(message){
        this.returnResponse = message;
        console.log(this.returnResponse)
        this.returnResponseUpdated.next(this.returnResponse);
    }

    getReturnResponseUpdateListener(){
        return this.returnResponseUpdated.asObservable();
    }

    playSuccess(){
        this.SuccessAudio.play();
    }
    playError(){
        this.ErrorAudio.play();
    }
    getToken(){
        return this.token;
    }
    getNewToken(){
        
         let params = { token : '17568c13cd21c66574768a82d927f697',
                        applicationId : 'db3695da-e3b3-4d92-8981-5d8dee809f46',
                        applicationSecret : '2004f0b7-9dae-4a95-9337-feaf450ef996' };

        this.http
        .get(
            "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
            {params}
        )
        .subscribe((responseData:any) => {
            this.token = responseData.Token;
            this.tokenIsAvailable = true;
            //console.log(responseData)
        });

        
    }
    processOrder(orderId:string){
        if(this.tokenIsAvailable === false){
            console.log('no available token yet')
            return;
        }
        let url = `https://as-ext.linnworks.net/api/Orders/ProcessOrderByOrderOrReferenceId`;
        let params = {
            request:{
                "OrderOrReferenceId": orderId,
                "LocationId": "00000000-0000-0000-0000-000000000000",
                "ScansPerformed": true,
                "OrderProcessingNotesAcknowledged": true
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.token) };
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
        const options = {  headers: new HttpHeaders().set('Authorization', this.token) };
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
        const options = {  headers: new HttpHeaders().set('Authorization', this.token) };
        return  this.http.post(url,params,options);
    }
    
}