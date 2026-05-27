import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import "react-toastify/dist/ReactToastify.css";
import InvitationCodes from "./pages/InvitationCodes";
import AdminLogin from "./pages/AdminLogin";
import UsersPage from "./pages/Users";
import OrdersPoolPage from "./pages/OrdersPool";
import BonusTriggersPage from "./pages/BonusTriggers";
import AdminWithdrawalsPage from "./pages/AdminWithdrawals";
import AdminDepositsPage from "./pages/AdminDeposits";
import AdminSigninRewardsPage from "./pages/AdminSigninRewards";
import SettingsPage from "./pages/settings";
import TrialBonus from "./pages/TrialBonus";
import Content from "./pages/Content";
import Events from "./pages/Events";
import AdminLuckyDrawPage from "./pages/AdminLuckyDrawPage";
import BonusCreditPage from "./pages/BonusCredit";
import AdminPopupsPage from "./pages/AdminPopupsPage";
import AdminOrderList from "./pages/AdminOrderList";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
      
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Navigate to="/admin/users" replace />} />
            <Route path="/admin/invitation-codes" element={<InvitationCodes />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/trial-bonus" element={<TrialBonus />} />
            <Route path="/admin/orders/pool" element={<OrdersPoolPage />} />
            <Route path="/admin/orders/bonus" element={<BonusTriggersPage />} />
            <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
            <Route path="/admin/deposits" element={<AdminDepositsPage />} />
            <Route path="/admin/signin-rewards" element={<AdminSigninRewardsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/content" element={<Content />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/lucky-draw" element={<AdminLuckyDrawPage />} />
            <Route path="/admin/bonus-credit" element={<BonusCreditPage />} />
            <Route path="/admin/popups" element={<AdminPopupsPage />} />
            <Route path="/admin/orders/list" element={<AdminOrderList />} />
      
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
      
          <ToastContainer position="top-right" autoClose={2500} />
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}