import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
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

export default function AdminSigninRewards() {
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

  const buttonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

  const primaryButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/85 hover:bg-white/15"
      : "rounded-xl border border-gray-900 bg-gray-900 px-3 py-2 text-xs text-white hover:bg-gray-800";

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

  const noticeClass =
    theme === "dark"
      ? "mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80"
      : "mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700";

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    totalClaims: 0,
    uniqueUsers: 0,
    totalRewardAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [q, setQ] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [rewardLoading, setRewardLoading] = useState(false);
  const [dayRewards, setDayRewards] = useState(["300", "0", "0", "0", "0", "0"]);

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
      throw new Error(t("signinRewards.pleaseLoginAgain"));
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
      throw new Error(t("signinRewards.nonJson"));
    }

    if (!res.ok) {
      const msg =
        data?.message || `${t("signinRewards.requestFailed")} (${res.status})`;

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
      }

      throw new Error(msg);
    }

    return data;
  }

  async function loadAll() {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const params = new URLSearchParams();
      if (userId.trim()) params.set("userId", userId.trim());
      if (from.trim()) params.set("from", from.trim());
      if (to.trim()) params.set("to", to.trim());

      const list = await fetchJSON(
        `${API_BASE}/api/admin/signin/claims?${params.toString()}`
      );

      setRows(list.claims || []);

      const sumParams = new URLSearchParams();
      if (from.trim()) sumParams.set("from", from.trim());
      if (to.trim()) sumParams.set("to", to.trim());

      const sum = await fetchJSON(
        `${API_BASE}/api/admin/signin/summary?${sumParams.toString()}`
      );

      setSummary(
        sum.summary || {
          totalClaims: 0,
          uniqueUsers: 0,
          totalRewardAmount: 0,
        }
      );

      setNotice(t("signinRewards.loadedClaims"));
    } catch (e) {
      setRows([]);
      setSummary({
        totalClaims: 0,
        uniqueUsers: 0,
        totalRewardAmount: 0,
      });
      setError(e.message || t("signinRewards.failedLoadClaims"));
    } finally {
      setLoading(false);
    }
  }

  async function loadRewardConfig() {
    setRewardLoading(true);
    setError("");
    setNotice("");

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/signin/rewards-config`);

      const arr = data?.rule?.dayRewards;

      if (Array.isArray(arr) && arr.length === 6) {
        setDayRewards(arr.map((x) => String(x)));
      } else {
        setDayRewards(["300", "0", "0", "0", "0", "0"]);
      }

      setNotice(t("signinRewards.loadedRewardPrices"));
    } catch (e) {
      setError(e.message || t("signinRewards.failedLoadRewardConfig"));
    } finally {
      setRewardLoading(false);
    }
  }

  async function saveRewardConfig() {
    setRewardLoading(true);
    setError("");
    setNotice("");

    try {
      const cleaned = dayRewards.map((x) => {
        const n = Number(x);
        if (!Number.isFinite(n) || n < 0) return 0;
        return n;
      });

      await fetchJSON(`${API_BASE}/api/admin/signin/rewards-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayRewards: cleaned }),
      });

      setNotice(t("signinRewards.rewardPricesUpdated"));
    } catch (e) {
      setError(e.message || t("signinRewards.failedUpdateRewardPrices"));
    } finally {
      setRewardLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    loadRewardConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return rows.filter((r) => {
      const u = r.userId || {};
      const phone = String(u.phoneNumber || "").toLowerCase();
      const uid = String(u.uid || "").toLowerCase();
      const mongoId = String(u._id || r.userId || "").toLowerCase();
      
      return (
        !qq ||
        uid.includes(qq) ||
        phone.includes(qq) ||
        mongoId.includes(qq) ||
        String(r.localDate || "").toLowerCase().includes(qq) ||
        String(r.streakDay || "").toLowerCase().includes(qq) ||
        String(r.rewardAmount || "").toLowerCase().includes(qq)
      );
    });
  }, [rows, q]);

  return (
    <Shell title={t("signinRewards.title")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className={`text-xs ${mutedText}`}>
          {t("signinRewards.subtitle")}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("signinRewards.searchPlaceholder")}
            className={`${inputClass} md:w-56`}
          />

          <button
            disabled={loading}
            onClick={loadAll}
            className={`${buttonClass} disabled:opacity-50`}
          >
            {t("signinRewards.refresh")}
          </button>
        </div>
      </div>

      <div className={`${cardClass} mt-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`text-sm font-semibold ${strongText}`}>
              {t("signinRewards.rewardPrices")}
            </div>
            <div className={`mt-1 text-[11px] ${mutedText}`}>
              {t("signinRewards.rewardPricesDesc")}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              disabled={rewardLoading}
              onClick={loadRewardConfig}
              className={`${buttonClass} disabled:opacity-50`}
            >
              {t("signinRewards.reload")}
            </button>

            <button
              disabled={rewardLoading}
              onClick={saveRewardConfig}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {t("signinRewards.savePrices")}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-6">
          {dayRewards.map((val, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className={`text-[11px] ${softText}`}>
                {t("signinRewards.day")} {i + 1}
              </div>

              <input
                value={val}
                onChange={(e) => {
                  const copy = [...dayRewards];
                  copy[i] = e.target.value;
                  setDayRewards(copy);
                }}
                placeholder="0"
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <div className={`mt-2 text-[11px] ${mutedText}`}>
          {t("signinRewards.dayOneTip")}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryCard
          title={t("signinRewards.totalClaims")}
          value={safeNum(summary.totalClaims)}
          cardClass={cardClass}
          mutedText={mutedText}
          strongText={strongText}
        />

        <SummaryCard
          title={t("signinRewards.uniqueUsers")}
          value={safeNum(summary.uniqueUsers)}
          cardClass={cardClass}
          mutedText={mutedText}
          strongText={strongText}
        />

        <SummaryCard
          title={t("signinRewards.totalRewardAmount")}
          value={safeNum(summary.totalRewardAmount).toFixed(2)}
          cardClass={cardClass}
          mutedText={mutedText}
          strongText={strongText}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className={`${cardClass} p-3`}>
          <div className={`text-xs font-semibold ${strongText}`}>
            {t("signinRewards.filterUserId")}
          </div>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={t("signinRewards.optionalUserId")}
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div className={`${cardClass} p-3`}>
          <div className={`text-xs font-semibold ${strongText}`}>
            {t("signinRewards.fromDate")}
          </div>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="YYYY-MM-DD"
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div className={`${cardClass} p-3`}>
          <div className={`text-xs font-semibold ${strongText}`}>
            {t("signinRewards.toDate")}
          </div>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="YYYY-MM-DD"
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div className={`${cardClass} flex flex-col justify-between p-3`}>
          <div>
            <div className={`text-xs font-semibold ${strongText}`}>
              {t("signinRewards.apply")}
            </div>
            <div className={`mt-1 text-[11px] ${mutedText}`}>
              {t("signinRewards.filtersUseEt")}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              disabled={loading}
              onClick={loadAll}
              className={`flex-1 ${primaryButtonClass} disabled:opacity-50`}
            >
              {t("signinRewards.apply")}
            </button>

            <button
              disabled={loading}
              onClick={() => {
                setUserId("");
                setFrom("");
                setTo("");
                setQ("");
                setNotice("");
                setError("");
              }}
              className={`${buttonClass} disabled:opacity-50`}
            >
              {t("signinRewards.clear")}
            </button>
          </div>
        </div>
      </div>

      {error ? <div className={noticeClass}>{error}</div> : null}

      {notice && !error ? <div className={noticeClass}>{notice}</div> : null}

      <div className={tableWrapClass}>
        <div className={tableHeaderBarClass}>
          {t("signinRewards.claims")} ({filtered.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3">{t("signinRewards.user")}</th>
                <th className="px-4 py-3">{t("signinRewards.etDate")}</th>
                <th className="px-4 py-3">{t("signinRewards.streakDay")}</th>
                <th className="px-4 py-3">{t("signinRewards.reward")}</th>
                <th className="px-4 py-3">
                  {t("signinRewards.ordersCompleted")}
                </th>
                <th className="px-4 py-3">{t("signinRewards.createdAt")}</th>
              </tr>
            </thead>

            <tbody className={tableBodyClass}>
              {loading ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={6}>
                    {t("signinRewards.loadingClaims")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={6}>
                    {t("signinRewards.noClaimsFound")}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const u = r.userId || {};
                  const uid = u.uid || "-";
                  const mongoId = u._id || r.userId || "-";
                
                  return (
                    <tr key={r._id} className={tableRowClass}>
                      <td className="px-4 py-3">
                        <div className={`text-xs ${strongText}`}>{uid}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={classNames(
                            "inline-flex rounded-full px-2 py-1 text-xs",
                            theme === "dark"
                              ? "bg-white/10 text-white/80"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {r.localDate || "-"}
                        </span>

                        <div className={`mt-1 text-[11px] ${mutedText}`}>
                          America/New_York
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={classNames(
                            "inline-flex rounded-full px-2 py-1 text-xs",
                            theme === "dark"
                              ? "bg-white/10 text-white/80"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {t("signinRewards.day")} {r.streakDay ?? "-"}
                        </span>
                      </td>

                      <td className={`px-4 py-3 text-xs ${strongText}`}>
                        {safeNum(r.rewardAmount).toFixed(2)}
                      </td>

                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {safeNum(r.dailyCompletedOrders)}
                      </td>

                      <td className={`px-4 py-3 text-xs ${softText}`}>
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

function SummaryCard({ title, value, cardClass, mutedText, strongText }) {
  return (
    <div className={cardClass}>
      <div className={`text-xs ${mutedText}`}>{title}</div>
      <div className={`mt-2 text-xl font-semibold ${strongText}`}>{value}</div>
    </div>
  );
}