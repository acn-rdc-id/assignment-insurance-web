import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { NxSpinnerComponent } from '@aposin/ng-aquila/spinner';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { routes } from './app.routes';
import { LoadingService } from './services/loading.service';

@Component({
	selector: 'app-root',
	imports: [
		RouterModule,
		AsyncPipe,
		NxSpinnerComponent,
		SiteHeaderComponent,
		SiteFooterComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
	showSiteHeader: boolean = false;
	showSiteFooter: boolean = true;
	loading$: Observable<boolean>;
	private appRoutes = routes;
	private router = inject(Router);
	private loadingService = inject(LoadingService);
	private unsubscribe$ = new Subject();

	constructor() {
		this.loading$ = this.loadingService.loading$;
	}

	ngOnInit(): void {
		this.routesListener();
	}
	
	private routesListener(): void {
		this.router.events
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(event => {
				if (event instanceof NavigationEnd) {
					console.log(this.appRoutes.find((route) => event.urlAfterRedirects.includes(route.path ? route.path : '') && route.path !== ''));
					if (!event.urlAfterRedirects.includes('login')) {
						this.showSiteHeader = true;
					} else {
						this.showSiteHeader = false;
					}

					if (!this.appRoutes.find((route) => 
						event.urlAfterRedirects.includes(route.path ? route.path : '') && route.path !== ''
					)) {
						this.showSiteHeader = false;
						this.showSiteFooter = false;
					}
				}
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next('');
		this.unsubscribe$.complete();
	}
}
