import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './order/modal/modal.component';
import { OrderReturnMessageComponent } from './order/order-return-message/order-return-message.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';
import { TokenService } from './shared/token.service';
import { SoundsService } from './shared/sounds.service';
import { SettingsComponent } from './settings/settings.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { MatSidenavModule, MatIconModule, MatListModule, MatTabsModule, MatExpansionModule, MatSelectModule } from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import { InventoryWithSuppliersComponent } from './inventory/inventory-with-suppliers/inventory-with-suppliers.component';
import { SuppliersComponent } from './inventory/suppliers/suppliers.component';
import { SupplierEditComponent } from './inventory/suppliers/supplier-edit/supplier-edit.component';





@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    HeaderComponent,
    NavigationComponent,
    ModalComponent,
    OrderReturnMessageComponent,
    InventoryComponent,
    InventoryDetailComponent,
    SettingsComponent,
    LoginComponent,
    HomeComponent,
    InventoryWithSuppliersComponent,
    SuppliersComponent,
    SupplierEditComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    


    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,

    BrowserAnimationsModule
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [AuthGuard,TokenService,SoundsService,{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
