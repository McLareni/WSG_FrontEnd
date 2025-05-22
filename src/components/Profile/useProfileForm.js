import { useState } from 'react';

export const useProfileForm = (initialFields) => {
  const initialFormData = initialFields.reduce((acc, field) => {
    acc[field.name] = field.value || '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return { formData, handleChange, setFormData };
};