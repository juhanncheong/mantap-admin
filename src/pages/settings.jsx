import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

export default function Settings() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  const cardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5"
      : "rounded-2xl border border-gray-200 bg-white shadow-sm";

  const subCardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 p-3"
      : "rounded-2xl border border-gray-200 bg-gray-50 p-3";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
      : "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400";

  const buttonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

  const primaryButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/85 hover:bg-white/15"
      : "rounded-xl border border-gray-900 bg-gray-900 px-3 py-2 text-xs text-white hover:bg-gray-800";

  const tableHeadClass =
    theme === "dark"
      ? "bg-white/5 text-xs text-white/60"
      : "bg-gray-50 text-xs text-gray-500";

  const tableBodyClass =
    theme === "dark" ? "divide-y divide-white/10" : "divide-y divide-gray-200";

  const tableRowClass = theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50";

  const [vipLoading, setVipLoading] = useState(false);
  const [bonusCommissionRate, setBonusCommissionRate] = useState("0.1");
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeEnabled, setNoticeEnabled] = useState(true);
  const [noticeLabel, setNoticeLabel] = useState("Security reminder");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeVersion, setNoticeVersion] = useState(1);

  const [vipRanks, setVipRanks] = useState([
    { rank: 1, ordersLimit: 40, commissionRate: 0.01 },
    { rank: 2, ordersLimit: 60, commissionRate: 0.015 },
    { rank: 3, ordersLimit: 80, commissionRate: 0.02 },
  ]);

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
      throw new Error(t("settings.pleaseLoginAgain"));
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
      throw new Error(t("settings.nonJson"));
    }

    if (!res.ok) {
      const msg =
        data?.message || `${t("settings.requestFailed")} (${res.status})`;

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
      }

      throw new Error(msg);
    }

    return data;
  }

  async function loadVipConfig() {
    setVipLoading(true);

    try {
      const data = await fetchJSON(`${API_BASE}/api/admin/vip/config`);
      const config = data?.config || {};
      const ranks = config?.ranks || [];
      const bonusRate = config?.bonusCommissionRate ?? 0.1;

      setBonusCommissionRate(String(bonusRate));

      if (Array.isArray(ranks) && ranks.length) {
        const cleaned = [...ranks].sort(
          (a, b) => Number(a.rank) - Number(b.rank)
        );

        setVipRanks(cleaned);
      }
    } catch (e) {
      toast.error(e.message || t("settings.failedLoadVipConfig"));
    } finally {
      setVipLoading(false);
    }
  }

  async function saveVipConfig() {
    setVipLoading(true);

    try {
      const cleanBonus = Number(bonusCommissionRate);

      if (!Number.isFinite(cleanBonus) || cleanBonus < 0 || cleanBonus > 1) {
        throw new Error(t("settings.bonusRateValidation"));
      }

      const cleanedRanks = vipRanks.map((r) => {
        const rank = Number(r.rank);
        const ordersLimit = Number(r.ordersLimit);
        const commissionRate = Number(r.commissionRate);

        if (![1, 2, 3].includes(rank)) {
          throw new Error(t("settings.rankValidation"));
        }

        if (!Number.isFinite(ordersLimit) || ordersLimit < 1) {
          throw new Error(
            t("settings.ordersLimitValidation", { rank })
          );
        }

        if (
          !Number.isFinite(commissionRate) ||
          commissionRate < 0 ||
          commissionRate > 1
        ) {
          throw new Error(
            t("settings.commissionRateValidation", { rank })
          );
        }

        return {
          rank,
          ordersLimit,
          commissionRate,
        };
      });

      await fetchJSON(`${API_BASE}/api/admin/vip/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bonusCommissionRate: cleanBonus,
          ranks: cleanedRanks,
        }),
      });

      setVipRanks(cleanedRanks);
      setBonusCommissionRate(String(cleanBonus));
      toast.success(t("settings.savedSuccess"));
    } catch (e) {
      toast.error(e.message || t("settings.failedSaveVipConfig"));
    } finally {
      setVipLoading(false);
    }
  }

  async function loadSafetyNotice() {
  setNoticeLoading(true);

  try {
    const data = await fetchJSON(`${API_BASE}/api/admin/safety-notice`);
    const notice = data?.notice || {};

    setNoticeEnabled(Boolean(notice.enabled));
    setNoticeLabel(notice.label || "Security reminder");
    setNoticeTitle(notice.title || "");
    setNoticeDescription(notice.description || "");
    setNoticeVersion(notice.version || 1);
  } catch (e) {
    toast.error(e.message || t("settings.failedLoadSafetyNotice"));
  } finally {
    setNoticeLoading(false);
  }
}

async function saveSafetyNotice() {
  setNoticeLoading(true);

  try {
    const title = String(noticeTitle || "").trim();
    const description = String(noticeDescription || "").trim();

    if (!title) {
      throw new Error(t("settings.safetyNoticeTitleRequired"));
    }

    if (!description) {
      throw new Error(t("settings.safetyNoticeDescriptionRequired"));
    }

    const data = await fetchJSON(`${API_BASE}/api/admin/safety-notice`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: noticeEnabled,
        label: noticeLabel,
        title,
        description,
      }),
    });

    const saved = data?.notice || {};

    setNoticeEnabled(Boolean(saved.enabled));
    setNoticeLabel(saved.label || "Security reminder");
    setNoticeTitle(saved.title || "");
    setNoticeDescription(saved.description || "");
    setNoticeVersion(saved.version || 1);

    toast.success(t("settings.safetyNoticeSaved"));
  } catch (e) {
    toast.error(e.message || t("settings.failedSaveSafetyNotice"));
  } finally {
    setNoticeLoading(false);
  }
}

  useEffect(() => {
    loadVipConfig();
    loadSafetyNotice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Shell title={t("settings.title")}>

    <div className={`${cardClass} mt-4 overflow-hidden`}>
      <div
        className={`px-4 py-3 text-sm font-semibold ${
          theme === "dark" ? "bg-white/5 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {t("settings.safetyNoticeTitle")}
      </div>
    
      <div className="space-y-4 p-4">
        <div className={`text-xs ${mutedText}`}>
          {t("settings.safetyNoticeDesc")}
        </div>
    
        <div className={subCardClass}>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={noticeEnabled}
              onChange={(e) => setNoticeEnabled(e.target.checked)}
            />
            <span className={strongText}>
              {t("settings.enableSafetyNotice")}
            </span>
          </label>
        </div>
    
        <div className="grid gap-3 md:grid-cols-2">
          <div className={subCardClass}>
            <div className={`text-xs font-semibold ${strongText}`}>
              {t("settings.noticeLabel")}
            </div>
    
            <input
              value={noticeLabel}
              onChange={(e) => setNoticeLabel(e.target.value)}
              placeholder={t("settings.noticeLabelPlaceholder")}
              className={`mt-3 ${inputClass}`}
            />
          </div>
    
          <div className={subCardClass}>
            <div className={`text-xs font-semibold ${strongText}`}>
              {t("settings.noticeVersion")}
            </div>
    
            <div className={`mt-3 text-xs ${mutedText}`}>
              {t("settings.currentVersion", { version: noticeVersion })}
            </div>
          </div>
        </div>
    
        <div className={subCardClass}>
          <div className={`text-xs font-semibold ${strongText}`}>
            {t("settings.noticeTitleInput")}
          </div>
    
          <input
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            placeholder={t("settings.noticeTitlePlaceholder")}
            className={`mt-3 ${inputClass}`}
          />
        </div>
    
        <div className={subCardClass}>
          <div className={`text-xs font-semibold ${strongText}`}>
            {t("settings.noticeDescriptionInput")}
          </div>
    
          <textarea
            value={noticeDescription}
            onChange={(e) => setNoticeDescription(e.target.value)}
            placeholder={t("settings.noticeDescriptionPlaceholder")}
            rows={4}
            className={`mt-3 ${inputClass} resize-none`}
          />
        </div>
    
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={noticeLoading}
            onClick={loadSafetyNotice}
            className={`${buttonClass} disabled:opacity-50`}
          >
            {t("settings.refresh")}
          </button>
    
          <button
            disabled={noticeLoading}
            onClick={saveSafetyNotice}
            className={`${primaryButtonClass} disabled:opacity-50`}
          >
            {noticeLoading
              ? t("settings.saving")
              : t("settings.saveSafetyNotice")}
          </button>
        </div>
      </div>
    </div>

      <div className={`${cardClass} mt-4 overflow-hidden`}>
        <div
          className={`px-4 py-3 text-sm font-semibold ${
            theme === "dark" ? "bg-white/5 text-white" : "bg-gray-50 text-gray-900"
          }`}
        >
          {t("settings.vipBonusSettings")}
        </div>

        <div className="space-y-4 p-4">
          <div className={`text-xs ${mutedText}`}>
            {t("settings.description")}
            <span
              className={`ml-2 ${
                theme === "dark" ? "text-white/30" : "text-gray-400"
              }`}
            >
              {t("settings.example")}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className={subCardClass}>
              <div className={`text-xs font-semibold ${strongText}`}>
                {t("settings.bonusOrderCommissionRate")}
              </div>

              <div className={`mt-1 text-[11px] ${mutedText}`}>
                {t("settings.bonusOrderCommissionRateDesc")}
              </div>

              <input
                value={bonusCommissionRate}
                onChange={(e) => setBonusCommissionRate(e.target.value)}
                placeholder="0.1"
                className={`mt-3 ${inputClass}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-4 py-3">{t("settings.rank")}</th>
                  <th className="px-4 py-3">{t("settings.ordersLimit")}</th>
                  <th className="px-4 py-3">
                    {t("settings.normalCommissionRate")}
                  </th>
                </tr>
              </thead>

              <tbody className={tableBodyClass}>
                {vipRanks.map((r, idx) => (
                  <tr key={r.rank} className={tableRowClass}>
                    <td className={`px-4 py-3 ${strongText}`}>
                      {t("settings.rank")} {r.rank}
                    </td>

                    <td className="px-4 py-3">
                      <input
                        value={String(r.ordersLimit ?? "")}
                        onChange={(e) => {
                          const v = e.target.value;
                          setVipRanks((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, ordersLimit: v } : x
                            )
                          );
                        }}
                        className={`w-32 ${inputClass}`}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        value={String(r.commissionRate ?? "")}
                        onChange={(e) => {
                          const v = e.target.value;
                          setVipRanks((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, commissionRate: v } : x
                            )
                          );
                        }}
                        className={`w-32 ${inputClass}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              disabled={vipLoading}
              onClick={loadVipConfig}
              className={`${buttonClass} disabled:opacity-50`}
            >
              {t("settings.refresh")}
            </button>

            <button
              disabled={vipLoading}
              onClick={saveVipConfig}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {vipLoading ? t("settings.saving") : t("settings.saveSettings")}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}