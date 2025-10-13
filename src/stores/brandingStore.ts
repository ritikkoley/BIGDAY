import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface BrandingState {
  institutionName: string;
  institutionType: string;
  productName: string;
  isLoading: boolean;
  fetchBranding: () => Promise<void>;
  updateInstitutionName: (name: string) => Promise<void>;
}

export const useBrandingStore = create<BrandingState>((set, get) => ({
  institutionName: 'Delhi Public School, Bhilai',
  institutionType: 'school',
  productName: 'BIG DAY',
  isLoading: false,

  fetchBranding: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['institution_name', 'institution_type', 'product_name']);

      if (error) {
        console.error('Error fetching branding settings:', error);
        return;
      }

      if (data) {
        const settings = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, string>);

        set({
          institutionName: settings.institution_name || get().institutionName,
          institutionType: settings.institution_type || get().institutionType,
          productName: settings.product_name || get().productName,
        });
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateInstitutionName: async (name: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({
          value: name,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('key', 'institution_name');

      if (error) throw error;

      set({ institutionName: name });
    } catch (error) {
      console.error('Error updating institution name:', error);
      throw error;
    }
  },
}));
