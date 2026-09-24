import { defineQuery } from 'groq';

export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"] | order(_createdAt desc){
  "id": _id,
  name,
  description,
  price,
  category,
  imageUrl,
  rating,
  reviewCount,
  "inStock": inStock == "in-stock",
  "scentFamily": scentFamily->name,
  "occasion": occasion->name,
  options
}`);

export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && _id == $id][0]{
  "id": _id,
  name,
  description,
  price,
  category,
  imageUrl,
  rating,
  reviewCount,
  "inStock": inStock == "in-stock",
  "scentFamily": scentFamily->name,
  "occasion": occasion->name,
  options
}`);
