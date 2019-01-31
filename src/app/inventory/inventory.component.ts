import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild("skuKey") skuKeyField: ElementRef;
  constructor(private inventoryService: InventoryService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      skuKey: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.skuKeyField.nativeElement.focus();

    

  }



  checkSku(){
    this.router.navigate(['/sku', this.form.value.skuKey]);
    
  }


}
