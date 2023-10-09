import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';
import { UsersElement } from 'src/app/Models/UsersElement';
import { UsersElementService } from 'src/app/Services/UsersElementService';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UsersElementService]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>
  displayedColumns: string[] = ['nome', 'sobrenome', 'dataNascimento', 'documento', 'escolaridade',  'actions'];
  dataSource!: UsersElement[];
  constructor(
    public dialog: MatDialog,
    public userElementService: UsersElementService
    ) { 
      this.userElementService.getUsers()
      .subscribe((data: UsersElement[]) => {
        this.dataSource = data
      });
    }

  ngOnInit(): void {
  }
  openDialog(element: UsersElement | null): void{
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      data: element === null ? {
        id: 0,
        nome: '',
        sobrenome:'',
        dataNascimento: null,
        documento: '',
        escolaridadeId: 0
      } : {
        id:  element.id,
        nome: element.nome,
        sobrenome: element.sobrenome,
        dataNascimento: element.dataNascimento,
        documento: element.documento,
        escolaridadeId: element.escolaridadeId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){

        if(this.dataSource.map(p => p.id).includes(result.id)){
          this.userElementService.editUser(result)
          .subscribe((data: any)=>{
            this.dataSource[result.id] = result;

            if(data.includes("Erro")){
              alert(data);
            }else{
              alert('Usuário editado com sucesso!');
            }
            
            location.reload();
          
          });
          
        }else{
          this.userElementService.createUser(result)
          .subscribe((data: any)=>{
            this.dataSource.push(data)

            if(data.includes("Erro")){
              alert(data);
            }else{
              alert('Usuário inserido com sucesso!');
            }
            location.reload();
            
          });
         
        }
        
      }
  
    });
  }
  deleteElement(element: UsersElement): void{
    this.userElementService.deleteUser(element)
    .subscribe(()=>{
      this.dataSource = this.dataSource.filter(u => u.id !== element.id);
    });
    
  }
  editElement(element: UsersElement): void{
    this.openDialog(element)
  }

  inputFileChange(event: any, element: UsersElement): any{
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('Nome', element.nome);
      formData.append('Documento', element.documento);
      formData.append('CaminhoArquivo', file);
      this.userElementService.uploadFile(formData)
    .subscribe((data: any)=>{
      alert(data)
    });
    }
  }

  downloadFile(documento: string){
    this.userElementService.downloadFile(documento)
    .subscribe((res: any)=>{
         
      const file = new Blob([res],{
        type: res.type
      });

      if (res.type == "application/force-download"){
        alert('Este documento não possui histórico!');
      }else{

      const blob = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = blob;
      if(file.type == "application/pdf"){
        link.download = 'historico.pdf';
      }else{
        link.download = 'historico.docx';
      }
      
      link.click();
      window.URL.revokeObjectURL(blob);
      link.remove();
      alert('Download com sucesso!');
    }
    
    
    });
    

  }
}
