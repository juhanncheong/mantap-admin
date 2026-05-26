import React, { useEffect, useMemo, useState } from "react";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

const PER_PAGE = 10;

function money(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "0";
  return num.toFixed(0);
}

function fmtDate(d) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "-";
  }
}

function shortId(id) {
  if (!id) return "-";
  return String(id).slice(0, 6) + "..." + String(id).slice(-5);
}

export default function AdminDeposits() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const softText = theme === "dark" ? "text-white/70" : "text-gray-600";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  const subtleButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50";

  const inputClass =
    theme === "dark"
      ? "w-full mt-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none focus:border-white/20"
      : "w-full mt-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-400";

  const filterCardClass =
    theme === "dark"
      ? "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
      : "mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";

  const tableWrapClass =
    theme === "dark"
      ? "mt-5 rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
      : "mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden";

  const tableHeaderBarClass =
    theme === "dark"
      ? "px-4 py-3 border-b border-white/10 flex items-center justify-between"
      : "px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50";

  const tableHeadClass =
    theme === "dark"
      ? "bg-white/5 text-left text-white/60"
      : "bg-gray-50 text-left text-gray-500";

  const tableBodyClass =
    theme === "dark"
      ? "divide-y divide-white/10"
      : "divide-y divide-gray-200";

  function typeBadgeClasses() {
    if (theme === "dark") {
      return "border border-white/10 bg-white/5 text-white/80";
    }
    return "border border-gray-300 bg-gray-100 text-gray-700";
  }

  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState({
    totalCount: 0,
    totalAmount: 0,
    todayCount: 0,
    todayAmount: 0,
  });

  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchDeposits() {
    try {
      setBusy(true);

      const token = localStorage.getItem("admin_token");

      const url = new URL(`${API}/api/admin/deposits`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(PER_PAGE));
      if (q.trim()) url.searchParams.set("q", q.trim());

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || t("deposits.failedLoad"));
      }

      const list = Array.isArray(data.deposits) ? data.deposits : [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRows(list);

      const s = data.stats || {};
      setStats({
        totalCount: Number(s.totalDeposits ?? 0),
        totalAmount: Number(s.totalDepositAmount ?? 0),
        todayCount: Number(s.todayDeposits ?? 0),
        todayAmount: Number(s.todayDepositAmount ?? 0),
      });

      setPages(Number(data.pagination?.pages || data.pagination?.totalPages || 1));
      setTotal(Number(data.pagination?.total || 0));
    } catch (err) {
      console.error("fetchDeposits error:", err);
      toast.error(err.message || t("deposits.failedLoad"));
      setRows([]);
      setStats({
        totalCount: 0,
        totalAmount: 0,
        todayCount: 0,
        todayAmount: 0,
      });
      setPages(1);
      setTotal(0);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredRows = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = [...rows];

    if (s) {
      list = list.filter((d) => {
        const id = String(d._id || "").toLowerCase();
        const type = String(d.type || "").toLowerCase();
        const note = String(d.note || "").toLowerCase();
        const uid = String(d?.userId?.uid || "").toLowerCase();
        const mongoUserId = String(d?.userId?._id || "").toLowerCase();

        return (
          id.includes(s) ||
          type.includes(s) ||
          note.includes(s) ||
          uid.includes(s) ||
          mongoUserId.includes(s)
        );
      });
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [rows, q]);

  const pageCount = Math.max(
    1,
    pages || Math.ceil(filteredRows.length / PER_PAGE) || 1
  );
  const pageSafe = Math.min(Math.max(1, page), pageCount);
  const pageItems = filteredRows;

  return (
    <Shell title={t("deposits.title")}>
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className={`text-xs ${mutedText}`}>
            {t("deposits.subtitle")}
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <button
              disabled={busy}
              onClick={fetchDeposits}
              className={`${subtleButtonClass} disabled:opacity-50`}
            >
              {busy ? t("deposits.loading") : t("deposits.refresh")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <StatCard
            theme={theme}
            title={t("deposits.total")}
            value={stats.totalCount}
            sub={`${t("deposits.amount")}: ${money(stats.totalAmount)}`}
          />
          <StatCard
            theme={theme}
            title={t("deposits.today")}
            value={stats.todayCount}
            sub={`${t("deposits.amount")}: ${money(stats.todayAmount)}`}
          />
          <StatCard
            theme={theme}
            title={t("deposits.showing")}
            value={pageItems.length}
            sub={`${t("deposits.of")} ${total || filteredRows.length}`}
          />
          <StatCard
            theme={theme}
            title={t("deposits.page")}
            value={`${pageSafe}`}
            sub={`${pageCount} ${t("deposits.totalPages")}`}
          />
        </div>

        <div className={filterCardClass}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-3">
              <label className={`text-xs ${mutedText}`}>
                {t("deposits.search")}
              </label>
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder={t("deposits.searchPlaceholder")}
                className={inputClass}
              />
            </div>

            <div className="flex items-end justify-end gap-2">
              <button
                onClick={() => {
                  setPage(1);
                  fetchDeposits();
                }}
                className={subtleButtonClass}
              >
                {t("deposits.apply")}
              </button>

              <button
                onClick={() => {
                  setQ("");
                  setPage(1);
                }}
                className={subtleButtonClass}
              >
                {t("deposits.clearFilters")}
              </button>
            </div>
          </div>
        </div>

        <div className={tableWrapClass}>
          <div className={tableHeaderBarClass}>
            <div className={`font-semibold ${strongText}`}>
              {t("deposits.deposits")} ({total || filteredRows.length})
            </div>
            <div className={`text-xs ${mutedText}`}>
              {t("deposits.page")} {pageSafe} / {pageCount}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-4 py-3">{t("deposits.date")}</th>
                  <th className="px-4 py-3">{t("deposits.type")}</th>
                  <th className="px-4 py-3">{t("deposits.user")}</th>
                  <th className="px-4 py-3">{t("deposits.amount")}</th>
                  <th className="px-4 py-3">{t("deposits.before")}</th>
                  <th className="px-4 py-3">{t("deposits.after")}</th>
                  <th className="px-4 py-3">{t("deposits.note")}</th>
                </tr>
              </thead>

              <tbody className={tableBodyClass}>
                {!busy && pageItems.length === 0 ? (
                  <tr>
                    <td
                      className={`px-4 py-10 text-center ${mutedText}`}
                      colSpan={7}
                    >
                      {t("deposits.noDepositsFound")}
                    </td>
                  </tr>
                ) : (
                  pageItems.map((d) => (
                    <tr key={d._id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={strongText}>{fmtDate(d.createdAt)}</div>
                        <div className={`mt-1 text-xs ${mutedText}`}>
                          {shortId(d._id)}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={[
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold",
                            typeBadgeClasses(d.type),
                          ].join(" ")}
                        >
                          {d.type || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={strongText}>
                          {d?.userId?.uid || t("deposits.unknown")}
                        </div>
                      </td>

                      <td className={`px-4 py-3 whitespace-nowrap font-semibold ${strongText}`}>
                        {Number(d.amount || 0) >= 0 ? "+" : "-"}
                        {money(Math.abs(Number(d.amount || 0)))}
                      </td>

                      <td className={`px-4 py-3 whitespace-nowrap ${softText}`}>
                        {money(d.balanceBefore)}
                      </td>

                      <td className={`px-4 py-3 whitespace-nowrap ${softText}`}>
                        {money(d.balanceAfter)}
                      </td>

                      <td className="px-4 py-3">
                        <div
                          className={`max-w-[320px] truncate ${softText}`}
                          title={d.note || "-"}
                        >
                          {d.note || "-"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            className={`px-4 py-3 flex items-center justify-between ${
              theme === "dark" ? "border-t border-white/10" : "border-t border-gray-200"
            }`}
          >
            <div className={`text-xs ${mutedText}`}>
              {t("deposits.showing")}{" "}
              <span className={`font-semibold ${strongText}`}>
                {(pageSafe - 1) * PER_PAGE + (pageItems.length ? 1 : 0)}
              </span>{" "}
              -{" "}
              <span className={`font-semibold ${strongText}`}>
                {(pageSafe - 1) * PER_PAGE + pageItems.length}
              </span>{" "}
              {t("deposits.of")}{" "}
              <span className={`font-semibold ${strongText}`}>
                {total || filteredRows.length}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={pageSafe === 1}
                className={`${subtleButtonClass} disabled:opacity-50`}
              >
                {t("deposits.first")}
              </button>

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe === 1}
                className={`${subtleButtonClass} disabled:opacity-50`}
              >
                {t("deposits.prev")}
              </button>

              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={pageSafe === pageCount}
                className={`${subtleButtonClass} disabled:opacity-50`}
              >
                {t("deposits.next")}
              </button>

              <button
                onClick={() => setPage(pageCount)}
                disabled={pageSafe === pageCount}
                className={`${subtleButtonClass} disabled:opacity-50`}
              >
                {t("deposits.last")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatCard({ title, value, sub, theme }) {
  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <div
      className={
        theme === "dark"
          ? "rounded-2xl border border-white/10 bg-white/5 p-4"
          : "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      }
    >
      <div className={`text-xs ${mutedText}`}>{title}</div>
      <div className={`text-2xl font-bold mt-1 ${strongText}`}>{value}</div>
      <div className={`text-xs ${mutedText} mt-1`}>{sub}</div>
    </div>
  );
}