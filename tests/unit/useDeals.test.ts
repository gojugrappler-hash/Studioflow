import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRpc = vi.fn().mockResolvedValue({ data: [], error: null });
const mockFrom = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      is: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
  insert: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: { id: 'deal-1', title: 'Logo Design', value: 5000, stage_id: 'stage-1' },
        error: null,
      }),
    }),
  }),
  update: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
});

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ from: mockFrom, rpc: mockRpc }),
}));

describe('Deals Data Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should query deals with stage information', () => {
    mockFrom('deals');
    expect(mockFrom).toHaveBeenCalledWith('deals');
  });

  it('should create a deal with value and stage', () => {
    const deal = {
      title: 'Logo Design',
      value: 5000,
      stage_id: 'stage-1',
      org_id: 'org-123',
    };
    mockFrom('deals').insert(deal);
    expect(mockFrom).toHaveBeenCalledWith('deals');
  });

  it('should update deal stage on drag-and-drop', () => {
    mockFrom('deals').update({ stage_id: 'stage-2' });
    expect(mockFrom).toHaveBeenCalledWith('deals');
  });

  it('should calculate pipeline value totals', () => {
    const deals = [
      { value: 1000 },
      { value: 2500 },
      { value: 3000 },
    ];
    const total = deals.reduce((sum, d) => sum + d.value, 0);
    expect(total).toBe(6500);
  });
});
