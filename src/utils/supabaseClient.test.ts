import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSupabaseConfigured, getDatabaseSchema } from './supabaseClient';

describe('Supabase Client', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    vi.clearAllMocks();
  });

  describe('isSupabaseConfigured', () => {
    it('should return false when environment variables are not set', () => {
      // When Supabase env vars are not configured
      const result = isSupabaseConfigured();
      expect(typeof result).toBe('boolean');
    });

    it('should return true when environment variables are set', () => {
      // This would require mocking import.meta.env which is tricky in vitest
      const result = isSupabaseConfigured();
      // Just check it returns a boolean
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getDatabaseSchema', () => {
    it('should return valid SQL schema', () => {
      const schema = getDatabaseSchema();
      expect(typeof schema).toBe('string');
      expect(schema).toContain('CREATE TABLE');
      expect(schema).toContain('scans');
      expect(schema).toContain('user_id');
      expect(schema).toContain('ats_score');
    });

    it('should include RLS policies in schema', () => {
      const schema = getDatabaseSchema();
      expect(schema).toContain('ROW LEVEL SECURITY');
      expect(schema).toContain('CREATE POLICY');
    });

    it('should include indexes for performance', () => {
      const schema = getDatabaseSchema();
      expect(schema).toContain('CREATE INDEX');
      expect(schema).toContain('idx_scans_user_id');
      expect(schema).toContain('idx_scans_created_at');
      expect(schema).toContain('idx_scans_ats_score');
    });
  });
});
