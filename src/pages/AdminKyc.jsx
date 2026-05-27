import { useEffect, useMemo, useRef, useState } from "react";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  CheckCircle,
  Eye,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function formatDate(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleString();
}

function getUserLabel(user) {
  if (!user) return "-";
  return user.uid || user.phoneNumber || user._id || "-";
}

function statusText(status, t) {
  const clean = String(status || "PENDING").toUpperCase();

  if (clean === "APPROVED") return t("adminKyc.approved");
  if (clean === "REJECTED") return t("adminKyc.rejected");
  return t("adminKyc.pending");
}

function formatDocumentType(type, t) {
  const clean = String(type || "").toUpperCase();

  if (clean === "NATIONAL_ID") return t("adminKyc.nationalId");
  if (clean === "PASSPORT") return t("adminKyc.passport");
  if (clean === "DRIVERS_LICENSE") return t("adminKyc.driversLicense");

  return type || "-";
}

function StatusPill({ status, t }) {
  const clean = String(status || "PENDING").toUpperCase();

  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold";

  if (clean === "APPROVED") {
    return (
      <span
        className={`${base} border-emerald-500/25 bg-emerald-500/10 text-emerald-600`}
      >
        {t("adminKyc.approved")}
      </span>
    );
  }

  if (clean === "REJECTED") {
    return (
      <span className={`${base} border-red-500/25 bg-red-500/10 text-red-600`}>
        {t("adminKyc.rejected")}
      </span>
    );
  }

  return (
    <span className={`${base} border-amber-500/25 bg-amber-500/10 text-amber-600`}>
      {t("adminKyc.pending")}
    </span>
  );
}

function Drawer({ open, title, subtitle, children, onClose, closeLabel }) {
  const panelRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
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

      <div className="absolute inset-0 flex md:inset-y-0 md:left-auto md:right-0 md:max-w-full">
        <div
          ref={panelRef}
          className={`relative flex h-full w-full flex-col shadow-2xl md:max-w-[820px] ${
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
              aria-label={closeLabel}
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

export default function AdminKyc() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const isDark = theme === "dark";

  const mutedText = isDark ? "text-white/50" : "text-gray-500";
  const softText = isDark ? "text-white/70" : "text-gray-600";
  const strongText = isDark ? "text-white" : "text-gray-900";

  const inputClass = isDark
    ? "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
    : "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400";

  const buttonClass = isDark
    ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 disabled:opacity-50"
    : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/15 disabled:opacity-50";

  const dangerButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/15 disabled:opacity-50";

  const tableWrapClass = isDark
    ? "mt-4 overflow-hidden rounded-2xl border border-white/10"
    : "mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

  const tableHeaderBarClass = isDark
    ? "bg-white/5 px-4 py-3 text-sm font-semibold text-white"
    : "bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900";

  const tableHeadClass = isDark
    ? "bg-white/5 text-xs text-white/60"
    : "bg-gray-50 text-xs text-gray-500";

  const tableBodyClass = isDark
    ? "divide-y divide-white/10"
    : "divide-y divide-gray-200";

  const tableRowClass = isDark ? "hover:bg-white/5" : "hover:bg-gray-50";

  const drawerSectionClass = isDark
    ? "rounded-3xl border border-white/10 bg-white/[0.03] p-4"
    : "rounded-3xl border border-gray-200 bg-gray-50 p-4";

  const drawerCardClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/[0.04] p-4"
    : "rounded-2xl border border-gray-200 bg-white p-4";

  const drawerLabelClass = isDark ? "text-xs text-white/50" : "text-xs text-gray-500";

  const drawerValueClass = isDark
    ? "mt-1 text-sm font-semibold text-white"
    : "mt-1 text-sm font-semibold text-gray-900";

  const imageFrameClass = isDark
    ? "overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
    : "overflow-hidden rounded-2xl border border-gray-200 bg-white";

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
      throw new Error(t("adminKyc.pleaseLoginAgain"));
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...auth,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.ok === false) {
      throw new Error(
        data?.message || `${t("adminKyc.requestFailed")} (${res.status})`
      );
    }

    return data;
  }

  async function loadKyc() {
    setLoading(true);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/kyc`);
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      toast.error(err.message || t("adminKyc.failedLoad"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function approveKyc(kyc) {
    if (!kyc?._id) return;

    const ok = window.confirm(t("adminKyc.confirmApprove"));
    if (!ok) return;

    setBusyId(kyc._id);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/kyc/${kyc._id}/approve`, {
        method: "PATCH",
      });

      const updated = data.kyc || {
        ...kyc,
        status: "APPROVED",
        reviewedAt: new Date().toISOString(),
      };

      setItems((prev) =>
        prev.map((item) => (item._id === kyc._id ? { ...item, ...updated } : item))
      );

      setSelected((prev) =>
        prev && prev._id === kyc._id ? { ...prev, ...updated } : prev
      );

      toast.success(data.message || t("adminKyc.approvedToast"));
    } catch (err) {
      toast.error(err.message || t("adminKyc.failedApprove"));
    } finally {
      setBusyId(null);
    }
  }

  async function rejectKyc(kyc) {
    if (!kyc?._id) return;

    const reason = String(rejectReason || "").trim();

    if (!reason) {
      toast.error(t("adminKyc.enterRejectReason"));
      return;
    }

    const ok = window.confirm(t("adminKyc.confirmReject"));
    if (!ok) return;

    setBusyId(kyc._id);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/kyc/${kyc._id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const updated = data.kyc || {
        ...kyc,
        status: "REJECTED",
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
      };

      setItems((prev) =>
        prev.map((item) => (item._id === kyc._id ? { ...item, ...updated } : item))
      );

      setSelected((prev) =>
        prev && prev._id === kyc._id ? { ...prev, ...updated } : prev
      );

      toast.success(data.message || t("adminKyc.rejectedToast"));
    } catch (err) {
      toast.error(err.message || t("adminKyc.failedReject"));
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    loadKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    return items.filter((item) => {
      const user = item.user || {};
      const status = String(item.status || "").toUpperCase();

      const matchesStatus =
        statusFilter === "all" ? true : status === statusFilter;

      const haystack = [
        item.fullName,
        item.documentType,
        item.documentNumber,
        item.status,
        user.uid,
        user.phoneNumber,
        user._id,
        item._id,
      ]
        .map((x) => String(x || "").toLowerCase())
        .join(" ");

      const matchesQuery = !keyword || haystack.includes(keyword);

      return matchesStatus && matchesQuery;
    });
  }, [items, q, statusFilter]);

  const selectedUser = selected?.user || {};

  return (
    <Shell title={t("adminKyc.title")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className={`text-xs ${mutedText}`}>{t("adminKyc.subtitle")}</div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search
              className={`pointer-events-none absolute left-3 top-2.5 h-4 w-4 ${mutedText}`}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("adminKyc.searchPlaceholder")}
              className={`${inputClass} pl-9`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="all">{t("adminKyc.allStatus")}</option>
            <option value="PENDING">{t("adminKyc.pending")}</option>
            <option value="APPROVED">{t("adminKyc.approved")}</option>
            <option value="REJECTED">{t("adminKyc.rejected")}</option>
          </select>

          <button disabled={loading} onClick={loadKyc} className={buttonClass}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw className={classNames("h-4 w-4", loading && "animate-spin")} />
              {t("adminKyc.refresh")}
            </span>
          </button>
        </div>
      </div>

      <div className={tableWrapClass}>
        <div className={tableHeaderBarClass}>
          {t("adminKyc.submissions")} ({filtered.length})
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3">{t("adminKyc.action")}</th>
                <th className="px-4 py-3">{t("adminKyc.user")}</th>
                <th className="px-4 py-3">{t("adminKyc.phone")}</th>
                <th className="px-4 py-3">{t("adminKyc.fullName")}</th>
                <th className="px-4 py-3">{t("adminKyc.document")}</th>
                <th className="px-4 py-3">{t("adminKyc.documentNumber")}</th>
                <th className="px-4 py-3">{t("adminKyc.status")}</th>
                <th className="px-4 py-3">{t("adminKyc.submitted")}</th>
              </tr>
            </thead>

            <tbody className={tableBodyClass}>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className={tableRowClass}>
                    {Array.from({ length: 8 }).map((__, colIndex) => (
                      <td key={colIndex} className="px-4 py-4">
                        <div
                          className={`h-3 animate-pulse rounded-full ${
                            isDark ? "bg-white/10" : "bg-gray-200"
                          }`}
                          style={{
                            width:
                              colIndex === 0
                                ? "70px"
                                : colIndex === 3
                                ? "140px"
                                : "100px",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={8}>
                    {t("adminKyc.noSubmissions")}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const user = item.user || {};
                  const isBusy = busyId === item._id;

                  return (
                    <tr key={item._id} className={tableRowClass}>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => {
                            setSelected(item);
                            setRejectReason(item.rejectionReason || "");
                          }}
                          className={buttonClass}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            {t("adminKyc.view")}
                          </span>
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className={`text-xs font-semibold ${strongText}`}>
                          {getUserLabel(user)}
                        </div>
                      </td>

                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {user.phoneNumber || "-"}
                      </td>

                      <td className={`px-4 py-3 text-xs font-semibold ${strongText}`}>
                        {item.fullName || "-"}
                      </td>

                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {formatDocumentType(item.documentType, t)}
                      </td>

                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {item.documentNumber || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <StatusPill status={item.status} t={t} />
                      </td>

                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={Boolean(selected)}
        title={
          selected
            ? `${t("adminKyc.reviewTitle")} - ${selected.fullName || "-"}`
            : t("adminKyc.reviewTitle")
        }
        subtitle={
          selected
            ? `${getUserLabel(selectedUser)} · ${selectedUser.phoneNumber || "-"}`
            : ""
        }
        closeLabel={t("adminKyc.close")}
        onClose={() => {
          setSelected(null);
          setRejectReason("");
        }}
      >
        {selected ? (
          <div className="space-y-5">
            <div className={drawerSectionClass}>
              <div className="mb-3">
                <div className={`text-sm font-semibold ${strongText}`}>
                  {t("adminKyc.documentImages")}
                </div>
                <div className={`mt-1 text-xs ${mutedText}`}>
                  {t("adminKyc.clickImageHint")}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className={imageFrameClass}>
                  <div
                    className={`border-b px-4 py-3 text-xs font-semibold ${
                      isDark
                        ? "border-white/10 text-white"
                        : "border-gray-200 text-gray-900"
                    }`}
                  >
                    {t("adminKyc.frontDocument")}
                  </div>

                  {selected.frontImage?.url ? (
                    <a
                      href={selected.frontImage.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={selected.frontImage.url}
                        alt={t("adminKyc.frontDocumentAlt")}
                        className="h-80 w-full object-contain"
                      />
                    </a>
                  ) : (
                    <div className={`p-6 text-xs ${mutedText}`}>
                      {t("adminKyc.noFrontImage")}
                    </div>
                  )}
                </div>

                <div className={imageFrameClass}>
                  <div
                    className={`border-b px-4 py-3 text-xs font-semibold ${
                      isDark
                        ? "border-white/10 text-white"
                        : "border-gray-200 text-gray-900"
                    }`}
                  >
                    {t("adminKyc.backDocument")}
                  </div>

                  {selected.backImage?.url ? (
                    <a
                      href={selected.backImage.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={selected.backImage.url}
                        alt={t("adminKyc.backDocumentAlt")}
                        className="h-80 w-full object-contain"
                      />
                    </a>
                  ) : (
                    <div className={`p-6 text-xs ${mutedText}`}>
                      {t("adminKyc.noBackImage")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={drawerSectionClass}>
              <div className="mb-3">
                <div className={`text-sm font-semibold ${strongText}`}>
                  {t("adminKyc.submittedDetails")}
                </div>
                <div className={`mt-1 text-xs ${mutedText}`}>
                  {t("adminKyc.detailsHint")}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className={drawerCardClass}>
                  <div className={drawerLabelClass}>{t("adminKyc.fullName")}</div>
                  <div className={drawerValueClass}>{selected.fullName || "-"}</div>
                </div>

                <div className={drawerCardClass}>
                  <div className={drawerLabelClass}>{t("adminKyc.documentType")}</div>
                  <div className={drawerValueClass}>
                    {formatDocumentType(selected.documentType, t)}
                  </div>
                </div>

                <div className={drawerCardClass}>
                  <div className={drawerLabelClass}>
                    {t("adminKyc.documentNumber")}
                  </div>
                  <div className={drawerValueClass}>
                    {selected.documentNumber || "-"}
                  </div>
                </div>

                <div className={drawerCardClass}>
                  <div className={drawerLabelClass}>{t("adminKyc.submittedAt")}</div>
                  <div className={drawerValueClass}>
                    {formatDate(selected.createdAt)}
                  </div>
                </div>

                <div className={drawerCardClass}>
                  <div className={drawerLabelClass}>{t("adminKyc.reviewedAt")}</div>
                  <div className={drawerValueClass}>
                    {formatDate(selected.reviewedAt)}
                  </div>
                </div>

                <div className={drawerCardClass}>
                  <div className={drawerLabelClass}>
                    {t("adminKyc.rejectionReason")}
                  </div>
                  <div className={drawerValueClass}>
                    {selected.rejectionReason || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className={drawerSectionClass}>
              <div className="mb-3">
                <div className={`text-sm font-semibold ${strongText}`}>
                  {t("adminKyc.reviewDecision")}
                </div>
                <div className={`mt-1 text-xs ${mutedText}`}>
                  {t("adminKyc.reviewDecisionHint")}
                </div>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  disabled={busyId === selected._id || selected.status === "APPROVED"}
                  onClick={() => approveKyc(selected)}
                  className={primaryButtonClass}
                >
                  <CheckCircle className="h-4 w-4" />
                  {t("adminKyc.approveKyc")}
                </button>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t("adminKyc.rejectReasonPlaceholder")}
                  rows={3}
                  className={inputClass}
                />

                <button
                  type="button"
                  disabled={busyId === selected._id || selected.status === "REJECTED"}
                  onClick={() => rejectKyc(selected)}
                  className={dangerButtonClass}
                >
                  <XCircle className="h-4 w-4" />
                  {t("adminKyc.rejectKyc")}
                </button>
              </div>

              <div className={`mt-4 text-xs ${mutedText}`}>
                {t("adminKyc.currentStatus")}:{" "}
                <span className={strongText}>{statusText(selected.status, t)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </Shell>
  );
}