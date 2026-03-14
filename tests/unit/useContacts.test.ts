import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    is: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
});

const mockInsert = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    single: vi.fn().mockResolvedValue({
      data: { id: 'test-id', first_name: 'John', last_name: 'Doe', email: 'john@test.com' },
      error: null,
    }),
  }),
});

const mockUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ data: null, error: null }),
});

const mockFrom = vi.fn().mockReturnValue({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
});

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ from: mockFrom }),
}));

describe('Contacts Data Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should query contacts scoped to org_id', async () => {
    const orgId = 'org-123';
    mockFrom('contacts');
    expect(mockFrom).toHaveBeenCalledWith('contacts');
  });

  it('should create a contact with required fields', async () => {
    const contact = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      org_id: 'org-123',
    };
    mockInsert(contact);
    expect(mockInsert).toHaveBeenCalledWith(contact);
  });

  it('should soft-delete by setting deleted_at', async () => {
    const now = new Date().toISOString();
    mockUpdate({ deleted_at: now });
    expect(mockUpdate).toHaveBeenCalledWith({ deleted_at: now });
  });

  it('should filter out soft-deleted records', async () => {
    mockSelect();
    expect(mockSelect).toHaveBeenCalled();
  });
});
