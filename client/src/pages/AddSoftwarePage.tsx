import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SoftwareForm } from '../components/software/SoftwareForm.js';
import { softwareService } from '../services/softwareService.js';
import { SoftwareFormData } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';

export const AddSoftwarePage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SoftwareFormData) => {
    setIsSubmitting(true);
    try {
      const res = await softwareService.createSoftware(data);
      if (res.success && res.data) {
        success('System Registered', `Successfully added "${res.data.name}" (${res.data.systemId})`);
        navigate(`/registry/${res.data.id}`);
      }
    } catch (err: any) {
      error('Registration Failed', err.message || 'Could not register software system.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-2">
      <SoftwareForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={false}
      />
    </div>
  );
};
