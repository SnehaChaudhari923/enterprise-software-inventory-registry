import { api } from './api.js';
import { SoftwareSystem, SoftwareFormData, SoftwareFilterState, ApiResponse } from '../types/index.js';

export const softwareService = {
  getSoftwareList: async (params: Partial<SoftwareFilterState>): Promise<{
    success: boolean;
    data: SoftwareSystem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.environment && params.environment !== 'ALL') query.append('environment', params.environment);
    if (params.criticality && params.criticality !== 'ALL') query.append('criticality', params.criticality);
    if (params.businessDomain && params.businessDomain !== 'ALL') query.append('businessDomain', params.businessDomain);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const qs = query.toString();
    return api.get(`/software${qs ? `?${qs}` : ''}`);
  },

  getSoftwareById: async (id: string): Promise<ApiResponse<SoftwareSystem>> => {
    return api.get<ApiResponse<SoftwareSystem>>(`/software/${id}`);
  },

  createSoftware: async (data: SoftwareFormData): Promise<ApiResponse<SoftwareSystem>> => {
    return api.post<ApiResponse<SoftwareSystem>>('/software', data);
  },

  updateSoftware: async (id: string, data: Partial<SoftwareFormData>): Promise<ApiResponse<SoftwareSystem>> => {
    return api.put<ApiResponse<SoftwareSystem>>(`/software/${id}`, data);
  },

  deleteSoftware: async (id: string): Promise<ApiResponse<null>> => {
    return api.delete<ApiResponse<null>>(`/software/${id}`);
  },

  exportCsv: async (params: Partial<SoftwareFilterState>): Promise<void> => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.environment && params.environment !== 'ALL') query.append('environment', params.environment);
    if (params.criticality && params.criticality !== 'ALL') query.append('criticality', params.criticality);
    if (params.businessDomain && params.businessDomain !== 'ALL') query.append('businessDomain', params.businessDomain);

    const qs = query.toString();
    const blob = await api.getBlob(`/software/export/csv${qs ? `?${qs}` : ''}`);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise-software-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
