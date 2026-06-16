import { useEffect, useMemo, useRef, useState } from "react";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Mail,
  Send,
  Plus,
  RefreshCw,
  Search,
  X,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Inbox,
  FileText,
  UserRound,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

const EMAILS_CACHE_KEY = "admin_guest_emails_cache_v1";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function loadEmailCache() {
  try {
    const raw = sessionStorage.getItem(EMAILS_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveEmailCache(payload) {
  try {
    sessionStorage.setItem(EMAILS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache errors
  }
}

function Modal({ open, title, subtitle, children, footer, onClose }) {
  const { theme } = useTheme();
  const cardRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      onMouseDown={(e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) {
          onClose?.();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        className={classNames(
          "pointer-events-none absolute inset-0 overflow-hidden",
          isDark ? "opacity-40" : "opacity-60",
        )}
      >
        <div className="absolute left-[12%] top-[12%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute left-[45%] top-[35%] h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div
        ref={cardRef}
        className={classNames(
          "relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border shadow-2xl",
          isDark
            ? "border-white/10 bg-[#071120]/95 text-white shadow-black/40"
            : "border-white/80 bg-white/95 text-gray-900 shadow-gray-300/80",
        )}
      >
        <div
          className={classNames(
            "relative overflow-hidden border-b px-5 py-5 sm:px-7",
            isDark ? "border-white/10" : "border-gray-200",
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-emerald-500/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className={classNames(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                    isDark
                      ? "border-white/10 bg-white/10"
                      : "border-blue-100 bg-blue-50",
                  )}
                >
                  <Sparkles
                    className={classNames(
                      "h-5 w-5",
                      isDark ? "text-blue-200" : "text-blue-600",
                    )}
                  />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-lg font-bold tracking-tight sm:text-xl">
                    {title}
                  </div>

                  {subtitle ? (
                    <div
                      className={classNames(
                        "mt-1 text-xs sm:text-sm",
                        isDark ? "text-white/55" : "text-gray-500",
                      )}
                    >
                      {subtitle}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={classNames(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition",
                isDark
                  ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {children}
        </div>

        {footer ? (
          <div
            className={classNames(
              "border-t px-5 py-4 sm:px-7",
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-gray-200 bg-gray-50",
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminGuestEmails() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const cached = loadEmailCache();

  const [rows, setRows] = useState(() => cached?.rows || []);
  const [q, setQ] = useState(() => cached?.q || "");
  const [loading, setLoading] = useState(() => !cached?.rows?.length);
  const [sending, setSending] = useState(false);

  const [sendModal, setSendModal] = useState({
    open: false,
    email: "",
    title: "",
    description: "",
  });

  const [previewModal, setPreviewModal] = useState({
    open: false,
    row: null,
  });

  const mutedText = isDark ? "text-white/50" : "text-gray-500";
  const softText = isDark ? "text-white/70" : "text-gray-600";
  const strongText = isDark ? "text-white" : "text-gray-900";

  const cardClass = isDark
    ? "rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/10"
    : "rounded-3xl border border-gray-200 bg-white shadow-sm";

  const inputClass = isDark
    ? "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.08]"
    : "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50";

  const textareaClass = isDark
    ? "min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.08]"
    : "min-h-[180px] w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50";

  const buttonClass = isDark
    ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
    : "inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60";

  const tableWrapClass = isDark
    ? "overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
    : "overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm";

  const tableHeadClass = isDark
    ? "border-b border-white/10 bg-white/[0.05] text-xs uppercase tracking-wide text-white/45"
    : "border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500";

  const tableBodyClass = isDark
    ? "divide-y divide-white/10"
    : "divide-y divide-gray-100";

  const tableRowClass = isDark
    ? "transition hover:bg-white/[0.04]"
    : "transition hover:bg-gray-50";

  const filteredRows = useMemo(() => {
    const needle = String(q || "")
      .trim()
      .toLowerCase();

    if (!needle) return rows;

    return rows.filter((row) => {
      const email = String(row.email || "").toLowerCase();
      const title = String(row.title || "").toLowerCase();
      const description = String(row.description || "").toLowerCase();
      const status = String(row.status || "").toLowerCase();

      return (
        email.includes(needle) ||
        title.includes(needle) ||
        description.includes(needle) ||
        status.includes(needle)
      );
    });
  }, [rows, q]);

  const stats = useMemo(() => {
    const total = rows.length;
    const sent = rows.filter((x) => x.status === "sent").length;
    const failed = rows.filter((x) => x.status === "failed").length;
    const today = rows.filter((x) => {
      if (!x.createdAt) return false;
      const d = new Date(x.createdAt);
      const now = new Date();

      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }).length;

    return { total, sent, failed, today };
  }, [rows]);

  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function fetchJSON(url, options = {}) {
    const auth = getAuthHeaders();

    if (!auth) {
      throw new Error(t("guestEmails.errors.loginAgain"));
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
      throw new Error(t("guestEmails.errors.nonJson"));
    }

    if (!res.ok || data?.ok === false) {
      throw new Error(
        data?.message ||
          t("guestEmails.errors.requestFailed", { status: res.status }),
      );
    }

    return data;
  }

  async function loadEmails({ silent = false } = {}) {
    if (!silent) setLoading(true);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/guest-email/history`);

      const nextRows = Array.isArray(data.rows)
        ? data.rows
        : Array.isArray(data.emails)
          ? data.emails
          : [];

      setRows(nextRows);

      saveEmailCache({
        rows: nextRows,
        q,
        savedAt: Date.now(),
      });
    } catch (e) {
      if (!rows.length) {
        setRows([]);
      }

      if (!String(e.message || "").includes("404")) {
        toast.error(e.message || t("guestEmails.errors.loadFailed"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitSendEmail() {
    const email = String(sendModal.email || "")
      .trim()
      .toLowerCase();
    const title = String(sendModal.title || "").trim();
    const description = String(sendModal.description || "").trim();

    if (!email) {
      toast.error(t("guestEmails.errors.emailRequired"));
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(t("guestEmails.errors.invalidEmail"));
      return;
    }

    if (!title) {
      toast.error(t("guestEmails.errors.titleRequired"));
      return;
    }

    if (title.length > 150) {
      toast.error(t("guestEmails.errors.titleTooLong"));
      return;
    }

    if (!description) {
      toast.error(t("guestEmails.errors.descriptionRequired"));
      return;
    }

    if (description.length > 5000) {
      toast.error(t("guestEmails.errors.descriptionTooLong"));
      return;
    }

    setSending(true);

    const tempId = `local-${Date.now()}`;

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/guest-email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          title,
          description,
        }),
      });

      const newRow = {
        _id: data.emailId || data._id || tempId,
        email,
        title,
        description,
        status: "sent",
        brevoMessageId: data.brevoMessageId || null,
        createdAt: new Date().toISOString(),
      };

      setRows((prev) => {
        const next = [newRow, ...prev];

        saveEmailCache({
          rows: next,
          q,
          savedAt: Date.now(),
        });

        return next;
      });

      toast.success(data?.message || t("guestEmails.success.sent"));

      setSendModal({
        open: false,
        email: "",
        title: "",
        description: "",
      });

      loadEmails({ silent: true });
    } catch (e) {
      const failedRow = {
        _id: tempId,
        email,
        title,
        description,
        status: "failed",
        errorMessage: e.message || t("guestEmails.errors.sendFailed"),
        createdAt: new Date().toISOString(),
      };

      setRows((prev) => {
        const next = [failedRow, ...prev];

        saveEmailCache({
          rows: next,
          q,
          savedAt: Date.now(),
        });

        return next;
      });

      toast.error(e.message || t("guestEmails.errors.sendFailed"));
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    saveEmailCache({
      rows,
      q,
      savedAt: Date.now(),
    });
  }, [rows, q]);

  useEffect(() => {
    loadEmails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function StatusPill({ status }) {
    const clean = String(status || "sent").toLowerCase();

    if (clean === "failed") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-500">
          <AlertCircle className="h-3.5 w-3.5" />
          {t("guestEmails.status.failed")}
        </span>
      );
    }

    if (clean === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-500">
          <Clock className="h-3.5 w-3.5" />
          {t("guestEmails.status.pending")}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {t("guestEmails.status.sent")}
      </span>
    );
  }

  function StatCard({ icon, label, value }) {
    return (
      <div
        className={classNames(
          "relative overflow-hidden rounded-3xl border p-4",
          isDark
            ? "border-white/10 bg-white/[0.04]"
            : "border-gray-200 bg-white shadow-sm",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 opacity-80" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className={classNames("text-xs", mutedText)}>{label}</div>
            <div className={classNames("mt-2 text-2xl font-black", strongText)}>
              {value}
            </div>
          </div>

          <div
            className={classNames(
              "flex h-12 w-12 items-center justify-center rounded-2xl border",
              isDark
                ? "border-white/10 bg-black/20"
                : "border-white/80 bg-white/80",
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Shell title={t("guestEmails.title")}>
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label={t("guestEmails.stats.totalEmails")}
            value={stats.total}
            icon={<Inbox className="h-5 w-5 text-blue-500" />}
          />

          <StatCard
            label={t("guestEmails.stats.sent")}
            value={stats.sent}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          />

          <StatCard
            label={t("guestEmails.stats.failed")}
            value={stats.failed}
            icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          />

          <StatCard
            label={t("guestEmails.stats.today")}
            value={stats.today}
            icon={<Clock className="h-5 w-5 text-violet-500" />}
          />
        </div>

        <div className={cardClass}>
          <div className="flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className={classNames("text-base font-bold", strongText)}>
                {t("guestEmails.historyTitle")}
              </div>
              <div className={classNames("mt-1 text-xs", mutedText)}>
                {t("guestEmails.showingRecords", {
                  shown: filteredRows.length,
                  total: rows.length,
                })}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
              <button
                type="button"
                onClick={() => loadEmails()}
                disabled={loading}
                className={buttonClass}
              >
                <RefreshCw
                  className={classNames("h-4 w-4", loading && "animate-spin")}
                />
                {t("guestEmails.refresh")}
              </button>

              <button
                type="button"
                onClick={() =>
                  setSendModal({
                    open: true,
                    email: "",
                    title: "",
                    description: "",
                  })
                }
                className={primaryButtonClass}
              >
                <Plus className="h-4 w-4" />
                {t("guestEmails.sendEmail")}
              </button>

              <div className="relative w-full sm:min-w-[320px] xl:w-[380px]">
                <Search
                  className={classNames(
                    "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2",
                    mutedText,
                  )}
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("guestEmails.searchPlaceholder")}
                  className={classNames(inputClass, "pl-11")}
                />
              </div>
            </div>
          </div>

          <div className={tableWrapClass}>
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] text-left text-sm">
                <thead className={tableHeadClass}>
                  <tr>
                    <th className="px-5 py-4">
                      {t("guestEmails.table.status")}
                    </th>
                    <th className="px-5 py-4">
                      {t("guestEmails.table.guestEmail")}
                    </th>
                    <th className="px-5 py-4">
                      {t("guestEmails.table.emailTitle")}
                    </th>
                    <th className="px-5 py-4">
                      {t("guestEmails.table.description")}
                    </th>
                    <th className="px-5 py-4">
                      {t("guestEmails.table.brevoId")}
                    </th>
                    <th className="px-5 py-4">
                      {t("guestEmails.table.sentAt")}
                    </th>
                    <th className="px-5 py-4 text-right">
                      {t("guestEmails.table.action")}
                    </th>
                  </tr>
                </thead>

                <tbody className={tableBodyClass}>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <tr key={index} className={tableRowClass}>
                        {Array.from({ length: 7 }).map((__, cellIndex) => (
                          <td key={cellIndex} className="px-5 py-5">
                            <div
                              className={classNames(
                                "h-3 animate-pulse rounded-full",
                                isDark ? "bg-white/10" : "bg-gray-200",
                              )}
                              style={{
                                width:
                                  cellIndex === 1
                                    ? "160px"
                                    : cellIndex === 3
                                      ? "220px"
                                      : "90px",
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <div
                          className={classNames(
                            "mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border",
                            isDark
                              ? "border-white/10 bg-white/[0.04]"
                              : "border-gray-200 bg-gray-50",
                          )}
                        >
                          <Mail className={classNames("h-7 w-7", mutedText)} />
                        </div>

                        <div
                          className={classNames(
                            "mt-4 text-base font-bold",
                            strongText,
                          )}
                        >
                          {t("guestEmails.emptyTitle")}
                        </div>

                        <div className={classNames("mt-1 text-sm", mutedText)}>
                          {t("guestEmails.emptySubtitle")}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr
                        key={row._id || row.createdAt}
                        className={tableRowClass}
                      >
                        <td className="px-5 py-4">
                          <StatusPill status={row.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={classNames(
                                "flex h-10 w-10 items-center justify-center rounded-2xl border",
                                isDark
                                  ? "border-white/10 bg-white/[0.05]"
                                  : "border-gray-200 bg-gray-50",
                              )}
                            >
                              <UserRound
                                className={classNames("h-4 w-4", mutedText)}
                              />
                            </div>

                            <div className="min-w-0">
                              <div
                                className={classNames(
                                  "max-w-[220px] truncate text-xs font-bold",
                                  strongText,
                                )}
                              >
                                {row.email || "-"}
                              </div>
                              <div
                                className={classNames(
                                  "mt-1 text-[11px]",
                                  mutedText,
                                )}
                              >
                                {t("guestEmails.guestRecipient")}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div
                            className={classNames(
                              "max-w-[220px] truncate text-xs font-bold",
                              strongText,
                            )}
                            title={row.title}
                          >
                            {row.title || "-"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div
                            className={classNames(
                              "max-w-[280px] truncate text-xs",
                              softText,
                            )}
                            title={row.description}
                          >
                            {row.description || row.errorMessage || "-"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div
                            className={classNames(
                              "max-w-[150px] truncate rounded-full border px-2.5 py-1 text-[11px]",
                              isDark
                                ? "border-white/10 bg-white/[0.04] text-white/50"
                                : "border-gray-200 bg-gray-50 text-gray-500",
                            )}
                            title={row.brevoMessageId || ""}
                          >
                            {row.brevoMessageId || "-"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className={classNames("text-xs", softText)}>
                            {formatDate(row.createdAt || row.sentAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewModal({
                                open: true,
                                row,
                              })
                            }
                            className={buttonClass}
                          >
                            <Eye className="h-4 w-4" />
                            {t("guestEmails.view")}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={sendModal.open}
        title={t("guestEmails.modal.sendTitle")}
        subtitle={t("guestEmails.modal.sendSubtitle")}
        onClose={() => {
          if (sending) return;

          setSendModal({
            open: false,
            email: "",
            title: "",
            description: "",
          });
        }}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={classNames("text-xs", mutedText)}>
              {t("guestEmails.modal.footerHint")}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={sending}
                onClick={() =>
                  setSendModal({
                    open: false,
                    email: "",
                    title: "",
                    description: "",
                  })
                }
                className={buttonClass}
              >
                {t("guestEmails.cancel")}
              </button>

              <button
                type="button"
                disabled={sending}
                onClick={submitSendEmail}
                className={primaryButtonClass}
              >
                {sending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? t("guestEmails.sending") : t("guestEmails.sendNow")}
              </button>
            </div>
          </div>
        }
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <label
                className={classNames(
                  "mb-2 block text-xs font-bold",
                  strongText,
                )}
              >
                {t("guestEmails.form.guestEmail")}
              </label>

              <input
                value={sendModal.email}
                onChange={(e) =>
                  setSendModal((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder={t("guestEmails.form.guestEmailPlaceholder")}
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  className={classNames("block text-xs font-bold", strongText)}
                >
                  {t("guestEmails.form.emailTitle")}
                </label>

                <span
                  className={classNames(
                    "text-[11px]",
                    sendModal.title.length > 150 ? "text-red-500" : mutedText,
                  )}
                >
                  {sendModal.title.length}/150
                </span>
              </div>

              <input
                value={sendModal.title}
                onChange={(e) =>
                  setSendModal((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder={t("guestEmails.form.emailTitlePlaceholder")}
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  className={classNames("block text-xs font-bold", strongText)}
                >
                  {t("guestEmails.form.description")}
                </label>

                <span
                  className={classNames(
                    "text-[11px]",
                    sendModal.description.length > 5000
                      ? "text-red-500"
                      : mutedText,
                  )}
                >
                  {sendModal.description.length}/5000
                </span>
              </div>

              <textarea
                value={sendModal.description}
                onChange={(e) =>
                  setSendModal((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={t("guestEmails.form.descriptionPlaceholder")}
                className={textareaClass}
              />
            </div>
          </div>

          <div
            className={classNames(
              "overflow-hidden rounded-3xl border",
              isDark
                ? "border-white/10 bg-white/[0.04]"
                : "border-gray-200 bg-gray-50",
            )}
          >
            <div
              className={classNames(
                "border-b px-4 py-3",
                isDark ? "border-white/10" : "border-gray-200",
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className={classNames("h-4 w-4", mutedText)} />
                <div className={classNames("text-xs font-bold", strongText)}>
                  {t("guestEmails.preview.title")}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div
                className={classNames(
                  "rounded-3xl border p-5",
                  isDark
                    ? "border-white/10 bg-[#071120]"
                    : "border-gray-200 bg-white",
                )}
              >
                <div
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold",
                    isDark
                      ? "border-blue-400/20 bg-blue-500/10 text-blue-200"
                      : "border-blue-100 bg-blue-50 text-blue-700",
                  )}
                >
                  <Mail className="h-3.5 w-3.5" />
                  {t("guestEmails.preview.badge")}
                </div>

                <div
                  className={classNames("mt-5 text-lg font-black", strongText)}
                >
                  {sendModal.title || t("guestEmails.preview.emptyTitle")}
                </div>

                <div
                  className={classNames(
                    "mt-4 whitespace-pre-wrap text-sm leading-6",
                    softText,
                  )}
                >
                  {sendModal.description ||
                    t("guestEmails.preview.emptyDescription")}
                </div>

                <div
                  className={classNames(
                    "mt-6 rounded-2xl border px-4 py-3 text-xs",
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-white/45"
                      : "border-gray-200 bg-gray-50 text-gray-500",
                  )}
                >
                  {t("guestEmails.preview.recipient")}:{" "}
                  {sendModal.email || "guest@example.com"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={previewModal.open}
        title={t("guestEmails.details.title")}
        subtitle={t("guestEmails.details.subtitle")}
        onClose={() =>
          setPreviewModal({
            open: false,
            row: null,
          })
        }
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                setPreviewModal({
                  open: false,
                  row: null,
                })
              }
              className={buttonClass}
            >
              {t("guestEmails.close")}
            </button>
          </div>
        }
      >
        {previewModal.row ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div
                className={classNames(
                  "rounded-3xl border p-4",
                  isDark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-gray-200 bg-gray-50",
                )}
              >
                <div className={classNames("text-xs", mutedText)}>
                  {t("guestEmails.details.status")}
                </div>
                <div className="mt-2">
                  <StatusPill status={previewModal.row.status} />
                </div>
              </div>

              <div
                className={classNames(
                  "rounded-3xl border p-4",
                  isDark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-gray-200 bg-gray-50",
                )}
              >
                <div className={classNames("text-xs", mutedText)}>
                  {t("guestEmails.details.recipient")}
                </div>

                <div
                  className={classNames(
                    "mt-2 break-all text-sm font-bold",
                    strongText,
                  )}
                >
                  {previewModal.row.email || "-"}
                </div>
              </div>

              <div
                className={classNames(
                  "rounded-3xl border p-4",
                  isDark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-gray-200 bg-gray-50",
                )}
              >
                <div className={classNames("text-xs", mutedText)}>
                  {t("guestEmails.details.sentAt")}
                </div>

                <div
                  className={classNames("mt-2 text-sm font-bold", strongText)}
                >
                  {formatDate(
                    previewModal.row.createdAt || previewModal.row.sentAt,
                  )}
                </div>
              </div>
            </div>

            <div
              className={classNames(
                "rounded-3xl border p-5",
                isDark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div className={classNames("text-xs font-bold", mutedText)}>
                {t("guestEmails.details.emailTitle")}
              </div>

              <div
                className={classNames("mt-2 text-lg font-black", strongText)}
              >
                {previewModal.row.title || "-"}
              </div>

              <div className={classNames("mt-6 text-xs font-bold", mutedText)}>
                {t("guestEmails.details.description")}
              </div>

              <div
                className={classNames(
                  "mt-2 whitespace-pre-wrap text-sm leading-7",
                  softText,
                )}
              >
                {previewModal.row.description ||
                  previewModal.row.errorMessage ||
                  "-"}
              </div>

              <div className={classNames("mt-6 text-xs font-bold", mutedText)}>
                {t("guestEmails.details.brevoMessageId")}
              </div>

              <div
                className={classNames(
                  "mt-2 break-all rounded-2xl border px-4 py-3 text-xs",
                  isDark
                    ? "border-white/10 bg-black/20 text-white/60"
                    : "border-gray-200 bg-white text-gray-600",
                )}
              >
                {previewModal.row.brevoMessageId || "-"}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </Shell>
  );
}
