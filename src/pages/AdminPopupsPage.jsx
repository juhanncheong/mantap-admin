import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Shell from "../components/Shell";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function Modal({ open, title, subtitle, children, onClose, footer, wide = false }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onMouseDown={(e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        ref={cardRef}
        className={classNames(
          "relative w-full overflow-hidden rounded-[28px] border shadow-2xl",
          wide ? "max-w-4xl" : "max-w-xl",
          "border-white/10 bg-[#0b1220]/95"
        )}
      >
        <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.24),_transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-white">{title}</div>
              {subtitle ? (
                <div className="mt-1 text-xs text-white/50">{subtitle}</div>
              ) : null}
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white/70 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <div className="border-t border-white/10 bg-white/[0.03] px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function UserPicker({
  selectedUsers,
  setSelectedUsers,
  allUsers,
  search,
  setSearch,
  t,
  hideSearch = false,
  hideSelected = false,
}) {
  const filteredUsers = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    if (!q) return allUsers.slice(0, 20);

    return allUsers
      .filter((u) => {
        return (
          String(u.phoneNumber || "").toLowerCase().includes(q) ||
          String(u.uid || "").toLowerCase().includes(q) ||
          String(u._id || "").toLowerCase().includes(q)
        );
      })
      .slice(0, 30);
  }, [allUsers, search]);

  function toggleUser(user) {
    const exists = selectedUsers.some((id) => String(id) === String(user._id));

    if (exists) {
      setSelectedUsers((prev) =>
        prev.filter((id) => String(id) !== String(user._id))
      );
    } else {
      setSelectedUsers((prev) => [...prev, String(user._id)]);
    }
  }

  return (
    <div className="space-y-3">
      {!hideSearch ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-xs font-semibold text-white">
            {t("popups.searchUsers")}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("popups.searchUsersPlaceholder")}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold text-white">
            {t("popups.pickUsers")}
          </div>
          <div className="text-[11px] text-white/50">
            {t("popups.selected")}: {selectedUsers.length}
          </div>
        </div>

        <div className="grid gap-2">
          {filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50">
              {t("popups.noUsersFound")}
            </div>
          ) : (
            filteredUsers.map((u) => {
              const active = selectedUsers.some(
                (id) => String(id) === String(u._id)
              );

              return (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => toggleUser(u)}
                  className={classNames(
                    "flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition",
                    active
                      ? "border-blue-500/35 bg-blue-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">
                      UID: {u.uid || "-"}
                    </div>
                    <div className="mt-1 text-[12px] text-white/55">
                      {t("popups.phone")}: {u.phoneNumber || "-"}
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      active
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-white/5 text-white/60"
                    )}
                  >
                    {active ? t("popups.selected") : t("popups.select")}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {!hideSelected && selectedUsers.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 text-xs font-semibold text-white">
            {t("popups.selectedUserIds")}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((id) => (
              <span
                key={id}
                className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPopupsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("popup");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [popups, setPopups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [q, setQ] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorType, setEditorType] = useState("popup");
  const [editorMode, setEditorMode] = useState("create");
  const [editingId, setEditingId] = useState(null);

  const [popupForm, setPopupForm] = useState({
    title: "",
    message: "",
    targetType: "all",
    targetUsers: [],
    isActive: true,
  });

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    description: "",
    targetType: "all",
    targetUser: "",
  });

  const [userSearch, setUserSearch] = useState("");

  const cardClass = isDark
    ? "rounded-[28px] border border-white/10 bg-white/[0.04]"
    : "rounded-[28px] border border-[#E7E1D7] bg-white shadow-sm";

  const mutedText = isDark ? "text-white/50" : "text-gray-500";
  const softText = isDark ? "text-white/70" : "text-gray-600";
  const strongText = isDark ? "text-white" : "text-gray-900";

  const panelClass = isDark
    ? "border-white/10 bg-white/[0.04]"
    : "border-[#E7E1D7] bg-white shadow-sm";

  const inputClass = isDark
    ? "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
    : "w-full rounded-2xl border border-[#D9DDE5] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#93C5FD]";

  const subtleButtonClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10"
    : "rounded-2xl border border-[#D8E4FF] bg-white px-4 py-3 text-sm text-[#374151] hover:bg-[#F8FBFF]";

  const primaryButtonClass = isDark
    ? "rounded-2xl border border-blue-500/25 bg-blue-500/15 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/20"
    : "rounded-2xl border border-[#BFDBFE] bg-[#EAF3FF] px-4 py-3 text-sm font-semibold text-[#1D4ED8] hover:bg-[#DDEEFF]";

  const headerPillClass = isDark
    ? "inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-200"
    : "inline-flex rounded-full border border-[#BFDBFE] bg-[#EAF3FF] px-3 py-1 text-[11px] font-semibold text-[#2563EB]";

  const tableHeadClass = isDark
    ? "bg-white/[0.03] text-xs text-white/50"
    : "bg-[#FAFBFC] text-xs text-[#6B7280]";

  const rowHoverClass = isDark ? "hover:bg-white/[0.03]" : "hover:bg-[#FAFBFF]";

  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchJSON(url, options = {}) {
    const auth = getAuthHeaders();
    if (!auth) throw new Error(t("popups.pleaseLoginAgain"));

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...auth,
      },
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      throw new Error(t("popups.nonJson"));
    }

    if (!res.ok) {
      throw new Error(data?.message || `${t("popups.requestFailed")} (${res.status})`);
    }

    return data;
  }

  async function loadPage() {
    setLoading(true);

    try {
      const [popupData, notificationData, userData] = await Promise.all([
        fetchJSON(`${API_BASE}/api/admin/popups`),
        fetchJSON(`${API_BASE}/api/admin/user-notifications`),
        fetchJSON(`${API_BASE}/api/admin/users`),
      ]);

      setPopups(Array.isArray(popupData.popups) ? popupData.popups : []);
      setNotifications(
        Array.isArray(notificationData.notifications)
          ? notificationData.notifications
          : []
      );
      setUsers(Array.isArray(userData.users) ? userData.users : []);
    } catch (e) {
      toast.error(e.message || t("popups.failedLoadPage"));
      setPopups([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetPopupForm() {
    setPopupForm({
      title: "",
      message: "",
      targetType: "all",
      targetUsers: [],
      isActive: true,
    });

    setUserSearch("");
    setEditingId(null);
    setEditorMode("create");
  }

  function resetNotificationForm() {
    setNotificationForm({
      title: "",
      description: "",
      targetType: "all",
      targetUser: "",
    });

    setUserSearch("");
    setEditingId(null);
    setEditorMode("create");
  }

  function closeEditor() {
    setEditorOpen(false);
    resetPopupForm();
    resetNotificationForm();
  }

  function openCreatePopup() {
    resetPopupForm();
    setEditorType("popup");
    setEditorMode("create");
    setEditorOpen(true);
  }

  function openEditPopup(popup) {
    setEditorType("popup");
    setEditorMode("edit");
    setEditingId(popup._id);

    setPopupForm({
      title: popup.title || "",
      message: popup.message || "",
      targetType: popup.targetType === "specific" ? "specific" : "all",
      targetUsers: Array.isArray(popup.targetUsers)
        ? popup.targetUsers.map((u) => String(u._id || u))
        : [],
      isActive: Boolean(popup.isActive),
    });

    setUserSearch("");
    setEditorOpen(true);
  }

  function openCreateNotification() {
    resetNotificationForm();
    setEditorType("notification");
    setEditorMode("create");
    setEditorOpen(true);
  }

  async function savePopup() {
    const title = String(popupForm.title || "").trim();
    const message = String(popupForm.message || "").trim();
    const targetType = popupForm.targetType === "specific" ? "specific" : "all";

    if (!title) {
      toast.error(t("popups.titleRequired"));
      return;
    }

    if (!message) {
      toast.error(t("popups.messageRequired"));
      return;
    }

    if (targetType === "specific" && popupForm.targetUsers.length === 0) {
      toast.error(t("popups.pickAtLeastOneUser"));
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        message,
        targetType,
        targetUsers: targetType === "specific" ? popupForm.targetUsers : [],
        isActive: Boolean(popupForm.isActive),
      };

      if (editorMode === "create") {
        const data = await fetchJSON(`${API_BASE}/api/admin/popups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setPopups((prev) => [data.popup, ...prev]);
        toast.success(t("popups.popupCreated"));
      } else {
        const data = await fetchJSON(`${API_BASE}/api/admin/popups/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setPopups((prev) =>
          prev.map((p) => (p._id === editingId ? data.popup : p))
        );

        toast.success(t("popups.popupUpdated"));
      }

      closeEditor();
      await loadPage();
    } catch (e) {
      toast.error(e.message || t("popups.failedSavePopup"));
    } finally {
      setSaving(false);
    }
  }

  async function saveNotification() {
    const title = String(notificationForm.title || "").trim();
    const description = String(notificationForm.description || "").trim();
    const targetType = notificationForm.targetType === "user" ? "user" : "all";
    const targetUser = String(notificationForm.targetUser || "").trim();

    if (!title) {
      toast.error(t("popups.notificationTitleRequired"));
      return;
    }

    if (!description) {
      toast.error(t("popups.notificationDescriptionRequired"));
      return;
    }

    if (targetType === "user" && !targetUser) {
      toast.error(t("popups.pickUserNotification"));
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        description,
        targetType,
        targetUser: targetType === "user" ? targetUser : null,
      };

      const data = await fetchJSON(`${API_BASE}/api/admin/user-notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setNotifications((prev) => [data.notification, ...prev]);
      toast.success(t("popups.notificationCreated"));

      closeEditor();
      await loadPage();
    } catch (e) {
      toast.error(e.message || t("popups.failedCreateNotification"));
    } finally {
      setSaving(false);
    }
  }

  async function saveEditor() {
    if (editorType === "notification") {
      await saveNotification();
      return;
    }

    await savePopup();
  }

  async function togglePopupActive(popup) {
    setBusyId(popup._id);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/popups/${popup._id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !popup.isActive }),
      });

      setPopups((prev) =>
        prev.map((p) => (p._id === popup._id ? data.popup : p))
      );

      toast.success(
        data.popup?.isActive
          ? t("popups.popupActivated")
          : t("popups.popupDeactivated")
      );
    } catch (e) {
      toast.error(e.message || t("popups.failedUpdatePopup"));
    } finally {
      setBusyId(null);
    }
  }

  async function deletePopup(popup) {
    const ok = window.confirm(t("popups.confirmDeletePopup", { title: popup.title }));
    if (!ok) return;

    setBusyId(popup._id);

    try {
      await fetchJSON(`${API_BASE}/api/admin/popups/${popup._id}`, {
        method: "DELETE",
      });

      setPopups((prev) => prev.filter((p) => p._id !== popup._id));
      toast.success(t("popups.popupDeleted"));
    } catch (e) {
      toast.error(e.message || t("popups.failedDeletePopup"));
    } finally {
      setBusyId(null);
    }
  }

  async function disableNotification(notification) {
    const ok = window.confirm(
      t("popups.confirmDisableNotification", { title: notification.title })
    );
    if (!ok) return;

    setBusyId(notification._id);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/user-notifications/${notification._id}/disable`,
        {
          method: "PATCH",
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? data.notification : n))
      );

      toast.success(t("popups.notificationDisabled"));
    } catch (e) {
      toast.error(e.message || t("popups.failedDisableNotification"));
    } finally {
      setBusyId(null);
    }
  }

  const filteredPopups = useMemo(() => {
    const qq = String(q || "").trim().toLowerCase();

    return popups.filter((p) => {
      if (!qq) return true;

      return (
        String(p.title || "").toLowerCase().includes(qq) ||
        String(p.message || "").toLowerCase().includes(qq) ||
        String(p.targetType || "").toLowerCase().includes(qq)
      );
    });
  }, [popups, q]);

  const filteredNotifications = useMemo(() => {
    const qq = String(q || "").trim().toLowerCase();

    return notifications.filter((n) => {
      if (!qq) return true;

      return (
        String(n.title || "").toLowerCase().includes(qq) ||
        String(n.description || "").toLowerCase().includes(qq) ||
        String(n.targetType || "").toLowerCase().includes(qq)
      );
    });
  }, [notifications, q]);

  const notificationUserResults = useMemo(() => {
    const qq = String(userSearch || "").trim().toLowerCase();

    if (!qq) return users.slice(0, 20);

    return users
      .filter((u) => {
        return (
          String(u.phoneNumber || "").toLowerCase().includes(qq) ||
          String(u.uid || "").toLowerCase().includes(qq) ||
          String(u._id || "").toLowerCase().includes(qq)
        );
      })
      .slice(0, 30);
  }, [users, userSearch]);

  const activeTitle =
    activeTab === "notification"
      ? t("popups.userNotifications")
      : t("popups.popupManagement");

  const activeDescription =
    activeTab === "notification"
      ? t("popups.notificationDescription")
      : t("popups.popupDescription");

  const createButtonText =
    activeTab === "notification"
      ? t("popups.newNotification")
      : t("popups.newPopup");

  const modalTitle =
    editorType === "notification"
      ? t("popups.createNotification")
      : editorMode === "create"
      ? t("popups.createPopup")
      : t("popups.editPopup");

  const modalSubtitle =
    editorType === "notification"
      ? t("popups.createNotificationSubtitle")
      : editorMode === "create"
      ? t("popups.createPopupSubtitle")
      : t("popups.editingPopup", { id: editingId || "" });

  return (
    <Shell title={activeTitle}>
      <div className="flex flex-col gap-4">
        <div className={classNames(cardClass, "relative overflow-hidden p-5")}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className={headerPillClass}>
                {t("popups.communicationCenter")}
              </div>

              <h2 className={`mt-3 text-2xl font-semibold tracking-tight ${strongText}`}>
                {activeTitle}
              </h2>

              <p className={`mt-2 max-w-2xl text-sm leading-6 ${softText}`}>
                {activeDescription}
              </p>

              <div
                className={classNames(
                  "mt-5 inline-flex rounded-2xl border p-1",
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-[#E5E7EB] bg-[#F9FAFB]"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("popup");
                    setQ("");
                  }}
                  className={classNames(
                    "rounded-xl px-4 py-2 text-xs font-semibold transition",
                    activeTab === "popup"
                      ? isDark
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-white text-[#1D4ED8] shadow-sm"
                      : isDark
                      ? "text-white/55 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {t("popups.popup")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("notification");
                    setQ("");
                  }}
                  className={classNames(
                    "rounded-xl px-4 py-2 text-xs font-semibold transition",
                    activeTab === "notification"
                      ? isDark
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-white text-[#1D4ED8] shadow-sm"
                      : isDark
                      ? "text-white/55 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {t("popups.notification")}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  activeTab === "notification"
                    ? t("popups.searchNotifications")
                    : t("popups.searchPopups")
                }
                className={`${inputClass} sm:w-64`}
              />

              <button
                onClick={loadPage}
                disabled={loading}
                className={`${subtleButtonClass} disabled:opacity-50`}
              >
                {t("popups.refresh")}
              </button>

              <button
                onClick={
                  activeTab === "notification"
                    ? openCreateNotification
                    : openCreatePopup
                }
                className={primaryButtonClass}
              >
                {createButtonText}
              </button>
            </div>
          </div>
        </div>

        {activeTab === "popup" ? (
          <div className={classNames(panelClass, "overflow-hidden")}>
            <div
              className={classNames(
                "flex items-center justify-between px-5 py-4",
                isDark ? "border-b border-white/10" : "border-b border-[#EEF2F7]"
              )}
            >
              <div className={`text-sm font-semibold ${strongText}`}>
                {t("popups.popups")} ({filteredPopups.length})
              </div>
              <div className={`text-xs ${mutedText}`}>
                {t("popups.popupControlCenter")}
              </div>
            </div>

            <div className="popup-table-scroll overflow-x-auto">
              <table className="min-w-[1650px] text-left text-sm">
                <thead className={tableHeadClass}>
                  <tr>
                    <th className="w-[240px] px-5 py-3">{t("popups.title")}</th>
                    <th className="w-[520px] px-5 py-3">{t("popups.message")}</th>
                    <th className="w-[140px] px-5 py-3">{t("popups.target")}</th>
                    <th className="w-[180px] px-5 py-3">{t("popups.users")}</th>
                    <th className="w-[130px] px-5 py-3">{t("popups.status")}</th>
                    <th className="w-[220px] px-5 py-3">{t("popups.created")}</th>
                    <th className="w-[220px] px-5 py-3">{t("popups.actions")}</th>
                  </tr>
                </thead>

                <tbody
                  className={
                    isDark
                      ? "divide-y divide-white/10"
                      : "divide-y divide-[#EEF2F7]"
                  }
                >
                  {loading ? (
                    <tr>
                      <td colSpan={7} className={`px-5 py-6 text-sm ${softText}`}>
                        {t("popups.loadingPopups")}
                      </td>
                    </tr>
                  ) : filteredPopups.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`px-5 py-6 text-sm ${softText}`}>
                        {t("popups.noPopupsFound")}
                      </td>
                    </tr>
                  ) : (
                    filteredPopups.map((popup) => {
                      const targetUsers = Array.isArray(popup.targetUsers)
                        ? popup.targetUsers
                        : [];
                      const isBusy = busyId === popup._id;

                      return (
                        <tr key={popup._id} className={rowHoverClass}>
                          <td className="px-5 py-4 align-top">
                            <div className="max-w-[240px]">
                              <div
                                className={`truncate text-sm font-semibold ${strongText}`}
                              >
                                {popup.title || "-"}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div
                              className={`max-w-[520px] whitespace-pre-wrap break-words text-sm leading-7 ${softText}`}
                            >
                              {popup.message || "-"}
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={classNames(
                                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                popup.targetType === "specific"
                                  ? isDark
                                    ? "bg-violet-500/15 text-violet-200"
                                    : "border border-violet-200 bg-violet-50 text-violet-700"
                                  : isDark
                                  ? "bg-emerald-500/15 text-emerald-200"
                                  : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              )}
                            >
                              {popup.targetType === "specific"
                                ? t("popups.specificUsers")
                                : t("popups.allUsers")}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            {popup.targetType === "specific" ? (
                              <div className="max-w-[240px]">
                                <div className={`text-sm ${strongText}`}>
                                  {targetUsers.length} {t("popups.selectedLower")}
                                </div>
                                <div className={`mt-1 text-[11px] ${mutedText}`}>
                                  {targetUsers
                                    .slice(0, 2)
                                    .map((u) => `UID: ${u?.uid || "-"}`)
                                    .join(", ")}
                                  {targetUsers.length > 2 ? " ..." : ""}
                                </div>
                              </div>
                            ) : (
                              <span className={`text-sm ${softText}`}>
                                {t("popups.everyone")}
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={classNames(
                                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                popup.isActive
                                  ? isDark
                                    ? "bg-blue-500/15 text-blue-200"
                                    : "border border-blue-200 bg-blue-50 text-blue-700"
                                  : isDark
                                  ? "bg-white/10 text-white/60"
                                  : "border border-gray-200 bg-gray-50 text-gray-600"
                              )}
                            >
                              {popup.isActive ? t("popups.active") : t("popups.inactive")}
                            </span>
                          </td>

                          <td className={`px-5 py-4 align-top text-sm ${softText}`}>
                            {formatDate(popup.createdAt)}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <button
                                disabled={isBusy}
                                onClick={() => openEditPopup(popup)}
                                className={
                                  isDark
                                    ? "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
                                    : "rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                }
                              >
                                {t("popups.edit")}
                              </button>

                              <button
                                disabled={isBusy}
                                onClick={() => togglePopupActive(popup)}
                                className={classNames(
                                  "rounded-2xl border px-3 py-2 text-xs font-medium disabled:opacity-50",
                                  popup.isActive
                                    ? isDark
                                      ? "border-orange-500/25 bg-orange-500/10 text-orange-200 hover:bg-orange-500/15"
                                      : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                    : isDark
                                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                )}
                              >
                                {popup.isActive ? t("popups.deactivate") : t("popups.activate")}
                              </button>

                              <button
                                disabled={isBusy}
                                onClick={() => deletePopup(popup)}
                                className={
                                  isDark
                                    ? "rounded-2xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-50"
                                    : "rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 hover:bg-red-100 disabled:opacity-50"
                                }
                              >
                                {t("popups.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={classNames(panelClass, "overflow-hidden")}>
            <div
              className={classNames(
                "flex items-center justify-between px-5 py-4",
                isDark ? "border-b border-white/10" : "border-b border-[#EEF2F7]"
              )}
            >
              <div className={`text-sm font-semibold ${strongText}`}>
                {t("popups.notifications")} ({filteredNotifications.length})
              </div>
              <div className={`text-xs ${mutedText}`}>
                {t("popups.notificationControlCenter")}
              </div>
            </div>

            <div className="popup-table-scroll overflow-x-auto">
              <table className="min-w-[1300px] text-left text-sm">
                <thead className={tableHeadClass}>
                  <tr>
                    <th className="w-[260px] px-5 py-3">{t("popups.title")}</th>
                    <th className="w-[560px] px-5 py-3">
                      {t("popups.description")}
                    </th>
                    <th className="w-[160px] px-5 py-3">{t("popups.target")}</th>
                    <th className="w-[130px] px-5 py-3">{t("popups.status")}</th>
                    <th className="w-[220px] px-5 py-3">{t("popups.created")}</th>
                    <th className="w-[180px] px-5 py-3">{t("popups.actions")}</th>
                  </tr>
                </thead>

                <tbody
                  className={
                    isDark
                      ? "divide-y divide-white/10"
                      : "divide-y divide-[#EEF2F7]"
                  }
                >
                  {loading ? (
                    <tr>
                      <td colSpan={6} className={`px-5 py-6 text-sm ${softText}`}>
                        {t("popups.loadingNotifications")}
                      </td>
                    </tr>
                  ) : filteredNotifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-5 py-6 text-sm ${softText}`}>
                        {t("popups.noNotificationsFound")}
                      </td>
                    </tr>
                  ) : (
                    filteredNotifications.map((notification) => {
                      const isBusy = busyId === notification._id;

                      return (
                        <tr key={notification._id} className={rowHoverClass}>
                          <td className="px-5 py-4 align-top">
                            <div className="max-w-[260px]">
                              <div
                                className={`truncate text-sm font-semibold ${strongText}`}
                              >
                                {notification.title || "-"}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div
                              className={`max-w-[560px] whitespace-pre-wrap break-words text-sm leading-7 ${softText}`}
                            >
                              {notification.description || "-"}
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={classNames(
                                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                notification.targetType === "user"
                                  ? isDark
                                    ? "bg-violet-500/15 text-violet-200"
                                    : "border border-violet-200 bg-violet-50 text-violet-700"
                                  : isDark
                                  ? "bg-emerald-500/15 text-emerald-200"
                                  : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              )}
                            >
                              {notification.targetType === "user"
                                ? t("popups.specificUser")
                                : t("popups.allUsers")}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={classNames(
                                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                notification.isActive
                                  ? isDark
                                    ? "bg-blue-500/15 text-blue-200"
                                    : "border border-blue-200 bg-blue-50 text-blue-700"
                                  : isDark
                                  ? "bg-white/10 text-white/60"
                                  : "border border-gray-200 bg-gray-50 text-gray-600"
                              )}
                            >
                              {notification.isActive ? t("popups.active") : t("popups.disabled")}
                            </span>
                          </td>

                          <td className={`px-5 py-4 align-top text-sm ${softText}`}>
                            {formatDate(notification.createdAt)}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <button
                              disabled={isBusy || !notification.isActive}
                              onClick={() => disableNotification(notification)}
                              className={
                                isDark
                                  ? "rounded-2xl border border-orange-500/25 bg-orange-500/10 px-3 py-2 text-xs text-orange-200 hover:bg-orange-500/15 disabled:opacity-50"
                                  : "rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                              }
                            >
                              {t("popups.disable")}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={editorOpen}
        wide
        title={modalTitle}
        subtitle={modalSubtitle}
        onClose={closeEditor}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={closeEditor}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
            >
              {t("popups.cancel")}
            </button>

            <button
              disabled={saving}
              onClick={saveEditor}
              className="rounded-2xl border border-blue-500/25 bg-blue-500/15 px-4 py-2 text-xs font-semibold text-blue-200 hover:bg-blue-500/20 disabled:opacity-50"
            >
              {saving
                ? editorType === "notification"
                  ? t("popups.creating")
                  : editorMode === "create"
                  ? t("popups.creating")
                  : t("popups.saving")
                : editorType === "notification"
                ? t("popups.createNotification")
                : editorMode === "create"
                ? t("popups.createPopup")
                : t("popups.saveChanges")}
            </button>
          </div>
        }
      >
        {editorType === "notification" ? (
          <div className="grid gap-4 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 text-sm font-semibold text-white">
                {t("popups.notificationContent")}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-2 text-xs text-white/60">
                    {t("popups.title")}
                  </div>
                  <input
                    value={notificationForm.title}
                    onChange={(e) =>
                      setNotificationForm((p) => ({
                        ...p,
                        title: e.target.value,
                      }))
                    }
                    placeholder={t("popups.notificationTitlePlaceholder")}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  />
                </div>

                <div>
                  <div className="mb-2 text-xs text-white/60">
                    {t("popups.description")}
                  </div>
                  <textarea
                    value={notificationForm.description}
                    onChange={(e) =>
                      setNotificationForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t("popups.notificationDescriptionPlaceholder")}
                    rows={8}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  />
                </div>
              </div>
            </div>

            <AudienceSelector
              mode={notificationForm.targetType}
              setAll={() =>
                setNotificationForm((p) => ({
                  ...p,
                  targetType: "all",
                  targetUser: "",
                }))
              }
              setSpecific={() =>
                setNotificationForm((p) => ({
                  ...p,
                  targetType: "user",
                }))
              }
              specificLabel={t("popups.specificUser")}
              allTitle={t("popups.allUsers")}
              allDesc={t("popups.sendNotificationEveryone")}
              specificDesc={t("popups.sendNotificationOneUser")}
              t={t}
            />

            {notificationForm.targetType === "user" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-xs font-semibold text-white">
                      {t("popups.searchUsers")}
                    </div>
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={t("popups.searchUsersPlaceholder")}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xs font-semibold text-white">
                        {t("popups.pickUser")}
                      </div>
                      <div className="text-[11px] text-white/50">
                        {notificationForm.targetUser
                          ? `1 ${t("popups.selectedLower")}`
                          : `0 ${t("popups.selectedLower")}`}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {notificationUserResults.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50">
                          {t("popups.noUsersFound")}
                        </div>
                      ) : (
                        notificationUserResults.map((u) => {
                          const active =
                            String(notificationForm.targetUser) === String(u._id);

                          return (
                            <button
                              key={u._id}
                              type="button"
                              onClick={() =>
                                setNotificationForm((p) => ({
                                  ...p,
                                  targetUser: String(u._id),
                                }))
                              }
                              className={classNames(
                                "flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition",
                                active
                                  ? "border-blue-500/35 bg-blue-500/10"
                                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                              )}
                            >
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  UID: {u.uid || "-"}
                                </div>
                                <div className="mt-1 text-[12px] text-white/55">
                                  {t("popups.phone")}: {u.phoneNumber || "-"}
                                </div>
                              </div>

                              <div
                                className={classNames(
                                  "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                  active
                                    ? "bg-blue-500/20 text-blue-200"
                                    : "bg-white/5 text-white/60"
                                )}
                              >
                                {active ? t("popups.selected") : t("popups.select")}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <SelectedSingleUser
                  users={users}
                  targetUser={notificationForm.targetUser}
                  clear={() =>
                    setNotificationForm((p) => ({
                      ...p,
                      targetUser: "",
                    }))
                  }
                  t={t}
                />
              </div>
            ) : null}

            <QuickTips
              title={t("popups.quickTips")}
              tips={[
                t("popups.notificationTip1"),
                t("popups.notificationTip2"),
                t("popups.notificationTip3"),
                t("popups.notificationTip4"),
              ]}
            />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-1">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 text-sm font-semibold text-white">
                  {t("popups.popupContent")}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-2 text-xs text-white/60">
                      {t("popups.title")}
                    </div>
                    <input
                      value={popupForm.title}
                      onChange={(e) =>
                        setPopupForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder={t("popups.popupTitlePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                    />
                  </div>

                  <div>
                    <div className="mb-2 text-xs text-white/60">
                      {t("popups.message")}
                    </div>
                    <textarea
                      value={popupForm.message}
                      onChange={(e) =>
                        setPopupForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder={t("popups.popupMessagePlaceholder")}
                      rows={8}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                    />
                  </div>
                </div>
              </div>

              <AudienceSelector
                mode={popupForm.targetType}
                setAll={() =>
                  setPopupForm((p) => ({
                    ...p,
                    targetType: "all",
                    targetUsers: [],
                  }))
                }
                setSpecific={() =>
                  setPopupForm((p) => ({ ...p, targetType: "specific" }))
                }
                specificLabel={t("popups.specificUsers")}
                allTitle={t("popups.allUsers")}
                allDesc={t("popups.showPopupEveryone")}
                specificDesc={t("popups.pickPopupSpecific")}
                t={t}
              />

              {popupForm.targetType === "specific" ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-xs font-semibold text-white">
                        {t("popups.searchUsers")}
                      </div>
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder={t("popups.searchUidPhone")}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                      />
                    </div>

                    <UserPicker
                      selectedUsers={popupForm.targetUsers}
                      setSelectedUsers={(cbOrValue) => {
                        if (typeof cbOrValue === "function") {
                          setPopupForm((p) => ({
                            ...p,
                            targetUsers: cbOrValue(p.targetUsers),
                          }));
                        } else {
                          setPopupForm((p) => ({
                            ...p,
                            targetUsers: cbOrValue,
                          }));
                        }
                      }}
                      allUsers={users}
                      search={userSearch}
                      setSearch={setUserSearch}
                      t={t}
                      hideSearch
                      hideSelected
                    />
                  </div>

                  <SelectedMultipleUsers
                    users={users}
                    selectedUsers={popupForm.targetUsers}
                    remove={(id) =>
                      setPopupForm((p) => ({
                        ...p,
                        targetUsers: p.targetUsers.filter(
                          (x) => String(x) !== String(id)
                        ),
                      }))
                    }
                    t={t}
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 text-sm font-semibold text-white">
                  {t("popups.status")}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPopupForm((p) => ({ ...p, isActive: !p.isActive }))
                  }
                  className={classNames(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition",
                    popupForm.isActive
                      ? "border-blue-500/35 bg-blue-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {popupForm.isActive ? t("popups.active") : t("popups.inactive")}
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                      {popupForm.isActive
                        ? t("popups.usersCanReceive")
                        : t("popups.savedButHidden")}
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      popupForm.isActive
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-white/10 text-white/60"
                    )}
                  >
                    {popupForm.isActive ? t("popups.on") : t("popups.off")}
                  </div>
                </button>
              </div>

              <QuickTips
                title={t("popups.quickTips")}
                tips={[
                  t("popups.popupTip1"),
                  t("popups.popupTip2"),
                  t("popups.popupTip3"),
                  t("popups.popupTip4"),
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </Shell>
  );
}

function AudienceSelector({
  mode,
  setAll,
  setSpecific,
  specificLabel,
  allTitle,
  allDesc,
  specificDesc,
  t,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 text-sm font-semibold text-white">
        {t("popups.audience")}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={setAll}
          className={classNames(
            "rounded-3xl border px-4 py-4 text-left transition",
            mode === "all"
              ? "border-emerald-500/35 bg-emerald-500/10"
              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
          )}
        >
          <div className="text-sm font-semibold text-white">{allTitle}</div>
          <div className="mt-1 text-xs text-white/50">{allDesc}</div>
        </button>

        <button
          type="button"
          onClick={setSpecific}
          className={classNames(
            "rounded-3xl border px-4 py-4 text-left transition",
            mode === "specific" || mode === "user"
              ? "border-violet-500/35 bg-violet-500/10"
              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
          )}
        >
          <div className="text-sm font-semibold text-white">{specificLabel}</div>
          <div className="mt-1 text-xs text-white/50">{specificDesc}</div>
        </button>
      </div>
    </div>
  );
}

function SelectedSingleUser({ users, targetUser, clear, t }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold text-white">
          {t("popups.selectedUser")}
        </div>
      </div>

      {!targetUser ? (
        <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50">
          {t("popups.noUserSelected")}
        </div>
      ) : (
        (() => {
          const picked = users.find((u) => String(u._id) === String(targetUser));

          return (
            <div className="flex items-center justify-between rounded-2xl border border-blue-500/25 bg-blue-500/10 px-3 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  UID: {picked?.uid || "-"}
                </div>
                <div className="mt-1 text-[12px] text-white/55">
                  {t("popups.phone")}: {picked?.phoneNumber || "-"}
                </div>
                <div className="mt-1 text-[11px] text-white/35">
                  ID: {targetUser}
                </div>
              </div>

              <button
                type="button"
                onClick={clear}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70 hover:bg-white/10"
              >
                {t("popups.remove")}
              </button>
            </div>
          );
        })()
      )}
    </div>
  );
}

function SelectedMultipleUsers({ users, selectedUsers, remove, t }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold text-white">
          {t("popups.selectedUsers")}
        </div>
        <div className="text-[11px] text-white/50">
          {t("popups.total")}: {selectedUsers.length}
        </div>
      </div>

      {selectedUsers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50">
          {t("popups.noUsersSelected")}
        </div>
      ) : (
        <div className="grid gap-2">
          {selectedUsers.map((id) => {
            const picked = users.find((u) => String(u._id) === String(id));

            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-2xl border border-blue-500/25 bg-blue-500/10 px-3 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    UID: {picked?.uid || "-"}
                  </div>
                  <div className="mt-1 text-[12px] text-white/55">
                    {t("popups.phone")}: {picked?.phoneNumber || "-"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70 hover:bg-white/10"
                >
                  {t("popups.remove")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuickTips({ title, tips }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 text-sm font-semibold text-white">{title}</div>
      <ul className="space-y-2 text-xs leading-6 text-white/55">
        {tips.map((tip) => (
          <li key={tip}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}