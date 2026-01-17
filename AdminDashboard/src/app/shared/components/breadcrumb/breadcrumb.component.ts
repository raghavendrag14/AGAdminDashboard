import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgForOf, NgIf } from '@angular/common';
import {  } from '@angular/router';


interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [NgForOf, NgIf,RouterLink],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
homeurl: string = '/dashboard';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // populate immediately (in case component initializes after initial navigation)
    this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
    //this.breadcrumbs.push({ label: 'Home', url: '/dasboard' });
    console.log('[Breadcrumb] initial breadcrumbs:', this.breadcrumbs);
    console.log('[Breadcrumb] current url:', this.router.url);

    // update on subsequent navigations
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
      console.log('[Breadcrumb] updated breadcrumbs after navigation:', this.breadcrumbs);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }
    console.log('Final breadcrumbs:', breadcrumbs);
    return breadcrumbs;
  }
}
