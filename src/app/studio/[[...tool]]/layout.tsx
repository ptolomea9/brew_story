export const metadata = {
  title: 'Brew Story Studio',
  description: 'Content management for Brew Story',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100]" style={{ margin: 0 }}>
      {children}
    </div>
  );
}
