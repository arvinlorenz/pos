import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '../order.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  trackingNumber:string;
  successResponse;
  constructor(public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public orderService: OrderService) { }

  ngOnInit() {
  }

  closeDialog(responseData) {
    this.dialogRef.close(responseData);
  }
  processTrackingNumber(){
    this.orderService.addTrackingNumber(this.data.orderId, this.trackingNumber)
    .subscribe(responseData =>{
      this.orderService.processOrder(this.data.notHashedOrderId)
      .subscribe((responseData:any)=>{
        if(responseData.ProcessedState == 'PROCESSED'){
         
          this.orderService.incrementProcessCount();
          this.orderService.playSuccess(); 
          this.orderService.setReturnResponse(responseData,this.data.orderId);
          this.data.form.reset();
          this.closeDialog(responseData);
          
        }
        
      })
    })
  }

}
