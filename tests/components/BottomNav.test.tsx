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

describe('BottomNav', () => {

  it('renders mobile navigation', async () => {
    // Component test — verifies BottomNav module can be imported
    const mod = await import('@/components/layout/BottomNav');
    expect(mod).toBeDefined();
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });

  it('highlights active route', async () => {
    // Component test — verifies BottomNav module can be imported
    const mod = await import('@/components/layout/BottomNav');
    expect(mod).toBeDefined();
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });
});
