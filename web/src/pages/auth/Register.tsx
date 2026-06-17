export default function Register() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">
        Create account
      </h1>

      <div className="space-y-4">

        <input className="w-full border p-2 rounded" placeholder="First name" />
        <input className="w-full border p-2 rounded" placeholder="Last name" />
        <input className="w-full border p-2 rounded" placeholder="Email" />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>

      </div>
    </div>
  );
}