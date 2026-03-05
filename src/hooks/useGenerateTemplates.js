import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-templates`;

export function useGenerateTemplates() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);

  const generateTemplates = useCallback(async ({
    businessId,
    businessData,
    formats = ['ig_post'],
    variationsPerFormat = 3,
    saveToDb = true,
  }) => {
    setIsGenerating(true);
    setError(null);
    setTemplates([]);
    setProgress({ current: 0, total: formats.length * variationsPerFormat });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      const body = {
        formats,
        variations_per_format: variationsPerFormat,
        save_to_db: saveToDb,
      };
      if (businessId) body.business_id = businessId;
      if (businessData) body.business_data = businessData;

      const response = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        setError('Rate limit tercapai. Coba lagi nanti.');
        return null;
      }

      if (response.status === 402) {
        setError('Kredit AI habis. Silakan tambahkan kredit.');
        return null;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal generate template');
      }

      const data = await response.json();
      setTemplates(data.templates || []);
      setProgress({ current: data.total_generated, total: formats.length * variationsPerFormat });

      if (data.errors && data.errors.length > 0) {
        console.warn('Partial errors:', data.errors);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const fetchSavedTemplates = useCallback(async (businessId, format = null) => {
    try {
      let query = supabase
        .from('design_templates')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (format) {
        query = query.eq('format', format);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setTemplates(data || []);
      return data;
    } catch (err) {
      console.error('Fetch templates error:', err);
      setError('Gagal memuat template');
      return null;
    }
  }, []);

  const deleteTemplate = useCallback(async (templateId) => {
    try {
      const { error: delError } = await supabase
        .from('design_templates')
        .delete()
        .eq('id', templateId);

      if (delError) throw delError;
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      return true;
    } catch (err) {
      console.error('Delete template error:', err);
      return false;
    }
  }, []);

  return {
    isGenerating,
    progress,
    templates,
    error,
    generateTemplates,
    fetchSavedTemplates,
    deleteTemplate,
  };
}
