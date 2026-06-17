import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">
        Sign in
      </h1>

      <div className="space-y-4">

        <input
          className="w-full border border-slate-300 rounded-md p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-slate-300 rounded-md p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="
          w-full
          bg-blue-600
          text-white
          rounded-md
          p-2
        ">
          Login
        </button>

      </div>
    </div>
  );
}