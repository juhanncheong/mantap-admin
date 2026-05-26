import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

const USERS_CACHE_KEY = "admin_users_page_cache_v1";

function loadUsersCache() {
  try {
    const raw = sessionStorage.getItem(USERS_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUsersCache(payload) {
  try {
    sessionStorage.setItem(USERS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache errors
  }
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function safeNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function sortUsersList(list, sortBy) {
  const next = [...list];

  next.sort((a, b) => {
    if (sortBy === "createdAt_desc") {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    }

    if (sortBy === "createdAt_asc") {
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    }

    if (sortBy === "lastOnline_desc") {
      return (
        new Date(b.lastOnlineAt || 0).getTime() -
        new Date(a.lastOnlineAt || 0).getTime()
      );
    }

    if (sortBy === "balance_desc") {
      return safeNum(b.displayBalance ?? b.balance) - safeNum(a.displayBalance ?? a.balance);
    }

    if (sortBy === "balance_asc") {
      return safeNum(a.displayBalance ?? a.balance) - safeNum(b.displayBalance ?? b.balance);
    }

    if (sortBy === "orders_desc") {
      return safeNum(b.ordersCompleted) - safeNum(a.ordersCompleted);
    }

    if (sortBy === "orders_asc") {
      return safeNum(a.ordersCompleted) - safeNum(b.ordersCompleted);
    }

    if (sortBy === "pending_desc") {
      return safeNum(b.pendingAmount) - safeNum(a.pendingAmount);
    }

    return 0;
  });

  return next;
}

/** Premium modal (click outside + ESC to close) */
function Modal({ open, title, subtitle, children, onClose, footer }) {
  const cardRef = useRef(null);
  const { theme } = useTheme();

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

  const modalCardClass =
    theme === "dark"
      ? "relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/90 shadow-2xl"
      : "relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl";

  const titleClass =
    theme === "dark" ? "text-base font-semibold text-white" : "text-base font-semibold text-gray-900";

  const subtitleClass =
    theme === "dark" ? "mt-1 text-xs text-white/50" : "mt-1 text-xs text-gray-500";

  const closeBtnClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-600 hover:bg-gray-50";

  const footerClass =
    theme === "dark"
      ? "border-t border-white/10 bg-white/5 px-5 py-4"
      : "border-t border-gray-200 bg-gray-50 px-5 py-4";

  const modalSectionClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 p-3"
      : "rounded-2xl border border-gray-200 bg-gray-50 p-3";

  const modalLabelClass =
    theme === "dark" ? "text-xs font-semibold text-white" : "text-xs font-semibold text-gray-900";

  const modalHintClass =
    theme === "dark" ? "mt-2 text-[11px] text-white/40" : "mt-2 text-[11px] text-gray-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onMouseDown={(e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div ref={cardRef} className={modalCardClass}>
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div>
            <div className={titleClass}>{title}</div>
            {subtitle ? <div className={subtitleClass}>{subtitle}</div> : null}
          </div>

          <button onClick={onClose} className={closeBtnClass}>✕</button>
        </div>

        <div className="px-5 pb-5">{children}</div>

        {footer ? <div className={footerClass}>{footer}</div> : null}
      </div>
    </div>
  );
}

/** Right sidebar drawer for More actions */
function Drawer({ open, title, subtitle, children, onClose }) {
  const panelRef = useRef(null);
  const { theme } = useTheme();

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
      className="fixed inset-0 z-50"
      onMouseDown={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) {
          onClose?.();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="absolute inset-0 flex md:inset-y-0 md:right-0 md:left-auto md:max-w-full">
        <div
          ref={panelRef}
          className={`relative flex h-full w-full flex-col shadow-2xl md:max-w-[760px] ${
            theme === "dark"
              ? "bg-[#071120] md:border-l md:border-white/10"
              : "bg-white md:border-l md:border-gray-200"
          }`}
        >
          <div
            className={`sticky top-0 z-10 flex items-start justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 ${
              theme === "dark"
                ? "border-b border-white/10 bg-[#071120]/95"
                : "border-b border-gray-200 bg-white/95"
            } backdrop-blur`}
          >
            <div className="min-w-0">
              <div
                className={`truncate text-base font-semibold sm:text-lg ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </div>

              {subtitle ? (
                <div
                  className={`mt-1 line-clamp-2 text-xs ${
                    theme === "dark" ? "text-white/50" : "text-gray-500"
                  }`}
                >
                  {subtitle}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs transition ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  className = "",
  placement = "bottom",
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const { theme } = useTheme();

  const selected = options.find((x) => String(x.value) === String(value));

  useEffect(() => {
    function onMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const buttonClass =
    theme === "dark"
      ? "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.09]"
      : "border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50";

  const menuClass =
    theme === "dark"
      ? "border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40"
      : "border-gray-200 bg-white shadow-2xl shadow-gray-200/80";

  const optionClass =
    theme === "dark"
      ? "text-white/80 hover:bg-white/[0.07]"
      : "text-gray-700 hover:bg-gray-50";

  const activeOptionClass =
    theme === "dark"
      ? "bg-blue-500/15 text-blue-200"
      : "bg-blue-50 text-blue-700";

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex min-h-[40px] w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
      >
        <span className="min-w-0 truncate">
          {selected?.label || placeholder}
        </span>

        <span
          className={`shrink-0 text-[10px] opacity-60 transition ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open ? (
        <div
          className={`absolute left-0 z-[999] max-h-72 w-full min-w-[180px] overflow-y-auto rounded-2xl border p-1 ${menuClass} ${
            placement === "top"
              ? "bottom-[calc(100%+8px)]"
              : "top-[calc(100%+8px)]"
          }`}
        >
          {options.map((opt) => {
            const active = String(opt.value) === String(value);

            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition ${
                  active ? activeOptionClass : optionClass
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {active ? <span className="text-[11px]">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function Users() {
  const navigate = useNavigate();

  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const softText = theme === "dark" ? "text-white/70" : "text-gray-600";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";
  
  const cardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5"
      : "rounded-2xl border border-gray-200 bg-white shadow-sm";
  
  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
      : "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400";
  
  const selectClass =
    theme === "dark"
      ? "appearance-none rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white outline-none hover:bg-[#182236]"
      : "appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none hover:bg-gray-50";

  const optionClass =
    theme === "dark"
      ? "bg-[#111827] text-white"
      : "bg-white text-gray-900";    
  
  const buttonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";
  
  const tableWrapClass =
    theme === "dark"
      ? "mt-4 overflow-hidden rounded-2xl border border-white/10"
      : "mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";
  
  const tableHeaderBarClass =
    theme === "dark"
      ? "bg-white/5 px-4 py-3 text-sm font-semibold"
      : "bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900";
  
  const tableHeadClass =
    theme === "dark"
      ? "bg-white/5 text-xs text-white/60"
      : "bg-gray-50 text-xs text-gray-500";
  
  const tableBodyClass =
    theme === "dark"
      ? "divide-y divide-white/10"
      : "divide-y divide-gray-200";
  
  const tableRowClass =
    theme === "dark"
      ? "hover:bg-white/5"
      : "hover:bg-gray-50";
  
  const footerBarClass =
    theme === "dark"
      ? "flex flex-col gap-3 border-t border-white/10 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
      : "flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between";
  
  const drawerSectionClass =
    theme === "dark"
    ? "rounded-3xl border border-white/10 bg-white/[0.03] p-4"
    : "rounded-3xl border border-gray-200 bg-gray-50 p-4";

  const drawerCardClass =
    theme === "dark"
    ? "rounded-2xl border border-white/10 bg-white/[0.04] p-4"
    : "rounded-2xl border border-gray-200 bg-white p-4";

  const drawerLabelClass =
    theme === "dark" ? "text-xs text-white/50" : "text-xs text-gray-500";

  const drawerValueClass =
    theme === "dark"
      ? "mt-1 text-sm font-semibold text-white"
      : "mt-1 text-sm font-semibold text-gray-900";
  
  const drawerMutedClass =
    theme === "dark" ? "text-[11px] text-white/50" : "text-[11px] text-gray-500";
  
  const drawerNeutralButtonClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-xs text-white/80 hover:bg-white/[0.07]"
      : "rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-xs text-gray-800 hover:bg-gray-50";
  
  const pillNeutralClass =
    theme === "dark"
      ? "rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/80"
      : "rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10px] text-gray-700";

  const actionPlainClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-xs text-white/85 hover:bg-white/[0.07]"
      : "rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-xs text-gray-900 hover:bg-gray-50";

  const statusPlainClass =
    theme === "dark"
      ? "inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold text-white/80"
      : "inline-flex rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-700";
  
  const skeletonCellClass =
    theme === "dark"
      ? "h-3 rounded-full bg-white/10"
      : "h-3 rounded-full bg-gray-200";

  const roleOptions = [
    { value: "all", label: t("users.allRoles") },
    { value: "user", label: t("users.user") },
    { value: "super_agent", label: "Super Agent" },
    { value: "admin", label: t("users.admin") },
  ];
  
  const sortOptions = [
    { value: "createdAt_desc", label: t("users.sortNewest") },
    { value: "createdAt_asc", label: t("users.sortOldest") },
    { value: "lastOnline_desc", label: t("users.sortLastOnline") },
    { value: "balance_desc", label: t("users.sortHighestBalance") },
    { value: "balance_asc", label: t("users.sortLowestBalance") },
    { value: "orders_desc", label: t("users.sortMostOrders") },
    { value: "orders_asc", label: t("users.sortLeastOrders") },
    { value: "pending_desc", label: t("users.sortHighestPending") },
  ];
  
  const pageSizeOptions = [
    { value: 10, label: "10 / page" },
    { value: 20, label: "20 / page" },
    { value: 100, label: "100 / page" },
  ];
  
  const vipRankOptions = [
    { value: "1", label: `${t("users.rank")} 1` },
    { value: "2", label: `${t("users.rank")} 2` },
    { value: "3", label: `${t("users.rank")} 3` },
  ];
  
  function LoadingSkeletonRows() {
    return Array.from({ length: 8 }).map((_, rowIndex) => (
      <tr key={`skeleton-${rowIndex}`} className={tableRowClass}>
        {Array.from({ length: 16 }).map((__, colIndex) => (
          <td key={`skeleton-${rowIndex}-${colIndex}`} className="px-4 py-4">
            <div
              className={`${skeletonCellClass} animate-pulse`}
              style={{
                width:
                  colIndex === 0
                    ? "64px"
                    : colIndex === 1
                    ? "110px"
                    : colIndex === 2
                    ? "90px"
                    : colIndex === 8
                    ? "180px"
                    : "80px",
              }}
            />
          </td>
        ))}
      </tr>
    ));
  }

    const initialCache = loadUsersCache();

    const [rows, setRows] = useState(() => initialCache?.rows || []);
    const [loading, setLoading] = useState(() => !initialCache?.rows?.length);
    const [busyId, setBusyId] = useState(null);
  
    const [q, setQ] = useState(() => initialCache?.q || "");
    const [roleFilter, setRoleFilter] = useState(() => initialCache?.roleFilter || "all");
    const [sortBy, setSortBy] = useState(() => initialCache?.sortBy || "createdAt_desc");

    const [orderEdit, setOrderEdit] = useState({});
    const [resetEdit, setResetEdit] = useState({});
    const [vipEdit, setVipEdit] = useState({});
    const [creditScoreEdit, setCreditScoreEdit] = useState({});
  
    const [walletSummary, setWalletSummary] = useState({
    loading: false,
    userId: null,
    totalDeposit: 0,
    totalWithdrawal: 0,
  });

  // pagination
  const [pageSize, setPageSize] = useState(() => initialCache?.pageSize || 10);
  const [page, setPage] = useState(() => initialCache?.page || 1);

  // Balance modal
  const [balanceModal, setBalanceModal] = useState({
    open: false,
    userId: null,
    phoneNumber: "",
    currentBalance: 0,
    mode: "inc",
    amount: "",
  });

  // Actions drawer (More)
  const [actionsModal, setActionsModal] = useState({
    open: false,
    user: null,
  });

  // Ban modal
  const [banModal, setBanModal] = useState({
    open: false,
    userId: null,
    phoneNumber: "",
    isBanned: false,
    reason: "",
  });

  // Reset password modal
  const [passwordModal, setPasswordModal] = useState({
    open: false,
    userId: null,
    phoneNumber: "",
    newPassword: "",
  });

  // Reset phone modal
  const [phoneModal, setPhoneModal] = useState({
    open: false,
    userId: null,
    oldPhone: "",
    newPhone: "",
  });

  const [withdrawalBlockModal, setWithdrawalBlockModal] = useState({
    open: false,
    userId: null,
    phoneNumber: "",
    blocked: true,
    reason: "",
  });

  // Reset withdrawal PIN modal
  const [withdrawPinModal, setWithdrawPinModal] = useState({
    open: false,
    userId: null,
    phoneNumber: "",
    newPin: "",
  });

  // Delete confirm modal
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    userId: null,
    phoneNumber: "",
  });

  const [createUserModal, setCreateUserModal] = useState({
    open: false,
    phoneNumber: "",
    password: "",
    role: "user",
  });

  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchJSON(url, options = {}) {
    const auth = getAuthHeaders();

    console.log("[Users] fetchJSON request:", {
      url,
      method: options.method || "GET",
      hasAuth: !!auth,
    });

   if (!auth) {
      console.error("[Users] Missing admin_token for:", url);
      throw new Error("Please login again.");
    }

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
      console.error("[Users] Non-JSON response from:", url);
      throw new Error("Server returned non-JSON response.");
    }

    console.log("[Users] fetchJSON response:", {
      url,
      status: res.status,
      ok: res.ok,
      data,
    });

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;

    if (res.status === 401) {
      console.error("[Users] 401 from:", url, data);
    }

    throw new Error(msg);
  }

  return data;
}

  async function copyUid(uid) {
    const clean = String(uid || "").trim();
  
    if (!clean) {
      toast.error("No UID to copy");
      return;
    }
  
    try {
      await navigator.clipboard.writeText(clean);
      toast.success("UID copied");
    } catch {
      toast.error("Failed to copy UID");
    }
  }

  async function loadUsers(forceRefresh = true) {
    if (forceRefresh) {
      setLoading(true);
    }
  
    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users`);
      const nextRows = data.users || [];
  
      setRows(nextRows);
  
      saveUsersCache({
        rows: nextRows,
        savedAt: Date.now(),
      });
    } catch (e) {
      if (!rows.length) {
        setRows([]);
      }
      toast.error(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function saveUserVipRank(userId) {
    const val = vipEdit[userId];
    const num = Number(val);

    if (![1, 2, 3].includes(num)) {
      toast.error("vipRank must be 1, 2, or 3");
      return;
    }

    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/vip-rank`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vipRank: num }),
      });

      const newRank = data?.user?.vipRank ?? data?.vipRank ?? num;

      setRows((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, vipRank: newRank } : u))
      );

      toast.success("VIP rank updated");
    } catch (e) {
      toast.error(e.message || "Failed to update VIP rank");
    } finally {
      setBusyId(null);
    }
  }

  async function saveUserOrders(userId) {
    const val = orderEdit[userId];
    const num = Number(val);

    if (!Number.isFinite(num) || num < 0) {
      toast.error("ordersCompleted must be a number >= 0");
      return;
    }

    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/orders/set`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersCompleted: num }),
      });

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                ordersCompleted: data.ordersCompleted ?? num,
              }
            : u
        )
      );

      toast.success("Orders updated");
    } catch (e) {
      toast.error(e.message || "Failed to update orders");
    } finally {
      setBusyId(null);
    }
  }

  async function saveUserResetCount(userId) {
    const val = resetEdit[userId];
    const num = Number(val);

    if (!Number.isFinite(num) || num < 1) {
      toast.error("totalResetCount must be a number >= 1");
      return;
    }

    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/reset-count/set`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalResetCount: num }),
      });

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, totalResetCount: data.totalResetCount ?? num }
            : u
        )
      );

      toast.success("Reset count updated");
    } catch (e) {
      toast.error(e.message || "Failed to update reset count");
    } finally {
      setBusyId(null);
    }
  }

  async function resetUserOrdersCount(userId) {
    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/orders/reset`, {
        method: "POST",
      });

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                ordersCompleted: data.ordersCompleted ?? 0,
              }
            : u
        )
      );

      setOrderEdit((p) => ({ ...p, [userId]: "0" }));
      toast.success("Orders reset to 0");
    } catch (e) {
      toast.error(e.message || "Failed to reset orders");
    } finally {
      setBusyId(null);
    }
  }

  async function changeRole(userId, role) {
    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      setRows((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: data.user.role } : u))
      );

      toast.success("Role updated");
    } catch (e) {
      toast.error(e.message || "Failed to update role");
    } finally {
      setBusyId(null);
    }
  }

  async function submitBalance() {
    const userId = balanceModal.userId;
    if (!userId) return;

    const amount = Number(balanceModal.amount);

    if (!Number.isFinite(amount)) {
      toast.error("Please enter a valid number.");
      return;
    }

    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: balanceModal.mode,
          amount,
        }),
      });

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, balance: data.user.balance } : u
        )
      );

      toast.success("Balance updated");

      setBalanceModal({
        open: false,
        userId: null,
        phoneNumber: "",
        currentBalance: 0,
        mode: "inc",
        amount: "",
      });
    } catch (e) {
      toast.error(e.message || "Failed to update balance");
    } finally {
      setBusyId(null);
    }
  }

  async function saveUserCreditScore(userId) {
    const val = creditScoreEdit[userId];
    const score = Number(val);
  
    if (!Number.isFinite(score)) {
      toast.error("Credit score must be a number");
      return;
    }
  
    if (score < 0 || score > 100) {
      toast.error("Credit score must be between 0 and 100");
      return;
    }
  
    setBusyId(userId);
  
    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/credit-score`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditScore: score }),
      });
  
      const newScore = Number(data?.user?.creditScore ?? score);
  
      setRows((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                creditScore: newScore,
              }
            : u
        )
      );
  
      setActionsModal((prev) =>
        prev.user && prev.user._id === userId
          ? {
              ...prev,
              user: {
                ...prev.user,
                creditScore: newScore,
              },
            }
          : prev
      );
  
      setCreditScoreEdit((prev) => ({
        ...prev,
        [userId]: String(newScore),
      }));
  
      toast.success("Credit score updated");
    } catch (e) {
      toast.error(e.message || "Failed to update credit score");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleWithdrawalBlock(user, customReason = "") {
    if (!user?._id) return;

    const nextBlocked = !Boolean(user.withdrawalBlocked);
    const reason = nextBlocked ? String(customReason || "Manual review").trim() : "";

    setBusyId(user._id);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/users/${user._id}/withdrawal-block`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocked: nextBlocked,
            reason,
          }),
        }
      );

      setRows((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                withdrawalBlocked: data.user.withdrawalBlocked,
                withdrawalBlockedAt: data.user.withdrawalBlockedAt,
                withdrawalBlockedReason: data.user.withdrawalBlockedReason,
              }
            : u
        )
      );

      setActionsModal((prev) =>
        prev.user && prev.user._id === user._id
          ? {
              ...prev,
              user: {
                ...prev.user,
                withdrawalBlocked: data.user.withdrawalBlocked,
                withdrawalBlockedAt: data.user.withdrawalBlockedAt,
                withdrawalBlockedReason: data.user.withdrawalBlockedReason,
              },
            }
          : prev
      );

      toast.success(
        data.user.withdrawalBlocked
          ? "Withdrawal frozen"
          : "Withdrawal unfrozen"
      );
    } catch (e) {
      toast.error(e.message || "Failed to update withdrawal block");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleAgentHidden(user) {
    if (!user?._id) return;
  
    const nextHidden = !Boolean(user.hiddenFromAgent);
  
    setBusyId(user._id);
  
    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/users/${user._id}/agent-hidden`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hidden: nextHidden,
          }),
        }
      );
  
      setRows((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                hiddenFromAgent: data.user.hiddenFromAgent,
                hiddenFromAgentAt: data.user.hiddenFromAgentAt,
                hiddenFromAgentBy: data.user.hiddenFromAgentBy,
              }
            : u
        )
      );
  
      toast.success(
        data.user.hiddenFromAgent
          ? "User hidden from agent"
          : "User visible to agent again"
      );
    } catch (e) {
      toast.error(e.message || "Failed to update agent visibility");
    } finally {
      setBusyId(null);
    }
  }

  async function submitBan() {
    const userId = banModal.userId;
    if (!userId) return;

    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBanned: banModal.isBanned,
          reason: banModal.reason,
        }),
      });

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                isBanned: data.user.isBanned,
                bannedAt: data.user.bannedAt,
                banReason: data.user.banReason,
              }
            : u
        )
      );

      toast.success("Ban status updated");

      setBanModal({
        open: false,
        userId: null,
        phoneNumber: "",
        isBanned: false,
        reason: "",
      });
    } catch (e) {
      toast.error(e.message || "Failed to update ban status");
    } finally {
      setBusyId(null);
    }
  }

  async function submitResetPassword() {
    const userId = passwordModal.userId;
    if (!userId) return;

    if (!passwordModal.newPassword || passwordModal.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setBusyId(userId);

    try {
      await fetchJSON(`${API_BASE}/api/admin/users/${userId}/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: passwordModal.newPassword }),
      });

      toast.success("Password reset successful");

      setPasswordModal({
        open: false,
        userId: null,
        phoneNumber: "",
        newPassword: "",
      });
    } catch (e) {
      toast.error(e.message || "Failed to reset password");
    } finally {
      setBusyId(null);
    }
  }

  async function submitResetWithdrawPin() {
    const userId = withdrawPinModal.userId;
    if (!userId) return;

    const pin = String(withdrawPinModal.newPin || "").trim();

    if (!/^\d{4,6}$/.test(pin)) {
      toast.error("Withdrawal PIN must be 4 to 6 digits.");
      return;
    }

    setBusyId(userId);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/users/${userId}/withdraw-pin/reset`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPin: pin }),
        }
      );

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                withdrawPinFailedAttempts: data?.user?.withdrawPinFailedAttempts ?? 0,
                withdrawPinLocked: data?.user?.withdrawPinLocked ?? false,
              }
            : u
        )
      );

      toast.success("Withdrawal PIN reset + unlocked");

      setWithdrawPinModal({
        open: false,
        userId: null,
        phoneNumber: "",
        newPin: "",
      });
    } catch (e) {
      toast.error(e.message || "Failed to reset withdrawal PIN");
    } finally {
      setBusyId(null);
    }
  }

  async function submitResetPhone() {
    const userId = phoneModal.userId;
    if (!userId) return;

    const clean = String(phoneModal.newPhone || "").trim();
    if (!clean) {
      toast.error("Please enter a valid new phone number.");
      return;
    }

    setBusyId(userId);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/reset-phone`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPhoneNumber: clean }),
      });

      setRows((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, phoneNumber: data.user.phoneNumber } : u
        )
      );

      toast.success("Phone number updated");

      setPhoneModal({
        open: false,
        userId: null,
        oldPhone: "",
        newPhone: "",
      });
    } catch (e) {
      toast.error(e.message || "Failed to update phone number");
    } finally {
      setBusyId(null);
    }
  }

  async function loadWalletSummary(userId) {
  setWalletSummary({
    loading: true,
    userId,
    totalDeposit: 0,
    totalWithdrawal: 0,
  });

  try {
    const data = await fetchJSON(`${API_BASE}/api/admin/users/${userId}/wallet-summary`);

    setWalletSummary({
      loading: false,
      userId,
      totalDeposit: Number(data?.summary?.totalDeposit || 0),
      totalWithdrawal: Number(data?.summary?.totalWithdrawal || 0),
    });
  } catch (e) {
    setWalletSummary({
      loading: false,
      userId,
      totalDeposit: 0,
      totalWithdrawal: 0,
    });
    toast.error(e.message || "Failed to load wallet summary");
  }
}

  async function submitDelete() {
    const userId = deleteModal.userId;
    if (!userId) return;

    setBusyId(userId);

    try {
      await fetchJSON(`${API_BASE}/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      setRows((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted");

      setDeleteModal({ open: false, userId: null, phoneNumber: "" });
    } catch (e) {
      toast.error(e.message || "Failed to delete user");
    } finally {
      setBusyId(null);
    }
  }

  async function submitCreateUser() {
    const phoneNumber = String(createUserModal.phoneNumber || "").trim();
    const password = String(createUserModal.password || "");
    const role = createUserModal.role || "user";

    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setBusyId("create-user");

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password, role }),
      });

      setRows((prev) => [data.user, ...prev]);

      toast.success("User created");

      setCreateUserModal({
        open: false,
        phoneNumber: "",
        password: "",
        role: "user",
      });
    } catch (e) {
      toast.error(e.message || "Failed to create user");
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    saveUsersCache({
      rows,
      q,
      roleFilter,
      sortBy,
      page,
      pageSize,
      savedAt: Date.now(),
    });
  }, [rows, q, roleFilter, sortBy, page, pageSize]);

  useEffect(() => {
    const cache = loadUsersCache();

    if (cache?.rows?.length) {
      setRows(cache.rows);
      setQ(cache.q || "");
      setRoleFilter(cache.roleFilter || "all");
      setSortBy(cache.sortBy || "createdAt_desc");
      setPage(cache.page || 1);
      setPageSize(cache.pageSize || 10);
      setLoading(false);
      return;
  }

    loadUsers(true);
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((u) => {
      const matchesQuery =
        !qq ||
        String(u.phoneNumber || "").toLowerCase().includes(qq) ||
        String(u.uid || "").toLowerCase().includes(qq) ||
        String(u._id || "").toLowerCase().includes(qq) ||
        String(u.registeredIp || "").toLowerCase().includes(qq);

      const matchesRole =
        roleFilter === "all" ? true : String(u.role) === roleFilter;

      return matchesQuery && matchesRole;
    });
  }, [rows, q, roleFilter]);

  useEffect(() => {
    setPage(1);
  }, [q, roleFilter, sortBy, pageSize]);
  
  const sortedFiltered = useMemo(() => {
    return sortUsersList(filtered, sortBy);
  }, [filtered, sortBy]);
  
  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / pageSize));
  
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);
  
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedFiltered.slice(start, start + pageSize);
  }, [sortedFiltered, page, pageSize]);

  return (
    <Shell title={t("users.title")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className={`text-xs ${mutedText}`}>
          {t("users.subtitle")}
        </div>
  
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("users.searchPlaceholder")}
            className={`${inputClass} md:w-64`}
          />
          
          <button
            disabled={loading}
            onClick={loadUsers}
            className={`${buttonClass} disabled:opacity-50`}
          >
            {t("users.refresh")}
          </button>

          <CustomSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={roleOptions}
            className="md:w-44"
          />
  
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
            className="md:w-56"
          />
  
          <button
            onClick={() =>
              setCreateUserModal({
                open: true,
                phoneNumber: "",
                password: "",
                role: "user",
              })
            }
            className={`rounded-xl border px-3 py-2 text-xs ${
              theme === "dark"
                ? "border-blue-500/25 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {t("users.createUser")}
          </button>
        </div>
      </div>
  
      <div className={tableWrapClass}>
        <div className={tableHeaderBarClass}>
          {t("users.usersCount")} ({filtered.length})
        </div>
  
        <div className="users-table-scroll overflow-x-auto">
          <table className="min-w-[2350px] text-left text-sm">
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3">{t("users.actions")}</th>
                <th className="px-4 py-3">{t("users.phone")}</th>
                <th className="px-4 py-3">{t("users.userId")}</th>
                <th className="px-4 py-3">{t("users.referrer")}</th>
                <th className="px-4 py-3">{t("users.country")}</th>
                <th className="px-4 py-3">{t("users.pending")}</th>
                <th className="px-4 py-3">{t("users.balance")}</th>
                <th className="px-4 py-3">{t("users.addBalance")}</th>
                <th className="px-4 py-3">{t("users.orders")}</th>
                <th className="px-4 py-3">{t("users.orderControls")}</th>
                <th className="px-4 py-3">{t("users.rounds")}</th>
                <th className="px-4 py-3">{t("users.registeredIp")}</th>
                <th className="px-4 py-3">{t("users.lastOnline")}</th>
                <th className="px-4 py-3">{t("users.created")}</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">{t("users.role")}</th>
              </tr>
            </thead>
  
            <tbody className={tableBodyClass}>
              {loading ? (
                <LoadingSkeletonRows />
              ) : filtered.length === 0 ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={16}>
                    {t("users.noUsersFound")}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((u) => {
                  const isBusy = busyId === u._id;
                  const banned = Boolean(u.isBanned);
  
                  return (
                    <tr key={u._id} className={tableRowClass}>
                      <td className="px-4 py-3">
                        <div className="flex">
                          <button
                            disabled={isBusy}
                            onClick={() => {
                              setActionsModal({ open: true, user: u });
                              loadWalletSummary(u._id);
                            }}
                            className={`rounded-xl px-3 py-2 text-xs disabled:opacity-50 ${
                              theme === "dark"
                                ? "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {t("users.more")}
                          </button>
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <div className={`text-xs ${strongText}`}>
                          {u.phoneNumber || "-"}
                        </div>
  
                        {banned ? (
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-2 py-1 text-[10px] text-red-200">
                            {t("users.banned")}
                          </div>
                        ) : null}
                      </td>
  
                      <td className="px-4 py-3">
                        <div
                          className={`cursor-pointer select-none text-xs ${softText}`}
                          title={u.uid ? t("users.doubleClickCopyUid") : ""}
                          onDoubleClick={() => copyUid(u.uid)}
                        >
                          {u.uid || "-"}
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <div
                          className={`max-w-[140px] truncate text-xs ${softText}`}
                          title={u?.referredBy?.phoneNumber || "-"}
                        >
                          {u?.referredBy?.phoneNumber || "-"}
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        {u.registeredCountry ? (
                          <div
                            className={`flex items-center gap-2 text-xs ${softText}`}
                            title={
                              String(u.registeredCountry) === "ADMIN_CREATED"
                                ? "Admin Created"
                                : String(u.registeredCountry).toUpperCase()
                            }
                          >
                            {String(u.registeredCountry) === "ADMIN_CREATED" ? (
                              <span
                                className="text-sm leading-none"
                                role="img"
                                aria-label="Admin created"
                              >
                                🌐
                              </span>
                            ) : (
                              <img
                                src={`https://flagcdn.com/24x18/${String(
                                  u.registeredCountry
                                ).toLowerCase()}.png`}
                                alt={String(u.registeredCountry).toUpperCase()}
                                className="h-[14px] w-[18px] rounded-[2px] object-cover"
                                loading="lazy"
                              />
                            )}
                      
                            <span>
                              {String(u.registeredCountry) === "ADMIN_CREATED"
                                ? "Admin Created"
                                : String(u.registeredCountry).toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <div className={`text-xs ${softText}`}>-</div>
                        )}
                      </td>
  
                      <td className="px-4 py-3">
                        <div
                          className={`text-xs ${
                            theme === "dark" ? "text-blue-200" : "text-blue-700"
                          }`}
                        >
                          {safeNum(u.pendingAmount).toFixed(2)}
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <div className={`text-xs ${strongText}`}>
                          {safeNum(u.displayBalance).toFixed(2)}
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <button
                          disabled={isBusy}
                          onClick={() =>
                            setBalanceModal({
                              open: true,
                              userId: u._id,
                              phoneNumber: u.phoneNumber || "",
                              currentBalance: safeNum(u.displayBalance),
                              mode: "inc",
                              amount: "",
                            })
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs disabled:opacity-50 ${
                            theme === "dark"
                              ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          title={t("users.addSubtractBalance")}
                        >
                          {t("users.add")}
                        </button>
                      </td>
  
                      <td className="px-4 py-3">
                        <div className={`text-xs ${strongText}`}>
                          {safeNum(u.ordersCompleted)}/
                          {Number.isFinite(Number(u.ordersLimit))
                            ? Number(u.ordersLimit)
                            : "-"}
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            value={
                              orderEdit[u._id] ??
                              String(u.ordersCompleted ?? 0)
                            }
                            onChange={(e) =>
                              setOrderEdit((p) => ({
                                ...p,
                                [u._id]: e.target.value,
                              }))
                            }
                            className={
                              theme === "dark"
                                ? "w-20 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/90 outline-none focus:border-white/20"
                                : "w-20 rounded-xl border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400"
                            }
                            placeholder="0"
                            disabled={isBusy}
                          />
  
                          <button
                            disabled={isBusy}
                            onClick={() => saveUserOrders(u._id)}
                            className={`rounded-xl border px-2 py-1 text-xs disabled:opacity-50 ${
                              theme === "dark"
                                ? "border-blue-500/25 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                            title={t("users.saveOrdersCompleted")}
                          >
                            {t("users.save")}
                          </button>
  
                          <button
                            disabled={isBusy}
                            onClick={() => resetUserOrdersCount(u._id)}
                            className={`rounded-xl border px-2 py-1 text-xs disabled:opacity-50 ${
                              theme === "dark"
                                ? "border-orange-500/25 bg-orange-500/10 text-orange-200 hover:bg-orange-500/15"
                                : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                            }`}
                            title={t("users.resetToZero")}
                          >
                            {t("users.reset")}
                          </button>
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`text-xs ${strongText}`}>
                            {safeNum(u.totalResetCount || 1)}
                          </div>
  
                          <input
                            value={
                              resetEdit[u._id] ??
                              String(u.totalResetCount ?? 1)
                            }
                            onChange={(e) =>
                              setResetEdit((p) => ({
                                ...p,
                                [u._id]: e.target.value,
                              }))
                            }
                            className={
                              theme === "dark"
                                ? "w-16 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/90 outline-none focus:border-white/20"
                                : "w-16 rounded-xl border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400"
                            }
                            placeholder="1"
                            disabled={isBusy}
                          />
  
                          <button
                            disabled={isBusy}
                            onClick={() => saveUserResetCount(u._id)}
                            className={`rounded-xl border px-2 py-1 text-xs disabled:opacity-50 ${
                              theme === "dark"
                                ? "border-blue-500/25 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                            title={t("users.saveTotalResetCount")}
                          >
                            {t("users.save")}
                          </button>
                        </div>
                      </td>
  
                      <td className="px-4 py-3">
                        <div
                          className={`max-w-[180px] truncate text-xs ${softText}`}
                          title={u.registeredIp || "-"}
                        >
                          {u.registeredIp || "-"}
                        </div>
                      </td>
  
                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {formatDate(u.lastOnlineAt)}
                      </td>
  
                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {formatDate(u.createdAt)}
                      </td>
                      
                      <td className="px-4 py-3">
                        <button
                          disabled={isBusy}
                          onClick={() => toggleAgentHidden(u)}
                          className={`rounded-xl border px-3 py-1.5 text-xs disabled:opacity-50 ${
                            u.hiddenFromAgent
                              ? theme === "dark"
                                ? "border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                              : theme === "dark"
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          title={
                            u.hiddenFromAgent
                              ? "Click to show this user to agent"
                              : "Click to hide this user from agent"
                          }
                        >
                          {u.hiddenFromAgent ? "Hidden" : "Visible"}
                        </button>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] ${
                            theme === "dark"
                              ? "border border-white/10 bg-white/5 text-white/80"
                              : "border border-gray-200 bg-gray-50 text-gray-700"
                          }`}
                        >
                          {u.role || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
  
        <div className={footerBarClass}>
          <div className={`text-xs ${mutedText}`}>
            {t("users.showing")}{" "}
            {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}{" "}
            {t("users.to")} {Math.min(page * pageSize, filtered.length)}{" "}
            {t("users.of")} {filtered.length} {t("users.users")}
          </div>
  
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${mutedText}`}>
                {t("users.perPage")}
              </span>
              <CustomSelect
                value={pageSize}
                onChange={(val) => setPageSize(Number(val))}
                options={pageSizeOptions}
                className="w-32"
                placement="top"
              />
            </div>
  
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`${buttonClass} disabled:opacity-40`}
              >
                {t("users.prev")}
              </button>
  
              <div className={`text-xs ${softText}`}>
                {t("users.page")} {totalPages === 0 ? 1 : page} / {totalPages}
              </div>
  
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`${buttonClass} disabled:opacity-40`}
              >
                {t("users.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <Modal
        open={withdrawalBlockModal.open}
        title={t("users.freezeWithdrawal")}
        subtitle={
          withdrawalBlockModal.userId
            ? `${t("users.userLabel")}: ${withdrawalBlockModal.phoneNumber}`
            : ""
        }
        onClose={() =>
          setWithdrawalBlockModal({
            open: false,
            userId: null,
            phoneNumber: "",
            blocked: true,
            reason: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setWithdrawalBlockModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                  blocked: true,
                  reason: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === withdrawalBlockModal.userId}
              onClick={async () => {
                const user = rows.find(
                  (x) => x._id === withdrawalBlockModal.userId
                );
  
                if (!user) {
                  toast.error(t("users.userNotFound"));
                  return;
                }
  
                await toggleWithdrawalBlock(user, withdrawalBlockModal.reason);
  
                setWithdrawalBlockModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                  blocked: true,
                  reason: "",
                });
              }}
              className={
                theme === "dark"
                  ? "rounded-xl border border-orange-500/25 bg-orange-500/15 px-4 py-2 text-xs text-orange-200 hover:bg-orange-500/20 disabled:opacity-50"
                  : "rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-xs text-orange-700 hover:bg-orange-100 disabled:opacity-50"
              }
            >
              {busyId === withdrawalBlockModal.userId
                ? t("users.saving")
                : t("users.confirmFreeze")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-orange-500/25 bg-orange-500/10 p-3 text-xs text-orange-200"
                : "rounded-2xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-700"
            }
          >
            {t("users.freezeWarning")}
          </div>
  
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.reason")}
            </div>
  
            <input
              value={withdrawalBlockModal.reason}
              onChange={(e) =>
                setWithdrawalBlockModal((p) => ({
                  ...p,
                  reason: e.target.value,
                }))
              }
              placeholder={t("users.freezeReasonPlaceholder")}
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
            />
          </div>
        </div>
      </Modal>
  
      <Modal
        open={balanceModal.open}
        title={t("users.editBalance")}
        subtitle={
          balanceModal.userId
            ? `${t("users.userLabel")}: ${balanceModal.phoneNumber} • ${t(
                "users.current"
              )}: ${safeNum(balanceModal.currentBalance).toFixed(2)}`
            : ""
        }
        onClose={() =>
          setBalanceModal({
            open: false,
            userId: null,
            phoneNumber: "",
            currentBalance: 0,
            mode: "inc",
            amount: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setBalanceModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                  currentBalance: 0,
                  mode: "inc",
                  amount: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === balanceModal.userId}
              onClick={submitBalance}
              className={
                theme === "dark"
                  ? "rounded-xl border border-emerald-500/25 bg-emerald-500/15 px-4 py-2 text-xs text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
                  : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              }
            >
              {busyId === balanceModal.userId
                ? t("users.saving")
                : t("users.save")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.mode")}
            </div>
  
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setBalanceModal((p) => ({ ...p, mode: "inc" }))}
                className={classNames(
                  "rounded-2xl border px-3 py-3 text-left text-xs transition",
                  balanceModal.mode === "inc"
                    ? theme === "dark"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : theme === "dark"
                    ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                <div className="font-semibold">
                  {t("users.addSubtract")}
                </div>
                <div className="mt-1 text-[11px] opacity-70">
                  {t("users.useNegative")}
                </div>
              </button>
  
              <button
                onClick={() => setBalanceModal((p) => ({ ...p, mode: "set" }))}
                className={classNames(
                  "rounded-2xl border px-3 py-3 text-left text-xs transition",
                  balanceModal.mode === "set"
                    ? theme === "dark"
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
                      : "border-blue-300 bg-blue-50 text-blue-700"
                    : theme === "dark"
                    ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                <div className="font-semibold">{t("users.setBalance")}</div>
                <div className="mt-1 text-[11px] opacity-70">
                  {t("users.replaceBalance")}
                </div>
              </button>
            </div>
          </div>
  
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.amount")}
            </div>
  
            <input
              value={balanceModal.amount}
              onChange={(e) =>
                setBalanceModal((p) => ({ ...p, amount: e.target.value }))
              }
              placeholder={
                balanceModal.mode === "inc"
                  ? t("users.amountIncPlaceholder")
                  : t("users.amountSetPlaceholder")
              }
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
            />
  
            <div
              className={
                theme === "dark"
                  ? "mt-2 text-[11px] text-white/40"
                  : "mt-2 text-[11px] text-gray-500"
              }
            >
              {t("users.subtractTip")}
            </div>
          </div>
        </div>
      </Modal>
  
      <Drawer
        open={actionsModal.open}
        title={t("users.userActions")}
        subtitle={
          actionsModal.user
            ? `${t("users.userLabel")}: ${actionsModal.user.phoneNumber} • ${t(
                "users.role"
              )}: ${actionsModal.user.role}`
            : ""
        }
        onClose={() => {
          setActionsModal({ open: false, user: null });
          setWalletSummary({
            loading: false,
            userId: null,
            totalDeposit: 0,
            totalWithdrawal: 0,
          });
        }}
      >
        {actionsModal.user ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className={drawerCardClass}>
                <div className={drawerLabelClass}>UID</div>
                <div className={`${drawerValueClass}`}>
                  {actionsModal.user.uid || "-"}
                </div>
              </div>
  
              <div className={drawerCardClass}>
                <div className="flex items-center justify-between gap-3">
                  <div className={drawerLabelClass}>
                    {t("users.withdrawalStatus")}
                  </div>
                  <div className={statusPlainClass}>
                    {actionsModal.user.withdrawalBlocked
                      ? t("users.frozen")
                      : t("users.active")}
                  </div>
                </div>
  
                {actionsModal.user.withdrawalBlockedReason ? (
                  <div className={`mt-2 ${drawerMutedClass}`}>
                    {t("users.reason")}:{" "}
                    {actionsModal.user.withdrawalBlockedReason}
                  </div>
                ) : null}
  
                {actionsModal.user.withdrawalBlockedAt ? (
                  <div className={`mt-1 ${drawerMutedClass}`}>
                    {t("users.since")}:{" "}
                    {formatDate(actionsModal.user.withdrawalBlockedAt)}
                  </div>
                ) : null}
              </div>
            </div>
  
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className={drawerCardClass}>
                <div className={drawerLabelClass}>
                  {t("users.totalDeposit")}
                </div>
                <div className={`mt-2 text-2xl font-semibold ${strongText}`}>
                  {walletSummary.loading &&
                  walletSummary.userId === actionsModal.user._id
                    ? "..."
                    : safeNum(walletSummary.totalDeposit).toFixed(2)}
                </div>
              </div>
  
              <div className={drawerCardClass}>
                <div className={drawerLabelClass}>
                  {t("users.totalWithdrawal")}
                </div>
                <div className={`mt-2 text-2xl font-semibold ${strongText}`}>
                  {walletSummary.loading &&
                  walletSummary.userId === actionsModal.user._id
                    ? "..."
                    : safeNum(walletSummary.totalWithdrawal).toFixed(2)}
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className={drawerSectionClass}>
                <div className={drawerLabelClass}>{t("users.vipRanking")}</div>
  
                <div className="mt-3 flex items-center gap-2">
                  <CustomSelect
                    value={
                      vipEdit[actionsModal.user._id] ??
                      String(actionsModal.user.vipRank ?? 1)
                    }
                    onChange={(val) =>
                      setVipEdit((p) => ({
                        ...p,
                        [actionsModal.user._id]: val,
                      }))
                    }
                    options={vipRankOptions}
                    disabled={busyId === actionsModal.user._id}
                    className="w-36"
                  />
  
                  <button
                    disabled={busyId === actionsModal.user._id}
                    onClick={async () => {
                      const id = actionsModal.user._id;
                      await saveUserVipRank(id);
  
                      setActionsModal((prev) =>
                        prev.user
                          ? {
                              ...prev,
                              user: {
                                ...prev.user,
                                vipRank: Number(
                                  vipEdit[id] ?? prev.user.vipRank ?? 1
                                ),
                              },
                            }
                          : prev
                      );
                    }}
                    className={`rounded-xl border px-3 py-2 text-xs disabled:opacity-50 ${
                      theme === "dark"
                        ? "border-blue-500/25 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                        : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {t("users.saveVip")}
                  </button>
                </div>
              </div>
  
              <div className={drawerSectionClass}>
                <div className={drawerLabelClass}>
                  {t("users.withdrawalPin")}
                </div>
  
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className={pillNeutralClass}>
                    {t("users.locked")}:{" "}
                    <span
                      className={
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }
                    >
                      {actionsModal.user.withdrawPinLocked
                        ? t("users.yes")
                        : t("users.no")}
                    </span>
                  </div>
  
                  <div className={pillNeutralClass}>
                    {t("users.attemptsLeft")}:{" "}
                    <span
                      className={
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }
                    >
                      {Math.max(
                        0,
                        3 -
                          Number(
                            actionsModal.user.withdrawPinFailedAttempts || 0
                          )
                      )}
                    </span>
                  </div>
  
                  <div className={pillNeutralClass}>
                    {t("users.failed")}:{" "}
                    {Number(actionsModal.user.withdrawPinFailedAttempts || 0)}
                  </div>
                </div>
              </div>
            </div>
  
            <div className={drawerSectionClass}>
              <div className={drawerLabelClass}>
                {t("users.accountActions")}
              </div>
  
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
  
                    setWithdrawPinModal({
                      open: true,
                      userId: u._id,
                      phoneNumber: u.phoneNumber || "",
                      newPin: "",
                    });
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">
                    {t("users.resetWithdrawalPin")}
                  </div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {t("users.resetAttemptsDesc")}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
  
                    setPasswordModal({
                      open: true,
                      userId: u._id,
                      phoneNumber: u.phoneNumber || "",
                      newPassword: "",
                    });
                  }}
                  className={drawerNeutralButtonClass}
                >
                  <div className="font-semibold">
                    {t("users.resetPassword")}
                  </div>
                  <div className={`mt-1 ${drawerMutedClass}`}>
                    {t("users.resetPasswordDesc")}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
  
                    setPhoneModal({
                      open: true,
                      userId: u._id,
                      oldPhone: u.phoneNumber || "",
                      newPhone: "",
                    });
                  }}
                  className={drawerNeutralButtonClass}
                >
                  <div className="font-semibold">
                    {t("users.resetPhoneNumber")}
                  </div>
                  <div className={`mt-1 ${drawerMutedClass}`}>
                    {t("users.updatePhoneNumber")}
                  </div>
                </button>

                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={async () => {
                    const u = actionsModal.user;
                    const nextRole = u.role === "super_agent" ? "user" : "super_agent";
                
                    setActionsModal({ open: false, user: null });
                
                    await changeRole(u._id, nextRole);
                  }}
                  className={
                    actionsModal.user.role === "super_agent"
                      ? theme === "dark"
                        ? "rounded-2xl border border-orange-500/25 bg-orange-500/10 px-4 py-3 text-left text-xs text-orange-200 hover:bg-orange-500/15 disabled:opacity-50"
                        : "rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-left text-xs text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                      : theme === "dark"
                      ? "rounded-2xl border border-purple-500/25 bg-purple-500/10 px-4 py-3 text-left text-xs text-purple-200 hover:bg-purple-500/15 disabled:opacity-50"
                      : "rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 text-left text-xs text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                  }
                >
                  <div className="font-semibold">
                    {actionsModal.user.role === "super_agent"
                      ? "Remove Super Agent"
                      : "Make Super Agent"}
                  </div>
                
                  <div className="mt-1 text-[11px] opacity-70">
                    {actionsModal.user.role === "super_agent"
                      ? "Change this user back to normal agent access."
                      : "Allow this user to view all non-hidden platform users."}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={async () => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
                    await changeRole(
                      u._id,
                      u.role === "admin" ? "user" : "admin"
                    );
                  }}
                  className={drawerNeutralButtonClass}
                >
                  <div className="font-semibold">
                    {actionsModal.user.role === "admin"
                      ? t("users.makeUser")
                      : t("users.makeAdmin")}
                  </div>
                  <div className={`mt-1 ${drawerMutedClass}`}>
                    {t("users.changeUserRole")}
                  </div>
                </button>
              </div>
            </div>
  
            <div className={drawerSectionClass}>
              <div className={drawerLabelClass}>
                {t("users.growthCampaigns")}
              </div>
  
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
                    navigate(
                      `/admin/orders/bonus?uid=${encodeURIComponent(
                        u.uid
                      )}&currentOrder=${encodeURIComponent(
                        Number(u.ordersCompleted || 0)
                      )}`
                    );
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">{t("users.bonusOrder")}</div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {t("users.bonusOrderDesc")}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
                    navigate(
                      `/admin/lucky-draw?uid=${encodeURIComponent(
                        u.uid
                      )}&currentOrder=${encodeURIComponent(
                        Number(u.ordersCompleted || 0)
                      )}`
                    );
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">{t("users.luckyDraw")}</div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {t("users.luckyDrawDesc")}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
                    navigate(
                      `/admin/bonus-credit?userId=${u._id}&uid=${u.uid || ""}`
                    );
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">{t("users.bonusCredit")}</div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {t("users.bonusCreditDesc")}
                  </div>
                </button>
              </div>
            </div>
  
            <div className={drawerSectionClass}>
              <div className={drawerLabelClass}>{t("users.riskControls")}</div>
  
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div
                  className={
                    theme === "dark"
                      ? "rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                      : "rounded-2xl border border-gray-200 bg-white p-3"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold">
                        {t("users.creditScore")}
                      </div>
                      <div className={`mt-1 ${drawerMutedClass}`}>
                        {t("users.creditScoreDesc")}
                      </div>
                    </div>
  
                    <div
                      className={
                        Number(actionsModal.user.creditScore ?? 100) < 95
                          ? theme === "dark"
                            ? "rounded-full border border-red-400/30 bg-red-500/15 px-2.5 py-1 text-[10px] font-semibold text-red-200"
                            : "rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700"
                          : theme === "dark"
                          ? "rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-200"
                          : "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"
                      }
                    >
                      {Number(actionsModal.user.creditScore ?? 100) < 95
                        ? t("users.restricted")
                        : t("users.ok")}
                    </div>
                  </div>
  
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        creditScoreEdit[actionsModal.user._id] ??
                        String(actionsModal.user.creditScore ?? 100)
                      }
                      onChange={(e) =>
                        setCreditScoreEdit((p) => ({
                          ...p,
                          [actionsModal.user._id]: e.target.value,
                        }))
                      }
                      disabled={busyId === actionsModal.user._id}
                      className={
                        theme === "dark"
                          ? "w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
                          : "w-24 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400"
                      }
                      placeholder="100"
                    />
  
                    <button
                      disabled={busyId === actionsModal.user._id}
                      onClick={() => saveUserCreditScore(actionsModal.user._id)}
                      className={`rounded-xl border px-3 py-2 text-xs disabled:opacity-50 ${
                        theme === "dark"
                          ? "border-blue-500/25 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                          : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {busyId === actionsModal.user._id
                        ? t("users.saving")
                        : t("users.saveScore")}
                    </button>
                  </div>
                </div>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
  
                    if (u.withdrawalBlocked) {
                      toggleWithdrawalBlock(u);
                      return;
                    }
  
                    setActionsModal({ open: false, user: null });
                    setWithdrawalBlockModal({
                      open: true,
                      userId: u._id,
                      phoneNumber: u.phoneNumber || "",
                      blocked: true,
                      reason: u.withdrawalBlockedReason || "",
                    });
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">
                    {actionsModal.user.withdrawalBlocked
                      ? t("users.unfreezeWithdrawal")
                      : t("users.freezeWithdrawal")}
                  </div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {actionsModal.user.withdrawalBlocked
                      ? t("users.unfreezeWithdrawalDesc")
                      : t("users.freezeWithdrawalDesc")}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    const banned = Boolean(u.isBanned);
  
                    setActionsModal({ open: false, user: null });
  
                    setBanModal({
                      open: true,
                      userId: u._id,
                      phoneNumber: u.phoneNumber || "",
                      isBanned: !banned,
                      reason: banned ? "" : "Violation",
                    });
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">
                    {actionsModal.user.isBanned
                      ? t("users.unbanUser")
                      : t("users.banUser")}
                  </div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {actionsModal.user.isBanned
                      ? t("users.allowLoginAgain")
                      : t("users.blockUserLogin")}
                  </div>
                </button>
  
                <button
                  disabled={busyId === actionsModal.user._id}
                  onClick={() => {
                    const u = actionsModal.user;
                    setActionsModal({ open: false, user: null });
  
                    setDeleteModal({
                      open: true,
                      userId: u._id,
                      phoneNumber: u.phoneNumber || "",
                    });
                  }}
                  className={`${actionPlainClass} disabled:opacity-50`}
                >
                  <div className="font-semibold">{t("users.deleteUser")}</div>
                  <div className="mt-1 text-[11px] opacity-70">
                    {t("users.deleteUserDesc")}
                  </div>
                </button>
              </div>
            </div>
  
            <button
              onClick={() => {
                setActionsModal({ open: false, user: null });
                setWalletSummary({
                  loading: false,
                  userId: null,
                  totalDeposit: 0,
                  totalWithdrawal: 0,
                });
              }}
              className={`w-full rounded-2xl px-4 py-3 text-xs ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("users.close")}
            </button>
          </div>
        ) : null}
      </Drawer>
  
      <Modal
        open={banModal.open}
        title={banModal.isBanned ? t("users.banUser") : t("users.unbanUser")}
        subtitle={
          banModal.userId
            ? `${t("users.userLabel")}: ${banModal.phoneNumber}`
            : ""
        }
        onClose={() =>
          setBanModal({
            open: false,
            userId: null,
            phoneNumber: "",
            isBanned: false,
            reason: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setBanModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                  isBanned: false,
                  reason: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === banModal.userId}
              onClick={submitBan}
              className={classNames(
                "rounded-xl border px-4 py-2 text-xs disabled:opacity-50",
                banModal.isBanned
                  ? theme === "dark"
                    ? "border-red-500/25 bg-red-500/15 text-red-200 hover:bg-red-500/20"
                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : theme === "dark"
                  ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              )}
            >
              {busyId === banModal.userId
                ? t("users.saving")
                : banModal.isBanned
                ? t("users.confirmBan")
                : t("users.confirmUnban")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {banModal.isBanned ? (
            <div
              className={
                theme === "dark"
                  ? "rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-200"
                  : "rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              }
            >
              {t("users.banWarning")}
            </div>
          ) : (
            <div
              className={
                theme === "dark"
                  ? "rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-200"
                  : "rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700"
              }
            >
              {t("users.unbanWarning")}
            </div>
          )}
  
          {banModal.isBanned ? (
            <div
              className={
                theme === "dark"
                  ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                  : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
              }
            >
              <div
                className={
                  theme === "dark"
                    ? "text-xs font-semibold text-white"
                    : "text-xs font-semibold text-gray-900"
                }
              >
                {t("users.reasonOptional")}
              </div>
  
              <input
                value={banModal.reason}
                onChange={(e) =>
                  setBanModal((p) => ({ ...p, reason: e.target.value }))
                }
                placeholder={t("users.banReasonPlaceholder")}
                className={
                  theme === "dark"
                    ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                    : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
                }
              />
            </div>
          ) : null}
        </div>
      </Modal>
  
      <Modal
        open={createUserModal.open}
        title={t("users.createUserTitle")}
        subtitle={t("users.createUserSubtitle")}
        onClose={() =>
          setCreateUserModal({
            open: false,
            phoneNumber: "",
            password: "",
            role: "user",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setCreateUserModal({
                  open: false,
                  phoneNumber: "",
                  password: "",
                  role: "user",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === "create-user"}
              onClick={submitCreateUser}
              className={
                theme === "dark"
                  ? "rounded-xl border border-emerald-500/25 bg-emerald-500/15 px-4 py-2 text-xs text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
                  : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              }
            >
              {busyId === "create-user"
                ? t("users.creating")
                : t("users.createUserButton")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.phoneNumber")}
            </div>
  
            <input
              value={createUserModal.phoneNumber}
              onChange={(e) =>
                setCreateUserModal((p) => ({
                  ...p,
                  phoneNumber: e.target.value,
                }))
              }
              placeholder={t("users.phonePlaceholder")}
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
            />
          </div>
  
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.password")}
            </div>
  
            <input
              type="password"
              value={createUserModal.password}
              onChange={(e) =>
                setCreateUserModal((p) => ({
                  ...p,
                  password: e.target.value,
                }))
              }
              placeholder={t("users.minimumPassword")}
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
            />
          </div>
  
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.role")}
            </div>
  
            <select
              value={createUserModal.role}
              onChange={(e) =>
                setCreateUserModal((p) => ({ ...p, role: e.target.value }))
              }
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white/90 outline-none hover:bg-[#182236]"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none hover:bg-gray-50"
              }
            >
              <option value="user">{t("users.user")}</option>
              <option value="admin">{t("users.admin")}</option>
            </select>
          </div>
        </div>
      </Modal>
  
      <Modal
        open={passwordModal.open}
        title={t("users.resetPassword")}
        subtitle={
          passwordModal.userId
            ? `${t("users.userLabel")}: ${passwordModal.phoneNumber}`
            : ""
        }
        onClose={() =>
          setPasswordModal({
            open: false,
            userId: null,
            phoneNumber: "",
            newPassword: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setPasswordModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                  newPassword: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === passwordModal.userId}
              onClick={submitResetPassword}
              className={
                theme === "dark"
                  ? "rounded-xl border border-blue-500/25 bg-blue-500/15 px-4 py-2 text-xs text-blue-200 hover:bg-blue-500/20 disabled:opacity-50"
                  : "rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              }
            >
              {busyId === passwordModal.userId
                ? t("users.saving")
                : t("users.resetPassword")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.newPassword")}
            </div>
  
            <input
              value={passwordModal.newPassword}
              onChange={(e) =>
                setPasswordModal((p) => ({
                  ...p,
                  newPassword: e.target.value,
                }))
              }
              placeholder={t("users.minimumPassword")}
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
              type="text"
            />
  
            <div
              className={
                theme === "dark"
                  ? "mt-2 text-[11px] text-white/40"
                  : "mt-2 text-[11px] text-gray-500"
              }
            >
              {t("users.passwordTip")}
            </div>
          </div>
        </div>
      </Modal>
  
      <Modal
        open={withdrawPinModal.open}
        title={t("users.resetWithdrawalPin")}
        subtitle={
          withdrawPinModal.userId
            ? `${t("users.userLabel")}: ${withdrawPinModal.phoneNumber}`
            : ""
        }
        onClose={() =>
          setWithdrawPinModal({
            open: false,
            userId: null,
            phoneNumber: "",
            newPin: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setWithdrawPinModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                  newPin: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === withdrawPinModal.userId}
              onClick={submitResetWithdrawPin}
              className={
                theme === "dark"
                  ? "rounded-xl border border-purple-500/25 bg-purple-500/15 px-4 py-2 text-xs text-purple-200 hover:bg-purple-500/20 disabled:opacity-50"
                  : "rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs text-purple-700 hover:bg-purple-100 disabled:opacity-50"
              }
            >
              {busyId === withdrawPinModal.userId
                ? t("users.saving")
                : t("users.resetPin")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.newPin")}
            </div>
  
            <input
              value={withdrawPinModal.newPin}
              onChange={(e) =>
                setWithdrawPinModal((p) => ({
                  ...p,
                  newPin: e.target.value,
                }))
              }
              placeholder={t("users.newPinPlaceholder")}
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
              type="text"
              inputMode="numeric"
            />
  
            <div
              className={
                theme === "dark"
                  ? "mt-2 text-[11px] text-white/40"
                  : "mt-2 text-[11px] text-gray-500"
              }
            >
              {t("users.pinResetTip")}
            </div>
          </div>
        </div>
      </Modal>
  
      <Modal
        open={phoneModal.open}
        title={t("users.resetPhoneNumber")}
        subtitle={
          phoneModal.userId
            ? `${t("users.old")}: ${phoneModal.oldPhone}`
            : ""
        }
        onClose={() =>
          setPhoneModal({
            open: false,
            userId: null,
            oldPhone: "",
            newPhone: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setPhoneModal({
                  open: false,
                  userId: null,
                  oldPhone: "",
                  newPhone: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === phoneModal.userId}
              onClick={submitResetPhone}
              className={
                theme === "dark"
                  ? "rounded-xl border border-emerald-500/25 bg-emerald-500/15 px-4 py-2 text-xs text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
                  : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              }
            >
              {busyId === phoneModal.userId
                ? t("users.saving")
                : t("users.updatePhone")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/10 bg-white/5 p-3"
                : "rounded-2xl border border-gray-200 bg-gray-50 p-3"
            }
          >
            <div
              className={
                theme === "dark"
                  ? "text-xs font-semibold text-white"
                  : "text-xs font-semibold text-gray-900"
              }
            >
              {t("users.newPhoneNumber")}
            </div>
  
            <input
              value={phoneModal.newPhone}
              onChange={(e) =>
                setPhoneModal((p) => ({ ...p, newPhone: e.target.value }))
              }
              placeholder={t("users.phonePlaceholder")}
              className={
                theme === "dark"
                  ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
                  : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
              }
              type="text"
            />
  
            <div
              className={
                theme === "dark"
                  ? "mt-2 text-[11px] text-white/40"
                  : "mt-2 text-[11px] text-gray-500"
              }
            >
              {t("users.phoneUniqueTip")}
            </div>
          </div>
        </div>
      </Modal>
  
      <Modal
        open={deleteModal.open}
        title={t("users.deleteUser")}
        subtitle={
          deleteModal.userId
            ? `${t("users.userLabel")}: ${deleteModal.phoneNumber}`
            : ""
        }
        onClose={() =>
          setDeleteModal({
            open: false,
            userId: null,
            phoneNumber: "",
          })
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                setDeleteModal({
                  open: false,
                  userId: null,
                  phoneNumber: "",
                })
              }
              className={
                theme === "dark"
                  ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              }
            >
              {t("users.cancel")}
            </button>
  
            <button
              disabled={busyId === deleteModal.userId}
              onClick={submitDelete}
              className={
                theme === "dark"
                  ? "rounded-xl border border-red-500/25 bg-red-500/15 px-4 py-2 text-xs text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                  : "rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 hover:bg-red-100 disabled:opacity-50"
              }
            >
              {busyId === deleteModal.userId
                ? t("users.deleting")
                : t("users.deletePermanently")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-200"
                : "rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            }
          >
            {t("users.deleteWarning")}
          </div>
  
          <div
            className={
              theme === "dark" ? "text-xs text-white/60" : "text-xs text-gray-600"
            }
          >
            {t("users.deleteInsteadPrefix")}{" "}
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
              {t("users.banUser")}
            </span>{" "}
            {t("users.deleteInsteadSuffix")}
          </div>
        </div>
      </Modal>
    </Shell>
  );
}