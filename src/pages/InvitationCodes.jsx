import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

export default function ReferralUsers() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const softText = theme === "dark" ? "text-white/70" : "text-gray-600";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  const cardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 p-4"
      : "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
      : "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400";

  const selectClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 outline-none hover:bg-white/10"
      : "rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none hover:bg-gray-50";

  const buttonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

  const tableWrapClass =
    theme === "dark"
      ? "mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
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
    theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50";

  const footerBarClass =
    theme === "dark"
      ? "flex flex-col gap-3 border-t border-white/10 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
      : "flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between";

  const pillClass =
    theme === "dark"
      ? "inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80"
      : "inline-flex rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-700";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [refFilter, setRefFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchJSON(url, options = {}) {
    const auth = getAuthHeaders();

    if (!auth) {
      localStorage.removeItem("admin_token");
      navigate("/admin/login", { replace: true });
      throw new Error(t("referralUsers.pleaseLoginAgain"));
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...auth,
      },
    });

    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error(t("referralUsers.nonJson"));
    }

    if (!res.ok) {
      const msg =
        data?.message || `${t("referralUsers.requestFailed")} (${res.status})`;

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
      }

      throw new Error(msg);
    }

    return data;
  }

  async function loadUsers() {
    setLoading(true);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/users`);
      setRows(data.users || []);
    } catch (e) {
      setRows([]);
      toast.error(e.message || t("referralUsers.failedLoadUsers"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalUsers = rows.length;

  const topReferrerThisWeek = useMemo(() => {
    const startOfWeek = getStartOfWeek();
    const counts = new Map();

    for (const user of rows) {
      const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) continue;
      if (createdAt < startOfWeek) continue;

      const referrer = user?.referredBy;
      if (!referrer?._id) continue;

      const key = String(referrer._id);
      const existing = counts.get(key) || {
        _id: referrer._id,
        phoneNumber: referrer.phoneNumber || "-",
        referralCode: referrer.referralCode || "-",
        count: 0,
      };

      existing.count += 1;
      counts.set(key, existing);
    }

    let top = null;

    for (const item of counts.values()) {
      if (!top || item.count > top.count) top = item;
    }

    return top;
  }, [rows]);

  const filteredRows = useMemo(() => {
    const qq = q.trim().toLowerCase();

    let list = rows.filter((u) => {
      const referredByPhone = String(
        u?.referredBy?.phoneNumber || ""
      ).toLowerCase();
      const phone = String(u?.phoneNumber || "").toLowerCase();
      const referralCode = String(u?.referralCode || "").toLowerCase();

      const matchesSearch =
        !qq ||
        phone.includes(qq) ||
        referralCode.includes(qq) ||
        referredByPhone.includes(qq);

      const hasReferrer = Boolean(u?.referredBy?._id);

      const matchesFilter =
        refFilter === "all"
          ? true
          : refFilter === "hasReferrer"
          ? hasReferrer
          : !hasReferrer;

      return matchesSearch && matchesFilter;
    });

    list.sort((a, b) => {
      const aTime = new Date(a?.createdAt || 0).getTime();
      const bTime = new Date(b?.createdAt || 0).getTime();

      if (sortBy === "oldest") return aTime - bTime;
      return bTime - aTime;
    });

    return list;
  }, [rows, q, refFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [q, refFilter, sortBy]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const startItem = filteredRows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, filteredRows.length);

  return (
    <Shell title={t("referralUsers.title")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className={`text-sm font-semibold ${strongText}`}>
            {t("referralUsers.title")}
          </div>
          <div className={`text-xs ${mutedText}`}>
            {t("referralUsers.subtitle")}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("referralUsers.searchPlaceholder")}
            className={`${inputClass} md:w-72`}
          />

          <select
            value={refFilter}
            onChange={(e) => setRefFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">{t("referralUsers.allUsers")}</option>
            <option value="hasReferrer">
              {t("referralUsers.hasReferrer")}
            </option>
            <option value="noReferrer">
              {t("referralUsers.noReferrer")}
            </option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={selectClass}
          >
            <option value="newest">{t("referralUsers.newest")}</option>
            <option value="oldest">{t("referralUsers.oldest")}</option>
          </select>

          <button
            disabled={loading}
            onClick={loadUsers}
            className={`${buttonClass} disabled:opacity-50`}
          >
            {t("referralUsers.refresh")}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <div className={`text-xs ${mutedText}`}>
            {t("referralUsers.totalUsers")}
          </div>
          <div className={`mt-2 text-2xl font-semibold ${strongText}`}>
            {totalUsers}
          </div>
        </div>

        <div className={cardClass}>
          <div className={`text-xs ${mutedText}`}>
            {t("referralUsers.topReferrerThisWeek")}
          </div>

          {topReferrerThisWeek ? (
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className={`truncate text-sm font-semibold ${strongText}`}>
                  {topReferrerThisWeek.phoneNumber}
                </div>
                <div className={`mt-1 truncate text-xs ${softText}`}>
                  {t("referralUsers.code")}: {topReferrerThisWeek.referralCode}
                </div>
              </div>

              <div className={`${pillClass} whitespace-nowrap`}>
                {topReferrerThisWeek.count}{" "}
                {topReferrerThisWeek.count > 1
                  ? t("referralUsers.referrals")
                  : t("referralUsers.referral")}
              </div>
            </div>
          ) : (
            <div className={`mt-2 text-sm ${softText}`}>
              {t("referralUsers.noReferralsThisWeek")}
            </div>
          )}
        </div>
      </div>

      <div className={tableWrapClass}>
        <div className={tableHeaderBarClass}>
          {t("referralUsers.title")} ({filteredRows.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3">
                  {t("referralUsers.phoneNumber")}
                </th>
                <th className="px-4 py-3">
                  {t("referralUsers.referralCode")}
                </th>
                <th className="px-4 py-3">
                  {t("referralUsers.referredBy")}
                </th>
                <th className="px-4 py-3">
                  {t("referralUsers.referralCount")}
                </th>
                <th className="px-4 py-3">
                  {t("referralUsers.createdDate")}
                </th>
              </tr>
            </thead>

            <tbody className={tableBodyClass}>
              {loading ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={5}>
                    {t("referralUsers.loadingUsers")}
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={5}>
                    {t("referralUsers.noUsersFound")}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((u) => (
                  <tr key={u._id} className={tableRowClass}>
                    <td className="px-4 py-3">
                      <div className={`text-xs ${strongText}`}>
                        {u.phoneNumber || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className={`text-xs ${strongText}`}>
                        {u.referralCode || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className={`text-xs ${softText}`}>
                        {u?.referredBy?.phoneNumber || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={pillClass}>
                        {Number(u.referralCount || 0)}
                      </span>
                    </td>

                    <td className={`px-4 py-3 text-xs ${softText}`}>
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={footerBarClass}>
          <div className={`text-xs ${mutedText}`}>
            {t("referralUsers.showing")} {startItem}-{endItem}{" "}
            {t("referralUsers.of")} {filteredRows.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`${buttonClass} disabled:opacity-40`}
            >
              {t("referralUsers.prev")}
            </button>

            <div className={`${buttonClass} cursor-default`}>
              {t("referralUsers.page")} {page} / {totalPages}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`${buttonClass} disabled:opacity-40`}
            >
              {t("referralUsers.next")}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}