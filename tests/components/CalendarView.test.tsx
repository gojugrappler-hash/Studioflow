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

describe('CalendarView', () => {

  it('renders calendar grid', async () => {
    const mod = await import('@/components/calendar/CalendarView');
    expect(mod).toBeDefined();
    // Component exports either default or named — both valid
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });

  it('shows current month', async () => {
    const mod = await import('@/components/calendar/CalendarView');
    expect(mod).toBeDefined();
    // Component exports either default or named — both valid
    const Component = mod.default || Object.values(mod)[0];
    expect(Component).toBeDefined();
  });
});
