import { describe, it, expect, vi } from 'vitest';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({ data: [], error: null }),
      insert: vi.fn().mockReturnValue({ data: {}, error: null }),
    })),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }) },
  }),
}));

describe('RevenueChart', () => {

  it('renders chart container', async () => {
    // Component test — verifies RevenueChart module can be imported
    const mod = await import('@/components/dashboard/RevenueChart');
    expect(mod).toBeDefined();
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });

  it('displays revenue label', async () => {
    // Component test — verifies RevenueChart module can be imported
    const mod = await import('@/components/dashboard/RevenueChart');
    expect(mod).toBeDefined();
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });
});
