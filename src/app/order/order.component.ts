import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material';

import { OrderService } from './order.service';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  processCount:number = 0;
  pCountSub: Subscription;
  form: FormGroup;

  


  constructor(
    private orderService: OrderService,
    public dialog: MatDialog) { }

  ngOnInit() {

    this.form = new FormGroup({
      orderNumber: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });

    this.pCountSub = this.orderService.getProcessCountUpdateListener().subscribe(processCount=>{
      this.processCount = processCount;
    })
  }

  processOrder(){

    if(this.form.invalid){return;}
    this.orderService.processOrder(this.form.value.orderNumber).subscribe((responseData:any) => {
 
        if(responseData.ProcessedState == 'PROCESSED'){
          this.orderService.incrementProcessCount();
          this.orderService.setReturnResponse(responseData);
          this.orderService.playSuccess();  
          this.form.reset();
        }

        else if(responseData.ProcessedState === 'NOT_PROCESSED'){
            if(responseData.Message === `The order ${this.form.value.orderNumber} with postal service Tracked requires tracking number`){
                const dialogRef = this.dialog.open(ModalComponent, {
                  width: '250px',
                  data: {orderId: responseData.OrderId, notHashedOrderId: this.form.value.orderNumber, form: this.form}
                });
            
                dialogRef.afterClosed().subscribe(result => {
                  console.log(`Dialog result: ${result}`);
   
                });
                
            }
            
            else{
              this.orderService.playError(); 
              this.orderService.setReturnResponse(responseData);
            }
        }


        else if(responseData.ProcessedState === 'NOT_FOUND'){

          this.orderService.searchProcessedOrders(this.form.value.orderNumber).subscribe((processedRes:any)=>{
            if(processedRes.ProcessedOrders.Data.length > 0){
              this.orderService.setReturnResponse(processedRes);
              this.form.reset();
            }
            else{
              this.orderService.setReturnResponse('NO DATA FOUND'); 
              this.form.reset();
              this.orderService.playError(); 
            }
          })
        }


        else{
          this.orderService.playError(); 
          console.log(responseData)
        }
    })
  }

  ngOnDestroy(){
    this.pCountSub.unsubscribe();
  }

}
