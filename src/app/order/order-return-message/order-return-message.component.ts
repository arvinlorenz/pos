import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../order.service';

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
        
        if(res === 'NO DATA FOUND'){
          this.returnResponse = null;
        }

        else if(res.ProcessedOrders.Data != undefined){
          this.returnResponse = res;
          this.orderStatus = 'Order already processed';
          //this.orderNumber = this.returnResponse.ProcessedState ;
          this.orderCustomerName =  this.returnResponse.ProcessedOrders.Data[0].ChannelBuyerName;
          this.orderProcessDate = this.returnResponse.ProcessedOrders.Data[0].dProcessedOn;
        }
        
        else{
          console.log(this.returnResponse);
          this.returnResponse = res;
          this.orderStatus = this.returnResponse.ProcessedState;
          //this.orderNumber = this.returnResponse.ProcessedState ;
          this.orderCustomerName =  this.returnResponse.OrderSummary.CustomerName;
          this.orderProcessDate = this.returnResponse.OrderSummary.ProcessDate;
        }
        
      })
  }
  ngOnDestroy(){
    this.getReturnResSub.unsubscribe();
  }
}
