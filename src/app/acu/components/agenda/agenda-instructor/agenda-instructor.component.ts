import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AcuService } from '@acu/services/acu.service';
import { SeleccionarAccionAgendaComponent } from '../modals/seleccionar-accion-agenda/seleccionar-accion-agenda.component';
import { SeleccionarFechaComponent } from '../modals/seleccionar-fecha/seleccionar-fecha.component';
export interface AgendaElement {
  Instructor: string;
  Hora0: string;
  Hora1: string;
  Hora2: string;
  Hora3: string;
  Hora4: string;
  Hora5: string;
  Hora6: string;
  Hora7: string;
  Hora8: string;
  Hora9: string;
  Hora10: string;
  Hora11: string;
  Hora12: string;
  Hora13: string;
  Hora14: string;
  Hora15: string;
  Hora16: string;
  Hora17: string;
  Hora18: string;
  Hora19: string;
  Hora20: string;
  Hora21: string;
  Hora22: string;
  Hora23: string;
  Hora24: string;
}
export interface DataAgenda {
  Hora: number;
  MovCod: number;
  Valor: string;
  Disponible: boolean;
  AluId: string;
  AluApe1: string;
  EsAgCuInsId: string;
  EsAgCuInsNom: string;
  EsAgCuInsNomCorto: string;
  TipCurId: number;
  HoraCoche: string;
  AluNro: number;
  InsEst: string;
  TipCurEst: string;
  EscCurEst: string;
  EsAgCuEst: string;
  EsAgCuAviso: number;
  MovilEstado: string;
  Situacion: string;
  HorasNoDisponibles: string;
  claseCelda: string;
}

export interface Cell {
  value: string;
  class: string;
  existe: boolean;
}


@Component({
  selector: 'app-agenda-instructor',
  templateUrl: './agenda-instructor.component.html',
  styleUrls: ['./agenda-instructor.component.scss']
})
export class AgendaInstructorComponent implements OnInit, AfterViewInit {

  animal: string;
  name: string;
  sabadoODomingo: number;
  verAgenda: boolean;

  hoy = new Date();
  agendaDisplayedColumns: string[];
  columns: string[] = [];
  agendaDataSource: AgendaElement[];
  agenda: any[] = [];
  moviles: any[] = [];
  horas: any[] = [];
  fechaClase = '';
  fecha: Date;
  auxFechaClase: Date = new Date();

  horaMovilPlano: DataAgenda[] = null;

  constructor(
    private acuService: AcuService,
    public dialog: MatDialog,
    // tslint:disable-next-line: variable-name
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    console.log('Fuciona?');
    this.fecha = new Date();
    this.getAgenda(this.fecha);
  }

  makeDataSource(
    horas: any[],
    moviles: any[]) {

    const col: any[] = [];

    for (const m of moviles) {

      const o = {};
      // tslint:disable-next-line: no-string-literal
      o['Instructor'] = m.MovCod;

      for (const h of horas) {
        const cell = this.existeEnHorasMoviles(h, m);

        o['class' + h.Hora] = cell.class;
        // tslint:disable-next-line: no-string-literal
        o['existe' + h.Hora] = cell.existe;
        o['Hora' + h.Hora] = cell.value;
      }

      col.push(o);
    }
    return col;
  }

  existeEnHorasMoviles(hora: any, movil: any): Cell {
    const cell: Cell = {
      value: '',
      class: '',
      existe: false
    };
    for (const h of this.horaMovilPlano) {
      if (h.Hora === hora.Hora && h.MovCod === movil.MovCod) {
        cell.value = `${h.EsAgCuInsId} ${h.AluApe1.substring(0, 10)}`;
        cell.class = h.claseCelda;
        cell.existe = true;
      }
    }
    return cell;

  }


  showAlert(movil: number, hora: number, existe: boolean): void {
    const text = `Movil: ${movil} ; Hora: ${hora} ; Existe:  ${existe}`;

    const celda = document.getElementById(`${movil}${hora}`);
    celda.getAttribute('class');
    console.log(text);
    localStorage.setItem('fechaClase', this.fechaClase);
    localStorage.setItem('fecha', JSON.stringify(this.fecha));
    localStorage.setItem('movil', movil.toString());
    localStorage.setItem('hora', hora.toString());
    localStorage.setItem('existe', existe.toString());

    const mainParameters = {
      fecha: this.fechaClase,
      movil,
      hora,
      class: celda.getAttribute('class'),
      text: celda.innerHTML,
    };

    localStorage.setItem('mainParameters', JSON.stringify(mainParameters));
    const t = this._bottomSheet.open(SeleccionarAccionAgendaComponent);
    t.afterDismissed().subscribe(() => {
      console.log('fin open sheet');

      const refreshAgenda = localStorage.getItem('refreshAgenda');
      const refreshLiberaAgenda = localStorage.getItem('refreshLiberaAgenda');

      if (refreshLiberaAgenda) {
        localStorage.removeItem('refreshLiberaAgenda');
        celda.removeAttribute('class');
        celda.innerHTML = '';
        celda.classList.add('cdk-cell', 'mat-cell', `cdk-column-${hora}`, `mat-column-${hora}`, 'cell', 'ng-star-inserted');
      }

      if (refreshAgenda) {
        const classOld = localStorage.getItem('classOld');
        const textOld = localStorage.getItem('textOld');

        if (localStorage.getItem('limpiarCeldaOld')) {
          const oldParameters = JSON.parse(localStorage.getItem('copiarMoverParameters'));
          const celdaOld = document.getElementById(`${oldParameters.movilOld}${oldParameters.horaOld}`);
          celdaOld.removeAttribute('class');
          celdaOld.innerHTML = '';
          celdaOld.classList.add(
            'cdk-cell',
            'mat-cell',
            `cdk-column-${oldParameters.horaOld}`,
            `mat-column-${oldParameters.horaOld}`,
            'cell', 'ng-star-inserted'
          );
          localStorage.removeItem('copiarMoverParameters');
          localStorage.removeItem('limpiarCeldaOld');
        }
        const arrayClass: string[] = classOld.split(' ');
        localStorage.removeItem('classOld');
        localStorage.removeItem('textOld');

        localStorage.removeItem('refreshLiberaAgenda');
        celda.removeAttribute('class');
        celda.innerHTML = textOld;
        arrayClass.forEach(element => {
          console.log('class: ', element);
          celda.classList.add(element);
        });
      }
    });

  }


  ngAfterViewInit() {
    this.getAgenda(this.fecha);

  }

  liberarDia() {

    this.confirmacionUsuario(
      'Confirmación de Usuario',
      'ATENCIÓN: Se procederá a liberar las clases, elimnando los registros actuales. ¿Confirma el proceso?')
      .then((result) => {
        if (result.value) {
          this.accionGeneralDia('liberar');
        }
      });

  }

  moverDia() {

    this.confirmacionUsuario(
      'Confirmación de Usuario',
      `ATENCIÓN: Se procederá a mover las clases, eliminando los registros actuales.
    ¿Confirma el proceso?`)
      .then((result) => {
        if (result.value) {
          this.accionGeneralDia('mover');
        }
      });

  }

  duplicarDia() {

    this.confirmacionUsuario(
      'Confirmación de Usuario',
      `ATENCIÓN: Se procederá a duplicar las clases, haciendo una copia los registros actuales a una nueva fecha.
    ¿Confirma el proceso?`)
      .then((result) => {
        if (result.value) {
          this.accionGeneralDia('duplicar');
        }
      });

  }

  accionGeneralDia(accion: string) {
    this.seleccionarFecha()
      .subscribe((fechaSeleccionada: Date) => {
        if (fechaSeleccionada) {

          this.finAccionGeneralDia(fechaSeleccionada, accion);

        }
      });
  }

  finAccionGeneralDia(fechaSeleccionada, accion) {


    if (accion === 'liberar') {
      // acuservice.liberarDiaAgenda
      this.acuService.liberarDiaAgenda(fechaSeleccionada)
        .subscribe((response: any) => {

          console.log('liberarDiaAgenda: ', response);

          this.getAgenda(fechaSeleccionada);

          this.mensajeConfirmacion('Confirmado!', 'Se libero el día, correctamente.').then((res2) => {
            if (res2.dismiss === Swal.DismissReason.timer) {
              console.log('Cierro  con el timer');
            }
          });
        });
    } else {

      this.confirmacionUsuario(
        'Confirmación de Usuario',
        `ATENCIÓN: Desea marcar las clases para avisar al alumno?`)
        .then((result2) => {

          console.log('Resultado:: ', result2);
          let EsAgCuAviso = 0;
          if (result2.value) {

            EsAgCuAviso = 1;

          }

          switch (accion) {
            case 'duplicar':
              this.acuService.duplicarDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso
              }).subscribe((response: any) => {
                console.log('duplicarDiaAgenda: ', response);

                this.getAgenda(this.fecha);

                this.mensajeConfirmacion('Confirmado!', response.mensaje).then((res2) => {
                  if (res2.dismiss === Swal.DismissReason.timer) {
                    console.log('Cierro  con el timer');
                  }
                });

              });

              break;
            case 'mover':
              this.acuService.moverDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso
              }).subscribe((response: any) => {
                console.log('moverDiaAgenda: ', response);


                this.getAgenda(this.fecha);

                this.mensajeConfirmacion('Confirmado!', response.mensaje).then((res2) => {
                  if (res2.dismiss === Swal.DismissReason.timer) {
                    console.log('Cierro  con el timer');
                  }
                });

              });

              break;

            default:
              break;
          }


        });

    }
  }


  mensajeConfirmacion(title, text) {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 5000,
      showConfirmButton: false,
      onClose: () => {
        console.log('Cieerro antes de timer');
      }
    });
  }

  confirmacionUsuario(title, text) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });
  }

  seleccionarFecha() {

    const fechaDialogRef = this.dialog.open(SeleccionarFechaComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        fecha: this.auxFechaClase,
        invalidFechaAnterior: true,
      }
    });

    return fechaDialogRef.afterClosed();
  }

  diaAnterior() {
    const result = new Date(this.fecha);
    result.setDate(result.getDate() - 1);
    this.sabadoODomingo = result.getDay();
    this.fecha = result;
    this.getAgenda(this.fecha);
  }

  diaSiguiente() {
    this.agendaDataSource = [];
    const result = new Date(this.fecha);
    result.setDate(result.getDate() + 1);
    this.sabadoODomingo = result.getDay();
    this.fecha = result;
    this.getAgenda(this.fecha);

  }

  getAgenda(fecha: Date) {
    this.verAgenda = false;
    const strFecha = this.formatDateToString(fecha);
    this.acuService.getAgendaPorFecha(strFecha, 'instructor')
      .subscribe((res: any) => {
        console.log('Agenda: ', res);

        this.agenda = res.TablaAgenda;
        this.moviles = res.TablaAgenda.Moviles;
        this.horas = res.TablaAgenda.Horas;
        this.fechaClase = res.TablaAgenda.FechaClase;
        this.columns = this.horas.map(item => item.Hora.toString());
        this.horaMovilPlano = res.TablaAgenda.HoraMovilPlano;
        this.agendaDataSource = this.makeDataSource(this.horas, this.moviles);

        this.agendaDisplayedColumns = ['Instructor'];
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat(this.columns);
        this.verAgenda = true;

      });
  }

  formatDateToString(fecha: Date): string {
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    let strDay;
    let strMonth;
    const strYear = year.toString();

    if (day < 10) {
      strDay = '0' + day.toString();
    } else {
      strDay = day.toString();
    }

    if (month < 10) {
      strMonth = '0' + month.toString();
    } else {
      strMonth = month.toString();
    }
    return `${strYear}-${strMonth}-${strDay}`;

  }
}
