import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto.model';
import { URL_SERVICIOS } from '../config/config';
import  swal from 'sweetalert';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from './usuario.service';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  producto: Producto;
  token:string;
  

  constructor(public http: HttpClient, public _usuarioService : UsuarioService,
              public router: Router) { }

  cargarProductos(desde: number = 0){

    let url =URL_SERVICIOS +'/producto?desde='+ desde;

    return this.http.get(url);
  }
 
  cargarProducto( id: string ){
    console.log( id );
    let url =URL_SERVICIOS +'/producto/'+ id;
        //url += '?token=' + this._usuarioService.token;

      return this.http.get(url)
         .map ((resp:any) => resp.producto);
         //return resp.producto;
  }

  

  crearProducto( producto: Producto){
    let url = URL_SERVICIOS + '/producto';
        url += '?token=' + this._usuarioService.token;
    return this.http.post(url, producto)
      .map( (resp: any) =>{

          swal('Producto creado', producto.nombre, 'success')
          return resp.producto;

      })
      .catch( err =>{

        ///console.log (err.error.mensaje);
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return Observable.throw(err);
      });
  }

  actualizarProducto(producto: Producto){

  let url = URL_SERVICIOS + '/producto/' + producto._id;
  url += '?token='+ this._usuarioService.token;
  //console.log ('url: '+ url);
  return this.http.put(url, producto)
          .map( (resp:any) => {

            
            swal('Producto Actualizado', producto.nombre, 'success' );
            return true;
            
          })
          .catch( err =>{

            ///console.log (err.error.mensaje);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return Observable.throw(err);
          });
  

  }

  borrarProducto( id: string ){

    let url =URL_SERVICIOS +'/producto/' + id;
         url += '?token=' + this._usuarioService.token;
 
      return this.http.delete(url)
         .map(resp =>{
           swal('Producto borrado', 'El producto ha sido eliminada correctamente','success');
           return true;
         });
 
   }

}
