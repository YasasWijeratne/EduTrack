import { useCallback, useEffect, useState } from "react";
import { Search, Mail, BookOpen, Clock, UserPlus, Filter, Eye, Pencil, Trash2 } from "lucide-react";
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

export default function Lecturers() {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [lecturers, setLecturers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionError, setActionError] = useState("");

  const fetchLecturers = useCallback(() => {
    setLoading(true);
    getUsersByRole("lecturer")
      .then(setLecturers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  const filteredLecturers = lecturers.filter((lecturer) => {
    const fullName = `${lecturer.firstName} ${lecturer.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = lecturer.isActive ? "Active" : "Inactive";
    const matchesStatus = filterStatus === "All" || isActive === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
    setActionError("");
  };

  const openView = (lecturer: AdminUser) => {
    setSelectedUser(lecturer);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (lecturer: AdminUser) => {
    setSelectedUser(lecturer);
    setModalMode("edit");
    setModalOpen(true);
    setActionError("");
  };

  const handleDelete = async (lecturer: AdminUser) => {
    if (!window.confirm(`Delete lecturer ${lecturer.firstName} ${lecturer.lastName}? This cannot be undone.`)) {
      return;
    }

    setActionError("");
    try {
      await deleteUser(lecturer._id);
      fetchLecturers();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete lecturer");
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
        role: "lecturer",
      });
    } else if (selectedUser) {
      await updateUser(selectedUser._id, payload);
    }
    fetchLecturers();
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
            Faculty Directory
          </h1>
          <p className="text-on-surface-variant text-sm">
            Manage and view academic lecturers registered in the LMS.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="bg-primary hover:bg-primary-container text-on-primary font-bold text-sm px-4 py-2.5 rounded-xl transition-all active:scale-95 duration-150 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Lecturer</span>
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
            placeholder="Search by name or email..."
            className="w-full border border-outline-variant bg-surface rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          <Filter className="w-4 h-4 text-outline" />
          <select
            className="border border-outline-variant bg-surface rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Lecturers</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-xs text-on-surface-variant">Loading lecturers...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLecturers.map((lecturer) => (
          <div
            key={lecturer._id}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant custom-shadow flex flex-col justify-between gap-4 card-hover"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    {lecturer.firstName} {lecturer.lastName}
                  </h3>
                  <span className="text-[10px] text-outline font-semibold">Lecturer</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    lecturer.isActive
                      ? "text-green-700 bg-green-50"
                      : "text-outline bg-surface"
                  }`}
                >
                  {lecturer.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Mail className="w-4 h-4 text-outline" />
                <span>{lecturer.email}</span>
              </div>
            </div>

            <div className="border-t border-outline-variant pt-3.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                {lecturer.courseCount ?? 0} Course(s) assigned
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openView(lecturer)}
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(lecturer)}
                  className="p-2 rounded-lg hover:bg-surface-container text-primary cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(lecturer)}
                  className="p-2 rounded-lg hover:bg-error-container/20 text-error cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredLecturers.length === 0 && (
          <div className="col-span-full bg-surface-container-lowest p-8 rounded-2xl border border-dashed border-outline-variant text-center max-w-lg mx-auto">
            <Clock className="w-8 h-8 text-outline mx-auto mb-2.5" />
            <h3 className="font-headline text-sm font-bold text-on-surface mb-1">
              No Lecturers Found
            </h3>
            <p className="text-xs text-on-surface-variant">
              No registered faculty lecturers matched your search criteria.
            </p>
          </div>
        )}
      </div>

      <UserFormModal
        open={modalOpen}
        mode={modalMode}
        role="lecturer"
        user={selectedUser}
        currentUserId={currentUser?.id}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
