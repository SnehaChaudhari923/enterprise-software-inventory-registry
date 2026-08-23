import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { SEED_ADMIN, SEED_SOFTWARE_SYSTEMS } from '../data/seedData.js';

export interface SoftwareSystemData {
  id?: string;
  systemId: string;
  name: string;
  description: string;
  businessDomain: string;
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
  environment?: string;
  status?: string;
  criticality?: string;
  version?: string | null;
  deploymentDate?: Date | string | null;
  lastUpdated?: Date | string;
  dependencies?: string | null;
  securityNotes?: string | null;
  complianceRequirements?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  department?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class DatabaseService {
  private isDbConnected: boolean | null = null;

  public async checkDatabaseConnection(): Promise<boolean> {
    if (this.isDbConnected !== null) return this.isDbConnected;
    try {
      await prisma.$queryRaw`SELECT 1`;
      this.isDbConnected = true;
      console.log('✅ Connected to Database via Prisma ORM.');
      return true;
    } catch (err) {
      this.isDbConnected = false;
      console.warn('⚠️ Prisma database connection warning:', err);
      return false;
    }
  }

  // --- USER METHODS ---

  async findUserByEmailOrUsername(identifier: string): Promise<UserData | null> {
    const isDb = await this.checkDatabaseConnection();
    const clean = identifier.trim();

    if (isDb) {
      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: clean } },
              { name: { equals: clean } },
            ],
          },
        });
        if (user) return user as UserData;

        // Also check case-insensitive match by searching all users if exact match fails
        const allUsers = await prisma.user.findMany();
        const matched = allUsers.find(
          (u) =>
            u.email.toLowerCase() === clean.toLowerCase() ||
            u.name.toLowerCase() === clean.toLowerCase() ||
            (clean.toLowerCase() === 'admin' && u.email.toLowerCase().includes('admin'))
        );
        if (matched) return matched as UserData;
      } catch (err) {
        console.error('Prisma user query error:', err);
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<UserData | null> {
    const isDb = await this.checkDatabaseConnection();
    if (isDb) {
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (user) return user as UserData;
      } catch (err) {
        console.error('Prisma findUserById error:', err);
      }
    }
    return null;
  }

  // --- SOFTWARE SYSTEM CRUD & FILTER METHODS ---

  async findSoftwareSystems(params: {
    search?: string;
    status?: string;
    environment?: string;
    criticality?: string;
    businessDomain?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    systems: SoftwareSystemData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const isDb = await this.checkDatabaseConnection();
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const skip = (page - 1) * limit;
    const sortBy = params.sortBy || 'lastUpdated';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

    if (isDb) {
      try {
        const where: any = {};

        if (params.status && params.status !== 'ALL') {
          where.status = { equals: params.status };
        }
        if (params.environment && params.environment !== 'ALL') {
          where.environment = { equals: params.environment };
        }
        if (params.criticality && params.criticality !== 'ALL') {
          where.criticality = { equals: params.criticality };
        }
        if (params.businessDomain && params.businessDomain !== 'ALL') {
          where.businessDomain = { equals: params.businessDomain };
        }

        if (params.search) {
          const q = params.search.trim();
          where.OR = [
            { name: { contains: q } },
            { systemId: { contains: q } },
            { domainOwner: { contains: q } },
            { technologyStack: { contains: q } },
            { description: { contains: q } },
          ];
        }

        const [total, systems] = await Promise.all([
          prisma.softwareSystem.count({ where }),
          prisma.softwareSystem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
          }),
        ]);

        return {
          systems: systems as SoftwareSystemData[],
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      } catch (err) {
        console.error('Prisma findSoftwareSystems error:', err);
      }
    }

    return { systems: [], total: 0, page: 1, limit, totalPages: 1 };
  }

  async findSoftwareById(id: string): Promise<SoftwareSystemData | null> {
    const isDb = await this.checkDatabaseConnection();
    if (isDb) {
      try {
        const item = await prisma.softwareSystem.findFirst({
          where: {
            OR: [{ id }, { systemId: id }],
          },
        });
        if (item) return item as SoftwareSystemData;
      } catch (err) {
        console.error('Prisma findById error:', err);
      }
    }
    return null;
  }

  async findSoftwareBySystemId(systemId: string): Promise<SoftwareSystemData | null> {
    const isDb = await this.checkDatabaseConnection();
    if (isDb) {
      try {
        const item = await prisma.softwareSystem.findUnique({
          where: { systemId },
        });
        if (item) return item as SoftwareSystemData;
      } catch (err) {
        console.error('Prisma findBySystemId error:', err);
      }
    }
    return null;
  }

  async createSoftwareSystem(data: Omit<SoftwareSystemData, 'id' | 'createdAt' | 'updatedAt'>): Promise<SoftwareSystemData> {
    const deploymentDate = data.deploymentDate ? new Date(data.deploymentDate) : null;
    const lastUpdated = new Date();

    const created = await prisma.softwareSystem.create({
      data: {
        ...data,
        deploymentDate,
        lastUpdated,
      },
    });
    return created as SoftwareSystemData;
  }

  async updateSoftwareSystem(id: string, data: Partial<SoftwareSystemData>): Promise<SoftwareSystemData | null> {
    const existing = await this.findSoftwareById(id);
    if (!existing) return null;

    const actualId = existing.id!;
    const deploymentDate = data.deploymentDate !== undefined
      ? (data.deploymentDate ? new Date(data.deploymentDate) : null)
      : existing.deploymentDate;
    const lastUpdated = new Date();

    const updated = await prisma.softwareSystem.update({
      where: { id: actualId },
      data: {
        ...data,
        deploymentDate,
        lastUpdated,
      },
    });
    return updated as SoftwareSystemData;
  }

  async deleteSoftwareSystem(id: string): Promise<boolean> {
    const existing = await this.findSoftwareById(id);
    if (!existing) return false;

    const actualId = existing.id!;
    await prisma.softwareSystem.delete({
      where: { id: actualId },
    });
    return true;
  }

  // --- DASHBOARD & METRICS METHODS ---

  async getDashboardStats() {
    const [total, active, maintenance, deprecated, planned, critical] = await Promise.all([
      prisma.softwareSystem.count(),
      prisma.softwareSystem.count({ where: { status: 'Active' } }),
      prisma.softwareSystem.count({ where: { status: 'Under Maintenance' } }),
      prisma.softwareSystem.count({ where: { status: 'Deprecated' } }),
      prisma.softwareSystem.count({ where: { status: 'Planned' } }),
      prisma.softwareSystem.count({ where: { criticality: 'Critical' } }),
    ]);
    return { total, active, maintenance, deprecated, planned, critical };
  }

  async getRecentSystems(limit = 5): Promise<SoftwareSystemData[]> {
    const items = await prisma.softwareSystem.findMany({
      take: limit,
      orderBy: { lastUpdated: 'desc' },
    });
    return items as SoftwareSystemData[];
  }

  async getStatusDistribution() {
    const list = await prisma.softwareSystem.findMany({ select: { status: true } });
    const counts: Record<string, number> = {
      Active: 0,
      'Under Maintenance': 0,
      Deprecated: 0,
      Planned: 0,
    };

    for (const item of list) {
      const status = item.status || 'Active';
      if (counts[status] !== undefined) {
        counts[status]++;
      } else {
        counts[status] = (counts[status] || 0) + 1;
      }
    }

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  async getTechnologyDistribution() {
    const list = await prisma.softwareSystem.findMany({
      select: { technologyStack: true, programmingLanguage: true },
    });
    const counts: Record<string, number> = {};

    for (const item of list) {
      const tokens = (item.technologyStack || '')
        .split(/[,/|]/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (item.programmingLanguage) {
        tokens.push(item.programmingLanguage.split('/')[0].trim());
      }

      for (const token of tokens) {
        let tag = token;
        if (tag.toLowerCase().includes('react')) tag = 'React';
        else if (tag.toLowerCase().includes('node')) tag = 'Node.js';
        else if (tag.toLowerCase().includes('postgres')) tag = 'PostgreSQL';
        else if (tag.toLowerCase().includes('python') || tag.toLowerCase().includes('django') || tag.toLowerCase().includes('fastapi')) tag = 'Python';
        else if (tag.toLowerCase().includes('java') || tag.toLowerCase().includes('spring')) tag = 'Java / Spring';
        else if (tag.toLowerCase().includes('go') || tag.toLowerCase().includes('gin')) tag = 'Go';
        else if (tag.toLowerCase().includes('docker') || tag.toLowerCase().includes('kubernetes') || tag.toLowerCase().includes('eks') || tag.toLowerCase().includes('gke')) tag = 'Docker / K8s';
        else if (tag.toLowerCase().includes('aws')) tag = 'AWS Cloud';
        else if (tag.toLowerCase().includes('azure')) tag = 'Azure Cloud';
        else if (tag.toLowerCase().includes('redis')) tag = 'Redis';

        counts[tag] = (counts[tag] || 0) + 1;
      }
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count]) => ({ name, count }));
  }

  async getDomainDistribution() {
    const list = await prisma.softwareSystem.findMany({ select: { businessDomain: true } });
    const counts: Record<string, number> = {};

    for (const item of list) {
      const domain = item.businessDomain || 'Other';
      counts[domain] = (counts[domain] || 0) + 1;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }

  async getCriticalityDistribution() {
    const list = await prisma.softwareSystem.findMany({ select: { criticality: true } });
    const counts: Record<string, number> = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    for (const item of list) {
      const crit = item.criticality || 'Medium';
      if (counts[crit] !== undefined) {
        counts[crit]++;
      } else {
        counts[crit] = 1;
      }
    }

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  async getAllForExport(filters: {
    status?: string;
    environment?: string;
    criticality?: string;
    businessDomain?: string;
    search?: string;
  }): Promise<SoftwareSystemData[]> {
    const result = await this.findSoftwareSystems({
      ...filters,
      page: 1,
      limit: 1000,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    return result.systems;
  }
}

export const db = new DatabaseService();
