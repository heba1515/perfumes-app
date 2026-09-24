import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SanityService } from './sanity.service';
import { FRAGRANCE_CATEGORIES_QUERY, SITE_SETTINGS_QUERY } from './content.queries.groq';
import { SanityFragranceCategory, SanitySiteSettings } from './content.model';

@Injectable({ providedIn: 'root' })
export class SanityContentService {
    private readonly sanity = inject(SanityService);

    getCategories(surface: 'home' | 'categories'): Observable<SanityFragranceCategory[]> {
        return from(
            this.sanity.fetch<SanityFragranceCategory[]>(FRAGRANCE_CATEGORIES_QUERY, { surface }),
        );
    }

    getSiteSettings(): Observable<SanitySiteSettings | null> {
        return from(this.sanity.fetch<SanitySiteSettings | null>(SITE_SETTINGS_QUERY));
    }
}
