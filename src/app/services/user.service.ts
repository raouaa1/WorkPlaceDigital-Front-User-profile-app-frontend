import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface DTO côté frontend
export interface UserDTO {
  id?: number;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  imageUrl?: string;  
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/user-profiles';

  constructor(private http: HttpClient) {}

  /** Récupérer profil utilisateur par ID */
  getUser(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
  }

  /** Mettre à jour profil AVEC image (multipart/form-data) */
  updateUserWithImage(id: number, formData: FormData): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/${id}/update-profile`, formData);
  }

  /** Supprimer profil */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Récupérer tous les profils */
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl);
  }
}
