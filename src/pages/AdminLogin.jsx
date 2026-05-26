import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  KeyRound,
  Database,
  Lock,
  Eye,
  EyeOff,
  ScanLine,
  X,
  Copy,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Sparkles,
  Fingerprint,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [twoFaOpen, setTwoFaOpen] = useState(false);
  const [twoFaMode, setTwoFaMode] = useState(null); // "setup" | "login"
  const [setupToken, setSetupToken] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [gaCode, setGaCode] = useState("");
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [setupLoaded, setSetupLoaded] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: String(phoneNumber).trim(),
          password,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("[AdminLogin] status:", res.status);
      console.log("[AdminLogin] response:", data);

      if (!res.ok) {
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      if (data?.user?.role !== "admin") {
        throw new Error("Admin only. This account is not admin.");
      }

      // ✅ First-time Google Authenticator setup
      if (data?.setup2FARequired && data?.setupToken) {
        setSetupToken(data.setupToken);
        setTempToken("");
        setTwoFaMode("setup");
        setTwoFaOpen(true);
        setGaCode("");
        setQrCodeUrl("");
        setManualKey("");
        setSetupLoaded(false);
        await loadSetupQr(data.setupToken);
        return;
      }

      // ✅ Future admin login with 6-digit code
      if (data?.twoFactorRequired && data?.tempToken) {
        setTempToken(data.tempToken);
        setSetupToken("");
        setTwoFaMode("login");
        setTwoFaOpen(true);
        setGaCode("");
        setQrCodeUrl("");
        setManualKey("");
        setSetupLoaded(true);
        return;
      }

      // ✅ Normal final login
      if (!data?.token) {
        throw new Error("Login succeeded but token missing");
      }

      finishLogin(data);
    } catch (err) {
      console.error("[AdminLogin] login error:", err);
      toast.error(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSetupQr(tokenToUse = setupToken) {
    try {
      setTwoFaLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/admin/2fa/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupToken: tokenToUse }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to create Google Authenticator setup"
        );
      }

      setQrCodeUrl(data.qrCodeUrl || "");
      setManualKey(data.manualKey || "");
      setSetupLoaded(true);
    } catch (err) {
      console.error("[AdminLogin] 2FA setup error:", err);
      toast.error(err.message || "Failed to load Google Authenticator QR");
    } finally {
      setTwoFaLoading(false);
    }
  }

  async function handleVerify2FA(e) {
    e.preventDefault();

    const cleanCode = String(gaCode || "").trim();

    if (!/^\d{6}$/.test(cleanCode)) {
      toast.error("Enter the 6-digit Google Authenticator code");
      return;
    }

    setTwoFaLoading(true);

    try {
      const isSetup = twoFaMode === "setup";

      const url = isSetup
        ? `${API_BASE}/api/auth/admin/2fa/verify-setup`
        : `${API_BASE}/api/auth/admin/2fa/verify-login`;

      const payload = isSetup
        ? { setupToken, code: cleanCode }
        : { tempToken, code: cleanCode };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Invalid Google Authenticator code");
      }

      if (!data?.token) {
        throw new Error("2FA passed but token missing");
      }

      finishLogin(data);
    } catch (err) {
      console.error("[AdminLogin] verify 2FA error:", err);
      toast.error(err.message || "Google Authenticator verification failed");
    } finally {
      setTwoFaLoading(false);
    }
  }

  function finishLogin(data) {
    localStorage.setItem("admin_token", data.token);
    console.log("[AdminLogin] saved admin_token:", data.token);

    toast.success(data?.message || "Login successful");
    navigate("/admin/dashboard", { replace: true });
  }

  async function copyManualKey() {
    if (!manualKey) return;

    try {
      await navigator.clipboard.writeText(manualKey);
      toast.success("Manual key copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  function closeTwoFa() {
    if (twoFaLoading) return;

    setTwoFaOpen(false);
    setTwoFaMode(null);
    setSetupToken("");
    setTempToken("");
    setQrCodeUrl("");
    setManualKey("");
    setGaCode("");
    setSetupLoaded(false);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#101828] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.16),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101828]/20 via-[#101828] to-[#101828]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-10">
        <section className="grid w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:min-h-[720px] lg:grid-cols-[1.08fr_0.92fr]">
          {/* Left Brand Side */}
          <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.10),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.10),transparent_30%)]" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-lg backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#101828] shadow-md">
                  <Shield className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-sm font-semibold leading-none">
                    曼达【MANTAP】集团
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Admin Portal
                  </div>
                </div>
              </div>

              <div className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200 sm:block">
                System Online
              </div>
            </div>

            <div className="relative z-10 my-14 max-w-xl lg:my-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/65">
                <Sparkles className="h-3.5 w-3.5" />
                Secure administrator access
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Welcome back.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                Please login to your admin dashboard. Protected with role
                verification, JWT authentication, and Google Authenticator 2FA.
              </p>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                <FeatureCard
                  icon={<KeyRound className="h-4 w-4" />}
                  title="2FA"
                  text="Protected"
                />
                <FeatureCard
                  icon={<Lock className="h-4 w-4" />}
                  title="JWT"
                  text="Secured"
                />
                <FeatureCard
                  icon={<Database className="h-4 w-4" />}
                  title="Data"
                  text="Connected"
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-3 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} 曼达【MANTAP】集团. Internal use only.</div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Admin security layer active
              </div>
            </div>
          </div>

          {/* Right Login Side */}
          <div className="relative flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <div className="w-full max-w-[460px]">
              <div className="mb-8 text-center lg:text-left">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.07] shadow-2xl lg:mx-0">
                  <Fingerprint className="h-7 w-7 text-white" />
                </div>

                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Admin Login
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  Enter your admin username, phone, or ID and password to
                  continue.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Username / Phone / Admin ID
                  </label>

                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="min-h-[54px] w-full rounded-2xl border border-white/10 bg-white px-4 text-base text-[#101828] shadow-lg outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10"
                    autoComplete="username"
                    inputMode="text"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={show ? "text" : "password"}
                      className="min-h-[54px] w-full rounded-2xl border border-white/10 bg-white px-4 pr-14 text-base text-[#101828] shadow-lg outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                    <Lock className="h-3.5 w-3.5" />
                    Google Authenticator may be required after password login.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-bold uppercase tracking-[0.18em] text-[#101828] shadow-[0_20px_50px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Login"}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Security Notice
                </div>
                <p className="mt-2 text-xs leading-6 text-white/45">
                  This dashboard is restricted to authorized administrators.
                  Login activity may be checked for protection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <TwoFactorSidebar
        open={twoFaOpen}
        mode={twoFaMode}
        qrCodeUrl={qrCodeUrl}
        manualKey={manualKey}
        gaCode={gaCode}
        setGaCode={setGaCode}
        loading={twoFaLoading}
        setupLoaded={setupLoaded}
        onClose={closeTwoFa}
        onSubmit={handleVerify2FA}
        onCopyManualKey={copyManualKey}
      />
    </div>
  );
}

function TwoFactorSidebar({
  open,
  mode,
  qrCodeUrl,
  manualKey,
  gaCode,
  setGaCode,
  loading,
  setupLoaded,
  onClose,
  onSubmit,
  onCopyManualKey,
}) {
  const isSetup = mode === "setup";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[500px] flex-col border-l border-white/10 bg-[#101828] text-white shadow-[0_0_80px_rgba(0,0,0,0.55)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative overflow-hidden border-b border-white/10 px-5 py-6 sm:px-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_30%)]" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/55">
                <Shield className="h-3.5 w-3.5" />
                Two-Factor Authentication
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
                {isSetup
                  ? "Set up Google Authenticator"
                  : "Verify Google Authenticator"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                {isSetup
                  ? "Scan the QR code once, then enter the 6-digit code from your app."
                  : "Open Google Authenticator and enter your current 6-digit admin code."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-white/70 transition hover:bg-white/10 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#101828] shadow-lg">
                {isSetup ? (
                  <ScanLine className="h-5 w-5" />
                ) : (
                  <Smartphone className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="text-sm font-semibold">
                  {isSetup ? "First-time setup" : "Login verification"}
                </div>
                <div className="text-xs text-white/45">
                  {isSetup ? "Scan once only" : "Code changes every 30 seconds"}
                </div>
              </div>
            </div>

            {isSetup && (
              <div className="mt-6">
                {!setupLoaded || loading ? (
                  <div className="flex h-[280px] items-center justify-center rounded-3xl border border-white/10 bg-black/20">
                    <div className="text-center">
                      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <div className="mt-4 text-sm text-white/55">
                        Creating secure QR...
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-3xl bg-white p-5 shadow-xl">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Google Authenticator QR Code"
                          className="mx-auto h-[230px] w-[230px]"
                        />
                      ) : (
                        <div className="flex h-[230px] items-center justify-center text-sm text-black/50">
                          QR code not available
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        Manual setup key
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1 break-all rounded-2xl bg-white/[0.06] px-3 py-3 font-mono text-xs text-white/75">
                          {manualKey || "No manual key"}
                        </div>

                        <button
                          type="button"
                          onClick={onCopyManualKey}
                          className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-white/70 transition hover:bg-white/10"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 text-xs leading-6 text-white/45">
                        If scanning does not work, open Google Authenticator,
                        choose manual entry, and paste this key.
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {!isSetup && (
              <div className="mt-6 rounded-3xl border border-emerald-300/15 bg-emerald-300/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Authenticator already connected
                </div>

                <p className="mt-2 text-xs leading-6 text-white/45">
                  No need to scan again. Use the current 6-digit code from your
                  Google Authenticator app.
                </p>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                6-digit code
              </label>

              <input
                value={gaCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setGaCode(value);
                }}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="min-h-[64px] w-full rounded-3xl border border-white/10 bg-white px-4 text-center text-2xl font-bold tracking-[0.35em] text-[#101828] shadow-lg outline-none transition placeholder:text-slate-300 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10"
              />

              <button
                type="submit"
                disabled={loading || gaCode.length !== 6}
                className="mt-5 flex min-h-[58px] w-full items-center justify-center rounded-3xl bg-white px-4 text-sm font-bold uppercase tracking-[0.14em] text-[#101828] shadow-[0_20px_50px_rgba(255,255,255,0.12)] transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Verifying..."
                  : isSetup
                  ? "Verify & Enable Authenticator"
                  : "Verify & Enter Admin Panel"}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-lg backdrop-blur-xl">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
        {icon}
      </div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-white/40">{text}</div>
    </div>
  );
}