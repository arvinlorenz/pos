import { Component, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  form;
  skuDetails;
  skuDetailsSub: Subscription;

  constructor(private inventoryService: InventoryService) { }

  ngOnInit() {
    this.form = new FormGroup({
      skuKey: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    

  }



  checkSku(){
    this.inventoryService.getSkuDetails(this.form.value.skuKey).subscribe((resSku:any[])=>{
      if(resSku.length === 0){
        requestAnimationFrame;
      }
      else{
        console.log(resSku)
        let itemDetails = {
          itemNumber: resSku[0].ItemNumber,
          available: resSku[0].Available,
          quantity: resSku[0].Quantity,
          openOrder:resSku[0].InOrder,
          due: resSku[0].Due,
          bin: resSku[0].binRack
  
        }
        this.inventoryService.setSkuDetails(itemDetails)
      }
      
    });
  }


}
