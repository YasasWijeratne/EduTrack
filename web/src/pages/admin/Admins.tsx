import { useCallback, useEffect, useState } from "react";
import { Search, Mail, Shield, UserPlus, Key, Clock, Eye, Pencil, Trash2 } from "lucide-react";
import {
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
  type AdminUser,
} from "../../services/admin.service";
import { useAuth } from "../../context/AuthContext";
import UserFormModal from "../../components/UserFormModal";

type ModalMode = "create" | "edit" | "view";

export default function Admins() {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionError, setActionError] = useState("");

  const fetchAdmins = useCallback(() => {
    setLoading(true);
    getUsersByRole("admin")
      .then(setAdmins)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.firstName} ${admin.lastName}`;
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
    setActionError("");
  };

  const openView = (admin: AdminUser) => {
    setSelectedUser(admin);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (admin: AdminUser) => {
    setSelectedUser(admin);
    setModalMode("edit");
    setModalOpen(true);
    setActionError("");
  };

  const handleDelete = async (admin: AdminUser) => {
    if (admin._id === currentUser?.id) {
      setActionError("You cannot delete your own account");
      return;
    }

    if (!window.confirm(`Delete administrator ${admin.firstName} ${admin.lastName}? This cannot be undone.`)) {
      return;
    }

    setActionError("");
    try {
      await deleteUser(admin._id);
      fetchAdmins();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete administrator");
    }
  };

  const handleModalSubmit = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    isActive?: boolean;
  }) => {
    if (modalMode === "create") {
      if (!payload.password) throw new Error("Password is required");
      await createUser({
        ...payload,
        password: payload.password,
        role: "admin",
      });
    } else if (selectedUser) {
      await updateUser(selectedUser._id, payload);
    }
    fetchAdmins();
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
            Administration Security Group
          </h1>
          <p className="text-on-surface-variant text-sm">
            Configure system access privileges and audit security coordinators.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="bg-primary hover:bg-primary-container text-on-primary font-bold text-sm px-4 py-2.5 rounded-xl transition-all active:scale-95 duration-150 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Admin</span>
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-error-container/20 border border-error-container/40 text-error rounded-xl text-xs font-semibold">
          {actionError}
        </div>
      )}

      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant custom-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            className="w-full border border-outline-variant bg-surface rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading && <p className="text-xs text-on-surface-variant">Loading administrators...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.map((admin) => (
          <div
            key={admin._id}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant custom-shadow flex flex-col justify-between gap-4 card-hover"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D97706]" />
                  <h3 className="font-headline text-base font-bold text-on-surface truncate max-w-[150px]">
                    {admin.firstName} {admin.lastName}
                  </h3>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    admin.isActive
                      ? "text-green-700 bg-green-50"
                      : "text-outline bg-surface border border-outline-variant"
                  }`}
                >
                  {admin.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Mail className="w-4 h-4 text-outline" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Key className="w-4 h-4 text-outline" />
                  <span className="font-semibold">Administrator</span>
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant pt-3.5 flex items-center justify-between">
              <span className="text-[10px] text-outline uppercase font-bold tracking-wider">
                Access Level
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openView(admin)}
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(admin)}
                  className="p-2 rounded-lg hover:bg-surface-container text-primary cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {admin._id !== currentUser?.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(admin)}
                    className="p-2 rounded-lg hover:bg-error-container/20 text-error cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredAdmins.length === 0 && (
          <div className="col-span-full bg-surface-container-lowest p-8 rounded-2xl border border-dashed border-outline-variant text-center max-w-lg mx-auto">
            <Clock className="w-8 h-8 text-outline mx-auto mb-2.5" />
            <h3 className="font-headline text-sm font-bold text-on-surface mb-1">
              No Administrators Found
            </h3>
            <p className="text-xs text-on-surface-variant">
              No registered security coordinators matched your search criteria.
            </p>
          </div>
        )}
      </div>

      <UserFormModal
        open={modalOpen}
        mode={modalMode}
        role="admin"
        user={selectedUser}
        currentUserId={currentUser?.id}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
