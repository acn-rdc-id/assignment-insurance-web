import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { routes } from './app.routes';

@Component({
	selector: 'app-root',
	imports: [
		RouterModule,
		SiteFooterComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	showSiteFooter: boolean = true;
	private appRoutes = routes;
	private router = inject(Router);

	ngOnInit(): void {
		this.router.events.subscribe(event => {
			// TODO: Add checking for site-header
			if (event instanceof NavigationEnd) {
				if (!this.appRoutes.find((route) => {
					return event.urlAfterRedirects.includes(route.path ? route.path : '') && route.path !== '';
				})) {
					this.showSiteFooter = false;
				}
			}
		});
	}
}
