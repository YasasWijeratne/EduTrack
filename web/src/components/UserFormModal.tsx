import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { AdminUser } from "../services/admin.service";

type ModalMode = "create" | "edit" | "view";

interface UserFormModalProps {
  open: boolean;
  mode: ModalMode;
  role: "lecturer" | "admin";
  user?: AdminUser | null;
  currentUserId?: string;
  onClose: () => void;
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    isActive?: boolean;
  }) => Promise<void>;
}

export default function UserFormModal({
  open,
  mode,
  role,
  user,
  currentUserId,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setIsActive(true);
    } else if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword("");
      setIsActive(user.isActive);
    }

    setErrorMsg("");
  }, [open, mode, user]);

  if (!open) return null;

  const isView = mode === "view";
  const isCreate = mode === "create";
  const roleLabel = role === "lecturer" ? "Lecturer" : "Administrator";
  const title =
    mode === "create"
      ? `Add ${roleLabel}`
      : mode === "edit"
        ? `Edit ${roleLabel}`
        : `${roleLabel} Details`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    setLoading(true);
    setErrorMsg("");

    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password || undefined,
        isActive,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant custom-shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-headline text-lg font-bold text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isView && user ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Name</span>
                <p className="font-semibold text-on-surface">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Email</span>
                <p className="text-on-surface-variant">{user.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Status</span>
                <p className="text-on-surface-variant">{user.isActive ? "Active" : "Inactive"}</p>
              </div>
              {role === "lecturer" && (
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Courses</span>
                  <p className="text-on-surface-variant">{user.courseCount ?? 0} assigned</p>
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Created</span>
                <p className="text-on-surface-variant">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">First Name</label>
                  <input
                    className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Last Name</label>
                  <input
                    className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  {isCreate ? "Password" : "New Password (optional)"}
                </label>
                <input
                  type="password"
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={isCreate}
                  disabled={loading}
                  minLength={6}
                  placeholder={isCreate ? "Minimum 6 characters" : "Leave blank to keep current"}
                />
              </div>

              {!isCreate && user?._id !== currentUserId && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    disabled={loading}
                    className="rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-on-surface-variant">Active account</span>
                </label>
              )}
            </>
          )}

          {errorMsg && (
            <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-outline-variant text-on-surface-variant font-bold text-xs py-2.5 rounded-lg hover:bg-surface-container cursor-pointer"
            >
              {isView ? "Close" : "Cancel"}
            </button>
            {!isView && (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-on-primary font-bold text-xs py-2.5 rounded-lg hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : isCreate ? "Create" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
