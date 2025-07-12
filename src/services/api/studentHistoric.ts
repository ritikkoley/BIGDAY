import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export interface StudentHistoricData {
  id: string;
  student_id: string;
  year: number;
  percentile: number;
  cgpa: number;
  strengths: string | null;
  weaknesses: string | null;
  created_at: string;
  updated_at: string;
}

export interface HistoricDataSummary {
  averageCGPA: number;
  averagePercentile: number;
  yearlyData: StudentHistoricData[];
  trend: 'improving' | 'declining' | 'stable';
}

export class StudentHistoricService {
  static async getStudentHistoricData(studentId: string): Promise<StudentHistoricData[]> {
    try {
      const { data, error } = await supabase
        .from('student_historic_data')
        .select('*')
        .eq('student_id', studentId)
        .order('year', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student historic data:', error);
      throw error;
    }
  }

  static async getHistoricDataSummary(studentId: string): Promise<HistoricDataSummary> {
    try {
      const historicData = await this.getStudentHistoricData(studentId);
      
      if (!historicData.length) {
        throw new Error('No historic data found');
      }

      const averageCGPA = historicData.reduce((sum, entry) => sum + entry.cgpa, 0) / historicData.length;
      const averagePercentile = historicData.reduce((sum, entry) => sum + entry.percentile, 0) / historicData.length;
      
      // Calculate trend based on last two years
      const sortedData = [...historicData].sort((a, b) => b.year - a.year);
      const trend = sortedData.length >= 2
        ? sortedData[0].cgpa > sortedData[1].cgpa
          ? 'improving'
          : sortedData[0].cgpa < sortedData[1].cgpa
            ? 'declining'
            : 'stable'
        : 'stable';

      return {
        averageCGPA,
        averagePercentile,
        yearlyData: historicData,
        trend
      };
    } catch (error) {
      console.error('Error generating historic data summary:', error);
      throw error;
    }
  }

  static async addHistoricData(data: Omit<StudentHistoricData, 'id' | 'created_at' | 'updated_at'>): Promise<StudentHistoricData> {
    try {
      const { data: result, error } = await supabase
        .from('student_historic_data')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error adding historic data:', error);
      throw error;
    }
  }

  static async updateHistoricData(id: string, data: Partial<StudentHistoricData>): Promise<StudentHistoricData> {
    try {
      const { data: result, error } = await supabase
        .from('student_historic_data')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error updating historic data:', error);
      throw error;
    }
  }
}