import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(firstName, lastName, email, password);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-10 h-10 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary tracking-tight">EduTrack</h1>
        </div>
        <p className="font-body text-xs text-on-surface-variant text-center px-4">
          Join our community of lifelong learners and academic achievers.
        </p>
      </div>

      {/* Registration Header */}
      <header className="mb-4">
        <h2 className="font-headline text-lg font-bold text-on-surface mb-1">Create an account</h2>
        <p className="font-body text-xs text-on-surface-variant">Please enter your details to register as a student.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="first-name">
              First Name
            </label>
            <input
              id="first-name"
              placeholder="John"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="last-name">
              Last Name
            </label>
            <input
              id="last-name"
              placeholder="Doe"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="email">
            Institutional Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="j.doe@university.edu"
            className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <p className="text-[10px] text-on-surface-variant italic mt-1">Must be a valid .edu or institutional address.</p>
        </div>

        {/* Password Fields */}
        <div>
          <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-3 pr-10 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-body text-xs font-semibold text-on-surface mb-1" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-container text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? "Creating Account..." : "Create Account"}
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Social / SSO visual ornament */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface-container-lowest px-2 text-on-surface-variant">Or register with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-3 py-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors active:scale-95 duration-150 cursor-pointer text-xs font-bold text-on-surface"
          >
            <img
              alt="Google Logo"
              className="w-4 h-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtSRnU96JybDnmTmaogxPF-tV8GS0uS9hGbwL6UL3yi2n3hwo-WW1Cu8I7I7KdyPcrE-0Spc8m355_Cv9DXTdcKQT1c6LTaf5C6nl5F-nKecaIyOLBsjM4XEkBMxbDAWSIc-AfmrCAtxAn7VAJQ_C_rOT7rm4k1oMpwOh5CuuOpUmixhcrSsOSKrhx_UHTWpiiV2tYDUnYGq6FZuYDMQPg36LttgpbUBWv4MEtVjAtJo-pghBrP6mlA_lOB-4SwlEByiCfjkibrA"
            />
            <span>Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-3 py-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors active:scale-95 duration-150 cursor-pointer text-xs font-bold text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>SSO</span>
          </button>
        </div>
      </form>

      {/* Login Link */}
      <footer className="mt-6 text-center">
        <p className="font-body text-xs text-on-surface-variant">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </footer>
    </div>
  );
}