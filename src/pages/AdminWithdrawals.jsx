import { useEffect, useMemo, useState } from "react";
import { Copy, QrCode, ShieldCheck, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

const PER_PAGE = 10;

function money(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "0";
  return num.toFixed(0);
}

function balanceMoney(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "0.00";
  return num.toFixed(2);
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

function cryptoLabel(t) {
  const map = {
    BTC_MAINNET: "Bitcoin (Mainnet)",
    ETH_ERC20: "Ethereum (ERC20)",
    SOL: "Solana (SOL)",
    USDC_ERC20: "USDC (ERC20)",
    USDT_TRC20: "USDT (TRC20)",
  };
  return map[t] || t || "-";
}

function cryptoSymbol(method) {
  const map = {
    BTC_MAINNET: "BTC",
    ETH_ERC20: "ETH",
    SOL: "SOL",
    USDC_ERC20: "USDC",
    USDT_TRC20: "USDT",
  };

  return map[method] || "";
}

function cryptoDecimals(method) {
  const map = {
    BTC_MAINNET: 6,
    ETH_ERC20: 6,
    SOL: 6,
    USDC_ERC20: 2,
    USDT_TRC20: 2,
  };

  return map[method] ?? 6;
}

const CRYPTO_OPTIONS = [
  "BTC_MAINNET",
  "ETH_ERC20",
  "SOL",
  "USDC_ERC20",
  "USDT_TRC20",
];

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin,tether&vs_currencies=eur&include_last_updated_at=true";

export default function AdminWithdrawalsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  const filterCardClass =
    theme === "dark"
      ? "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
      : "mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";

  const inputClass =
    theme === "dark"
      ? "w-full mt-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none focus:border-white/20"
      : "w-full mt-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-400";

  const selectClass =
    theme === "dark"
      ? "w-full mt-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none focus:border-white/20"
      : "w-full mt-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-400";

  const subtleButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50";

  const tableWrapClass =
    theme === "dark"
      ? "mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      : "mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

  const tableHeaderBarClass =
    theme === "dark"
      ? "flex items-center justify-between border-b border-white/10 px-4 py-3"
      : "flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gray-50";

  const tableHeadClass =
    theme === "dark"
      ? "bg-white/5 text-left text-white/60"
      : "bg-gray-50 text-left text-gray-500";

  const tableBodyClass =
    theme === "dark"
      ? "divide-y divide-white/10"
      : "divide-y divide-gray-200";

  const modalOverlayClass =
    "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4";

  const modalCardClass =
    theme === "dark"
      ? "my-4 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#071120] p-5 shadow-2xl"
      : "my-4 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl";

  const tabWrapClass =
    theme === "dark"
      ? "inline-flex rounded-2xl border border-white/10 bg-white/5 p-1"
      : "inline-flex rounded-2xl border border-gray-200 bg-white p-1";

  function badgeClasses(status) {
    const s = String(status || "").toUpperCase();

    if (s === "PENDING") {
      return theme === "dark"
        ? "border border-amber-400/20 bg-amber-400/10 text-amber-200"
        : "border border-amber-200 bg-amber-50 text-amber-700";
    }

    if (s === "APPROVED") {
      return theme === "dark"
        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
        : "border border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (s === "REJECTED") {
      return theme === "dark"
        ? "border border-red-400/20 bg-red-400/10 text-red-200"
        : "border border-red-200 bg-red-50 text-red-700";
    }

    return theme === "dark"
      ? "border border-white/10 bg-white/5 text-white/80"
      : "border border-gray-200 bg-gray-50 text-gray-700";
  }

  const [cryptoRates, setCryptoRates] = useState(null);
  const [cryptoRatesUpdatedAt, setCryptoRatesUpdatedAt] = useState(null);
  const [cryptoRateWarning, setCryptoRateWarning] = useState("");
  const [cryptoRateBusy, setCryptoRateBusy] = useState(false);

  const [tab, setTab] = useState("withdrawals");
  const [busy, setBusy] = useState(false);
  const [actionBusyId, setActionBusyId] = useState(null);

  const [withdrawals, setWithdrawals] = useState([]);
  const [recentAddresses, setRecentAddresses] = useState([]);

  const [status, setStatus] = useState("ALL");
  const [crypto, setCrypto] = useState("ALL");
  const [q, setQ] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [recentCrypto, setRecentCrypto] = useState("ALL");
  const [recentQ, setRecentQ] = useState("");

  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [editCryptoType, setEditCryptoType] = useState("BTC_MAINNET");
  const [saveBusy, setSaveBusy] = useState(false);

  const [cryptoAddressModal, setCryptoAddressModal] = useState({
    open: false,
    item: null,
    address: "",
    method: "",
  });

  async function fetchWithdrawals() {
    setBusy(true);
    try {
      const token = localStorage.getItem("admin_token");

      const url =
        status === "ALL"
          ? `${API}/api/admin/withdrawals`
          : `${API}/api/admin/withdrawals?status=${encodeURIComponent(status)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || t("withdrawals.failedLoadWithdrawals"));
      }

      const list = Array.isArray(data.withdrawals) ? data.withdrawals : [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setWithdrawals(list);
      setPage(1);
    } catch (err) {
      console.error("fetchWithdrawals error:", err);
      toast.error(err.message || t("withdrawals.failedLoadWithdrawals"));
      setWithdrawals([]);
    } finally {
      setBusy(false);
    }
  }

  async function fetchRecentAddresses() {
    setBusy(true);
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/recent-withdrawal-addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || t("withdrawals.failedLoadRecentAddresses"));
      }

      const list = Array.isArray(data.items) ? data.items : [];
      list.sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt));

      setRecentAddresses(list);
      setPage(1);
    } catch (err) {
      console.error("fetchRecentAddresses error:", err);
      toast.error(err.message || t("withdrawals.failedLoadRecentAddresses"));
      setRecentAddresses([]);
    } finally {
      setBusy(false);
    }
  }

  async function fetchCryptoRates() {
    setCryptoRateBusy(true);
    setCryptoRateWarning("");

    try {
      const res = await fetch(COINGECKO_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || t("withdrawals.coinGeckoFailed"));
      }

      const nextRates = {
        BTC_MAINNET: data?.bitcoin?.eur,
        ETH_ERC20: data?.ethereum?.eur,
        SOL: data?.solana?.eur,
        USDC_ERC20: data?.["usd-coin"]?.eur,
        USDT_TRC20: data?.tether?.eur,
      };

      const hasMissingRate = CRYPTO_OPTIONS.some((method) => {
        const value = Number(nextRates[method]);
        return !Number.isFinite(value) || value <= 0;
      });

      if (hasMissingRate) {
        throw new Error(t("withdrawals.incompleteRates"));
      }

      setCryptoRates(nextRates);

      const updatedTimes = [
        data?.bitcoin?.last_updated_at,
        data?.ethereum?.last_updated_at,
        data?.solana?.last_updated_at,
        data?.["usd-coin"]?.last_updated_at,
        data?.tether?.last_updated_at,
      ].filter(Boolean);

      const latestUpdatedAt = updatedTimes.length
        ? Math.max(...updatedTimes) * 1000
        : Date.now();

      setCryptoRatesUpdatedAt(latestUpdatedAt);
    } catch (err) {
      console.error("fetchCryptoRates error:", err);

      setCryptoRates(null);
      setCryptoRatesUpdatedAt(null);

      const msg = err.message || t("withdrawals.unableLoadRates");
      setCryptoRateWarning(msg);
      toast.warning(msg);
    } finally {
      setCryptoRateBusy(false);
    }
  }

  useEffect(() => {
    if (tab === "withdrawals") {
      fetchWithdrawals();
    } else {
      fetchRecentAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, status]);

  useEffect(() => {
    if (!cryptoAddressModal.open) return;

    fetchCryptoRates();

    const timer = setInterval(() => {
      fetchCryptoRates();
    }, 60000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoAddressModal.open]);

  const filteredWithdrawals = useMemo(() => {
    let list = [...withdrawals];

    if (crypto !== "ALL") {
      list = list.filter((w) => String(w.cryptoType) === crypto);
    }

    const min = minAmount === "" ? null : Number(minAmount);
    const max = maxAmount === "" ? null : Number(maxAmount);

    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((w) => Number(w.amount || 0) >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((w) => Number(w.amount || 0) <= max);
    }

    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter((w) => {
        const id = String(w._id || "").toLowerCase();
        const addr = String(w.address || "").toLowerCase();
        const userUid = String(w?.user?.uid || "").toLowerCase();
        const phone = String(w?.user?.phoneNumber || "").toLowerCase();
        const c = String(w.cryptoType || "").toLowerCase();

        return (
          id.includes(s) ||
          addr.includes(s) ||
          userUid.includes(s) ||
          phone.includes(s) ||
          c.includes(s)
        );
      });
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [withdrawals, crypto, q, minAmount, maxAmount]);

  const filteredRecentAddresses = useMemo(() => {
    let list = [...recentAddresses];

    if (recentCrypto !== "ALL") {
      list = list.filter((x) => String(x.cryptoType) === recentCrypto);
    }

    const s = recentQ.trim().toLowerCase();
    if (s) {
      list = list.filter((x) => {
        const id = String(x._id || "").toLowerCase();
        const addr = String(x.address || "").toLowerCase();
        const uid = String(x?.user?.uid || "").toLowerCase();
        const phone = String(x?.user?.phoneNumber || "").toLowerCase();
        const c = String(x.cryptoType || "").toLowerCase();

        return (
          id.includes(s) ||
          addr.includes(s) ||
          uid.includes(s) ||
          phone.includes(s) ||
          c.includes(s)
        );
      });
    }

    list.sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt));
    return list;
  }, [recentAddresses, recentCrypto, recentQ]);

  const withdrawalStats = useMemo(() => {
    const total = filteredWithdrawals.length;

    const pending = filteredWithdrawals.filter((x) => x.status === "PENDING");
    const approved = filteredWithdrawals.filter((x) => x.status === "APPROVED");
    const rejected = filteredWithdrawals.filter((x) => x.status === "REJECTED");

    const sum = (arr) =>
      arr.reduce((acc, x) => acc + Number(x.amount || 0), 0);

    return {
      total,
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      pendingAmount: sum(pending),
      approvedAmount: sum(approved),
      rejectedAmount: sum(rejected),
    };
  }, [filteredWithdrawals]);

  const recentStats = useMemo(() => {
    const total = filteredRecentAddresses.length;
    const byCrypto = CRYPTO_OPTIONS.reduce((acc, type) => {
      acc[type] = filteredRecentAddresses.filter(
        (x) => x.cryptoType === type
      ).length;
      return acc;
    }, {});

    return {
      total,
      btc: byCrypto.BTC_MAINNET || 0,
      eth: byCrypto.ETH_ERC20 || 0,
      sol: byCrypto.SOL || 0,
      usdc: byCrypto.USDC_ERC20 || 0,
      usdt: byCrypto.USDT_TRC20 || 0,
    };
  }, [filteredRecentAddresses]);

  const activeList =
    tab === "withdrawals" ? filteredWithdrawals : filteredRecentAddresses;

  const pageCount = Math.max(1, Math.ceil(activeList.length / PER_PAGE));
  const pageSafe = Math.min(Math.max(1, page), pageCount);

  const pageItems = useMemo(() => {
    const start = (pageSafe - 1) * PER_PAGE;
    return activeList.slice(start, start + PER_PAGE);
  }, [activeList, pageSafe]);

  async function approveWithdrawal(id) {
    if (!id) return;
    const ok = confirm(t("withdrawals.confirmApprove"));
    if (!ok) return;

    setActionBusyId(id);
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/withdrawals/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || t("withdrawals.approveFailed"));

      toast.success(t("withdrawals.approvedSuccess"));
      await fetchWithdrawals();
    } catch (err) {
      console.error("approveWithdrawal error:", err);
      toast.error(err.message || t("withdrawals.approveFailed"));
    } finally {
      setActionBusyId(null);
    }
  }

  async function rejectWithdrawal(id) {
    if (!id) return;

    const note = prompt(t("withdrawals.rejectReasonPrompt"), "");
    const ok = confirm(t("withdrawals.confirmReject"));
    if (!ok) return;

    setActionBusyId(id);
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/withdrawals/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNote: note || "" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || t("withdrawals.rejectFailed"));

      toast.success(t("withdrawals.rejectedSuccess"));
      await fetchWithdrawals();
    } catch (err) {
      console.error("rejectWithdrawal error:", err);
      toast.error(err.message || t("withdrawals.rejectFailed"));
    } finally {
      setActionBusyId(null);
    }
  }

  function openEditModal(item) {
    setEditItem(item);
    setEditAddress(String(item?.address || ""));
    setEditCryptoType(String(item?.cryptoType || "BTC_MAINNET"));
    setEditOpen(true);
  }

  function closeEditModal() {
    if (saveBusy) return;
    setEditOpen(false);
    setEditItem(null);
    setEditAddress("");
    setEditCryptoType("BTC_MAINNET");
  }

  function openCryptoAddressModal(item) {
    const selectedMethod = String(item?.cryptoType || "");
    const address = String(item?.address || "").trim();

    if (!address) {
      toast.error(t("withdrawals.noWalletAddress"));
      return;
    }

    setCryptoAddressModal({
      open: true,
      item,
      address,
      method: selectedMethod,
    });
  }

  function closeCryptoAddressModal() {
    setCryptoAddressModal({
      open: false,
      item: null,
      address: "",
      method: "",
    });
  }

  async function saveRecentAddressEdit() {
    if (!editItem?._id) return;

    const cleanAddress = String(editAddress || "").trim();
    if (cleanAddress.length < 8) {
      toast.error(t("withdrawals.addressMinLength"));
      return;
    }

    setSaveBusy(true);
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `${API}/api/admin/recent-withdrawal-addresses/${editItem._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            address: cleanAddress,
            cryptoType: editCryptoType,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || t("withdrawals.updateFailed"));
      }

      toast.success(t("withdrawals.recentAddressUpdated"));
      closeEditModal();
      await fetchRecentAddresses();
    } catch (err) {
      console.error("saveRecentAddressEdit error:", err);
      toast.error(err.message || t("withdrawals.updateFailed"));
    } finally {
      setSaveBusy(false);
    }
  }

  async function deleteRecentAddress(id) {
    if (!id) return;

    const ok = confirm(t("withdrawals.confirmDeleteRecentAddress"));
    if (!ok) return;

    setActionBusyId(id);
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `${API}/api/admin/recent-withdrawal-addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || t("withdrawals.deleteFailed"));
      }

      toast.success(t("withdrawals.recentAddressDeleted"));
      await fetchRecentAddresses();
    } catch (err) {
      console.error("deleteRecentAddress error:", err);
      toast.error(err.message || t("withdrawals.deleteFailed"));
    } finally {
      setActionBusyId(null);
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      toast.success(t("withdrawals.copied"));
    } catch {
      toast.error(t("withdrawals.copyFailed"));
    }
  }

  function calculateCryptoReceive(eurAmount, method) {
    const eur = Number(eurAmount || 0);
    const rate = Number(cryptoRates?.[method]);

    if (!cryptoRates) return null;
    if (!Number.isFinite(eur) || eur <= 0) return null;
    if (!Number.isFinite(rate) || rate <= 0) return null;

    return eur / rate;
  }

  function formatCryptoReceive(eurAmount, method) {
    const value = calculateCryptoReceive(eurAmount, method);

    if (value === null) {
      return t("withdrawals.rateUnavailable");
    }

    return `${value.toFixed(cryptoDecimals(method))} ${cryptoSymbol(method)}`;
  }

  function formatCryptoRate(method) {
    const rate = Number(cryptoRates?.[method]);

    if (!cryptoRates || !Number.isFinite(rate) || rate <= 0) {
      return t("withdrawals.rateUnavailable");
    }

    return `€${rate.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <Shell title={t("withdrawals.title")}>
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className={`text-xs ${mutedText}`}>
            {t("withdrawals.subtitle")}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={tabWrapClass}>
              <button
                onClick={() => {
                  setTab("withdrawals");
                  setPage(1);
                }}
                className={[
                  "rounded-xl px-4 py-2 text-sm transition",
                  tab === "withdrawals"
                    ? theme === "dark"
                      ? "bg-white text-slate-900 font-semibold"
                      : "bg-gray-900 text-white font-semibold"
                    : theme === "dark"
                    ? "text-white/70 hover:bg-white/10"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")}
              >
                {t("withdrawals.withdrawals")}
              </button>

              <button
                onClick={() => {
                  setTab("recent-addresses");
                  setPage(1);
                }}
                className={[
                  "rounded-xl px-4 py-2 text-sm transition",
                  tab === "recent-addresses"
                    ? theme === "dark"
                      ? "bg-white text-slate-900 font-semibold"
                      : "bg-gray-900 text-white font-semibold"
                    : theme === "dark"
                    ? "text-white/70 hover:bg-white/10"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")}
              >
                {t("withdrawals.recentWithdrawalAddresses")}
              </button>
            </div>

            <button
              disabled={busy}
              onClick={() => {
                if (tab === "withdrawals") {
                  fetchWithdrawals();
                } else {
                  fetchRecentAddresses();
                }
              }}
              className={`${subtleButtonClass} disabled:opacity-50`}
            >
              {busy ? t("withdrawals.loading") : t("withdrawals.refresh")}
            </button>
          </div>
        </div>

        {tab === "withdrawals" ? (
          <>
            <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                theme={theme}
                title={t("withdrawals.total")}
                value={withdrawalStats.total}
                sub={`${t("withdrawals.showing")}: ${withdrawalStats.total}`}
              />
              <StatCard
                theme={theme}
                title={t("withdrawals.pending")}
                value={withdrawalStats.pendingCount}
                sub={`${t("withdrawals.amount")}: ${money(
                  withdrawalStats.pendingAmount
                )}`}
              />
              <StatCard
                theme={theme}
                title={t("withdrawals.approved")}
                value={withdrawalStats.approvedCount}
                sub={`${t("withdrawals.amount")}: ${money(
                  withdrawalStats.approvedAmount
                )}`}
              />
              <StatCard
                theme={theme}
                title={t("withdrawals.rejected")}
                value={withdrawalStats.rejectedCount}
                sub={`${t("withdrawals.amount")}: ${money(
                  withdrawalStats.rejectedAmount
                )}`}
              />
            </div>

            <div className={filterCardClass}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.search")}
                  </label>
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder={t("withdrawals.searchPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.cryptoType")}
                  </label>
                  <select
                    value={crypto}
                    onChange={(e) => {
                      setCrypto(e.target.value);
                      setPage(1);
                    }}
                    className={selectClass}
                  >
                    <option value="ALL">{t("withdrawals.all")}</option>
                    {CRYPTO_OPTIONS.map((x) => (
                      <option key={x} value={x}>
                        {cryptoLabel(x)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.statusServerFilter")}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                    className={selectClass}
                  >
                    <option value="ALL">{t("withdrawals.allCaps")}</option>
                    <option value="PENDING">{t("withdrawals.pendingCaps")}</option>
                    <option value="APPROVED">{t("withdrawals.approvedCaps")}</option>
                    <option value="REJECTED">{t("withdrawals.rejectedCaps")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-4">
                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.minAmount")}
                  </label>
                  <input
                    value={minAmount}
                    onChange={(e) => {
                      setMinAmount(e.target.value);
                      setPage(1);
                    }}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.maxAmount")}
                  </label>
                  <input
                    value={maxAmount}
                    onChange={(e) => {
                      setMaxAmount(e.target.value);
                      setPage(1);
                    }}
                    placeholder="999999"
                    className={inputClass}
                  />
                </div>

                <div className="flex items-end justify-end gap-2 md:col-span-2">
                  <button
                    onClick={() => {
                      setQ("");
                      setCrypto("ALL");
                      setMinAmount("");
                      setMaxAmount("");
                      setPage(1);
                    }}
                    className={subtleButtonClass}
                  >
                    {t("withdrawals.clearFilters")}
                  </button>
                </div>
              </div>
            </div>

            <div className={tableWrapClass}>
              <div className={tableHeaderBarClass}>
                <div className={`font-semibold ${strongText}`}>
                  {t("withdrawals.withdrawals")} ({filteredWithdrawals.length})
                </div>
                <div className={`text-xs ${mutedText}`}>
                  {t("withdrawals.page")} {pageSafe} / {pageCount}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className={tableHeadClass}>
                    <tr>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.date")}</th>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.user")}</th>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.balance")}</th>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.amount")}</th>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.crypto")}</th>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.address")}</th>
                      <th className="px-4 py-3 font-normal">{t("withdrawals.status")}</th>
                      <th className="px-4 py-3 text-right font-normal">{t("withdrawals.actions")}</th>
                    </tr>
                  </thead>

                  <tbody className={tableBodyClass}>
                    {pageItems.map((w) => {
                      const isPending = w.status === "PENDING";
                      const acting = actionBusyId === w._id;

                      return (
                        <tr key={w._id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={strongText}>{fmtDate(w.createdAt)}</div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={strongText}>
                              {w?.user?.uid || t("withdrawals.unknown")}
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`font-normal ${strongText}`}>
                              {w.balanceAfter === null || w.balanceAfter === undefined
                                ? "-"
                                : balanceMoney(w.balanceAfter)}
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`font-normal ${strongText}`}>
                              {money(w.amount)}
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={strongText}>
                              {cryptoLabel(w.cryptoType)}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`max-w-[320px] truncate ${strongText}`}>
                                {w.address}
                              </div>

                              <button
                                onClick={() => openCryptoAddressModal(w)}
                                className={`inline-flex items-center justify-center rounded-xl p-2 ${
                                  theme === "dark"
                                    ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
                                    : "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                                }`}
                                title={t("withdrawals.viewQrCopyAddress")}
                              >
                                <QrCode className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => copy(w.address)}
                                className={`inline-flex items-center justify-center rounded-xl p-2 ${
                                  theme === "dark"
                                    ? "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                                title={t("withdrawals.copyAddress")}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            {w.adminNote ? (
                              <div className={`mt-1 text-xs ${mutedText}`}>
                                {t("withdrawals.note")}: {w.adminNote}
                              </div>
                            ) : null}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
                                badgeClasses(w.status),
                              ].join(" ")}
                            >
                              {w.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => approveWithdrawal(w._id)}
                                disabled={!isPending || acting}
                                className={`rounded-xl px-3 py-2 text-sm font-semibold disabled:opacity-50 ${
                                  theme === "dark"
                                    ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20"
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {acting && isPending ? "..." : t("withdrawals.approve")}
                              </button>

                              <button
                                onClick={() => rejectWithdrawal(w._id)}
                                disabled={!isPending || acting}
                                className={subtleButtonClass + " disabled:opacity-50"}
                              >
                                {t("withdrawals.reject")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {!busy && pageItems.length === 0 ? (
                      <tr>
                        <td
                          className={`px-4 py-10 text-center ${mutedText}`}
                          colSpan={8}
                        >
                          {t("withdrawals.noWithdrawalsFound")}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                theme={theme}
                title={t("withdrawals.totalRecords")}
                value={recentStats.total}
                sub={t("withdrawals.recentAddressRecords")}
              />
              <StatCard
                theme={theme}
                title="BTC / ETH"
                value={`${recentStats.btc} / ${recentStats.eth}`}
                sub="Bitcoin / Ethereum"
              />
              <StatCard
                theme={theme}
                title="SOL / USDC"
                value={`${recentStats.sol} / ${recentStats.usdc}`}
                sub="Solana / USDC"
              />
              <StatCard
                theme={theme}
                title="USDT"
                value={recentStats.usdt}
                sub="USDT (TRC20)"
              />
            </div>

            <div className={filterCardClass}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="md:col-span-3">
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.search")}
                  </label>
                  <input
                    value={recentQ}
                    onChange={(e) => {
                      setRecentQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder={t("withdrawals.searchPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.cryptoType")}
                  </label>
                  <select
                    value={recentCrypto}
                    onChange={(e) => {
                      setRecentCrypto(e.target.value);
                      setPage(1);
                    }}
                    className={selectClass}
                  >
                    <option value="ALL">{t("withdrawals.all")}</option>
                    {CRYPTO_OPTIONS.map((x) => (
                      <option key={x} value={x}>
                        {cryptoLabel(x)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setRecentQ("");
                    setRecentCrypto("ALL");
                    setPage(1);
                  }}
                  className={subtleButtonClass}
                >
                  {t("withdrawals.clearFilters")}
                </button>
              </div>
            </div>

            <div className={tableWrapClass}>
              <div className={tableHeaderBarClass}>
                <div className={`font-semibold ${strongText}`}>
                  {t("withdrawals.recentWithdrawalAddresses")} (
                  {filteredRecentAddresses.length})
                </div>
                <div className={`text-xs ${mutedText}`}>
                  {t("withdrawals.page")} {pageSafe} / {pageCount}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-normal">
                  <thead className={tableHeadClass}>
                    <tr>
                      <th className="px-4 py-3">{t("withdrawals.lastUsed")}</th>
                      <th className="px-4 py-3">{t("withdrawals.user")}</th>
                      <th className="px-4 py-3">{t("withdrawals.crypto")}</th>
                      <th className="px-4 py-3">{t("withdrawals.address")}</th>
                      <th className="px-4 py-3 text-right">
                        {t("withdrawals.actions")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className={tableBodyClass}>
                    {pageItems.map((item) => {
                      const acting = actionBusyId === item._id;

                      return (
                        <tr key={item._id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={strongText}>
                              {fmtDate(item.lastUsedAt)}
                            </div>
                            <div className={`text-xs ${mutedText}`}>
                              {shortId(item._id)}
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={strongText}>
                              {item?.user?.uid || t("withdrawals.unknown")}
                            </div>
                            <div className={`text-xs ${mutedText}`}>
                              {item?.user?.phoneNumber || "-"}
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={strongText}>
                              {cryptoLabel(item.cryptoType)}
                            </div>
                            <div className={`text-xs ${mutedText}`}>
                              {item.cryptoType}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`max-w-[360px] truncate ${strongText}`}>
                                {item.address}
                              </div>

                              <button
                                onClick={() => openCryptoAddressModal(item)}
                                className={`inline-flex items-center justify-center rounded-xl p-2 ${
                                  theme === "dark"
                                    ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
                                    : "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                                }`}
                                title={t("withdrawals.viewQrCopyAddress")}
                              >
                                <QrCode className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => copy(item.address)}
                                className={`inline-flex items-center justify-center rounded-xl p-2 ${
                                  theme === "dark"
                                    ? "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                                title={t("withdrawals.copyAddress")}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                disabled={acting}
                                className={subtleButtonClass + " disabled:opacity-50"}
                              >
                                {t("withdrawals.edit")}
                              </button>

                              <button
                                onClick={() => deleteRecentAddress(item._id)}
                                disabled={acting}
                                className={subtleButtonClass + " disabled:opacity-50"}
                              >
                                {acting ? "..." : t("withdrawals.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {!busy && pageItems.length === 0 ? (
                      <tr>
                        <td
                          className={`px-4 py-10 text-center ${mutedText}`}
                          colSpan={5}
                        >
                          {t("withdrawals.noRecentAddressesFound")}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <div
          className={`mt-5 flex flex-col gap-3 px-1 py-3 sm:flex-row sm:items-center sm:justify-between ${
            theme === "dark" ? "border-t border-white/10" : "border-t border-gray-200"
          }`}
        >
          <div className={`text-xs ${mutedText}`}>
            {t("withdrawals.showing")}{" "}
            <span className={`font-semibold ${strongText}`}>
              {(pageSafe - 1) * PER_PAGE + (pageItems.length ? 1 : 0)}
            </span>{" "}
            -{" "}
            <span className={`font-semibold ${strongText}`}>
              {(pageSafe - 1) * PER_PAGE + pageItems.length}
            </span>{" "}
            {t("withdrawals.of")}{" "}
            <span className={`font-semibold ${strongText}`}>
              {activeList.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={pageSafe === 1}
              className={subtleButtonClass + " disabled:opacity-50"}
            >
              {t("withdrawals.first")}
            </button>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
              className={subtleButtonClass + " disabled:opacity-50"}
            >
              {t("withdrawals.prev")}
            </button>

            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={pageSafe === pageCount}
              className={subtleButtonClass + " disabled:opacity-50"}
            >
              {t("withdrawals.next")}
            </button>

            <button
              onClick={() => setPage(pageCount)}
              disabled={pageSafe === pageCount}
              className={subtleButtonClass + " disabled:opacity-50"}
            >
              {t("withdrawals.last")}
            </button>
          </div>
        </div>

        {editOpen ? (
          <div className={modalOverlayClass}>
            <div className={modalCardClass}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${strongText}`}>
                    {t("withdrawals.editRecentAddress")}
                  </h3>
                  <p className={`mt-1 text-xs ${mutedText}`}>
                    {t("withdrawals.editRecentAddressDesc")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className={subtleButtonClass}
                >
                  {t("withdrawals.close")}
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.cryptoType")}
                  </label>
                  <select
                    value={editCryptoType}
                    onChange={(e) => setEditCryptoType(e.target.value)}
                    className={selectClass}
                  >
                    {CRYPTO_OPTIONS.map((x) => (
                      <option key={x} value={x}>
                        {cryptoLabel(x)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs ${mutedText}`}>
                    {t("withdrawals.walletAddress")}
                  </label>
                  <textarea
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saveBusy}
                  className={subtleButtonClass + " disabled:opacity-50"}
                >
                  {t("withdrawals.cancel")}
                </button>

                <button
                  type="button"
                  onClick={saveRecentAddressEdit}
                  disabled={saveBusy}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                    theme === "dark"
                      ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20"
                      : "border border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {saveBusy ? t("withdrawals.saving") : t("withdrawals.save")}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {cryptoAddressModal.open ? (
          <div className={modalOverlayClass}>
            <div
              className={
                theme === "dark"
                  ? "my-4 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#071120] shadow-[0_30px_90px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.03]"
                  : "my-4 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl"
              }
            >
              <div
                className={`px-4 py-4 sm:px-6 sm:py-5 ${
                  theme === "dark"
                    ? "border-b border-white/10"
                    : "border-b border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        theme === "dark"
                          ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                          : "border border-cyan-200 bg-white/80 text-cyan-700"
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {t("withdrawals.cryptoWithdrawalAddress")}
                    </div>

                    <h3 className={`mt-4 text-lg font-bold sm:text-xl ${strongText}`}>
                      {t("withdrawals.scanOrCopy")}
                    </h3>

                    <p className={`mt-2 text-xs leading-5 ${mutedText}`}>
                      {t("withdrawals.verifyBeforeApprove")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeCryptoAddressModal}
                    className={`rounded-2xl p-2 transition ${
                      theme === "dark"
                        ? "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[170px_1fr] sm:items-start">
                  <div className="mx-auto w-full max-w-[170px] sm:mx-0">
                    <div
                      className={
                        theme === "dark"
                          ? "rounded-[28px] border border-white/10 bg-white p-4"
                          : "rounded-[28px] border border-gray-200 bg-white p-4"
                      }
                    >
                      <div className="flex aspect-square items-center justify-center rounded-3xl bg-white">
                        <QRCodeSVG
                          value={cryptoAddressModal.address}
                          size={130}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 content-start sm:grid-cols-1">
                    <div
                      className={
                        theme === "dark"
                          ? "rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
                          : "rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                      }
                    >
                      <div className={`text-[11px] ${mutedText}`}>
                        {t("withdrawals.network")}
                      </div>
                      <div
                        className={`mt-1 break-words text-sm font-semibold ${strongText}`}
                      >
                        {cryptoLabel(cryptoAddressModal.method)}
                      </div>
                    </div>

                    <div
                      className={
                        theme === "dark"
                          ? "rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
                          : "rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                      }
                    >
                      <div className={`text-[11px] ${mutedText}`}>
                        {t("withdrawals.userUid")}
                      </div>
                      <div
                        className={`mt-1 break-words text-sm font-semibold ${strongText}`}
                      >
                        {cryptoAddressModal.item?.user?.uid ||
                          t("withdrawals.unknown")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 min-[430px]:grid-cols-3">
                  <div
                    className={
                      theme === "dark"
                        ? "rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                        : "rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    }
                  >
                    <div className={`text-[11px] ${mutedText}`}>
                      {t("withdrawals.amount")}
                    </div>
                    <div
                      className={`mt-1 break-words text-sm font-semibold sm:text-base ${strongText}`}
                    >
                      €{balanceMoney(cryptoAddressModal.item?.amount)}
                    </div>
                  </div>

                  <div
                    className={
                      theme === "dark"
                        ? "rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                        : "rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    }
                  >
                    <div className={`text-[11px] ${mutedText}`}>
                      {t("withdrawals.liveRate")}
                    </div>
                    <div
                      className={`mt-1 break-words text-sm font-semibold sm:text-base ${strongText}`}
                    >
                      {cryptoRateBusy
                        ? t("withdrawals.loadingRate")
                        : formatCryptoRate(cryptoAddressModal.method)}
                    </div>
                  </div>

                  <div
                    className={
                      theme === "dark"
                        ? "rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                        : "rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    }
                  >
                    <div className={`text-[11px] ${mutedText}`}>
                      {t("withdrawals.estimated")}
                    </div>
                    <div
                      className={`mt-1 break-words text-sm font-semibold sm:text-base ${strongText}`}
                    >
                      {cryptoRateBusy
                        ? t("withdrawals.loading")
                        : formatCryptoReceive(
                            cryptoAddressModal.item?.amount,
                            cryptoAddressModal.method
                          )}
                    </div>
                  </div>
                </div>

                {cryptoRateWarning ? (
                  <div
                    className={
                      theme === "dark"
                        ? "mt-3 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[11px] leading-4 text-amber-100"
                        : "mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-4 text-amber-800"
                    }
                  >
                    {cryptoRateWarning}
                  </div>
                ) : null}

                {cryptoRatesUpdatedAt ? (
                  <div className={`mt-2 text-[11px] ${mutedText}`}>
                    {t("withdrawals.updated")}: {fmtDate(cryptoRatesUpdatedAt)}
                  </div>
                ) : null}

                <div className="mt-5">
                  <div className={`mb-2 text-xs font-medium ${mutedText}`}>
                    {t("withdrawals.walletAddress")}
                  </div>

                  <div
                    className={
                      theme === "dark"
                        ? "flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between"
                        : "flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    }
                  >
                    <div
                      className={`break-all text-xs font-semibold leading-5 ${strongText}`}
                    >
                      {cryptoAddressModal.address}
                    </div>

                    <button
                      type="button"
                      onClick={() => copy(cryptoAddressModal.address)}
                      className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold ${
                        theme === "dark"
                          ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                          : "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {t("withdrawals.copy")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
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
      <div className={`mt-2 text-2xl font-bold ${strongText}`}>{value}</div>
      <div className={`mt-1 text-xs ${mutedText}`}>{sub}</div>
    </div>
  );
}