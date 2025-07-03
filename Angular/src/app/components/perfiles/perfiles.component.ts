import { Component, OnInit, ViewChild} from '@angular/core';
import { Registro } from '../../models/registro';
import { RegistroService } from 'src/app/services/registro.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import {SelectionModel} from '@angular/cdk/collections';
import { HttpService } from "src/app/services/http.service";


@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css'],
  providers: [RegistroService,AuthService]
})
export class PerfilesComponent implements OnInit {

  
  public perfiles: Registro[] = [];
  public registro!: Registro;
  public status!: String;
  selection = new SelectionModel<any>(true, []);;

  

  constructor(
    private _registroService: RegistroService,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    public authService : AuthService,
    public http: HttpService
  ) { 
    this.registro = {
      _id: '',
      date: '',
      nombre: '',
      correo: '',
      perfil: '',
      setena: '',
      acceso: false
    }
   
  }

  listData!: MatTableDataSource<any>;
  displayedColumns: string[] = ['_id', 'nombre', 'email', 'perfil', 'setena', 'acceso', 'actions'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchKey!: string;


  ngOnInit() {
    this.traerPerfiles();
  }

  traerPerfiles(){
    this._registroService.getRegistros(true).subscribe(
      response => { 
        if(response.registro){
          this.perfiles = response.registro;
           this.listData = new MatTableDataSource(response.registro);
           this.listData.sort = this.sort;
           this.listData.paginator = this.paginator; 
        }
      },
       error => {
        console.log(error);
      }
    );
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }





    selectRow($event: any, dataSource: any) {
      const acceso = true;
      this.registro.acceso = acceso;
      this.registro._id = dataSource._id;
      this.registro.date = new Date();
      this.registro.nombre = dataSource.nombre;
      this.registro.correo = dataSource.email;
      this.registro.perfil = dataSource.perfil;
      this.registro.setena = dataSource.setena;
    
      if ($event.checked) {
        this._registroService.update(dataSource._id, this.registro).subscribe(
          (response) => {
            if (response.status === 'success') {
              this.status = 'success';
              this.registro = response.registroUpdated;
    
              // ✅ Enviar correo de aprobación
              const aprobado = {
                nombre: dataSource.nombre,
                email: dataSource.email,
                perfil: dataSource.perfil,
                setena: dataSource.setena
              };
    
              this.http.sendApprovalEmail("https://origenes.museocostarica.go.cr:3900/sendApprovalMail", aprobado)
                .subscribe(
                  (res) => {
                    Swal.fire('Perfil Editado', 'Cambios aplicados y correo enviado', 'success');
                  },
                  (err) => {
                    console.error("Error al enviar correo de aprobación:", err);
                    Swal.fire('Perfil Editado', 'Cambios aplicados, pero no se pudo enviar el correo', 'warning');
                  }
                );
    
              this.traerPerfiles();
    
            } else {
              this.status = 'error';
            }
          },
          (error) => {
            console.log(error);
            this.status = 'error';
          }
        );
      }
    }
      

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.listData.data.forEach(row => this.selection.select(row));
  }

  openDialog(selected:any){ 
      this._router.navigate(['/', selected])
  }

  delete(id: any) {

    Swal.fire({

      title: 'Esta seguro de Borrar?',

      text: 'No podra recuperar el perfil!',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Si, Borrar!',

      cancelButtonText: 'No, Mantener'

    }).then((result) => {

      if (result.value) {

        this._registroService.delete(id).subscribe(
          response => {

            this._router.navigate(['/perfiles']);
            this.traerPerfiles();
          },
          error => {
            console.log(error);
            this._router.navigate(['/perfiles']);
          }

        );

        Swal.fire(

          'Borrado!',

          'El perfil ha sido borrado.',

          'success'

        )

      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire(

          'Cancelado',

          'El perfil se mantiene',

          'error'

        )

      }

    })

  }


  deny(user:any) {
      
      this.http.sendRejectionEmail("https://origenes.museocostarica.go.cr:3900/sendRejectionMail", user).subscribe(
        data => {
          let res:any = data; 
          /* console.log(
            `👏 > 👏 > 👏 > 👏 ${user.name} is successfully register and mail has been sent and the message id is ${res.messageId}`
          ); */
          Swal.fire(
  
            'Registro Orígenes',
    
            'Correo fué enviado, el usuario fué denegado',
    
            'success'
          )
          
        },
        err => {
          console.log(err);
        }
      );
  
  
    }

    get totalAprobados(): number {
  return this.perfiles.filter(p => p.acceso === true).length;
}

get totalRechazados(): number {
  return this.perfiles.filter(p => p.acceso === false).length;
}

  }
