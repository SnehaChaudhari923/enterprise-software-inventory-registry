import { Response } from 'express';
import { db } from '../services/db.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const getSoftwareList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      status,
      environment,
      criticality,
      businessDomain,
      page = 1,
      limit = 10,
      sortBy = 'lastUpdated',
      sortOrder = 'desc',
    } = req.query as any;

    const data = await db.findSoftwareSystems({
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      environment: environment ? String(environment) : undefined,
      criticality: criticality ? String(criticality) : undefined,
      businessDomain: businessDomain ? String(businessDomain) : undefined,
      page: Number(page),
      limit: Number(limit),
      sortBy: String(sortBy),
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });

    res.status(200).json({
      success: true,
      data: data.systems,
      pagination: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching software list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve software systems',
      error: error.message,
    });
  }
};

export const getSoftwareById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await db.findSoftwareById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: `Software system with identifier '${id}' not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error('Error fetching software by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve software system',
      error: error.message,
    });
  }
};

export const createSoftware = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = req.body;

    // Check systemId uniqueness
    const existing = await db.findSoftwareBySystemId(body.systemId);
    if (existing) {
      res.status(409).json({
        success: false,
        message: `A software system with System ID '${body.systemId}' already exists. Please use a unique identifier.`,
      });
      return;
    }

    const newSystem = await db.createSoftwareSystem({
      ...body,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Software system registered successfully',
      data: newSystem,
    });
  } catch (error: any) {
    console.error('Error creating software system:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create software system',
      error: error.message,
    });
  }
};

export const updateSoftware = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await db.findSoftwareById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Software system with ID '${id}' not found`,
      });
      return;
    }

    // Check systemId uniqueness if changed
    if (body.systemId && body.systemId.toLowerCase() !== existing.systemId.toLowerCase()) {
      const duplicate = await db.findSoftwareBySystemId(body.systemId);
      if (duplicate && duplicate.id !== existing.id) {
        res.status(409).json({
          success: false,
          message: `System ID '${body.systemId}' is already assigned to another software system.`,
        });
        return;
      }
    }

    const updated = await db.updateSoftwareSystem(id, body);

    res.status(200).json({
      success: true,
      message: 'Software system updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating software system:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update software system',
      error: error.message,
    });
  }
};

export const deleteSoftware = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await db.findSoftwareById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Software system with ID '${id}' not found`,
      });
      return;
    }

    const deleted = await db.deleteSoftwareSystem(id);
    if (!deleted) {
      res.status(500).json({
        success: false,
        message: 'Could not delete software system',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Software system '${existing.name}' (${existing.systemId}) was successfully deleted.`,
    });
  } catch (error: any) {
    console.error('Error deleting software system:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete software system',
      error: error.message,
    });
  }
};

export const exportCsv = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, environment, criticality, businessDomain, search } = req.query as any;

    const systems = await db.getAllForExport({
      status: status ? String(status) : undefined,
      environment: environment ? String(environment) : undefined,
      criticality: criticality ? String(criticality) : undefined,
      businessDomain: businessDomain ? String(businessDomain) : undefined,
      search: search ? String(search) : undefined,
    });

    const headers = [
      'System ID',
      'System Name',
      'Business Domain',
      'Domain Owner',
      'Owner Email',
      'Development Team',
      'Technology Stack',
      'Programming Language',
      'Framework',
      'Database',
      'Infrastructure',
      'Environment',
      'Status',
      'Criticality',
      'Version',
      'Deployment Date',
      'Last Updated',
      'Repository URL',
      'Documentation URL',
      'Dependencies',
      'Security Notes',
      'Compliance Requirements',
      'Notes',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const formatted = String(str).replace(/"/g, '""');
      return `"${formatted}"`;
    };

    const rows = systems.map((s) => [
      escapeCsv(s.systemId),
      escapeCsv(s.name),
      escapeCsv(s.businessDomain),
      escapeCsv(s.domainOwner),
      escapeCsv(s.ownerEmail),
      escapeCsv(s.developmentTeam || ''),
      escapeCsv(s.technologyStack),
      escapeCsv(s.programmingLanguage || ''),
      escapeCsv(s.framework || ''),
      escapeCsv(s.database || ''),
      escapeCsv(s.infrastructure || ''),
      escapeCsv(s.environment || 'Production'),
      escapeCsv(s.status || 'Active'),
      escapeCsv(s.criticality || 'Medium'),
      escapeCsv(s.version || '1.0.0'),
      escapeCsv(s.deploymentDate ? new Date(s.deploymentDate).toISOString().split('T')[0] : 'N/A'),
      escapeCsv(s.lastUpdated ? new Date(s.lastUpdated).toISOString().split('T')[0] : 'N/A'),
      escapeCsv(s.repositoryUrl || ''),
      escapeCsv(s.documentationUrl || ''),
      escapeCsv(s.dependencies || ''),
      escapeCsv(s.securityNotes || ''),
      escapeCsv(s.complianceRequirements || ''),
      escapeCsv(s.notes || ''),
    ]);

    const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="enterprise-software-inventory-${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Error generating CSV export:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CSV export',
      error: error.message,
    });
  }
};
