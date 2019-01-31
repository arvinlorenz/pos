import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';


import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './order/modal/modal.component';
import { OrderReturnMessageComponent } from './order/order-return-message/order-return-message.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';
import { TokenService } from './shared/token.service';
import { SoundsService } from './shared/sounds.service';




@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    HeaderComponent,
    ModalComponent,
    OrderReturnMessageComponent,
    InventoryComponent,
    InventoryDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,

    BrowserAnimationsModule
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [TokenService,SoundsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
