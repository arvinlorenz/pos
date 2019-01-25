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
        validators: [Validators.required, Validators.minLength(10)]
      })
    });

    this.pCountSub = this.orderService.getProcessCountUpdateListener().subscribe(processCount=>{
      this.processCount = processCount;
    })
  }

  processOrder(){
    this.orderService.processOrder(this.form.value.orderNumber).subscribe(responseData => {
 
        if(responseData.ProcessedState == 'PROCESSED'){
          this.orderService.incrementProcessCount();
          this.orderService.playSuccess();  
          this.form.reset();
        }

        else if(responseData.ProcessedState === 'NOT_PROCESSED'){
            if(responseData.Message === `The order ${this.form.value.orderNumber} with postal service Tracked requires tracking number`){
                const dialogRef = this.dialog.open(ModalComponent, {
                  width: '250px',
                  data: {orderId: responseData.OrderId, notHashedOrderId: this.form.value.orderNumber}
                });
            
                dialogRef.afterClosed().subscribe(result => {
                  console.log(`Dialog result: ${result}`); 
                });
                
            }
            else{
              this.orderService.playError(); 
            }
        }
        else{
          this.orderService.playError(); 
        }
    })
  }

  ngOnDestroy(){
    this.pCountSub.unsubscribe();
  }

}
