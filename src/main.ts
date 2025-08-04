import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ⬅️ ajouter ça
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // ⬅️ ici pour activer HttpClient dans les services
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
});
