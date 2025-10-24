// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize MongoDB ObjectId - remove any extra characters
 * MongoDB ObjectIds should be exactly 24 hexadecimal characters
 */
export function sanitizeObjectId(id: string): string {
  if (!id) return id;

  // Remove any whitespace
  let sanitized = id.toString().trim();

  // If ID is longer than 24 chars, take only first 24
  if (sanitized.length > 24) {
    sanitized = sanitized.substring(0, 24);
  }

  // Remove any non-hexadecimal characters
  sanitized = sanitized.replace(/[^a-f0-9]/gi, "");

  return sanitized;
}

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  if (!id) return false;
  const sanitized = sanitizeObjectId(id);
  return /^[a-f0-9]{24}$/i.test(sanitized);
}

/**
 * Generate a URL-friendly slug from product name and ID
 * Format: product-name-mongodbObjectId
 * Example: gold-ring-507f1f77bcf86cd799439011
 */
export function generateSlug(name: string, id: string): string {
  // Sanitize the ID first
  const cleanId = sanitizeObjectId(id);

  // Sanitize the name
  const slugName = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Combine name and ID
  return `${slugName}-${cleanId}`;
}

/**
 * Extract MongoDB ObjectId from slug
 * Slug format: product-name-24hexchars
 */
export function extractIdFromSlug(slug: string): string | null {
  if (!slug) return null;

  // Match exactly 24 hex characters at the end of the string
  const match = slug.match(/([a-f0-9]{24})$/i);

  if (match && match[1]) {
    const extractedId = sanitizeObjectId(match[1]);

    if (extractedId.length === 24) {
      return extractedId;
    }
  }

  return null;
}
