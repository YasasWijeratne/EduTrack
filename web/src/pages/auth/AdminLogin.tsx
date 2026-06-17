export default function AdminLogin() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">
        Admin Login
      </h1>

      <p className="text-sm text-slate-500 mb-6">
        Restricted access
      </p>

      <div className="space-y-4">

        <input className="w-full border p-2 rounded" placeholder="Email" />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" />

        <button className="w-full bg-blue-700 text-white p-2 rounded">
          Login
        </button>

      </div>
    </div>
  );
}