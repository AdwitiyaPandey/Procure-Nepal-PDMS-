import { z } from 'zod'

export const BuyerRegistrationSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  profilePhoto: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const SellerRegistrationSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  pan: z.string().min(9, 'PAN must be valid'),
  vat: z.string().optional(),
  turnover: z.string().optional(),
  established: z.string().optional(),
  citizenship: z.string().optional(),
  panVatDoc: z.instanceof(File).optional(),
  profilePhoto: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const CreateProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  marginPercentage: z.number().nonnegative('Margin percentage cannot be negative').default(20),
  image: z.instanceof(File).optional(),
})

export const QuoteRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  message: z.string().optional(),
})

// Helper function to validate data
export function validateFormData(schema, data) {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        success: false,
        data: null,
        errors,
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' },
    }
  }
}
