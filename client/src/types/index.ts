export type SystemStatus = 'Active' | 'Under Maintenance' | 'Deprecated' | 'Planned';
export type SystemCriticality = 'Critical' | 'High' | 'Medium' | 'Low';
export type EnvironmentType = 'Production' | 'Staging' | 'Development' | 'Testing';
export type BusinessDomain =
  | 'Finance'
  | 'HR'
  | 'Sales'
  | 'Operations'
  | 'IT'
  | 'Customer Service'
  | 'Marketing'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
}

export interface SoftwareSystem {
  id: string;
  systemId: string;
  name: string;
  description: string;
  businessDomain: BusinessDomain | string;
  domainOwner: string;
  ownerEmail: string;
  developmentTeam?: string | null;
  technologyStack: string;
  programmingLanguage?: string | null;
  framework?: string | null;
  database?: string | null;
  infrastructure?: string | null;
  repositoryUrl?: string | null;
  documentationUrl?: string | null;
  environment: EnvironmentType | string;
  status: SystemStatus | string;
  criticality: SystemCriticality | string;
  version?: string | null;
  deploymentDate?: string | null;
  lastUpdated: string;
  dependencies?: string | null;
  securityNotes?: string | null;
  complianceRequirements?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SoftwareFormData {
  systemId: string;
  name: string;
  description: string;
  businessDomain: string;
  domainOwner: string;
  ownerEmail: string;
  developmentTeam?: string;
  technologyStack: string;
  programmingLanguage?: string;
  framework?: string;
  database?: string;
  infrastructure?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  environment: string;
  status: string;
  criticality: string;
  version?: string;
  deploymentDate?: string;
  dependencies?: string;
  securityNotes?: string;
  complianceRequirements?: string;
  notes?: string;
}

export interface SoftwareFilterState {
  search: string;
  status: string;
  environment: string;
  criticality: string;
  businessDomain: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface DashboardStats {
  total: number;
  active: number;
  maintenance: number;
  deprecated: number;
  planned: number;
  critical: number;
}

export interface DistributionItem {
  name: string;
  count?: number;
  value?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: Array<{ field: string; message: string }>;
}
