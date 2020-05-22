import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { FormsModule }   from '@angular/forms';
import { format } from 'url';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  recuerdame :boolean= false;

  auth2: any;

  constructor(public router: Router,  public _usuariosService : UsuarioService) { }

  ngOnInit() {
    this.googleInit();
   

    this.email = localStorage.getItem('email')  || '';
    if ( this.email.length > 1 ){
      this.recuerdame = true;
    }

  }

  googleInit(){

    gapi.load('auth2', ()=> { 
      this.auth2 = gapi.auth2.init({
          client_id:'614089019288-sn2inh4jeu1jpsmrrq8mvp5759ro8qtj.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope:'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    })
  }

  attachSignin(element){

    this.auth2.attachClickHandler(element, {}, (googleUser)=>{

      let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token

      this._usuariosService.loginGoogle( token )
        .subscribe(  () => window.location.href= '#/dashboard');
      console.log (token);
    });
  }


  ingresar( forma: NgForm){

   //console.log('form invalido', forma.invalid );
    if (forma.invalid){

      return;
    }
    if (forma.value.password === undefined){
      forma.value.password ='';
    }
    console.log('form email:',forma.value.email);
    console.log('form pass:',forma.value.password);
    let usuario = new Usuario(null, forma.value.email, forma.value.password);
    //console.log('entra a login');
    this._usuariosService.login(usuario, forma.value.recuerdame)
        .subscribe( correcto => this.router.navigate(['/dashboard']) );
           
        //this.router.navigate(['/dashboard']);
   }
}
