import DashboardTable from './DashboardTable';



export default function Dashboard() {
  return (
    <>
      <div className="min-h-full">
      

        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back, Anes</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <DashboardTable />
              {/* Your content */}</div>
          </main>
        </div>
      </div>
    </>
  )
}