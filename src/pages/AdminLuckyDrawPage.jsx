import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

function money(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "0";
  return num.toFixed(0);
}

function badgeClasses(statusText, theme) {
  if (theme === "dark") {
    return "bg-white/10 border-white/10 text-white/80";
  }
  return "bg-gray-100 border-gray-300 text-gray-700";
}

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onMouseDown={(e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) {
          onClose?.();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        ref={cardRef}
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${
          theme === "dark"
            ? "border border-white/10 bg-[#0b1220]/95"
            : "border border-gray-200 bg-white"
        }`}
      >
        <div
          className={`flex items-start justify-between gap-3 px-5 py-4 ${
            theme === "dark"
              ? "border-b border-white/10"
              : "border-b border-gray-200"
          }`}
        >
          <div>
            <div
              className={`text-base font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </div>

            {subtitle ? (
              <div
                className={`mt-1 text-xs ${
                  theme === "dark" ? "text-white/50" : "text-gray-500"
                }`}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className={`rounded-xl px-2.5 py-2 text-xs ${
              theme === "dark"
                ? "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5 pt-4">{children}</div>

        {footer ? (
          <div
            className={`px-5 py-4 ${
              theme === "dark"
                ? "border-t border-white/10 bg-white/5"
                : "border-t border-gray-200 bg-gray-50"
            }`}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminLuckyDrawPage() {
  const [params] = useSearchParams();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const softText = theme === "dark" ? "text-white/70" : "text-gray-600";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  const cardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 p-5"
      : "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";

  const inputClass =
    theme === "dark"
      ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
      : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400";

  const selectClass =
    theme === "dark"
      ? "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 outline-none hover:bg-white/10"
      : "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none hover:bg-gray-50";

  const buttonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 hover:bg-white/10"
      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

  const primaryButtonClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs text-white/85 hover:bg-white/15"
      : "rounded-xl border border-gray-900 bg-gray-900 px-4 py-2 text-xs text-white hover:bg-gray-800";

  const drawerClass =
    theme === "dark"
      ? "fixed right-0 top-0 z-[999] h-full w-full max-w-md border-l border-white/10 bg-[#0B1220] shadow-2xl"
      : "fixed right-0 top-0 z-[999] h-full w-full max-w-md border-l border-gray-200 bg-white shadow-2xl";

  const [uid, setUid] = useState("");
  const [triggerCount, setTriggerCount] = useState("");
  const [rewardType, setRewardType] = useState("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [title, setTitle] = useState("Diamond Mystery Gift");
  const [description, setDescription] = useState(
    "Pick 1 diamond and win your reward"
  );
  const [currentOrder, setCurrentOrder] = useState(0);

  const [poolOrders, setPoolOrders] = useState([]);
  const [poolOrderId, setPoolOrderId] = useState("");
  const [selectedPoolOrder, setSelectedPoolOrder] = useState(null);
  const [bonusCommissionRateOverride, setBonusCommissionRateOverride] =
    useState("");

  const [busy, setBusy] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [rules, setRules] = useState([]);
  const [listBusy, setListBusy] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    mode: null,
    ruleId: null,
    busy: false,
  });

  useEffect(() => {
    const qUid = params.get("uid") || params.get("userId");
    const qCurrentOrder = params.get("currentOrder");

    if (qUid) setUid(qUid);

    if (qCurrentOrder !== null) {
      const parsed = Number(qCurrentOrder);
      setCurrentOrder(Number.isFinite(parsed) ? parsed : 0);
    } else {
      setCurrentOrder(0);
    }
  }, [params]);

  async function fetchPoolOrders() {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/admin/orders/pool/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) setPoolOrders(data.orders || []);
    } catch (e) {
      console.error("fetchPoolOrders error:", e);
    }
  }

  async function fetchLuckyDrawRules(uId) {
    if (!uId) {
      setRules([]);
      return;
    }

    try {
      setListBusy(true);

      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/lucky-draw/user/${uId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || t("luckyDraw.failedFetchRules"));
      }

      setRules(data?.rules || []);
    } catch (err) {
      console.error("fetchLuckyDrawRules error:", err);
      setRules([]);
      toast.error(err.message || t("luckyDraw.failedFetchRules"));
    } finally {
      setListBusy(false);
    }
  }

  useEffect(() => {
    fetchPoolOrders();
  }, []);

  useEffect(() => {
    if (uid) fetchLuckyDrawRules(uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const filteredOrders = useMemo(() => {
    let list = [...poolOrders].filter((o) => o.isActive);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const name = String(o.orderName || "").toLowerCase();
        const num = String(o.orderNumber || "").toLowerCase();
        return name.includes(q) || num.includes(q);
      });
    }

    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((o) => Number(o.price || 0) >= min);
    }

    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((o) => Number(o.price || 0) <= max);
    }

    list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    return list;
  }, [poolOrders, search, minPrice, maxPrice]);

  const visibleOrders = useMemo(() => {
    return filteredOrders.slice(0, 100);
  }, [filteredOrders]);

  function openPicker() {
    setPickerOpen(true);
  }

  function closePicker() {
    setPickerOpen(false);
  }

  function chooseOrder(order) {
    setPoolOrderId(order._id);
    setSelectedPoolOrder(order);
    closePicker();
  }

  async function saveLuckyDrawRule(e) {
    e.preventDefault();

    if (!uid || !triggerCount || !rewardType) {
      toast.error(t("luckyDraw.fillRequired"));
      return;
    }

    if (rewardType === "cash") {
      const amt = Number(cashAmount);
      if (!Number.isFinite(amt) || amt <= 0) {
        toast.error(t("luckyDraw.validCashAmount"));
        return;
      }
    }

    if (rewardType === "bonus_order" && !poolOrderId) {
      toast.error(t("luckyDraw.chooseBonusOrder"));
      return;
    }

    if (
      rewardType === "bonus_order" &&
      String(bonusCommissionRateOverride).trim() !== ""
    ) {
      const rate = Number(bonusCommissionRateOverride);

      if (!Number.isFinite(rate) || rate < 0) {
        toast.error(t("luckyDraw.rateNumberAboveZero"));
        return;
      }

      if (rate > 1) {
        toast.error(t("luckyDraw.useDecimalFormat"));
        return;
      }
    }

    setBusy(true);

    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/lucky-draw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid,
          triggerCount: Number(triggerCount),
          rewardType,
          cashAmount: rewardType === "cash" ? Number(cashAmount) : 0,
          poolOrderId: rewardType === "bonus_order" ? poolOrderId : null,
          bonusCommissionRateOverride:
            rewardType === "bonus_order" &&
            String(bonusCommissionRateOverride).trim() !== ""
              ? Number(bonusCommissionRateOverride)
              : null,
          title,
          description,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        toast.success(t("luckyDraw.ruleSaved"));
        setTriggerCount("");
        setCashAmount("");
        setPoolOrderId("");
        setSelectedPoolOrder(null);
        setBonusCommissionRateOverride("");
        fetchLuckyDrawRules(uid);
      } else {
        toast.error(data.message || t("luckyDraw.failedSaveRule"));
      }
    } catch (e) {
      console.error("saveLuckyDrawRule error:", e);
      toast.error(t("luckyDraw.serverErrorSaving"));
    } finally {
      setBusy(false);
    }
  }

  function openConfirmModal(mode, ruleId) {
    setConfirmModal({
      open: true,
      mode,
      ruleId,
      busy: false,
    });
  }

  function closeConfirmModal() {
    if (confirmModal.busy) return;

    setConfirmModal({
      open: false,
      mode: null,
      ruleId: null,
      busy: false,
    });
  }

  async function disableLuckyDrawRuleItem(ruleId) {
    try {
      setConfirmModal((prev) => ({ ...prev, busy: true }));

      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/lucky-draw/${ruleId}/disable`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || t("luckyDraw.failedDisableRule"));
      }

      toast.success(t("luckyDraw.ruleDisabled"));
      closeConfirmModal();
      fetchLuckyDrawRules(uid);
    } catch (err) {
      console.error("disableLuckyDrawRuleItem error:", err);
      toast.error(err.message || t("luckyDraw.failedDisableRule"));
      setConfirmModal((prev) => ({ ...prev, busy: false }));
    }
  }

  async function deleteLuckyDrawRuleItem(ruleId) {
    try {
      setConfirmModal((prev) => ({ ...prev, busy: true }));

      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${API}/api/admin/lucky-draw/${ruleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || t("luckyDraw.failedDeleteRule"));
      }

      toast.success(t("luckyDraw.ruleDeleted"));
      closeConfirmModal();
      fetchLuckyDrawRules(uid);
    } catch (err) {
      console.error("deleteLuckyDrawRuleItem error:", err);
      toast.error(err.message || t("luckyDraw.failedDeleteRule"));
      setConfirmModal((prev) => ({ ...prev, busy: false }));
    }
  }

  async function handleConfirmAction() {
    if (!confirmModal.ruleId) return;

    if (confirmModal.mode === "disable") {
      await disableLuckyDrawRuleItem(confirmModal.ruleId);
      return;
    }

    if (confirmModal.mode === "delete") {
      await deleteLuckyDrawRuleItem(confirmModal.ruleId);
    }
  }

  function getRealStatus(rule) {
    if (!rule?.isActive) return "DISABLED";
    if (rule?.claimedAt) return "CLAIMED";
    return "ACTIVE";
  }

  function translatedStatus(status) {
    if (status === "DISABLED") return t("luckyDraw.disabledStatus");
    if (status === "CLAIMED") return t("luckyDraw.claimedStatus");
    return t("luckyDraw.activeStatus");
  }

  return (
    <Shell title={t("luckyDraw.title")}>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <div className={`text-sm font-semibold ${strongText}`}>
            {t("luckyDraw.assignTitle")}
          </div>
          <div className={`mt-1 text-xs ${mutedText}`}>
            {t("luckyDraw.assignSubtitle")}
          </div>

          <form onSubmit={saveLuckyDrawRule} className="mt-4 space-y-3">
            <div>
              <div className={`text-xs ${softText}`}>UID</div>
              <input
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder={t("luckyDraw.uidPlaceholder")}
                className={inputClass}
                required
              />
            </div>

            <div
              className={`rounded-xl px-3 py-3 text-xs ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-white/80"
                  : "border border-gray-200 bg-gray-50 text-gray-800"
              }`}
            >
              <span className={softText}>
                {t("luckyDraw.userCurrentOrder")}:
              </span>{" "}
              <span className={`font-semibold ${strongText}`}>
                {currentOrder}
              </span>
            </div>

            <div>
              <div className={`text-xs ${softText}`}>
                {t("luckyDraw.triggerOrderCount")}
              </div>
              <input
                value={triggerCount}
                onChange={(e) => setTriggerCount(e.target.value)}
                type="number"
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <div className={`text-xs ${softText}`}>
                {t("luckyDraw.popupTitle")}
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <div className={`text-xs ${softText}`}>
                {t("luckyDraw.popupDescription")}
              </div>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("luckyDraw.descriptionPlaceholder")}
                className={inputClass}
              />
            </div>

            <div>
              <div className={`text-xs ${softText}`}>
                {t("luckyDraw.rewardType")}
              </div>
              <select
                value={rewardType}
                onChange={(e) => {
                  const next = e.target.value;
                  setRewardType(next);

                  if (next === "cash") {
                    setPoolOrderId("");
                    setSelectedPoolOrder(null);
                    setBonusCommissionRateOverride("");
                  } else {
                    setCashAmount("");
                  }
                }}
                className={selectClass}
              >
                <option value="cash">{t("luckyDraw.cashReward")}</option>
                <option value="bonus_order">
                  {t("luckyDraw.bonusOrder")}
                </option>
              </select>
            </div>

            {rewardType === "cash" ? (
              <div>
                <div className={`text-xs ${softText}`}>
                  {t("luckyDraw.cashAmount")}
                </div>
                <input
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  type="number"
                  min="0"
                  className={inputClass}
                  placeholder={t("luckyDraw.cashAmountPlaceholder")}
                  required
                />
              </div>
            ) : (
              <div>
                <div className={`text-xs ${softText}`}>
                  {t("luckyDraw.selectBonusOrder")}
                </div>

                <button
                  type="button"
                  onClick={openPicker}
                  className={`mt-2 w-full rounded-xl border px-3 py-2 text-left text-xs ${
                    theme === "dark"
                      ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {selectedPoolOrder ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className={`font-semibold ${strongText}`}>
                        {selectedPoolOrder.orderName}{" "}
                        <span className={mutedText}>
                          ({selectedPoolOrder.orderNumber})
                        </span>
                      </div>
                      <div className={mutedText}>
                        {t("luckyDraw.price")}: {money(selectedPoolOrder.price)}
                      </div>
                    </div>
                  ) : (
                    t("luckyDraw.clickChooseOrder")
                  )}
                </button>

                <input value={poolOrderId} readOnly className="hidden" required />

                <div className="mt-3">
                  <div className={`text-xs ${softText}`}>
                    {t("luckyDraw.bonusOrderCommissionRate")}
                  </div>

                  <input
                    value={bonusCommissionRateOverride}
                    onChange={(e) =>
                      setBonusCommissionRateOverride(e.target.value)
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t("luckyDraw.ratePlaceholder")}
                    className={inputClass}
                  />

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBonusCommissionRateOverride("0.15")}
                      className={buttonClass}
                    >
                      15%
                    </button>

                    <button
                      type="button"
                      onClick={() => setBonusCommissionRateOverride("0.10")}
                      className={buttonClass}
                    >
                      10%
                    </button>
                  </div>

                  <div className={`mt-2 text-[11px] ${mutedText}`}>
                    {t("luckyDraw.decimalFormatTip")}
                  </div>
                </div>
              </div>
            )}

            <button
              disabled={busy}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {busy ? t("luckyDraw.saving") : t("luckyDraw.saveRule")}
            </button>
          </form>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-semibold ${strongText}`}>
                {t("luckyDraw.savedRules")}
              </div>
              <div className={`mt-1 text-xs ${mutedText}`}>
                {t("luckyDraw.savedRulesSubtitle")}
              </div>
            </div>

            <button onClick={() => fetchLuckyDrawRules(uid)} className={buttonClass}>
              {t("luckyDraw.refresh")}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {listBusy && (
              <div
                className={`rounded-xl px-3 py-3 text-xs ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5 text-white/60"
                    : "border border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                {t("luckyDraw.loadingRules")}
              </div>
            )}

            {!listBusy && rules.length === 0 && (
              <div
                className={`rounded-xl px-3 py-3 text-xs ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5 text-white/60"
                    : "border border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                {t("luckyDraw.noRules")}
              </div>
            )}

            {!listBusy &&
              rules.map((r) => {
                const realStatus = getRealStatus(r);

                return (
                  <div
                    key={r._id}
                    className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 ${
                      theme === "dark"
                        ? "border border-white/10 bg-white/5"
                        : "border border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-semibold ${strongText}`}>
                        {t("luckyDraw.triggerAtOrder")} {r.triggerCount}
                      </div>

                      <div
                        className={`mt-1 flex flex-wrap items-center gap-2 text-[11px] ${mutedText}`}
                      >
                        <span>
                          {t("luckyDraw.reward")}:{" "}
                          {r.rewardType === "cash"
                            ? `${t("luckyDraw.cash")} ${money(r.cashAmount)}`
                            : `${r.poolOrder?.orderName || t("luckyDraw.unknownOrder")} (${
                                r.poolOrder?.orderNumber || "?"
                              })`}
                        </span>

                        {r.rewardType === "bonus_order" ? (
                          <>
                            <span>•</span>
                            <span>
                              {t("luckyDraw.rate")}:{" "}
                              <span className={strongText}>
                                {r.bonusCommissionRateOverride == null
                                  ? t("luckyDraw.globalRate")
                                  : `${(
                                      Number(r.bonusCommissionRateOverride) *
                                      100
                                    ).toFixed(2)}%`}
                              </span>
                            </span>
                          </>
                        ) : null}

                        <span>•</span>

                        <span>
                          {t("luckyDraw.rule")}:{" "}
                          <span className={strongText}>
                            {r.isActive ? t("luckyDraw.on") : t("luckyDraw.off")}
                          </span>
                        </span>

                        <span>•</span>

                        <span>
                          {t("luckyDraw.claimed")}:{" "}
                          <span className={strongText}>
                            {r.claimedAt ? t("luckyDraw.yes") : t("luckyDraw.no")}
                          </span>
                        </span>

                        {r.selectedEggIndex !== null &&
                        r.selectedEggIndex !== undefined ? (
                          <>
                            <span>•</span>
                            <span>
                              {t("luckyDraw.pickedEgg")}:{" "}
                              <span className={strongText}>
                                {Number(r.selectedEggIndex) + 1}
                              </span>
                            </span>
                          </>
                        ) : null}
                      </div>

                      <div className={`mt-1 text-[11px] ${softText}`}>
                        {t("luckyDraw.ruleTitle")}: {r.title || "Lucky Draw"}
                      </div>

                      <div className={`mt-1 text-[11px] ${mutedText}`}>
                        {r.claimedAt
                          ? `${t("luckyDraw.claimedAt")}: ${new Date(
                              r.claimedAt
                            ).toLocaleString()}`
                          : t("luckyDraw.notClaimedYet")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] ${badgeClasses(
                          realStatus,
                          theme
                        )}`}
                      >
                        {translatedStatus(realStatus)}
                      </span>

                      {r.isActive && !r.claimedAt && (
                        <button
                          onClick={() => openConfirmModal("disable", r._id)}
                          className={buttonClass}
                        >
                          {t("luckyDraw.disable")}
                        </button>
                      )}

                      <button
                        onClick={() => openConfirmModal("delete", r._id)}
                        className={buttonClass}
                      >
                        {t("luckyDraw.delete")}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {pickerOpen && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-black/50"
            onClick={closePicker}
          />

          <div className={drawerClass}>
            <div className="flex h-full flex-col">
              <div
                className={`flex items-start justify-between gap-3 p-5 ${
                  theme === "dark"
                    ? "border-b border-white/10"
                    : "border-b border-gray-200"
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${strongText}`}>
                    {t("luckyDraw.selectBonusOrder")}
                  </div>
                  <div className={`mt-1 text-xs ${mutedText}`}>
                    {t("luckyDraw.drawerSubtitle")}
                  </div>
                </div>

                <button onClick={closePicker} className={buttonClass}>
                  ✕
                </button>
              </div>

              <div
                className={`p-5 ${
                  theme === "dark"
                    ? "border-b border-white/10"
                    : "border-b border-gray-200"
                }`}
              >
                <div className="space-y-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("luckyDraw.searchNameNumber")}
                    className={
                      theme === "dark"
                        ? "w-full rounded-xl border border-white/10 bg-[#121B2D] px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
                        : "w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400"
                    }
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder={t("luckyDraw.minPrice")}
                      type="text"
                      inputMode="numeric"
                      className={
                        theme === "dark"
                          ? "w-full rounded-xl border border-white/10 bg-[#121B2D] px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
                          : "w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400"
                      }
                    />

                    <input
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder={t("luckyDraw.maxPrice")}
                      type="text"
                      inputMode="numeric"
                      className={
                        theme === "dark"
                          ? "w-full rounded-xl border border-white/10 bg-[#121B2D] px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
                          : "w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bonus-drawer-scroll flex-1 overflow-auto space-y-2 p-5">
                {filteredOrders.length > 100 && (
                  <div
                    className={`rounded-xl px-3 py-3 text-xs ${
                      theme === "dark"
                        ? "border border-white/10 bg-white/5 text-white/60"
                        : "border border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {t("luckyDraw.showingFirst100", {
                      count: filteredOrders.length,
                    })}
                  </div>
                )}

                {filteredOrders.length === 0 && (
                  <div
                    className={`rounded-xl px-3 py-3 text-xs ${
                      theme === "dark"
                        ? "border border-white/10 bg-white/5 text-white/60"
                        : "border border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {t("luckyDraw.noActivePoolOrders")}
                  </div>
                )}

                {visibleOrders.map((o) => (
                  <button
                    key={o._id}
                    onClick={() => chooseOrder(o)}
                    className={`block w-full rounded-xl border px-3 py-3 text-left ${
                      theme === "dark"
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`text-xs font-semibold ${strongText}`}>
                      {o.orderName}{" "}
                      <span className={mutedText}>({o.orderNumber})</span>
                    </div>
                    <div className={`mt-1 text-[11px] ${mutedText}`}>
                      {t("luckyDraw.price")}: {money(o.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        open={confirmModal.open}
        title={
          confirmModal.mode === "delete"
            ? t("luckyDraw.deleteRuleTitle")
            : t("luckyDraw.disableRuleTitle")
        }
        subtitle={
          confirmModal.mode === "delete"
            ? t("luckyDraw.deleteRuleSubtitle")
            : t("luckyDraw.disableRuleSubtitle")
        }
        onClose={closeConfirmModal}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={closeConfirmModal}
              disabled={confirmModal.busy}
              className={`${buttonClass} disabled:opacity-50`}
            >
              {t("luckyDraw.cancel")}
            </button>

            <button
              onClick={handleConfirmAction}
              disabled={confirmModal.busy}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {confirmModal.busy
                ? confirmModal.mode === "delete"
                  ? t("luckyDraw.deleting")
                  : t("luckyDraw.disabling")
                : confirmModal.mode === "delete"
                ? t("luckyDraw.delete")
                : t("luckyDraw.disable")}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div
            className={`rounded-2xl p-3 text-xs ${
              theme === "dark"
                ? "border border-white/10 bg-white/5 text-white/70"
                : "border border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {confirmModal.mode === "delete"
              ? t("luckyDraw.deletePermanentWarning")
              : t("luckyDraw.disableHistoryWarning")}
          </div>
        </div>
      </Modal>
    </Shell>
  );
}