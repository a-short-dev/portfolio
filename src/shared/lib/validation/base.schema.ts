import { z } from 'zod'

// Shared ID schema using top-level primitive
export const idSchema = z.uuid({ message: 'Invalid UUID format' })

// Email schema (normalized with trimming and lowercasing)
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: 'Invalid email address' }))

// Strict Password schema
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(100, { message: 'Password cannot exceed 100 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })

// Username schema
export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: 'Username must be at least 3 characters' })
  .max(30, { message: 'Username cannot exceed 30 characters' })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  })

// Global E.164 Phone Schema
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, {
    message: 'Phone number must be a valid E.164 international format (e.g. +12345678901)',
  })

// URL schema
export const urlSchema = z.url({ message: 'Invalid URL format' })

// Core Entity schema mixin
export const baseEntitySchema = z.object({
  id: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Soft delete mixin
export const softDeleteSchema = z.object({
  deletedAt: z.date().nullable().optional(),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int({ message: 'Page must be an integer' }).min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// Inferred TypeScript Types
export type BaseEntity = z.infer<typeof baseEntitySchema>
export type PaginationInput = z.infer<typeof paginationSchema>