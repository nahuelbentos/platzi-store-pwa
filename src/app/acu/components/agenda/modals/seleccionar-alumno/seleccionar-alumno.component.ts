import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgendarClaseComponent } from '../agendar-clase/agendar-clase.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AlumnoData {
  AluId: string;
  AluNro: string;
  AluNom: string;
  AluApe1: string;
  AluNomComp: string;
  AluCI: number;
}

@Component({
  selector: 'app-seleccionar-alumno',
  styleUrls: ['seleccionar-alumno.component.scss'],
  templateUrl: 'seleccionar-alumno.component.html',
})
export class SeleccionarAlumnoComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'AluNro', 'AluNomComp', 'AluCI'];
  dataSource: MatTableDataSource<AlumnoData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<AgendarClaseComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const alumnos = this.data.alumnos;
    console.log('alumnos: ', alumnos);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(alumnos);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
