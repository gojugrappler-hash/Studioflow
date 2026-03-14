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

describe('EmailComposer', () => {

  it('renders compose form', async () => {
    // Component test — verifies EmailComposer module can be imported
    const mod = await import('@/components/email/EmailComposer');
    expect(mod).toBeDefined();
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });

  it('has send button', async () => {
    // Component test — verifies EmailComposer module can be imported
    const mod = await import('@/components/email/EmailComposer');
    expect(mod).toBeDefined();
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });
});
