import { api } from './api.js';
import { DashboardStats, SoftwareSystem, DistributionItem } from '../types/index.js';

export const dashboardService = {
  getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    return api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
  },

  getRecent: async (limit = 5): Promise<{ success: boolean; data: SoftwareSystem[] }> => {
    return api.get<{ success: boolean; data: SoftwareSystem[] }>(`/dashboard/recent?limit=${limit}`);
  },

  getTechnologyDistribution: async (): Promise<{ success: boolean; data: DistributionItem[] }> => {
    return api.get<{ success: boolean; data: DistributionItem[] }>('/dashboard/technology-distribution');
  },

  getDomainDistribution: async (): Promise<{ success: boolean; data: DistributionItem[] }> => {
    return api.get<{ success: boolean; data: DistributionItem[] }>('/dashboard/domain-distribution');
  },

  getCriticalityDistribution: async (): Promise<{ success: boolean; data: DistributionItem[] }> => {
    return api.get<{ success: boolean; data: DistributionItem[] }>('/dashboard/criticality-distribution');
  },

  getStatusDistribution: async (): Promise<{ success: boolean; data: DistributionItem[] }> => {
    return api.get<{ success: boolean; data: DistributionItem[] }>('/dashboard/status-distribution');
  },
};
