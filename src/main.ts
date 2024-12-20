import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(FormsModule)],
}).catch((err) => console.error(err));