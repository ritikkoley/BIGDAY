import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface BrandingState {
  institutionName: string;
  institutionType: string;
  productName: string;
  isLoading: boolean;
  fetchBranding: () => Promise<void>;
  updateInstitutionName: (name: string) => Promise<void>;
}

export const useBrandingStore = create<BrandingState>()(
  persist(
    (set, get) => ({
      institutionName: 'GD Goenka, Indore',
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

          if (data && data.length > 0) {
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
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData?.session?.user?.id;

          const { error } = await supabase
            .from('system_settings')
            .upsert({
              key: 'institution_name',
              value: name,
              category: 'branding',
              description: 'Name of the educational institution',
              updated_at: new Date().toISOString(),
              updated_by: userId || null
            }, {
              onConflict: 'key'
            });

          if (error) {
            console.error('Supabase error:', error);
            set({ institutionName: name });
            return;
          }

          set({ institutionName: name });
        } catch (error) {
          console.error('Error updating institution name:', error);
          set({ institutionName: name });
        }
      },
    }),
    {
      name: 'branding-storage',
      partialize: (state) => ({
        institutionName: state.institutionName,
        institutionType: state.institutionType,
        productName: state.productName,
      })
    }
  )
);
