import { z } from 'zod';

const optionalUrl = z.string().trim().refine((val) => {
  if (!val || val === '') return true;
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}, { message: 'Must be a valid URL (e.g. https://...)' });

const optionalEmail = z.string().trim().refine((val) => {
  if (!val || val === '') return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}, { message: 'Must be a valid email address' });

export const softwareSystemSchema = z.object({
  systemId: z.string().min(2, 'System ID is required (min 2 characters)').max(50, 'System ID is too long'),
  name: z.string().min(2, 'System Name is required (min 2 characters)').max(150, 'System Name is too long'),
  description: z.string().min(5, 'Description is required (min 5 characters)'),
  businessDomain: z.enum([
    'Finance',
    'HR',
    'Sales',
    'Operations',
    'IT',
    'Customer Service',
    'Marketing',
    'Other'
  ], {
    errorMap: () => ({ message: 'Please select a valid Business Domain' }),
  }),
  domainOwner: z.string().min(2, 'Domain Owner is required'),
  ownerEmail: optionalEmail,
  developmentTeam: z.string().optional().nullable(),
  technologyStack: z.string().min(2, 'Technology stack summary is required'),
  programmingLanguage: z.string().optional().nullable(),
  framework: z.string().optional().nullable(),
  database: z.string().optional().nullable(),
  infrastructure: z.string().optional().nullable(),
  repositoryUrl: optionalUrl.optional().nullable(),
  documentationUrl: optionalUrl.optional().nullable(),
  environment: z.enum(['Production', 'Staging', 'Development', 'Testing']).default('Production'),
  status: z.enum(['Active', 'Under Maintenance', 'Deprecated', 'Planned']).default('Active'),
  criticality: z.enum(['Critical', 'High', 'Medium', 'Low']).default('Medium'),
  version: z.string().optional().nullable(),
  deploymentDate: z.string().or(z.date()).optional().nullable(),
  dependencies: z.string().optional().nullable(),
  securityNotes: z.string().optional().nullable(),
  complianceRequirements: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const softwareSystemUpdateSchema = softwareSystemSchema.partial();

export const softwareQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  environment: z.string().optional(),
  criticality: z.string().optional(),
  businessDomain: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().default('lastUpdated'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SoftwareSystemInput = z.infer<typeof softwareSystemSchema>;
export type SoftwareQueryInput = z.infer<typeof softwareQuerySchema>;
