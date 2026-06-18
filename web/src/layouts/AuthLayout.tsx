import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12 relative overflow-hidden" style={{
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.03) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(55, 85, 195, 0.03) 0px, transparent 50%)
      `
    }}>
      {/* Background Architectural Element */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low skew-x-[-12deg] translate-x-24 border-l border-outline-variant opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-fixed-dim rounded-full blur-[120px] opacity-10"></div>
      </div>
      
      <main className="z-10 w-full max-w-[480px]">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant custom-shadow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}