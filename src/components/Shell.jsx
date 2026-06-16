import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck } from "lucide-react";
import {
  Users,
  Ticket,
  Settings,
  LogOut,
  Wallet,
  Gift,
  BadgePercent,
  FileText,
  CalendarDays,
  Sun,
  Moon,
  Bell,
  X,
  MonitorSmartphone,
  Menu,
  Mail,
} from "lucide-react";

const API_BASE_URL = "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

const RECENT_TABS_STORAGE_KEY = "taichang_admin_recent_tabs_v1";
const MAX_RECENT_TABS = 12;

const TAB_LABEL_KEYS = {
  "/admin/users": "users",
  "/admin/withdrawals": "withdrawals",
  "/admin/kyc": "kyc",
  "/admin/orders/list": "orderList",
  "/admin/trial-bonus": "trialBonus",
  "/admin/bonus-credit": "bonusCredit",
  "/admin/invitation-codes": "invitationCodes",
  "/admin/lucky-draw": "luckyDraw",
  "/admin/orders/bonus": "bonusTriggers",
  "/admin/popups": "popups",
  "/admin/orders/pool": "orderPool",
  "/admin/signin-rewards": "signinRewards",
  "/admin/settings": "settings",
  "/admin/content": "content",
  "/admin/events": "events",
  "/admin/guest-emails": "guestEmails",
};

function isTrackableAdminPath(pathname) {
  return (
    pathname.startsWith("/admin/") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/dashboard" &&
    pathname !== "/admin/deposits"
  );
}

function getTabKey(pathname) {
  return TAB_LABEL_KEYS[pathname] || "page";
}

function loadRecentTabs() {
  try {
    const raw = localStorage.getItem(RECENT_TABS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((tab) => tab && typeof tab.path === "string")
      .filter((tab) => isTrackableAdminPath(tab.path))
      .map((tab) => ({
        path: tab.path,
      }))
      .slice(0, MAX_RECENT_TABS);
  } catch {
    return [];
  }
}

function saveRecentTabs(tabs) {
  try {
    localStorage.setItem(
      RECENT_TABS_STORAGE_KEY,
      JSON.stringify(tabs.map((tab) => ({ path: tab.path }))),
    );
  } catch {
    // ignore storage errors
  }
}

function moveTab(list, fromIndex, toIndex) {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return list;
  }

  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function Shell({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const [notifications, setNotifications] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const [recentTabs, setRecentTabs] = useState(() => loadRecentTabs());
  const [draggingPath, setDraggingPath] = useState(null);
  const [dragOverPath, setDragOverPath] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dragMovedRef = useRef(false);
  const audioRef = useRef(null);
  const hasLoadedNotificationsRef = useRef(false);
  const lastUnreadIdsRef = useRef([]);

  const pageKey = useMemo(() => {
    return `${location.pathname}-${theme}-${language}`;
  }, [location.pathname, theme, language]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead).length;
  }, [notifications]);

  const isDark = theme === "dark";

  function tabLabel(pathname) {
    return t(`nav.${getTabKey(pathname)}`);
  }

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onStorage(e) {
      if (!e || e.key === RECENT_TABS_STORAGE_KEY) {
        setRecentTabs(loadRecentTabs());
      }
    }

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!isTrackableAdminPath(location.pathname)) return;

    const newTab = {
      path: location.pathname,
    };

    setRecentTabs((prev) => {
      const alreadyExists = prev.some((tab) => tab.path === newTab.path);
      if (alreadyExists) return prev;

      const nextTabs = [...prev, newTab].slice(0, MAX_RECENT_TABS);
      saveRecentTabs(nextTabs);
      return nextTabs;
    });
  }, [location.pathname]);

  async function loadNotifications({ silent = false } = {}) {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      if (!silent) setLoadingNotifications(true);

      const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || t("notifications.failedLoad"));
      }

      const items = Array.isArray(data.notifications) ? data.notifications : [];

      const newUnreadIds = items
        .filter((item) => !item.isRead)
        .map((item) => item._id);

      if (hasLoadedNotificationsRef.current) {
        const previousUnreadIds = lastUnreadIdsRef.current;
        const hasBrandNewUnread = newUnreadIds.some(
          (id) => !previousUnreadIds.includes(id),
        );

        if (hasBrandNewUnread) {
          playNotificationSound();
        }
      }

      lastUnreadIdsRef.current = newUnreadIds;
      hasLoadedNotificationsRef.current = true;

      setNotifications(items);
    } catch (err) {
      console.error("Failed to load admin notifications:", err);
    } finally {
      if (!silent) setLoadingNotifications(false);
    }
  }

  async function markNotificationRead(notificationId) {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await fetch(
        `${API_BASE_URL}/api/admin/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || t("notifications.failedMarkRead"));
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }

  async function markAllNotificationsRead() {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await fetch(
        `${API_BASE_URL}/api/admin/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || t("notifications.failedMarkAllRead"));
      }

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }

  function formatTime(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return "";
    }
  }

  function playNotificationSound() {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // browser may block autoplay until user interacts once
    });
  }

  function buildNotificationSubtitle(item) {
    const currentUser =
      item?.user?.uid ||
      item?.user?.phoneNumber ||
      item?.user?._id ||
      t("notifications.unknown");

    const relatedUser =
      item?.relatedUser?.uid ||
      item?.relatedUser?.phoneNumber ||
      item?.relatedUser?._id ||
      t("notifications.unknown");

    if (item?.type === "NEW_WITHDRAWAL") {
      return `${t("notifications.user")} ${currentUser}${
        item?.cryptoType ? ` · ${item.cryptoType}` : ""
      }`;
    }

    if (item?.type === "DUPLICATE_WITHDRAWAL_ADDRESS") {
      return `${t("notifications.user")} ${currentUser} ${t(
        "notifications.matched",
      )} ${relatedUser}${item?.cryptoType ? ` · ${item.cryptoType}` : ""}`;
    }

    if (item?.type === "DUPLICATE_REGISTER_IP") {
      return `${t("notifications.user")} ${currentUser} ${t(
        "notifications.matched",
      )} ${relatedUser}${item?.ip ? ` · ${item.ip}` : ""}`;
    }

    return "";
  }

  function handleTabClick(path) {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }

    if (path !== location.pathname) {
      navigate(path);
    }
  }

  function closeTab(path, e) {
    e.stopPropagation();

    setRecentTabs((prev) => {
      const closingIndex = prev.findIndex((tab) => tab.path === path);
      const nextTabs = prev.filter((tab) => tab.path !== path);

      saveRecentTabs(nextTabs);

      if (location.pathname === path) {
        const leftTab = closingIndex > 0 ? prev[closingIndex - 1] : null;
        const rightTab =
          closingIndex >= 0 && closingIndex < prev.length - 1
            ? prev[closingIndex + 1]
            : null;

        const fallbackPath = leftTab?.path || rightTab?.path || "/admin/users";

        navigate(fallbackPath);
      }

      return nextTabs;
    });
  }

  function handleTabDragStart(path) {
    setDraggingPath(path);
    setDragOverPath(path);
    dragMovedRef.current = false;
  }

  function handleTabDragOver(targetPath, e) {
    e.preventDefault();

    if (!draggingPath || draggingPath === targetPath) {
      setDragOverPath(targetPath);
      return;
    }

    setRecentTabs((prev) => {
      const fromIndex = prev.findIndex((tab) => tab.path === draggingPath);
      const toIndex = prev.findIndex((tab) => tab.path === targetPath);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return prev;
      }

      dragMovedRef.current = true;
      const nextTabs = moveTab(prev, fromIndex, toIndex);
      saveRecentTabs(nextTabs);
      return nextTabs;
    });

    setDragOverPath(targetPath);
  }

  function handleTabDrop(e) {
    e.preventDefault();
    setDraggingPath(null);
    setDragOverPath(null);
  }

  function handleTabDragEnd() {
    setTimeout(() => {
      dragMovedRef.current = false;
      setDraggingPath(null);
      setDragOverPath(null);
    }, 0);
  }

  useEffect(() => {
    loadNotifications();

    const timer = setInterval(() => {
      loadNotifications({ silent: true });
    }, 10000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div
      className={`h-screen overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#101828] text-white" : "bg-[#FAF8F4] text-[#1F2937]"
      }`}
    >
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[65] bg-black/45 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-full overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-[70] flex h-full w-[250px] shrink-0 flex-col overflow-y-auto px-5 py-6 shadow-2xl transition-all duration-300 lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 lg:shadow-none ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isDark
              ? "border-r border-white/10 bg-[#0B1220]"
              : "border-r border-[#EAE5DC] bg-[#F5EFE6] text-[#1F2937]"
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="min-w-0 flex-1 text-center lg:text-left">
              <div className="truncate text-[17px] font-bold tracking-tight">
                {t("brand")}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl transition lg:hidden ${
                isDark
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-white text-[#1F2937] hover:bg-[#F8F3EA]"
              }`}
              title={t("common.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1">
            <nav className="mt-10 space-y-2">
              <SideLink
                theme={theme}
                to="/admin/users"
                icon={<Users className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.users")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/withdrawals"
                icon={<Wallet className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.withdrawals")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/kyc"
                icon={<ShieldCheck className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.kyc")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/guest-emails"
                icon={<Mail className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                Guest Emails
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/trial-bonus"
                icon={<BadgePercent className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.trialBonus")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/bonus-credit"
                icon={<Gift className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.bonusCredit")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/invitation-codes"
                icon={<Ticket className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.invitationCodes")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/lucky-draw"
                icon={<Gift className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.luckyDraw")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/orders/bonus"
                icon={<Settings className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.bonusTriggers")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/orders/list"
                icon={<FileText className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.orderList")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/popups"
                icon={<MonitorSmartphone className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.popups")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/orders/pool"
                icon={<Settings className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.orderPool")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/signin-rewards"
                icon={<Gift className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.signinRewards")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/settings"
                icon={<Settings className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.settings")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/content"
                icon={<FileText className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.content")}
              </SideLink>

              <SideLink
                theme={theme}
                to="/admin/events"
                icon={<CalendarDays className="h-4 w-4 shrink-0" />}
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {t("nav.events")}
              </SideLink>
            </nav>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                window.location.href = "/admin/login";
              }}
              className={`inline-flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isDark
                  ? "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  : "text-[#5B5B5B] hover:bg-white/60"
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {t("common.logout")}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header
            className={`sticky top-0 z-40 shrink-0 border-b px-4 py-3 transition-colors duration-300 lg:px-6 ${
              isDark
                ? "border-white/10 bg-[#0B1220]"
                : "border-[#EAE5DC] bg-[#F5EFE6]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition lg:hidden ${
                    isDark
                      ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                      : "border border-[#E8E1D6] bg-white text-[#1F2937] hover:bg-[#F8F3EA]"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0 truncate text-[16px] font-bold leading-none tracking-tight sm:text-[20px]">
                  {title}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setBellOpen((prev) => !prev)}
                    title={t("notifications.youHaveUnread", {
                      count: unreadCount,
                    })}
                    className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                      isDark
                        ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                        : "border border-[#E8E1D6] bg-white text-[#1F2937] hover:bg-[#F8F3EA]"
                    }`}
                  >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {bellOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-50 bg-black/40"
                        onClick={() => setBellOpen(false)}
                      />

                      <div
                        className={`fixed right-0 top-0 z-[60] flex h-screen w-full max-w-[420px] flex-col border-l shadow-2xl transition-transform duration-300 ${
                          isDark
                            ? "border-white/10 bg-[#101828] text-white"
                            : "border-[#E8E1D6] bg-white text-[#1F2937]"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between gap-3 px-4 py-4 ${
                            isDark
                              ? "border-b border-white/10"
                              : "border-b border-[#F0EADF]"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">
                              {t("notifications.title")}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-white/60" : "text-[#6B7280]"
                              }`}
                            >
                              {unreadCount} {t("notifications.unread")}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => loadNotifications()}
                              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                isDark
                                  ? "bg-white/10 text-white hover:bg-white/15"
                                  : "bg-[#F8F3EA] text-[#1F2937] hover:bg-[#F1EADB]"
                              }`}
                            >
                              {t("common.refresh")}
                            </button>

                            <button
                              type="button"
                              onClick={markAllNotificationsRead}
                              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                isDark
                                  ? "bg-white/10 text-white hover:bg-white/15"
                                  : "bg-[#F8F3EA] text-[#1F2937] hover:bg-[#F1EADB]"
                              }`}
                            >
                              {t("common.readAll")}
                            </button>

                            <button
                              type="button"
                              onClick={() => setBellOpen(false)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
                                isDark
                                  ? "bg-white/10 text-white hover:bg-white/15"
                                  : "bg-[#F8F3EA] text-[#1F2937] hover:bg-[#F1EADB]"
                              }`}
                              title={t("common.close")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                          {loadingNotifications ? (
                            <div
                              className={`px-4 py-6 text-sm ${
                                isDark ? "text-white/70" : "text-[#6B7280]"
                              }`}
                            >
                              {t("notifications.loading")}
                            </div>
                          ) : notifications.length === 0 ? (
                            <div
                              className={`px-4 py-6 text-sm ${
                                isDark ? "text-white/70" : "text-[#6B7280]"
                              }`}
                            >
                              {t("notifications.empty")}
                            </div>
                          ) : (
                            notifications.map((item) => (
                              <button
                                key={item._id}
                                type="button"
                                onClick={() => {
                                  if (!item.isRead) {
                                    markNotificationRead(item._id);
                                  }
                                }}
                                className={`block w-full px-4 py-3 text-left transition ${
                                  isDark
                                    ? "border-b border-white/5 hover:bg-white/5"
                                    : "border-b border-[#F7F2E9] hover:bg-[#FCFAF7]"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                      item.isRead ? "bg-gray-400" : "bg-red-500"
                                    }`}
                                  />

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="truncate text-sm font-semibold">
                                        {item.title ||
                                          t("notifications.fallbackTitle")}
                                      </div>
                                      <div
                                        className={`shrink-0 text-[11px] ${
                                          isDark
                                            ? "text-white/50"
                                            : "text-[#9CA3AF]"
                                        }`}
                                      >
                                        {formatTime(item.createdAt)}
                                      </div>
                                    </div>

                                    {item.message ? (
                                      <div
                                        className={`mt-1 text-xs ${
                                          isDark
                                            ? "text-white/70"
                                            : "text-[#6B7280]"
                                        }`}
                                      >
                                        {item.message}
                                      </div>
                                    ) : null}

                                    {buildNotificationSubtitle(item) ? (
                                      <div
                                        className={`mt-1 text-xs ${
                                          isDark
                                            ? "text-white/55"
                                            : "text-[#9CA3AF]"
                                        }`}
                                      >
                                        {buildNotificationSubtitle(item)}
                                      </div>
                                    ) : null}

                                    {item.address ? (
                                      <div
                                        className={`mt-1 break-all text-[11px] ${
                                          isDark
                                            ? "text-white/50"
                                            : "text-[#9CA3AF]"
                                        }`}
                                      >
                                        {item.address}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleLanguage}
                  className={`inline-flex h-11 items-center gap-2 rounded-2xl px-3 text-sm font-medium transition sm:px-4 ${
                    isDark
                      ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                      : "border border-[#E8E1D6] bg-white text-[#1F2937] hover:bg-[#F8F3EA]"
                  }`}
                  title={t("common.language")}
                >
                  <span>{language === "en" ? "中文" : "EN"}</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className={`inline-flex h-11 items-center gap-2 rounded-2xl px-3 text-sm font-medium transition sm:px-4 ${
                    isDark
                      ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                      : "border border-[#E8E1D6] bg-white text-[#1F2937] hover:bg-[#F8F3EA]"
                  }`}
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {t("common.lightMode")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {t("common.darkMode")}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {recentTabs.length > 0 && (
            <div
              className={`shrink-0 border-b px-4 py-2 transition-colors duration-300 lg:px-6 ${
                isDark
                  ? "border-white/10 bg-[#0E1726]"
                  : "border-[#EAE5DC] bg-[#F8F3EA]"
              }`}
            >
              <div
                className="flex items-center gap-2 overflow-x-auto"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleTabDrop}
              >
                {recentTabs.map((tab) => {
                  const isActive = location.pathname === tab.path;
                  const isDragging = draggingPath === tab.path;
                  const isDragOver =
                    dragOverPath === tab.path && draggingPath !== tab.path;
                  const label = tabLabel(tab.path);

                  return (
                    <button
                      key={tab.path}
                      type="button"
                      draggable
                      onDragStart={() => handleTabDragStart(tab.path)}
                      onDragOver={(e) => handleTabDragOver(tab.path, e)}
                      onDrop={handleTabDrop}
                      onDragEnd={handleTabDragEnd}
                      onClick={() => handleTabClick(tab.path)}
                      className={`group inline-flex shrink-0 items-center gap-2 rounded-t-2xl border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                        isActive
                          ? isDark
                            ? "border-white/10 bg-[#101828] text-white"
                            : "border-[#E2D8C8] bg-white text-[#111827]"
                          : isDark
                            ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                            : "border-[#E8E1D6] bg-[#F3EBDD] text-[#6B7280] hover:bg-white hover:text-[#111827]"
                      } ${isDragging ? "opacity-50" : ""} ${
                        isDragOver
                          ? isDark
                            ? "ring-1 ring-white/30"
                            : "ring-1 ring-black/10"
                          : ""
                      }`}
                      title={t("common.dragToMoveTab")}
                    >
                      <span className="cursor-grab select-none text-xs opacity-50 active:cursor-grabbing">
                        ⋮⋮
                      </span>

                      <span className="max-w-[130px] truncate font-medium sm:max-w-[180px]">
                        {label}
                      </span>

                      <span
                        onClick={(e) => closeTab(tab.path, e)}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition ${
                          isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                        }`}
                        title={`${t("common.close")} ${label}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 lg:px-8 lg:py-6">
            <div
              key={pageKey}
              className={`rounded-[20px] p-4 transition-colors duration-300 sm:rounded-[24px] sm:p-5 ${
                isDark
                  ? "border border-white/10 bg-white/5"
                  : "border border-[#ECE7DE] bg-white"
              }`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="/notification-mantap.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

function SideLink({ to, icon, children, theme, onNavigate }) {
  const isDark = theme === "dark";

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
          isDark
            ? isActive
              ? "bg-white/10 text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white"
            : isActive
              ? "bg-white text-[#111827] shadow-sm"
              : "text-[#4B5563] hover:bg-white/60 hover:text-[#111827]"
        }`
      }
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          isDark ? "bg-white/5" : "bg-transparent"
        }`}
      >
        {icon}
      </span>
      <span className="whitespace-nowrap font-medium">{children}</span>
    </NavLink>
  );
}
