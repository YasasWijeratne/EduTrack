import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, Mail, Lock, Eye, EyeOff, CheckSquare, Square } from "lucide-react";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securedNetwork, setSecuredNetwork] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securedNetwork) {
      setError("Please confirm you are connecting from a secured network");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header / Logo */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3 shadow-md">
          <ShieldAlert className="w-7 h-7 text-on-primary" />
        </div>
        <h1 className="font-headline text-xl font-bold text-primary">EduTrack</h1>
        <p className="font-body text-xs text-on-surface-variant font-bold tracking-wide uppercase">Admin Portal</p>
      </div>

      <div className="mb-4">
        <h2 className="font-headline text-lg font-bold text-on-surface">Secure Sign In</h2>
        <p className="font-body text-xs text-on-surface-variant leading-relaxed">
          Authorized access only. Technical staff or institutional administrators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="email">
            Administrator Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              id="email"
              type="email"
              placeholder="admin@university.edu"
              className="w-full bg-surface-container-lowest border border-outline rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="password">
            Access Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full bg-surface-container-lowest border border-outline rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me / Security Check */}
        <div
          className="flex items-center gap-2 py-1 cursor-pointer select-none"
          onClick={() => setSecuredNetwork(!securedNetwork)}
        >
          {securedNetwork ? (
            <CheckSquare className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Square className="w-4 h-4 text-outline shrink-0" />
          )}
          <span className="font-body text-xs text-on-surface-variant">
            I am connecting from a secured network.
          </span>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-bold text-sm py-2.5 rounded-lg shadow-sm hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Enter Management Dashboard</span>
        </button>
      </form>

      <p className="text-sm text-on-surface-variant text-center mt-6">
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Back to User Login
        </Link>
      </p>
    </div>
  );
}