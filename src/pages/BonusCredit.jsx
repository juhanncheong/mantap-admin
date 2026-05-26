import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

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

export default function BonusCredit() {
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
      ? "rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white/90 outline-none hover:bg-[#182236]"
      : "rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none hover:bg-gray-50";

  const neutralButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

  const primaryButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white px-4 py-3 text-xs font-semibold text-slate-900 hover:bg-white/90"
      : "rounded-xl border border-gray-900 bg-gray-900 px-4 py-3 text-xs font-semibold text-white hover:bg-gray-800";

  const secondaryActionClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/80 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-800 hover:bg-gray-50";

  const tableHeadClass =
    theme === "dark"
      ? "bg-white/5 text-xs text-white/60"
      : "bg-gray-50 text-xs text-gray-500";

  const tableBodyClass =
    theme === "dark"
      ? "divide-y divide-white/10"
      : "divide-y divide-gray-200";

  const footerBarClass =
    theme === "dark"
      ? "flex flex-col gap-3 border-t border-white/10 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
      : "flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between";

  function typeBadge() {
    if (theme === "dark") {
      return "border-white/10 bg-white/5 text-white/70";
    }
    return "border-gray-300 bg-gray-100 text-gray-700";
  }

  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchingUser, setSearchingUser] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [uidInput, setUidInput] = useState("");

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [history, setHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const userIdFromUrl = String(searchParams.get("userId") || "").trim();
  const uidFromUrl = String(searchParams.get("uid") || "").trim();

  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchJSON(url, options = {}) {
    const auth = getAuthHeaders();
    if (!auth) throw new Error(t("bonusCredit.pleaseLoginAgain"));

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
      throw new Error(t("bonusCredit.nonJson"));
    }

    if (!res.ok) {
      throw new Error(
        data?.message || `${t("bonusCredit.requestFailed")} (${res.status})`
      );
    }

    return data;
  }

  async function loadBonusHistory({ keepPage = true } = {}) {
    const nextPage = keepPage ? page : 1;
    if (!keepPage) setPage(1);

    setLoadingHistory(true);

    try {
      const qs = new URLSearchParams();
      qs.set("page", String(nextPage));
      qs.set("limit", String(pageSize));

      if (uidInput.trim()) qs.set("uid", uidInput.trim());
      if (historySearch.trim()) qs.set("q", historySearch.trim());

      const data = await fetchJSON(
        `${API_BASE}/api/admin/bonus-history?${qs.toString()}`
      );

      const rows = Array.isArray(data?.rows) ? data.rows : [];
      setHistory(rows);
      setSelectedUser(data?.user || null);
      setTotalRows(Number(data?.pagination?.total || 0));
      setTotalPages(Math.max(1, Number(data?.pagination?.totalPages || 1)));
    } catch (e) {
      setHistory([]);
      setSelectedUser(null);
      setTotalRows(0);
      setTotalPages(1);
      toast.error(e.message || t("bonusCredit.failedLoadHistory"));
    } finally {
      setLoadingHistory(false);
    }
  }

  async function searchUserByUid() {
    setSearchingUser(true);
    try {
      await loadBonusHistory({ keepPage: false });
    } finally {
      setSearchingUser(false);
    }
  }

  async function clearUserFilter() {
    setUidInput("");
    setSelectedUser(null);
    setAmount("");
    setNote("");
    setPage(1);

    setLoadingHistory(true);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/bonus-history?page=1&limit=${pageSize}`
      );

      const rows = Array.isArray(data?.rows) ? data.rows : [];
      setHistory(rows);
      setSelectedUser(null);
      setTotalRows(Number(data?.pagination?.total || 0));
      setTotalPages(Math.max(1, Number(data?.pagination?.totalPages || 1)));
    } catch (e) {
      setHistory([]);
      setTotalRows(0);
      setTotalPages(1);
      toast.error(e.message || t("bonusCredit.failedLoadHistory"));
    } finally {
      setLoadingHistory(false);
    }
  }

  async function submitBonus() {
    if (!selectedUser?._id) {
      toast.error(t("bonusCredit.searchSelectUserFirst"));
      return;
    }

    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      toast.error(t("bonusCredit.validBonusAmount"));
      return;
    }

    setSubmitting(true);

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/admin/users/${selectedUser._id}/bonus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: num,
            note: String(note || "").trim(),
          }),
        }
      );

      const nextBalance = Number(data?.user?.balance);
      if (Number.isFinite(nextBalance)) {
        setSelectedUser((prev) =>
          prev ? { ...prev, balance: nextBalance } : prev
        );
      }

      setAmount("");
      setNote("");
      toast.success(t("bonusCredit.creditedSuccess"));
      await loadBonusHistory({ keepPage: false });
    } catch (e) {
      toast.error(e.message || t("bonusCredit.failedCreditBonus"));
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadBonusHistory({ keepPage: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uidFromUrl) {
      setUidInput(uidFromUrl);
    }
  }, [uidFromUrl]);

  useEffect(() => {
    if (uidFromUrl || userIdFromUrl) {
      const boot = async () => {
        if (uidFromUrl) {
          setUidInput(uidFromUrl);
        }

        const qs = new URLSearchParams();
        qs.set("page", "1");
        qs.set("limit", String(pageSize));

        if (uidFromUrl) qs.set("uid", uidFromUrl);

        setLoadingHistory(true);

        try {
          const data = await fetchJSON(
            `${API_BASE}/api/admin/bonus-history?${qs.toString()}`
          );

          const rows = Array.isArray(data?.rows) ? data.rows : [];
          setHistory(rows);
          setSelectedUser(data?.user || null);
          setTotalRows(Number(data?.pagination?.total || 0));
          setTotalPages(Math.max(1, Number(data?.pagination?.totalPages || 1)));
          setPage(1);
        } catch (e) {
          setHistory([]);
          setSelectedUser(null);
          setTotalRows(0);
          setTotalPages(1);
          toast.error(e.message || t("bonusCredit.failedLoadHistory"));
        } finally {
          setLoadingHistory(false);
        }
      };

      boot();
      return;
    }

    loadBonusHistory({ keepPage: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uidFromUrl, userIdFromUrl]);

  const displayRows = useMemo(() => history, [history]);

  return (
    <Shell title={t("bonusCredit.title")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className={`text-xs ${mutedText}`}>
          {t("bonusCredit.subtitle")}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/users")}
            className={neutralButtonClass}
          >
            {t("bonusCredit.backToUsers")}
          </button>

          <button
            onClick={() => loadBonusHistory()}
            className={neutralButtonClass}
          >
            {t("bonusCredit.refresh")}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-1">
          <div className={`${cardClass} p-4`}>
            <div className={`text-sm font-semibold ${strongText}`}>
              {t("bonusCredit.searchUserByUid")}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className={`text-xs font-semibold ${strongText}`}>
                  UID
                </div>
                <input
                  value={uidInput}
                  onChange={(e) => setUidInput(e.target.value)}
                  placeholder={t("bonusCredit.uidPlaceholder")}
                  className={`mt-2 ${inputClass}`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  disabled={searchingUser}
                  onClick={searchUserByUid}
                  className={`flex-1 ${primaryButtonClass} disabled:opacity-50`}
                >
                  {searchingUser
                    ? t("bonusCredit.searching")
                    : t("bonusCredit.searchUser")}
                </button>

                <button onClick={clearUserFilter} className={secondaryActionClass}>
                  {t("bonusCredit.clear")}
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-4`}>
            <div className={`text-sm font-semibold ${strongText}`}>
              {t("bonusCredit.userDetails")}
            </div>

            {!selectedUser ? (
              <div className={`mt-4 text-xs ${mutedText}`}>
                {t("bonusCredit.noUserSelected")}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div
                  className={`rounded-2xl p-3 ${
                    theme === "dark"
                      ? "border border-white/10 bg-[#0f172a]"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className={`text-[11px] ${mutedText}`}>UID</div>
                  <div className={`mt-1 text-sm ${strongText}`}>
                    {selectedUser.uid || "-"}
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-3 ${
                    theme === "dark"
                      ? "border border-white/10 bg-white/5"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className={`text-[11px] ${mutedText}`}>
                    {t("bonusCredit.currentBalance")}
                  </div>
                  <div className={`mt-2 text-2xl font-semibold ${strongText}`}>
                    {safeNum(selectedUser.balance).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`${cardClass} p-4`}>
            <div className={`text-sm font-semibold ${strongText}`}>
              {t("bonusCredit.creditBonus")}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className={`text-xs font-semibold ${strongText}`}>
                  {t("bonusCredit.amount")}
                </div>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t("bonusCredit.amountPlaceholder")}
                  className={`mt-2 ${inputClass}`}
                />
              </div>

              <div>
                <div className={`text-xs font-semibold ${strongText}`}>
                  {t("bonusCredit.note")}
                </div>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("bonusCredit.notePlaceholder")}
                  className={`mt-2 ${inputClass}`}
                />
              </div>

              <button
                disabled={!selectedUser?._id || submitting}
                onClick={submitBonus}
                className={`w-full ${primaryButtonClass} disabled:opacity-50`}
              >
                {submitting
                  ? t("bonusCredit.crediting")
                  : t("bonusCredit.creditBonus")}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className={cardClass}>
            <div
              className={`flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between ${
                theme === "dark"
                  ? "border-b border-white/10"
                  : "border-b border-gray-200"
              }`}
            >
              <div>
                <div className={`text-sm font-semibold ${strongText}`}>
                  {t("bonusCredit.historyTitle")}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder={t("bonusCredit.searchNotePlaceholder")}
                  className={`${inputClass} md:w-72`}
                />

                <button
                  onClick={() => loadBonusHistory({ keepPage: false })}
                  className={neutralButtonClass}
                >
                  {t("bonusCredit.search")}
                </button>

                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className={selectClass}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="users-table-scroll overflow-x-auto">
              <table className="min-w-[980px] text-left text-sm">
                <thead className={tableHeadClass}>
                  <tr>
                    <th className="px-4 py-3">{t("bonusCredit.created")}</th>
                    <th className="px-4 py-3">UID</th>
                    <th className="px-4 py-3">{t("bonusCredit.type")}</th>
                    <th className="px-4 py-3">{t("bonusCredit.amount")}</th>
                    <th className="px-4 py-3">{t("bonusCredit.before")}</th>
                    <th className="px-4 py-3">{t("bonusCredit.after")}</th>
                    <th className="px-4 py-3">{t("bonusCredit.note")}</th>
                  </tr>
                </thead>

                <tbody className={tableBodyClass}>
                  {loadingHistory ? (
                    <tr>
                      <td className={`px-4 py-5 ${softText}`} colSpan={8}>
                        {t("bonusCredit.loadingHistory")}
                      </td>
                    </tr>
                  ) : displayRows.length === 0 ? (
                    <tr>
                      <td className={`px-4 py-5 ${softText}`} colSpan={8}>
                        {t("bonusCredit.noHistoryFound")}
                      </td>
                    </tr>
                  ) : (
                    displayRows.map((row) => (
                      <tr
                        key={row._id}
                        className={
                          theme === "dark"
                            ? "hover:bg-white/5"
                            : "hover:bg-gray-50"
                        }
                      >
                        <td className={`px-4 py-3 text-xs ${softText}`}>
                          {formatDate(row.createdAt)}
                        </td>

                        <td className="px-4 py-3">
                          <div className={`text-xs ${strongText}`}>
                            {row?.userId?.uid || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] ${typeBadge(
                              row.type
                            )}`}
                          >
                            {row.type || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`text-xs ${strongText}`}>
                            {safeNum(row.amount).toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`text-xs ${softText}`}>
                            {safeNum(row.balanceBefore).toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`text-xs ${strongText}`}>
                            {safeNum(row.balanceAfter).toFixed(2)}
                          </div>
                        </td>

                        <td className={`px-4 py-3 text-xs ${softText}`}>
                          {row.note || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={footerBarClass}>
              <div className={`text-xs ${mutedText}`}>
                {t("bonusCredit.showing")}{" "}
                {totalRows === 0 ? 0 : (page - 1) * pageSize + 1}{" "}
                {t("bonusCredit.to")} {Math.min(page * pageSize, totalRows)}{" "}
                {t("bonusCredit.of")} {totalRows}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`${neutralButtonClass} disabled:opacity-40`}
                >
                  {t("bonusCredit.prev")}
                </button>

                <div className={`text-xs ${softText}`}>
                  {t("bonusCredit.page")} {page} / {totalPages}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`${neutralButtonClass} disabled:opacity-40`}
                >
                  {t("bonusCredit.next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}