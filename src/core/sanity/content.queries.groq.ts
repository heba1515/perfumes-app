import { defineQuery } from 'groq';

export const FRAGRANCE_CATEGORIES_QUERY = defineQuery(`*[_type == "fragranceCategory" && $surface in surfaces] | order(sortOrder asc){
  title,
  subtitle,
  imageUrl,
  badge,
  filterType,
  filterValue
}`);

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  brandName,
  hero{
    eyebrow,
    title,
    description,
    primaryLabel,
    secondaryLabel,
    "featuredProduct": featuredProduct->{
      "id": _id,
      name,
      price,
      imageUrl,
      description
    }
  },
  metrics[]{value, label},
  story{
    eyebrow,
    title,
    description,
    imageUrl,
    "featuredProduct": featuredProduct->{
      "id": _id,
      name,
      price,
      imageUrl,
      description
    },
    promises
  }
}`);
