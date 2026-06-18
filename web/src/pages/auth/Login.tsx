import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"student" | "lecturer">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === "student") navigate("/student/dashboard");
        else if (u.role === "lecturer") navigate("/lecturer/dashboard");
        else if (u.role === "admin") navigate("/admin/dashboard");
        else navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Branding Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="w-10 h-10 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary tracking-tight">EduTrack</h1>
        </div>
        <h2 className="font-headline text-lg font-bold text-on-background">Portal Login</h2>
        <p className="font-body text-xs text-on-surface-variant mt-1">Access your academic dashboard and materials</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Toggle (Tabs) */}
        <div className="flex bg-surface-container rounded-lg p-1">
          <button
            type="button"
            className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${
              activeTab === "student"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
            onClick={() => setActiveTab("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${
              activeTab === "lecturer"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
            onClick={() => setActiveTab("lecturer")}
          >
            Lecturer
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="block font-body text-xs font-semibold text-on-background mb-1" htmlFor="email">
              University Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="e.g. j.doe@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body text-sm outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-body text-xs font-semibold text-on-background" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body text-sm outline-none transition-all"
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
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary text-on-primary hover:opacity-95 transition-all rounded-lg font-bold text-sm shadow-sm active:scale-[0.98] duration-150 cursor-pointer"
        >
          {loading ? "Signing In..." : `Sign In as ${activeTab === "student" ? "Student" : "Lecturer"}`}
        </button>

        {/* Footer Link */}
        <div className="pt-4 text-center border-t border-outline-variant space-y-2">
          <p className="font-body text-xs text-on-surface-variant">
            New to the platform?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register as a Student
            </Link>
          </p>
          <p className="font-body text-xs text-outline">
            <Link to="/admin/login" className="hover:text-primary transition-colors font-semibold">
              Admin Portal Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}