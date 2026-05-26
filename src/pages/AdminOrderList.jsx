import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Shell from "../components/Shell";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

const CACHE_KEY = "admin_order_list_page_cache_v1";

function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCache(payload) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache errors
  }
}

function safeNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function getStatusTone(status, theme) {
  const s = String(status || "").toUpperCase();

  if (s === "COMPLETED") {
    return theme === "dark"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (s === "PENDING") {
    return theme === "dark"
      ? "border-amber-500/25 bg-amber-500/10 text-amber-200"
      : "border-amber-200 bg-amber-50 text-amber-700";
  }

  return theme === "dark"
    ? "border-white/10 bg-white/5 text-white/75"
    : "border-gray-200 bg-gray-100 text-gray-700";
}

export default function AdminOrderList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const initialCache = loadCache();

  const [userId, setUserId] = useState(
    () => searchParams.get("userId") || initialCache?.userId || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || initialCache?.statusFilter || "all"
  );
  const [localQuery, setLocalQuery] = useState(
    () => initialCache?.localQuery || ""
  );
  const [page, setPage] = useState(() => {
    const fromUrl = Number(searchParams.get("page") || "");
    return Number.isFinite(fromUrl) && fromUrl > 0
      ? fromUrl
      : initialCache?.page || 1;
  });
  const [limit, setLimit] = useState(() => {
    const fromUrl = Number(searchParams.get("limit") || "");
    return Number.isFinite(fromUrl) && fromUrl > 0
      ? fromUrl
      : initialCache?.limit || 10;
  });

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState(() => initialCache?.rows || []);
  const [pickedUser, setPickedUser] = useState(
    () => initialCache?.pickedUser || null
  );
  const [pagination, setPagination] = useState(
    () =>
      initialCache?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      }
  );

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

  const buttonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

  const tableWrapClass =
    theme === "dark"
      ? "overflow-hidden rounded-2xl border border-white/10"
      : "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

  const tableHeaderBarClass =
    theme === "dark"
      ? "bg-white/5 px-4 py-3 text-sm font-semibold text-white"
      : "bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900";

  const tableHeadClass =
    theme === "dark"
      ? "bg-white/5 text-xs text-white/60"
      : "bg-gray-50 text-xs text-gray-500";

  const tableBodyClass =
    theme === "dark" ? "divide-y divide-white/10" : "divide-y divide-gray-200";

  const tableRowClass =
    theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50";

  const footerBarClass =
    theme === "dark"
      ? "flex flex-col gap-3 border-t border-white/10 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
      : "flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between";

  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchJSON(url, options = {}) {
    const auth = getAuthHeaders();

    if (!auth) {
      throw new Error(t("orderList.pleaseLoginAgain"));
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
      throw new Error(t("orderList.nonJson"));
    }

    if (!res.ok) {
      throw new Error(
        data?.message || `${t("orderList.requestFailed")} (${res.status})`
      );
    }

    return data;
  }

  async function loadOrders(forceRefresh = true, overrides = {}) {
    const nextUserId = String(overrides.userId ?? userId).trim();
    const nextStatus = String(overrides.statusFilter ?? statusFilter).trim();
    const nextPage = Number(overrides.page ?? page ?? 1);
    const nextLimit = Number(overrides.limit ?? limit ?? 10);

    if (!nextUserId) {
      setRows([]);
      setPickedUser(null);
      setPagination({ page: 1, limit: nextLimit, total: 0, totalPages: 1 });
      if (forceRefresh) {
        toast.error(t("orderList.enterUserIdFirst"));
      }
      return;
    }

    if (forceRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(nextLimit));

      if (nextStatus !== "all") {
        params.set("status", nextStatus.toUpperCase());
      }

      const data = await fetchJSON(
        `${API_BASE}/api/admin/orders/users/${encodeURIComponent(
          nextUserId
        )}/orders?${params.toString()}`
      );

      const nextRows = Array.isArray(data?.orders) ? data.orders : [];
      const nextPickedUser = data?.user || null;
      const nextPagination = data?.pagination || {
        page: nextPage,
        limit: nextLimit,
        total: nextRows.length,
        totalPages: 1,
      };

      setRows(nextRows);
      setPickedUser(nextPickedUser);
      setPagination(nextPagination);

      saveCache({
        userId: nextUserId,
        statusFilter: nextStatus,
        localQuery,
        page: nextPagination.page,
        limit: nextPagination.limit,
        rows: nextRows,
        pickedUser: nextPickedUser,
        pagination: nextPagination,
        savedAt: Date.now(),
      });
    } catch (e) {
      setRows([]);
      setPickedUser(null);
      setPagination({ page: 1, limit: nextLimit, total: 0, totalPages: 1 });
      toast.error(e.message || t("orderList.failedLoad"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    saveCache({
      userId,
      statusFilter,
      localQuery,
      page,
      limit,
      rows,
      pickedUser,
      pagination,
      savedAt: Date.now(),
    });
  }, [userId, statusFilter, localQuery, page, limit, rows, pickedUser, pagination]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (userId) next.set("userId", userId);
    else next.delete("userId");

    if (statusFilter && statusFilter !== "all") next.set("status", statusFilter);
    else next.delete("status");

    next.set("page", String(page));
    next.set("limit", String(limit));

    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, statusFilter, page, limit]);

  useEffect(() => {
    const initialUserId = searchParams.get("userId") || initialCache?.userId || "";
    if (initialUserId) {
      loadOrders(true, {
        userId: initialUserId,
        statusFilter,
        page,
        limit,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRows = useMemo(() => {
    const qq = localQuery.trim().toLowerCase();
    if (!qq) return rows;

    return rows.filter((row) => {
      return (
        String(row.orderNumber || "").toLowerCase().includes(qq) ||
        String(row.orderName || "").toLowerCase().includes(qq) ||
        String(row.status || "").toLowerCase().includes(qq) ||
        String(row._id || "").toLowerCase().includes(qq)
      );
    });
  }, [rows, localQuery]);

  const stats = useMemo(() => {
    const totalOrders = rows.length;
    const pendingOrders = rows.filter(
      (x) => String(x.status).toUpperCase() === "PENDING"
    ).length;
    const completedOrders = rows.filter(
      (x) => String(x.status).toUpperCase() === "COMPLETED"
    ).length;
    const bonusOrders = rows.filter((x) => Boolean(x.isBonus)).length;
    const totalPrice = rows.reduce((sum, x) => sum + safeNum(x.price), 0);
    const totalCommission = rows.reduce(
      (sum, x) => sum + safeNum(x.commission),
      0
    );

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      bonusOrders,
      totalPrice,
      totalCommission,
    };
  }, [rows]);

  function statusText(status) {
    const s = String(status || "").toUpperCase();
    if (s === "PENDING") return t("orderList.pending");
    if (s === "COMPLETED") return t("orderList.completed");
    return status || "-";
  }

  return (
    <Shell title={t("orderList.title")}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className={`text-xs ${mutedText}`}>
              {t("orderList.subtitle")}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className={buttonClass}
              type="button"
            >
              {t("orderList.back")}
            </button>

            <button
              onClick={() => loadOrders(false)}
              disabled={loading || refreshing || !userId.trim()}
              className={`${buttonClass} disabled:opacity-50`}
              type="button"
            >
              {refreshing ? t("orderList.refreshing") : t("orderList.refresh")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <div className={`${cardClass} xl:col-span-7`}>
            <div className="p-4">
              <div className={`mb-3 text-sm font-semibold ${strongText}`}>
                {t("orderList.filters")}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <div className={`mb-2 text-[11px] font-semibold ${mutedText}`}>
                    UID
                  </div>
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={t("orderList.pasteUid")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className={`mb-2 text-[11px] font-semibold ${mutedText}`}>
                    {t("orderList.status")}
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className={selectClass}
                  >
                    <option value="all">{t("orderList.allStatuses")}</option>
                    <option value="pending">{t("orderList.pendingCaps")}</option>
                    <option value="completed">{t("orderList.completedCaps")}</option>
                  </select>
                </div>

                <div>
                  <div className={`mb-2 text-[11px] font-semibold ${mutedText}`}>
                    {t("orderList.searchLoadedRows")}
                  </div>
                  <input
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder={t("orderList.searchPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className={`mb-2 text-[11px] font-semibold ${mutedText}`}>
                    {t("orderList.perPage")}
                  </div>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className={selectClass}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPage(1);
                    loadOrders(true, { page: 1 });
                  }}
                  className={classNames(
                    "rounded-xl border px-3 py-2 text-xs",
                    theme === "dark"
                      ? "border-blue-500/25 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                      : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {loading ? t("orderList.loading") : t("orderList.loadOrders")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserId("");
                    setStatusFilter("all");
                    setLocalQuery("");
                    setPage(1);
                    setRows([]);
                    setPickedUser(null);
                    setPagination({ page: 1, limit, total: 0, totalPages: 1 });
                  }}
                  className={buttonClass}
                >
                  {t("orderList.clear")}
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardClass} xl:col-span-5`}>
            <div className="p-4">
              <div className={`mb-3 text-sm font-semibold ${strongText}`}>
                {t("orderList.pickedUser")}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className={`text-[11px] font-semibold ${mutedText}`}>
                    {t("orderList.phone")}
                  </div>
                  <div className={`mt-1 text-sm font-semibold break-all ${strongText}`}>
                    {pickedUser?.phoneNumber || "-"}
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] font-semibold ${mutedText}`}>
                    UID
                  </div>
                  <div className={`mt-1 text-sm font-semibold break-all ${strongText}`}>
                    {pickedUser?.uid || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          <StatCard theme={theme} title={t("orderList.loadedOrders")} value={stats.totalOrders} />
          <StatCard theme={theme} title={t("orderList.pending")} value={stats.pendingOrders} />
          <StatCard theme={theme} title={t("orderList.completed")} value={stats.completedOrders} />
          <StatCard theme={theme} title={t("orderList.bonusOrders")} value={stats.bonusOrders} />
          <StatCard theme={theme} title={t("orderList.totalPrice")} value={stats.totalPrice.toFixed(2)} />
          <StatCard theme={theme} title={t("orderList.totalCommission")} value={stats.totalCommission.toFixed(2)} />
        </div>

        <div className={tableWrapClass}>
          <div className={tableHeaderBarClass}>
            {t("orderList.orders")} ({filteredRows.length})
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1450px] text-left text-sm">
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-4 py-3">{t("orderList.orderNumber")}</th>
                  <th className="px-4 py-3">{t("orderList.orderName")}</th>
                  <th className="px-4 py-3">{t("orderList.status")}</th>
                  <th className="px-4 py-3">{t("orderList.price")}</th>
                  <th className="px-4 py-3">{t("orderList.commission")}</th>
                  <th className="px-4 py-3">{t("orderList.bonus")}</th>
                  <th className="px-4 py-3">{t("orderList.created")}</th>
                  <th className="px-4 py-3">{t("orderList.completed")}</th>
                  <th className="px-4 py-3">{t("orderList.poolOrderId")}</th>
                  <th className="px-4 py-3">{t("orderList.orderId")}</th>
                </tr>
              </thead>

              <tbody className={tableBodyClass}>
                {loading ? (
                  <tr>
                    <td className={`px-4 py-5 ${softText}`} colSpan={10}>
                      {t("orderList.loadingOrders")}
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td className={`px-4 py-5 ${softText}`} colSpan={10}>
                      {userId.trim()
                        ? t("orderList.noOrdersFound")
                        : t("orderList.enterUserLoadOrders")}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const tone = getStatusTone(row.status, theme);

                    return (
                      <tr key={row._id} className={tableRowClass}>
                        <td className={`px-4 py-3 text-xs font-semibold ${strongText}`}>
                          {row.orderNumber || "-"}
                        </td>

                        <td className="px-4 py-3">
                          <div
                            className={`max-w-[340px] truncate text-xs ${strongText}`}
                            title={row.orderName || "-"}
                          >
                            {row.orderName || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${tone}`}
                          >
                            {statusText(row.status)}
                          </span>
                        </td>

                        <td className={`px-4 py-3 text-xs ${strongText}`}>
                          {safeNum(row.price).toFixed(2)}
                        </td>

                        <td className={`px-4 py-3 text-xs ${strongText}`}>
                          {safeNum(row.commission).toFixed(2)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={classNames(
                              "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                              row.isBonus
                                ? theme === "dark"
                                  ? "border-violet-500/25 bg-violet-500/10 text-violet-200"
                                  : "border-violet-200 bg-violet-50 text-violet-700"
                                : theme === "dark"
                                ? "border-white/10 bg-white/5 text-white/70"
                                : "border-gray-200 bg-gray-100 text-gray-700"
                            )}
                          >
                            {row.isBonus ? t("orderList.yes") : t("orderList.no")}
                          </span>
                        </td>

                        <td className={`px-4 py-3 text-xs ${softText}`}>
                          {formatDate(row.createdAt)}
                        </td>

                        <td className={`px-4 py-3 text-xs ${softText}`}>
                          {formatDate(row.completedAt)}
                        </td>

                        <td className="px-4 py-3">
                          <div
                            className={`max-w-[220px] truncate text-xs ${softText}`}
                            title={row.poolOrder || "-"}
                          >
                            {row.poolOrder || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div
                            className={`max-w-[220px] truncate text-xs ${softText}`}
                            title={row._id || "-"}
                          >
                            {row._id || "-"}
                          </div>
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
              {t("orderList.showing")} {filteredRows.length}{" "}
              {t("orderList.localRows")} • {t("orderList.serverTotal")}{" "}
              {pagination.total || 0}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className={`text-xs ${softText}`}>
                {t("orderList.page")} {pagination.page || 1} /{" "}
                {Math.max(1, pagination.totalPages || 1)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={(pagination.page || 1) <= 1 || loading}
                  onClick={() => {
                    const nextPage = Math.max(1, (pagination.page || 1) - 1);
                    setPage(nextPage);
                    loadOrders(true, { page: nextPage });
                  }}
                  className={`${buttonClass} disabled:opacity-40`}
                >
                  {t("orderList.prev")}
                </button>

                <button
                  type="button"
                  disabled={
                    (pagination.page || 1) >=
                      Math.max(1, pagination.totalPages || 1) || loading
                  }
                  onClick={() => {
                    const nextPage = Math.min(
                      Math.max(1, pagination.totalPages || 1),
                      (pagination.page || 1) + 1
                    );
                    setPage(nextPage);
                    loadOrders(true, { page: nextPage });
                  }}
                  className={`${buttonClass} disabled:opacity-40`}
                >
                  {t("orderList.next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatCard({ theme, title, value }) {
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
      <div className={`text-[11px] font-semibold ${mutedText}`}>{title}</div>
      <div className={`mt-2 text-2xl font-semibold ${strongText}`}>{value}</div>
    </div>
  );
}