import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterModule,
        SiteFooterComponent
    ],
    templateUrl: './app.component.html',
})
export class AppComponent {

}
