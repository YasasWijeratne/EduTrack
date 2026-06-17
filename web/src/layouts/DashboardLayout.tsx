import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="
        w-64
        bg-white
        border-r
        border-slate-200
        hidden
        md:flex
        flex-col
      ">
        <div className="
          h-16
          flex
          items-center
          px-6
          border-b
          border-slate-200
        ">
          <h1 className="
            text-xl
            font-semibold
            text-blue-700
          ">
            EduTrack
          </h1>
        </div>

        <nav className="p-4 space-y-2">
        </nav>
      </aside>

      <main className="flex-1">
        <header className="
          h-16
          bg-white
          border-b
          border-slate-200
          flex
          items-center
          px-6
        ">
          <h2 className="font-medium">Dashboard</h2>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}