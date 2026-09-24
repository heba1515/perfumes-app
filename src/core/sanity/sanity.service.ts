import { createClient, type QueryParams, type SanityClient } from '@sanity/client';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class SanityService {
    private readonly client: SanityClient = createClient({
        projectId: environment.sanity.projectId,
        dataset: environment.sanity.dataset,
        apiVersion: environment.sanity.apiVersion,
        useCdn: true,
    });

    fetch<QueryResult>(query: string, params?: QueryParams): Promise<QueryResult> {
        return params === undefined
            ? this.client.fetch<QueryResult>(query)
            : this.client.fetch<QueryResult>(query, params);
    }
}
