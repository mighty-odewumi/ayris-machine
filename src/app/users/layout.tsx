export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="bg-gray-100 min-h-screen">
      {children}
    </section>
  )
}

