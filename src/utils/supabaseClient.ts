import { createClient } from '@supabase/supabase-js';
import { ScanItem } from '../types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient && supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseKey;
};

/**
 * Save a resume scan to Supabase database
 */
export const saveScanToSupabase = async (scan: ScanItem, userId?: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Skipping save to database.');
      return null;
    }

    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Failed to initialize Supabase client');
    }

    const scanData = {
      id: scan.id,
      user_id: userId || 'anonymous',
      document_name: scan.documentName,
      ats_score: scan.atsScore,
      status: scan.status,
      summary: scan.summary,
      matched_keywords: scan.matchedKeywords,
      missing_keywords: scan.missingKeywords,
      formatting_score: scan.formattingScore,
      keyword_score: scan.keywordScore,
      experience_impact_score: scan.experienceImpactScore,
      bullet_points: JSON.stringify(scan.bulletPoints),
      benchmarks: JSON.stringify(scan.benchmarks),
      job_description: scan.jobDescription,
      resume_text: scan.resumeText,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await (client
      .from('scans')
      .insert([scanData] as any)
      .select() as any);

    if (error) {
      console.error('Error saving scan to Supabase:', error);
      return null;
    }

    console.log('Scan saved to Supabase:', data);
    return data?.[0];
  } catch (error) {
    console.error('Supabase save error:', error);
    return null;
  }
};

/**
 * Retrieve all scans for a user from Supabase
 */
export const getScansFromSupabase = async (userId?: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Cannot retrieve scans.');
      return [];
    }

    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Failed to initialize Supabase client');
    }

    const { data, error } = await client
      .from('scans')
      .select('*')
      .eq('user_id', userId || 'anonymous')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error retrieving scans from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Supabase retrieval error:', error);
    return [];
  }
};

/**
 * Delete a scan from Supabase
 */
export const deleteScanFromSupabase = async (scanId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Cannot delete scan.');
      return false;
    }

    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Failed to initialize Supabase client');
    }

    const { error } = await client
      .from('scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      console.error('Error deleting scan from Supabase:', error);
      return false;
    }

    console.log('Scan deleted from Supabase:', scanId);
    return true;
  } catch (error) {
    console.error('Supabase delete error:', error);
    return false;
  }
};

/**
 * Get statistics for a user's scans
 */
export const getScansStatistics = async (userId?: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Failed to initialize Supabase client');
    }

    const { data, error } = await client
      .from('scans')
      .select('ats_score, created_at')
      .eq('user_id', userId || 'anonymous');

    if (error) {
      console.error('Error retrieving statistics:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const scores = (data as any[]).map((scan: any) => scan.ats_score);
    const avgScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    return {
      totalScans: data.length,
      avgScore,
      maxScore,
      minScore,
      latestScan: (data as any)[0]?.created_at
    };
  } catch (error) {
    console.error('Statistics error:', error);
    return null;
  }
};

/**
 * Setup database schema (run once on first setup)
 * This provides the SQL to create the necessary table
 */
export const getDatabaseSchema = () => {
  return `
-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  document_name TEXT NOT NULL,
  ats_score INTEGER NOT NULL,
  status TEXT NOT NULL,
  summary TEXT,
  matched_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  missing_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  formatting_score INTEGER,
  keyword_score INTEGER,
  experience_impact_score INTEGER,
  bullet_points JSONB,
  benchmarks JSONB,
  job_description TEXT,
  resume_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at);
CREATE INDEX IF NOT EXISTS idx_scans_ats_score ON scans(ats_score);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Create policy for read access
CREATE POLICY "Enable read access for all users" ON scans
  FOR SELECT USING (true);

-- Create policy for insert access
CREATE POLICY "Enable insert for all users" ON scans
  FOR INSERT WITH CHECK (true);

-- Create policy for delete access
CREATE POLICY "Enable delete for own scans" ON scans
  FOR DELETE USING (user_id = current_user_id() OR user_id = 'anonymous');
`;
};
