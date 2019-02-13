import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

declare var $:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
    if(!this.authService.isAuthenticated()){
      $("#wrapper").removeClass("toggled");
    }
    else{
      $("#wrapper").addClass("toggled");
      $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
  
      $(window).resize(function(e) {
        if($(window).width()<=768){
          $("#wrapper").removeClass("toggled");
        }else{
          $("#wrapper").addClass("toggled");
        }
      });
    }
    
    
    this.authService.authTokenUpdateListener().subscribe(a=>{

  
      $("#wrapper").addClass("toggled");
        $("#menu-toggle").click(function(e) {
          e.preventDefault();
          $("#wrapper").toggleClass("toggled");
        });
    
        $(window).resize(function(e) {
          if($(window).width()<=768){
            $("#wrapper").removeClass("toggled");
          }else{
            $("#wrapper").addClass("toggled");
          }
        });
      
      
    })
    
  }

  onLogout(){
    this.authService.logout();
  }
}
