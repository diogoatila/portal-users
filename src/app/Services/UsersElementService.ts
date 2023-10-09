import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UsersElement } from "../Models/UsersElement";

@Injectable()
export class UsersElementService{
    userApiUrl = 'https://localhost:7038/api/' 
    constructor(private http: HttpClient){}

    getUsers(): Observable<UsersElement[]>{
        return this.http.get<UsersElement[]>(this.userApiUrl+'Users/ListarUsuarios');
    }

    createUser(element: UsersElement): Observable<UsersElement>{
        return this.http.post<UsersElement>(this.userApiUrl+'Users/AdicionarUsuario', element);
    }

    editUser(element: UsersElement): Observable<UsersElement>{
        return this.http.put<UsersElement>(this.userApiUrl+'Users/AtualizarUsuario', element);
    }

    deleteUser(element: UsersElement): Observable<UsersElement>{
        return this.http.post<UsersElement>(this.userApiUrl+'Users/DeletarUsuario', element);
    }
    
    uploadFile(formData: FormData): Observable<FormData>{
        return this.http.post<FormData>(this.userApiUrl+'Historico/Upload', formData);
    }

    downloadFile(document: string){
        return this.http.get(`${this.userApiUrl}Historico/Download?documento=${document}`,{
            responseType: 'blob' as 'json'
        });
    }
}