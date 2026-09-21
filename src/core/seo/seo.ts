import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONFIG } from '@core/config';

export interface SeoMetadata {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'product';
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly config = inject(APP_CONFIG, { optional: true });
  private readonly doc = inject(DOCUMENT);

  updateMetadata(meta: SeoMetadata): void {
    const fullTitle = this.config?.appName
      ? `${meta.title} | ${this.config.appName}`
      : meta.title;

    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: meta.description });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: meta.description });
    this.metaService.updateTag({ property: 'og:type', content: meta.type ?? 'website' });

    const canonicalUrl = this.buildUrl(meta.path);
    if (canonicalUrl) {
      this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
      this.updateCanonicalLink(canonicalUrl);
    }

    if (meta.imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: meta.imageUrl });
      this.metaService.updateTag({ name: 'twitter:image', content: meta.imageUrl });
    }

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: meta.description });
  }

  setStructuredData(schema: object): void {
    const existing = this.doc.getElementById('structured-data-json-ld');
    if (existing) {
      existing.remove();
    }

    const script = this.doc.createElement('script');
    script.id = 'structured-data-json-ld';
    script.type = 'application/ld+json';
    // Escaping '<' prevents XSS in serialized JSON-LD
    script.text = JSON.stringify(schema).replace(/</g, '\\u003c');
    this.doc.head.appendChild(script);
  }

  private buildUrl(path?: string): string | null {
    if (!this.config?.siteUrl) return null;
    const base = this.config.siteUrl.replace(/\/$/, '');
    if (!path) return base;
    const cleanPath = path.replace(/^\//, '');
    return `${base}/${cleanPath}`;
  }

  private updateCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
