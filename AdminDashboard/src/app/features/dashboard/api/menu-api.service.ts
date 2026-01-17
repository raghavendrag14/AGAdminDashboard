import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { MenuResponse } from '../models/menu.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class MenuApiService {
	private api = inject(ApiService);

	/**
	 * Fetch menus from backend and normalize into Menu[]
	 * endpoint: /roles/getAllMenu
	 */
	getMenus(): Observable<MenuResponse> {
		return this.api.get<MenuResponse>('menus/getAllMenu');
	}
}

