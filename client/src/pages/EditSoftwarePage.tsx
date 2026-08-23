import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SoftwareForm } from '../components/software/SoftwareForm.js';
import { softwareService } from '../services/softwareService.js';
import { SoftwareFormData, SoftwareSystem } from '../types/index.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { useToast } from '../context/ToastContext.js';

export const EditSoftwarePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [system, setSystem] = useState<SoftwareSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSystem = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await softwareService.getSoftwareById(id);
        if (res.success && res.data) {
          setSystem(res.data);
        } else {
          error('System Not Found', `No software system with ID "${id}"`);
          navigate('/registry');
        }
      } catch (err: any) {
        error('Failed to load system', err.message);
        navigate('/registry');
      } finally {
        setIsLoading(false);
      }
    };

    loadSystem();
  }, [id, navigate, error]);

  const handleSubmit = async (data: SoftwareFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const res = await softwareService.updateSoftware(id, data);
      if (res.success && res.data) {
        success('System Updated', `Updated specifications for "${res.data.name}"`);
        navigate(`/registry/${res.data.id}`);
      }
    } catch (err: any) {
      error('Update Failed', err.message || 'Could not save system changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading system record...</p>
      </div>
    );
  }

  if (!system) return null;

  return (
    <div className="py-2">
      <SoftwareForm
        initialData={system}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    </div>
  );
};
