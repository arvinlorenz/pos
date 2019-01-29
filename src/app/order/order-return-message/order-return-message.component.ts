import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-return-message',
  templateUrl: './order-return-message.component.html',
  styleUrls: ['./order-return-message.component.css']
})
export class OrderReturnMessageComponent implements OnInit, OnDestroy {
  getReturnResSub:Subscription;

  returnResponse;
  orderStatus;
  orderNumber;
  orderCustomerName;
  orderProcessDate;
  constructor(public orderService:OrderService) { }

  ngOnInit() {
    this.getReturnResSub = this.orderService.getReturnResponseUpdateListener()
      .subscribe(res=>{
        
        if(res.message === 'NO DATA FOUND'){
          this.returnResponse = null;
        }

        else if(res.message.ProcessedState === 'PROCESSED'){
          console.log(this.returnResponse);
          this.returnResponse = res;
          this.orderStatus = this.returnResponse.message.ProcessedState;
          this.orderNumber = this.returnResponse.message.OrderSummary.NumOrderId ;
          this.orderCustomerName =  this.returnResponse.message.OrderSummary.CustomerName;
          this.orderProcessDate = moment(this.returnResponse.message.OrderSummary.ProcessDate,"YYYY-MM-DD HH:mm Z"); 
        }

        //(res.ProcessedOrders.Data != undefined && res.ProcessedOrders.Data != null)
        else{
          console.log(res)
          this.returnResponse = res;
          this.orderStatus = 'Order already processed';
          this.orderNumber = this.returnResponse.orderId ;
          this.orderCustomerName =  this.returnResponse.message.ProcessedOrders.Data[0].cFullName;
          
          //   var date = new Date(this.returnResponse.ProcessedOrders.Data[0].dProcessedOn);
          //   var milliseconds = date.getTime(); 
          
          this.orderProcessDate = moment(this.returnResponse.message.ProcessedOrders.Data[0].dProcessedOn,"YYYY-MM-DD h:mm Z"); 
        }
        
        
        
      })
  }
  ngOnDestroy(){
    this.getReturnResSub.unsubscribe();
  }
}
