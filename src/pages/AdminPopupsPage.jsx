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

function toDatetimeLocalValue(value) {
  if (!value) return "";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function datetimeLocalToIso(value) {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  return d.toISOString();
}

function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
  footer,
  wide = false,
  isDark = false,
}) {
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

  const cardClass = isDark
    ? "border-white/10 bg-[#0b1220]/95"
    : "border-[#E5E7EB] bg-white";

  const headerClass = isDark
    ? "border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.24),_transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]"
    : "border-[#EEF2F7] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_42%),linear-gradient(135deg,#ffffff,#F8FAFC)]";

  const titleClass = isDark ? "text-white" : "text-gray-950";
  const subtitleClass = isDark ? "text-white/50" : "text-gray-500";

  const closeClass = isDark
    ? "rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white/70 hover:bg-white/10"
    : "rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-2 text-xs text-gray-600 hover:bg-[#F9FAFB]";

  const footerClass = isDark
    ? "border-t border-white/10 bg-white/[0.03] px-5 py-4"
    : "border-t border-[#EEF2F7] bg-[#FAFBFC] px-5 py-4";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onMouseDown={(e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) {
          onClose?.();
        }
      }}
    >
      <div
        className={classNames(
          "absolute inset-0 backdrop-blur-sm",
          isDark ? "bg-black/60" : "bg-gray-900/25",
        )}
      />

      <div
        ref={cardRef}
        className={classNames(
          "relative w-full overflow-hidden rounded-[28px] border shadow-2xl",
          wide ? "max-w-4xl" : "max-w-xl",
          cardClass,
        )}
      >
        <div
          className={classNames(
            "relative overflow-hidden border-b px-5 py-4",
            headerClass,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className={classNames("text-base font-semibold", titleClass)}
              >
                {title}
              </div>

              {subtitle ? (
                <div className={classNames("mt-1 text-xs", subtitleClass)}>
                  {subtitle}
                </div>
              ) : null}
            </div>

            <button onClick={onClose} className={closeClass}>
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>

        {footer ? <div className={footerClass}>{footer}</div> : null}
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
  isDark,
  hideSearch = false,
  hideSelected = false,
}) {
  const filteredUsers = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();
    if (!q) return allUsers.slice(0, 20);

    return allUsers
      .filter((u) => {
        return (
          String(u.phoneNumber || "")
            .toLowerCase()
            .includes(q) ||
          String(u.uid || "")
            .toLowerCase()
            .includes(q) ||
          String(u._id || "")
            .toLowerCase()
            .includes(q)
        );
      })
      .slice(0, 30);
  }, [allUsers, search]);

  function toggleUser(user) {
    const exists = selectedUsers.some((id) => String(id) === String(user._id));

    if (exists) {
      setSelectedUsers((prev) =>
        prev.filter((id) => String(id) !== String(user._id)),
      );
    } else {
      setSelectedUsers((prev) => [...prev, String(user._id)]);
    }
  }

  const boxClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/[0.03] p-3"
    : "rounded-2xl border border-[#E5E7EB] bg-white p-3";

  const titleClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-white/50" : "text-gray-500";

  const inputClass = isDark
    ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
    : "mt-2 w-full rounded-xl border border-[#D9DDE5] bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#93C5FD]";

  const emptyClass = isDark
    ? "rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50"
    : "rounded-xl border border-dashed border-[#D1D5DB] px-3 py-4 text-xs text-gray-500";

  return (
    <div className="space-y-3">
      {!hideSearch ? (
        <div className={boxClass}>
          <div className={classNames("text-xs font-semibold", titleClass)}>
            {t("popups.searchUsers")}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("popups.searchUsersPlaceholder")}
            className={inputClass}
          />
        </div>
      ) : null}

      <div className={boxClass}>
        <div className="mb-3 flex items-center justify-between">
          <div className={classNames("text-xs font-semibold", titleClass)}>
            {t("popups.pickUsers")}
          </div>
          <div className={classNames("text-[11px]", mutedClass)}>
            {t("popups.selected")}: {selectedUsers.length}
          </div>
        </div>

        <div className="grid gap-2">
          {filteredUsers.length === 0 ? (
            <div className={emptyClass}>{t("popups.noUsersFound")}</div>
          ) : (
            filteredUsers.map((u) => {
              const active = selectedUsers.some(
                (id) => String(id) === String(u._id),
              );

              return (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => toggleUser(u)}
                  className={classNames(
                    "flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition",
                    active
                      ? isDark
                        ? "border-blue-500/35 bg-blue-500/10"
                        : "border-blue-300 bg-blue-50"
                      : isDark
                        ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]",
                  )}
                >
                  <div>
                    <div
                      className={classNames(
                        "text-sm font-semibold",
                        titleClass,
                      )}
                    >
                      UID: {u.uid || "-"}
                    </div>
                    <div className={classNames("mt-1 text-[12px]", mutedClass)}>
                      {t("popups.phone")}: {u.phoneNumber || "-"}
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      active
                        ? isDark
                          ? "bg-blue-500/20 text-blue-200"
                          : "bg-blue-100 text-blue-700"
                        : isDark
                          ? "bg-white/5 text-white/60"
                          : "bg-gray-100 text-gray-600",
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
        <div className={boxClass}>
          <div className={classNames("mb-2 text-xs font-semibold", titleClass)}>
            {t("popups.selectedUserIds")}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((id) => (
              <span
                key={id}
                className={
                  isDark
                    ? "rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200"
                    : "rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] text-blue-700"
                }
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
  const [userLoading, setUserLoading] = useState(false);

  const [sentTimeOpen, setSentTimeOpen] = useState(false);
  const [sentTimeForm, setSentTimeForm] = useState({
    id: "",
    title: "",
    sentAt: "",
  });

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
    sentAt: "",
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

  const modalBoxClass = isDark
    ? "rounded-3xl border border-white/10 bg-white/[0.03] p-4"
    : "rounded-3xl border border-[#E5E7EB] bg-[#FAFBFC] p-4";

  const modalSmallBoxClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/[0.03] p-3"
    : "rounded-2xl border border-[#E5E7EB] bg-white p-3";

  const modalTitleText = isDark ? "text-white" : "text-gray-900";
  const modalMutedText = isDark ? "text-white/55" : "text-gray-500";
  const modalLabelText = isDark ? "text-white/60" : "text-gray-600";

  const modalInputClass = isDark
    ? "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
    : "w-full rounded-2xl border border-[#D9DDE5] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#93C5FD]";

  const modalSmallInputClass = isDark
    ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
    : "mt-2 w-full rounded-xl border border-[#D9DDE5] bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#93C5FD]";

  const modalEmptyClass = isDark
    ? "rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50"
    : "rounded-xl border border-dashed border-[#D1D5DB] px-3 py-4 text-xs text-gray-500";

  const modalFooterCancelClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
    : "rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs text-gray-600 hover:bg-[#F9FAFB]";

  const modalFooterPrimaryClass = isDark
    ? "rounded-2xl border border-blue-500/25 bg-blue-500/15 px-4 py-2 text-xs font-semibold text-blue-200 hover:bg-blue-500/20 disabled:opacity-50"
    : "rounded-2xl border border-[#BFDBFE] bg-[#EAF3FF] px-4 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DDEEFF] disabled:opacity-50";

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
      throw new Error(
        data?.message || `${t("popups.requestFailed")} (${res.status})`,
      );
    }

    return data;
  }

  async function loadUsers(searchText = "") {
    setUserLoading(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "30",
        sortBy: "createdAt_desc",
      });

      const cleanSearch = String(searchText || "").trim();
      if (cleanSearch) {
        params.set("q", cleanSearch);
      }

      const data = await fetchJSON(
        `${API_BASE}/api/admin/users?${params.toString()}`,
      );

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (e) {
      toast.error(e.message || t("popups.failedLoadPage"));
      setUsers([]);
    } finally {
      setUserLoading(false);
    }
  }

  async function loadPage() {
    setLoading(true);

    try {
      const [popupData, notificationData, userData] = await Promise.all([
        fetchJSON(`${API_BASE}/api/admin/popups`),
        fetchJSON(`${API_BASE}/api/admin/user-notifications`),
        fetchJSON(`${API_BASE}/api/admin/users?limit=100`),
      ]);

      setPopups(Array.isArray(popupData.popups) ? popupData.popups : []);
      setNotifications(
        Array.isArray(notificationData.notifications)
          ? notificationData.notifications
          : [],
      );
      setUsers(Array.isArray(userData.users) ? userData.users : []);
    } catch (e) {
      toast.error(e.message || t("popups.failedLoadPage"));
      setPopups([]);
      setNotifications([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editorOpen) return;

    const needsUserSearch =
      (editorType === "notification" &&
        notificationForm.targetType === "user") ||
      (editorType === "popup" && popupForm.targetType === "specific");

    if (!needsUserSearch) return;

    const timer = setTimeout(() => {
      loadUsers(userSearch);
    }, 250);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editorOpen,
    editorType,
    userSearch,
    notificationForm.targetType,
    popupForm.targetType,
  ]);

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
      sentAt: "",
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

  function openSentTimeEditor(notification) {
    setSentTimeForm({
      id: notification._id,
      title: notification.title || "",
      sentAt: toDatetimeLocalValue(
        notification.sentAt || notification.createdAt,
      ),
    });
    setSentTimeOpen(true);
  }

  function closeSentTimeEditor() {
    setSentTimeOpen(false);
    setSentTimeForm({
      id: "",
      title: "",
      sentAt: "",
    });
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
        const data = await fetchJSON(
          `${API_BASE}/api/admin/popups/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        setPopups((prev) =>
          prev.map((p) => (p._id === editingId ? data.popup : p)),
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
    const sentAtIso = datetimeLocalToIso(notificationForm.sentAt);

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

    if (notificationForm.sentAt && !sentAtIso) {
      toast.error("Invalid sent time");
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

      if (sentAtIso) {
        payload.sentAt = sentAtIso;
      }

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

  async function saveSentTime() {
    const notificationId = String(sentTimeForm.id || "").trim();
    const sentAtIso = datetimeLocalToIso(sentTimeForm.sentAt);

    if (!notificationId) {
      toast.error("Notification not found");
      return;
    }

    if (!sentTimeForm.sentAt || !sentAtIso) {
      toast.error("Invalid sent time");
      return;
    }

    setSaving(true);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/user-notifications/${notificationId}/sent-time`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sentAt: sentAtIso,
          }),
        },
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? data.notification : n)),
      );

      toast.success("Sent time updated");
      closeSentTimeEditor();
      await loadPage();
    } catch (e) {
      toast.error(e.message || "Failed to update sent time");
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
      const data = await fetchJSON(
        `${API_BASE}/api/admin/popups/${popup._id}/active`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !popup.isActive }),
        },
      );

      setPopups((prev) =>
        prev.map((p) => (p._id === popup._id ? data.popup : p)),
      );

      toast.success(
        data.popup?.isActive
          ? t("popups.popupActivated")
          : t("popups.popupDeactivated"),
      );
    } catch (e) {
      toast.error(e.message || t("popups.failedUpdatePopup"));
    } finally {
      setBusyId(null);
    }
  }

  async function deletePopup(popup) {
    const ok = window.confirm(
      t("popups.confirmDeletePopup", { title: popup.title }),
    );
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
      t("popups.confirmDisableNotification", { title: notification.title }),
    );
    if (!ok) return;

    setBusyId(notification._id);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/user-notifications/${notification._id}/disable`,
        {
          method: "PATCH",
        },
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? data.notification : n)),
      );

      toast.success(t("popups.notificationDisabled"));
    } catch (e) {
      toast.error(e.message || t("popups.failedDisableNotification"));
    } finally {
      setBusyId(null);
    }
  }

  const filteredPopups = useMemo(() => {
    const qq = String(q || "")
      .trim()
      .toLowerCase();

    return popups.filter((p) => {
      if (!qq) return true;

      return (
        String(p.title || "")
          .toLowerCase()
          .includes(qq) ||
        String(p.message || "")
          .toLowerCase()
          .includes(qq) ||
        String(p.targetType || "")
          .toLowerCase()
          .includes(qq)
      );
    });
  }, [popups, q]);

  const filteredNotifications = useMemo(() => {
    const qq = String(q || "")
      .trim()
      .toLowerCase();

    return notifications.filter((n) => {
      if (!qq) return true;

      return (
        String(n.title || "")
          .toLowerCase()
          .includes(qq) ||
        String(n.description || "")
          .toLowerCase()
          .includes(qq) ||
        String(n.targetType || "")
          .toLowerCase()
          .includes(qq)
      );
    });
  }, [notifications, q]);

  const notificationUserResults = useMemo(() => {
    return users.slice(0, 30);
  }, [users]);

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

              <h2
                className={`mt-3 text-2xl font-semibold tracking-tight ${strongText}`}
              >
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
                    : "border-[#E5E7EB] bg-[#F9FAFB]",
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
                        : "text-gray-500 hover:text-gray-900",
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
                        : "text-gray-500 hover:text-gray-900",
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
                isDark
                  ? "border-b border-white/10"
                  : "border-b border-[#EEF2F7]",
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
                    <th className="w-[520px] px-5 py-3">
                      {t("popups.message")}
                    </th>
                    <th className="w-[140px] px-5 py-3">
                      {t("popups.target")}
                    </th>
                    <th className="w-[180px] px-5 py-3">{t("popups.users")}</th>
                    <th className="w-[130px] px-5 py-3">
                      {t("popups.status")}
                    </th>
                    <th className="w-[220px] px-5 py-3">
                      {t("popups.created")}
                    </th>
                    <th className="w-[220px] px-5 py-3">
                      {t("popups.actions")}
                    </th>
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
                      <td
                        colSpan={7}
                        className={`px-5 py-6 text-sm ${softText}`}
                      >
                        {t("popups.loadingPopups")}
                      </td>
                    </tr>
                  ) : filteredPopups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className={`px-5 py-6 text-sm ${softText}`}
                      >
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
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-700",
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
                                  {targetUsers.length}{" "}
                                  {t("popups.selectedLower")}
                                </div>
                                <div
                                  className={`mt-1 text-[11px] ${mutedText}`}
                                >
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
                                    : "border border-gray-200 bg-gray-50 text-gray-600",
                              )}
                            >
                              {popup.isActive
                                ? t("popups.active")
                                : t("popups.inactive")}
                            </span>
                          </td>

                          <td
                            className={`px-5 py-4 align-top text-sm ${softText}`}
                          >
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
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                                )}
                              >
                                {popup.isActive
                                  ? t("popups.deactivate")
                                  : t("popups.activate")}
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
                isDark
                  ? "border-b border-white/10"
                  : "border-b border-[#EEF2F7]",
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
              <table className="min-w-[1450px] text-left text-sm">
                <thead className={tableHeadClass}>
                  <tr>
                    <th className="w-[240px] px-5 py-3">{t("popups.title")}</th>
                    <th className="w-[480px] px-5 py-3">
                      {t("popups.description")}
                    </th>
                    <th className="w-[150px] px-5 py-3">
                      {t("popups.target")}
                    </th>
                    <th className="w-[130px] px-5 py-3">
                      {t("popups.status")}
                    </th>
                    <th className="w-[220px] px-5 py-3">Sent Time</th>
                    <th className="w-[250px] px-5 py-3">
                      {t("popups.actions")}
                    </th>
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
                      <td
                        colSpan={6}
                        className={`px-5 py-6 text-sm ${softText}`}
                      >
                        {t("popups.loadingNotifications")}
                      </td>
                    </tr>
                  ) : filteredNotifications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className={`px-5 py-6 text-sm ${softText}`}
                      >
                        {t("popups.noNotificationsFound")}
                      </td>
                    </tr>
                  ) : (
                    filteredNotifications.map((notification) => {
                      const isBusy = busyId === notification._id;

                      return (
                        <tr key={notification._id} className={rowHoverClass}>
                          <td className="px-5 py-4 align-top">
                            <div className="max-w-[240px]">
                              <div
                                className={`truncate text-sm font-semibold ${strongText}`}
                              >
                                {notification.title || "-"}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div
                              className={`max-w-[480px] whitespace-pre-wrap break-words text-sm leading-7 ${softText}`}
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
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-700",
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
                                    : "border border-gray-200 bg-gray-50 text-gray-600",
                              )}
                            >
                              {notification.isActive
                                ? t("popups.active")
                                : t("popups.disabled")}
                            </span>
                          </td>

                          <td
                            className={`px-5 py-4 align-top text-sm ${softText}`}
                          >
                            {formatDate(
                              notification.sentAt || notification.createdAt,
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <button
                                disabled={isBusy}
                                onClick={() => openSentTimeEditor(notification)}
                                className={
                                  isDark
                                    ? "rounded-2xl border border-blue-500/25 bg-blue-500/10 px-3 py-2 text-xs text-blue-200 hover:bg-blue-500/15 disabled:opacity-50"
                                    : "rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                                }
                              >
                                Edit Time
                              </button>

                              <button
                                disabled={isBusy || !notification.isActive}
                                onClick={() =>
                                  disableNotification(notification)
                                }
                                className={
                                  isDark
                                    ? "rounded-2xl border border-orange-500/25 bg-orange-500/10 px-3 py-2 text-xs text-orange-200 hover:bg-orange-500/15 disabled:opacity-50"
                                    : "rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                                }
                              >
                                {t("popups.disable")}
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
        )}
      </div>

      <Modal
        open={editorOpen}
        wide
        isDark={isDark}
        title={modalTitle}
        subtitle={modalSubtitle}
        onClose={closeEditor}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button onClick={closeEditor} className={modalFooterCancelClass}>
              {t("popups.cancel")}
            </button>

            <button
              disabled={saving}
              onClick={saveEditor}
              className={modalFooterPrimaryClass}
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
            <div className={modalBoxClass}>
              <div
                className={classNames(
                  "mb-3 text-sm font-semibold",
                  modalTitleText,
                )}
              >
                {t("popups.notificationContent")}
              </div>

              <div className="space-y-3">
                <div>
                  <div className={classNames("mb-2 text-xs", modalLabelText)}>
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
                    className={modalInputClass}
                  />
                </div>

                <div>
                  <div className={classNames("mb-2 text-xs", modalLabelText)}>
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
                    className={classNames("resize-none", modalInputClass)}
                  />
                </div>

                <div>
                  <div className={classNames("mb-2 text-xs", modalLabelText)}>
                    Sent Time
                  </div>
                  <input
                    type="datetime-local"
                    value={notificationForm.sentAt}
                    onChange={(e) =>
                      setNotificationForm((p) => ({
                        ...p,
                        sentAt: e.target.value,
                      }))
                    }
                    className={modalInputClass}
                  />
                  <div
                    className={classNames("mt-2 text-[11px]", modalMutedText)}
                  >
                    Leave empty to use current time.
                  </div>
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
              isDark={isDark}
            />

            {notificationForm.targetType === "user" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className={modalSmallBoxClass}>
                    <div
                      className={classNames(
                        "text-xs font-semibold",
                        modalTitleText,
                      )}
                    >
                      {t("popups.searchUsers")}
                    </div>
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={t("popups.searchUsersPlaceholder")}
                      className={modalSmallInputClass}
                    />
                  </div>

                  <div className={modalSmallBoxClass}>
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={classNames(
                          "text-xs font-semibold",
                          modalTitleText,
                        )}
                      >
                        {t("popups.pickUser")}
                      </div>
                      <div
                        className={classNames("text-[11px]", modalMutedText)}
                      >
                        {notificationForm.targetUser
                          ? `1 ${t("popups.selectedLower")}`
                          : `0 ${t("popups.selectedLower")}`}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {userLoading ? (
                        <div className={modalEmptyClass}>
                          Searching users...
                        </div>
                      ) : notificationUserResults.length === 0 ? (
                        <div className={modalEmptyClass}>
                          {t("popups.noUsersFound")}
                        </div>
                      ) : (
                        notificationUserResults.map((u) => {
                          const active =
                            String(notificationForm.targetUser) ===
                            String(u._id);

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
                                  ? isDark
                                    ? "border-blue-500/35 bg-blue-500/10"
                                    : "border-blue-300 bg-blue-50"
                                  : isDark
                                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                                    : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]",
                              )}
                            >
                              <div>
                                <div
                                  className={classNames(
                                    "text-sm font-semibold",
                                    modalTitleText,
                                  )}
                                >
                                  UID: {u.uid || "-"}
                                </div>
                                <div
                                  className={classNames(
                                    "mt-1 text-[12px]",
                                    modalMutedText,
                                  )}
                                >
                                  {t("popups.phone")}: {u.phoneNumber || "-"}
                                </div>
                              </div>

                              <div
                                className={classNames(
                                  "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                  active
                                    ? isDark
                                      ? "bg-blue-500/20 text-blue-200"
                                      : "bg-blue-100 text-blue-700"
                                    : isDark
                                      ? "bg-white/5 text-white/60"
                                      : "bg-gray-100 text-gray-600",
                                )}
                              >
                                {active
                                  ? t("popups.selected")
                                  : t("popups.select")}
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
                  isDark={isDark}
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
              isDark={isDark}
            />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-1">
            <div className="space-y-4">
              <div className={modalBoxClass}>
                <div
                  className={classNames(
                    "mb-3 text-sm font-semibold",
                    modalTitleText,
                  )}
                >
                  {t("popups.popupContent")}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className={classNames("mb-2 text-xs", modalLabelText)}>
                      {t("popups.title")}
                    </div>
                    <input
                      value={popupForm.title}
                      onChange={(e) =>
                        setPopupForm((p) => ({
                          ...p,
                          title: e.target.value,
                        }))
                      }
                      placeholder={t("popups.popupTitlePlaceholder")}
                      className={modalInputClass}
                    />
                  </div>

                  <div>
                    <div className={classNames("mb-2 text-xs", modalLabelText)}>
                      {t("popups.message")}
                    </div>
                    <textarea
                      value={popupForm.message}
                      onChange={(e) =>
                        setPopupForm((p) => ({
                          ...p,
                          message: e.target.value,
                        }))
                      }
                      placeholder={t("popups.popupMessagePlaceholder")}
                      rows={8}
                      className={classNames("resize-none", modalInputClass)}
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
                  setPopupForm((p) => ({
                    ...p,
                    targetType: "specific",
                  }))
                }
                specificLabel={t("popups.specificUsers")}
                allTitle={t("popups.allUsers")}
                allDesc={t("popups.showPopupEveryone")}
                specificDesc={t("popups.pickPopupSpecific")}
                t={t}
                isDark={isDark}
              />

              {popupForm.targetType === "specific" ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className={modalSmallBoxClass}>
                      <div
                        className={classNames(
                          "text-xs font-semibold",
                          modalTitleText,
                        )}
                      >
                        {t("popups.searchUsers")}
                      </div>
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder={t("popups.searchUidPhone")}
                        className={modalSmallInputClass}
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
                      isDark={isDark}
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
                          (x) => String(x) !== String(id),
                        ),
                      }))
                    }
                    t={t}
                    isDark={isDark}
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className={modalBoxClass}>
                <div
                  className={classNames(
                    "mb-3 text-sm font-semibold",
                    modalTitleText,
                  )}
                >
                  {t("popups.status")}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPopupForm((p) => ({
                      ...p,
                      isActive: !p.isActive,
                    }))
                  }
                  className={classNames(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition",
                    popupForm.isActive
                      ? isDark
                        ? "border-blue-500/35 bg-blue-500/10"
                        : "border-blue-300 bg-blue-50"
                      : isDark
                        ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]",
                  )}
                >
                  <div>
                    <div
                      className={classNames(
                        "text-sm font-semibold",
                        modalTitleText,
                      )}
                    >
                      {popupForm.isActive
                        ? t("popups.active")
                        : t("popups.inactive")}
                    </div>
                    <div className={classNames("mt-1 text-xs", modalMutedText)}>
                      {popupForm.isActive
                        ? t("popups.usersCanReceive")
                        : t("popups.savedButHidden")}
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      popupForm.isActive
                        ? isDark
                          ? "bg-blue-500/20 text-blue-200"
                          : "bg-blue-100 text-blue-700"
                        : isDark
                          ? "bg-white/10 text-white/60"
                          : "bg-gray-100 text-gray-600",
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
                isDark={isDark}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={sentTimeOpen}
        isDark={isDark}
        title="Edit Sent Time"
        subtitle={sentTimeForm.title || "Modify notification display time"}
        onClose={closeSentTimeEditor}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={closeSentTimeEditor}
              className={modalFooterCancelClass}
            >
              Cancel
            </button>

            <button
              disabled={saving}
              onClick={saveSentTime}
              className={modalFooterPrimaryClass}
            >
              {saving ? "Saving..." : "Save Sent Time"}
            </button>
          </div>
        }
      >
        <div className={modalBoxClass}>
          <div className={classNames("mb-2 text-xs", modalLabelText)}>
            Sent Time
          </div>

          <input
            type="datetime-local"
            value={sentTimeForm.sentAt}
            onChange={(e) =>
              setSentTimeForm((p) => ({
                ...p,
                sentAt: e.target.value,
              }))
            }
            className={modalInputClass}
          />

          <div className={classNames("mt-3 text-xs leading-6", modalMutedText)}>
            This is the time users will see on the notification. It does not
            change the real database created time.
          </div>
        </div>
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
  isDark,
}) {
  const boxClass = isDark
    ? "rounded-3xl border border-white/10 bg-white/[0.03] p-4"
    : "rounded-3xl border border-[#E5E7EB] bg-[#FAFBFC] p-4";

  const titleClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-white/50" : "text-gray-500";

  return (
    <div className={boxClass}>
      <div className={classNames("mb-3 text-sm font-semibold", titleClass)}>
        {t("popups.audience")}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={setAll}
          className={classNames(
            "rounded-3xl border px-4 py-4 text-left transition",
            mode === "all"
              ? isDark
                ? "border-emerald-500/35 bg-emerald-500/10"
                : "border-emerald-300 bg-emerald-50"
              : isDark
                ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]",
          )}
        >
          <div className={classNames("text-sm font-semibold", titleClass)}>
            {allTitle}
          </div>
          <div className={classNames("mt-1 text-xs", mutedClass)}>
            {allDesc}
          </div>
        </button>

        <button
          type="button"
          onClick={setSpecific}
          className={classNames(
            "rounded-3xl border px-4 py-4 text-left transition",
            mode === "specific" || mode === "user"
              ? isDark
                ? "border-violet-500/35 bg-violet-500/10"
                : "border-violet-300 bg-violet-50"
              : isDark
                ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]",
          )}
        >
          <div className={classNames("text-sm font-semibold", titleClass)}>
            {specificLabel}
          </div>
          <div className={classNames("mt-1 text-xs", mutedClass)}>
            {specificDesc}
          </div>
        </button>
      </div>
    </div>
  );
}

function SelectedSingleUser({ users, targetUser, clear, t, isDark }) {
  const boxClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/[0.03] p-3"
    : "rounded-2xl border border-[#E5E7EB] bg-white p-3";

  const titleClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-white/55" : "text-gray-500";
  const softClass = isDark ? "text-white/35" : "text-gray-400";

  const emptyClass = isDark
    ? "rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50"
    : "rounded-xl border border-dashed border-[#D1D5DB] px-3 py-4 text-xs text-gray-500";

  return (
    <div className={boxClass}>
      <div className="mb-3 flex items-center justify-between">
        <div className={classNames("text-xs font-semibold", titleClass)}>
          {t("popups.selectedUser")}
        </div>
      </div>

      {!targetUser ? (
        <div className={emptyClass}>{t("popups.noUserSelected")}</div>
      ) : (
        (() => {
          const picked = users.find(
            (u) => String(u._id) === String(targetUser),
          );

          return (
            <div
              className={
                isDark
                  ? "flex items-center justify-between rounded-2xl border border-blue-500/25 bg-blue-500/10 px-3 py-3"
                  : "flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3"
              }
            >
              <div>
                <div
                  className={classNames("text-sm font-semibold", titleClass)}
                >
                  UID: {picked?.uid || "-"}
                </div>
                <div className={classNames("mt-1 text-[12px]", mutedClass)}>
                  {t("popups.phone")}: {picked?.phoneNumber || "-"}
                </div>
                <div className={classNames("mt-1 text-[11px]", softClass)}>
                  ID: {targetUser}
                </div>
              </div>

              <button
                type="button"
                onClick={clear}
                className={
                  isDark
                    ? "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70 hover:bg-white/10"
                    : "rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50"
                }
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

function SelectedMultipleUsers({ users, selectedUsers, remove, t, isDark }) {
  const boxClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/[0.03] p-3"
    : "rounded-2xl border border-[#E5E7EB] bg-white p-3";

  const titleClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-white/50" : "text-gray-500";

  const emptyClass = isDark
    ? "rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-white/50"
    : "rounded-xl border border-dashed border-[#D1D5DB] px-3 py-4 text-xs text-gray-500";

  return (
    <div className={boxClass}>
      <div className="mb-3 flex items-center justify-between">
        <div className={classNames("text-xs font-semibold", titleClass)}>
          {t("popups.selectedUsers")}
        </div>
        <div className={classNames("text-[11px]", mutedClass)}>
          {t("popups.total")}: {selectedUsers.length}
        </div>
      </div>

      {selectedUsers.length === 0 ? (
        <div className={emptyClass}>{t("popups.noUsersSelected")}</div>
      ) : (
        <div className="grid gap-2">
          {selectedUsers.map((id) => {
            const picked = users.find((u) => String(u._id) === String(id));

            return (
              <div
                key={id}
                className={
                  isDark
                    ? "flex items-center justify-between rounded-2xl border border-blue-500/25 bg-blue-500/10 px-3 py-3"
                    : "flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3"
                }
              >
                <div>
                  <div
                    className={classNames("text-sm font-semibold", titleClass)}
                  >
                    UID: {picked?.uid || "-"}
                  </div>
                  <div className={classNames("mt-1 text-[12px]", mutedClass)}>
                    {t("popups.phone")}: {picked?.phoneNumber || "-"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(id)}
                  className={
                    isDark
                      ? "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70 hover:bg-white/10"
                      : "rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50"
                  }
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

function QuickTips({ title, tips, isDark }) {
  const boxClass = isDark
    ? "rounded-3xl border border-white/10 bg-white/[0.03] p-4"
    : "rounded-3xl border border-[#E5E7EB] bg-[#FAFBFC] p-4";

  const titleClass = isDark ? "text-white" : "text-gray-900";
  const textClass = isDark ? "text-white/55" : "text-gray-500";

  return (
    <div className={boxClass}>
      <div className={classNames("mb-2 text-sm font-semibold", titleClass)}>
        {title}
      </div>
      <ul className={classNames("space-y-2 text-xs leading-6", textClass)}>
        {tips.map((tip) => (
          <li key={tip}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}
