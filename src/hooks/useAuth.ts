'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Profile } from '@/types/database';

export function useAuth() {
  const { orgId, userId, userEmail, userRole, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { clearAuth(); setLoading(false); return; }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setAuth(profileData.org_id, user.id, user.email || '', profileData.role);
        }
      } catch (err) {
        console.error('Auth load error:', err);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { clearAuth(); setProfile(null); }
      else { loadUser(); }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { supabase, orgId, userId, userEmail, userRole, profile, loading };
}
