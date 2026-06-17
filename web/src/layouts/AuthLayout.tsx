import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="
        w-full
        max-w-md
        bg-white
        border
        border-slate-200
        rounded-xl
        shadow-sm
        p-8
      ">
        <Outlet />
      </div>
    </div>
  );
}