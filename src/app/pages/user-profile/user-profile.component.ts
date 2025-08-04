import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserDTO } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user!: UserDTO;         // Données utilisateur chargées depuis backend
  selectedFile?: File;    // Fichier image sélectionné par l'utilisateur avant upload
  previewUrl?: string;    // URL base64 de l'image sélectionnée pour prévisualisation locale

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = 10; // Exemple ID utilisateur

    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.user = data;

        // À l'initialisation, pas d'image locale sélectionnée => previewUrl undefined
        this.previewUrl = undefined;

        // Affiche dans console l'URL reçue (utile pour debug)
        console.log('Image URL backend:', this.user.imageUrl);
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
      }
    });
  }

  /** Lorsqu'un fichier est sélectionné via input file */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();

      // Crée un URL base64 pour prévisualisation locale immédiate
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  /** Soumission du formulaire de mise à jour */
  onSubmit(): void {
    const formData = new FormData();

    // Ajout des champs texte
    formData.append('username', this.user.username);
    formData.append('email', this.user.email);
    formData.append('bio', this.user.bio || '');

    // Ajout du fichier image uniquement s'il y en a un sélectionné
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    // Envoi de la requête PUT multipart/form-data au backend
    this.userService.updateUserWithImage(this.user.id!, formData).subscribe({
      next: (response) => {
        alert('Profil mis à jour avec succès !');
        this.user = response;

        // On supprime la preview locale pour ne plus afficher l'ancienne image base64
        this.previewUrl = undefined;

        // On ajoute un timestamp à l'URL image pour éviter le cache navigateur
        if (this.user.imageUrl) {
          this.user.imageUrl = this.user.imageUrl.split('?')[0] + '?t=' + new Date().getTime();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour :', error);
        alert('Erreur lors de la mise à jour du profil.');
      }
    });
  }

  /** Suppression du profil */
  onDelete(): void {
    if (confirm('Voulez-vous vraiment supprimer ce profil ?')) {
      this.userService.deleteUser(this.user.id!).subscribe({
        next: () => {
          alert('Profil supprimé.');
          this.user = undefined!;
          this.previewUrl = undefined;
        },
        error: () => alert('Erreur suppression profil.')
      });
    }
  }
}
