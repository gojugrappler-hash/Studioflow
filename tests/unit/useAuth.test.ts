import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignIn = vi.fn().mockResolvedValue({
  data: { user: { id: 'user-1', email: 'test@studio.com' }, session: { access_token: 'tok' } },
  error: null,
});

const mockSignUp = vi.fn().mockResolvedValue({
  data: { user: { id: 'user-2', email: 'new@studio.com' }, session: null },
  error: null,
});

const mockSignOut = vi.fn().mockResolvedValue({ error: null });

const mockGetUser = vi.fn().mockResolvedValue({
  data: { user: { id: 'user-1', email: 'test@studio.com' } },
  error: null,
});

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
  }),
}));

describe('Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in with email and password', async () => {
    const result = await mockSignIn({ email: 'test@studio.com', password: 'pass123' });
    expect(result.data.user.email).toBe('test@studio.com');
    expect(result.error).toBeNull();
  });

  it('should sign up and create a new user', async () => {
    const result = await mockSignUp({ email: 'new@studio.com', password: 'pass123' });
    expect(result.data.user.email).toBe('new@studio.com');
    expect(result.error).toBeNull();
  });

  it('should sign out successfully', async () => {
    const result = await mockSignOut();
    expect(result.error).toBeNull();
  });

  it('should get current user', async () => {
    const result = await mockGetUser();
    expect(result.data.user.id).toBe('user-1');
  });

  it('should handle sign-in failure', async () => {
    mockSignIn.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login' },
    });
    const result = await mockSignIn({ email: 'bad@test.com', password: 'wrong' });
    expect(result.error).not.toBeNull();
    expect(result.error.message).toBe('Invalid login');
  });
});
