import { Component, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  form;
  skuDetails;
  skuDetailsSub: Subscription;

  constructor(private inventoryService: InventoryService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      skuKey: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    

  }



  checkSku(){
    this.router.navigate(['/sku', this.form.value.skuKey]);
    
  }


}
