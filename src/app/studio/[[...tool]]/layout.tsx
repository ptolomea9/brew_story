export const metadata = {
  title: 'Brew Story Studio',
  description: 'Content management for Brew Story',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
