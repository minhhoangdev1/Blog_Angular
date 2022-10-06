import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppInitializerService } from 'src/services/app-initializer.service';
import { BlogService,BLOG_SERVICE } from 'src/services/blog.service';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './common/interceptors/token.interceptor';
import { GlobalErrorHandler } from './common/validators/global-error-handler';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DetailblogComponent } from './detailblog/detailblog.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
export function appInitializerFactory(service: AppInitializerService) {
  return () => service.initialize();
}
// AoT requires an exported function for factories
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomeComponent,
    FooterComponent,
    AdminComponent,
    DetailblogComponent,
    AboutComponent,
    ContactComponent,
  ],
  imports: [
    CKEditorModule,
    BrowserModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud"),
    RouterModule.forRoot([
      { path: '', component:HomeComponent},
      { path: 'about', component:AboutComponent},
      { path: 'contact', component:ContactComponent},
      { path: 'detail/:id', component:DetailblogComponent},
      { path: 'admin', component: AdminComponent},
      { path: '**', component: NotfoundComponent },
     
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AppInitializerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: BLOG_SERVICE, useClass: BlogService },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AppInitializerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
