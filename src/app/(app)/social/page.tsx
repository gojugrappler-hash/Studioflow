'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, List, Wifi } from 'lucide-react';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import type { SocialAccount, SocialPost, SocialPlatform } from '@/types/database';
import { PlatformBadge, platformConfig } from '@/components/social/PlatformBadge';
import { AccountCard } from '@/components/social/AccountCard';
import { PostCard } from '@/components/social/PostCard';
import { PostComposer } from '@/components/social/PostComposer';
import { ContentCalendar } from '@/components/social/ContentCalendar';

type Tab = 'calendar' | 'posts' | 'accounts';

export default function SocialMediaPage() {
  const [tab, setTab] = useState<Tab>('calendar');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<SocialPlatform>('instagram');
  const [connectName, setConnectName] = useState('');
  const [connectHandle, setConnectHandle] = useState('');
  const [loading, setLoading] = useState(true);

  const { fetchAccounts, connectAccount, disconnectAccount, deleteAccount } = useSocialAccounts();
  const { fetchPosts, createPost, updatePost, deletePost, publishPost } = useSocialPosts();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [a, p] = await Promise.all([fetchAccounts(), fetchPosts()]);
      setAccounts(a);
      setPosts(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [fetchAccounts, fetchPosts]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSavePost = async (postData: Partial<SocialPost>) => {
    if (editingPost) {
      await updatePost(editingPost.id, postData);
    } else {
      await createPost(postData);
    }
    setEditingPost(null);
    loadData();
  };

  const handleDeletePost = async (id: string) => { await deletePost(id); loadData(); };
  const handlePublishPost = async (id: string) => { await publishPost(id); loadData(); };
  const handleDisconnect = async (id: string) => { await disconnectAccount(id); loadData(); };
  const handleDeleteAccount = async (id: string) => { await deleteAccount(id); loadData(); };
  const handleConnectAccount = async () => {
    if (!connectName.trim()) return;
    await connectAccount(connectPlatform, { account_name: connectName, account_handle: connectHandle || null });
    setConnectOpen(false);
    setConnectName('');
    setConnectHandle('');
    loadData();
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { key: 'posts', label: 'Posts', icon: List },
    { key: 'accounts', label: 'Accounts', icon: Wifi },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Social Media</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{posts.length} posts • {accounts.length} accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingPost(null); setComposerOpen(true); }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: 'var(--bg-card)' }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all" style={{ background: tab === t.key ? 'var(--bg-elevated)' : 'transparent', color: tab === t.key ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Calendar Tab */}
      {tab === 'calendar' && (
        <div className="glass-card p-4">
          <ContentCalendar posts={posts} onDayClick={(date) => { setEditingPost(null); setComposerOpen(true); }} />
        </div>
      )}

      {/* Posts Tab */}
      {tab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}>
                <List size={28} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No posts yet</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>Create your first social post to start scheduling</p>
              <button className="btn btn-primary" onClick={() => setComposerOpen(true)}><Plus size={14} /> Create Post</button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} onEdit={(p) => { setEditingPost(p); setComposerOpen(true); }} onDelete={handleDeletePost} onPublish={handlePublishPost} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accounts Tab */}
      {tab === 'accounts' && (
        <div>
          <button className="btn btn-secondary mb-4" onClick={() => setConnectOpen(!connectOpen)}><Plus size={14} /> Connect Account</button>
          {connectOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4 mb-4">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {(['instagram','facebook','tiktok','x','linkedin','pinterest'] as SocialPlatform[]).map((p) => (
                    <button key={p} onClick={() => setConnectPlatform(p)} style={{ opacity: connectPlatform === p ? 1 : 0.4 }}>
                      <PlatformBadge platform={p} size="md" />
                    </button>
                  ))}
                </div>
                <input value={connectName} onChange={(e) => setConnectName(e.target.value)} placeholder="Account name" />
                <input value={connectHandle} onChange={(e) => setConnectHandle(e.target.value)} placeholder="@handle (optional)" />
                <button className="btn btn-primary" onClick={handleConnectAccount} disabled={!connectName.trim()}>Connect</button>
              </div>
            </motion.div>
          )}
          {accounts.length === 0 && !connectOpen ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}>
                <Wifi size={28} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No accounts connected</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>Connect a social platform to get started</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} onDisconnect={handleDisconnect} onDelete={handleDeleteAccount} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Composer */}
      <PostComposer open={composerOpen} onClose={() => { setComposerOpen(false); setEditingPost(null); }} onSave={handleSavePost} editingPost={editingPost} />
    </div>
  );
}