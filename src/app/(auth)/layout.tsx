export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(129, 140, 248, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(45, 212, 191, 0.06) 0%, transparent 50%)',
      }}
    >
      <div className="w-full max-w-md animate-scale-in">
        {children}
      </div>
    </div>
  );
}
