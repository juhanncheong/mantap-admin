import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://closed-deirdre-jayjay122-a04beb79.koyeb.app";

function safeStr(x) {
  return String(x || "").trim();
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

export default function Events() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const mutedText = theme === "dark" ? "text-white/50" : "text-gray-500";
  const softText = theme === "dark" ? "text-white/70" : "text-gray-600";
  const strongText = theme === "dark" ? "text-white" : "text-gray-900";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
      : "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400";

  const textareaClass =
    theme === "dark"
      ? "w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 outline-none focus:border-white/20"
      : "w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-400";

  const cardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5"
      : "rounded-2xl border border-gray-200 bg-white shadow-sm";

  const subCardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 p-3"
      : "rounded-2xl border border-gray-200 bg-gray-50 p-3";

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
    theme === "dark"
      ? "divide-y divide-white/10"
      : "divide-y divide-gray-200";

  const tableRowClass =
    theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50";

  const fileInputClass = `mt-2 block w-full text-xs ${
    theme === "dark"
      ? "text-white/80 file:bg-white/10 file:text-white"
      : "text-gray-700 file:bg-gray-100 file:text-gray-800"
  } file:mr-3 file:rounded-xl file:border-0 file:px-3 file:py-2 file:text-xs`;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [q, setQ] = useState("");

  const [createModal, setCreateModal] = useState({
    open: false,
    name: "",
    imageUrl: "",
    imageFile: null,
    description: "",
  });

  const [editModal, setEditModal] = useState({
    open: false,
    id: null,
    name: "",
    imageUrl: "",
    imageFile: null,
    description: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

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
      throw new Error(t("events.pleaseLoginAgain"));
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
      throw new Error(t("events.nonJson"));
    }

    if (!res.ok) {
      const msg = data?.message || `${t("events.requestFailed")} (${res.status})`;

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
      }

      throw new Error(msg);
    }

    return data;
  }

  async function fetchForm(url, options = {}) {
    const auth = getAuthHeaders();

    if (!auth) {
      localStorage.removeItem("admin_token");
      navigate("/admin/login", { replace: true });
      throw new Error(t("events.pleaseLoginAgain"));
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
      throw new Error(t("events.nonJson"));
    }

    if (!res.ok) {
      const msg = data?.message || `${t("events.requestFailed")} (${res.status})`;

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
      }

      throw new Error(msg);
    }

    return data;
  }

  function getPreviewSrc(modal) {
    if (modal.imageFile) {
      return URL.createObjectURL(modal.imageFile);
    }

    return safeStr(modal.imageUrl);
  }

  function closeCreateModal() {
    setCreateModal({
      open: false,
      name: "",
      imageUrl: "",
      imageFile: null,
      description: "",
    });
  }

  function closeEditModal() {
    setEditModal({
      open: false,
      id: null,
      name: "",
      imageUrl: "",
      imageFile: null,
      description: "",
    });
  }

  async function loadEvents() {
    setLoading(true);

    try {
      const data = await fetchJSON(`${API_BASE}/api/events`);
      setRows(data.events || []);
    } catch (e) {
      setRows([]);
      toast.error(e.message || t("events.failedLoadEvents"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;

    return rows.filter((ev) => {
      const name = String(ev.name || "").toLowerCase();
      const desc = String(ev.description || "").toLowerCase();
      const id = String(ev._id || "").toLowerCase();

      return name.includes(qq) || desc.includes(qq) || id.includes(qq);
    });
  }, [rows, q]);

  async function submitCreate() {
    const name = safeStr(createModal.name);
    const description = safeStr(createModal.description);
    const imageFile = createModal.imageFile;
  
    if (!name || !description || !imageFile) {
      toast.error(t("events.fillRequired"));
      return;
    }
  
    setBusyId("create");
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", imageFile);
  
      const data = await fetchForm(`${API_BASE}/api/admin/events`, {
        method: "POST",
        body: formData,
      });
  
      const newEvent = data.event;
      setRows((prev) => [newEvent, ...prev]);
      toast.success(t("events.eventCreated"));
  
      closeCreateModal();
    } catch (e) {
      toast.error(e.message || t("events.failedCreateEvent"));
    } finally {
      setBusyId(null);
    }
  }

  async function submitEdit() {
    if (!editModal.id) return;
  
    const name = safeStr(editModal.name);
    const description = safeStr(editModal.description);
    const imageFile = editModal.imageFile;
  
    if (!name || !description) {
      toast.error(t("events.fillRequired"));
      return;
    }
  
    setBusyId(editModal.id);
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
  
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      const data = await fetchForm(
        `${API_BASE}/api/admin/events/${editModal.id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );
  
      const updated = data.event;
  
      setRows((prev) =>
        prev.map((x) => (x._id === editModal.id ? { ...x, ...updated } : x))
      );
  
      toast.success(t("events.eventUpdated"));
      closeEditModal();
    } catch (e) {
      toast.error(e.message || t("events.failedUpdateEvent"));
    } finally {
      setBusyId(null);
    }
  }

  async function submitDelete() {
    const id = deleteModal.id;
    if (!id) return;

    setBusyId(id);

    try {
      await fetchJSON(`${API_BASE}/api/admin/events/${id}`, {
        method: "DELETE",
      });

      setRows((prev) => prev.filter((x) => x._id !== id));
      toast.success(t("events.eventDeleted"));
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (e) {
      toast.error(e.message || t("events.failedDeleteEvent"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Shell title={t("events.title")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className={`text-xs ${mutedText}`}>{t("events.subtitle")}</div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("events.searchPlaceholder")}
            className={`${inputClass} md:w-72`}
          />

          <button
            disabled={loading}
            onClick={loadEvents}
            className={`${buttonClass} disabled:opacity-50`}
          >
            {t("events.refresh")}
          </button>

          <button
            onClick={() => {
              setCreateModal({
                open: true,
                name: "",
                imageUrl: "",
                imageFile: null,
                description: "",
              });
            }}
            className={primaryButtonClass}
          >
            {t("events.addEvent")}
          </button>
        </div>
      </div>

      <div className={`mt-4 overflow-hidden ${cardClass}`}>
        <div
          className={`px-4 py-3 text-sm font-semibold ${
            theme === "dark" ? "bg-white/5 text-white" : "bg-gray-50 text-gray-900"
          }`}
        >
          {t("events.events")} ({filtered.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3">{t("events.preview")}</th>
                <th className="px-4 py-3">{t("events.event")}</th>
                <th className="px-4 py-3">{t("events.description")}</th>
                <th className="px-4 py-3 text-right">{t("events.actions")}</th>
              </tr>
            </thead>

            <tbody className={tableBodyClass}>
              {loading ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={4}>
                    {t("events.loadingEvents")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className={`px-4 py-5 ${softText}`} colSpan={4}>
                    {t("events.noEventsFound")}
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => {
                  const isBusy = busyId === ev._id;

                  return (
                    <tr key={ev._id} className={tableRowClass}>
                      <td className="px-4 py-3">
                        <div
                          className={`h-14 w-20 overflow-hidden rounded-xl ${
                            theme === "dark"
                              ? "border border-white/10 bg-white/5"
                              : "border border-gray-200 bg-gray-50"
                          }`}
                        >
                          {ev.imageUrl ? (
                            <img
                              src={ev.imageUrl}
                              alt={ev.name || t("events.event")}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : null}
                        </div>

                        <div
                          className={`mt-1 max-w-[140px] truncate font-mono text-[10px] ${mutedText}`}
                        >
                          {ev._id}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className={`text-xs font-semibold ${strongText}`}>
                          {ev.name || "-"}
                        </div>

                        <div
                          className={`mt-1 max-w-[280px] truncate font-mono text-[11px] ${mutedText}`}
                        >
                          {ev.imageUrl || ""}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className={`max-w-xl line-clamp-2 text-xs ${softText}`}>
                          {ev.description || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isBusy}
                            onClick={() => {
                              setEditModal({
                                open: true,
                                id: ev._id,
                                name: ev.name || "",
                                imageUrl: ev.imageUrl || "",
                                imageFile: null,
                                description: ev.description || "",
                              });
                            }}
                            className={`${buttonClass} disabled:opacity-50`}
                          >
                            {t("events.edit")}
                          </button>

                          <button
                            disabled={isBusy}
                            onClick={() => {
                              setDeleteModal({
                                open: true,
                                id: ev._id,
                                name: ev.name || t("events.untitled"),
                              });
                            }}
                            className={`${buttonClass} disabled:opacity-50`}
                          >
                            {t("events.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={createModal.open}
        title={t("events.addEventTitle")}
        subtitle={t("events.createEventSubtitle")}
        onClose={closeCreateModal}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button onClick={closeCreateModal} className={buttonClass}>
              {t("events.cancel")}
            </button>

            <button
              disabled={busyId === "create"}
              onClick={submitCreate}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {busyId === "create" ? t("events.saving") : t("events.create")}
            </button>
          </div>
        }
      >
        <EventForm
          modal={createModal}
          setModal={setCreateModal}
          getPreviewSrc={getPreviewSrc}
          inputClass={inputClass}
          textareaClass={textareaClass}
          subCardClass={subCardClass}
          fileInputClass={fileInputClass}
          strongText={strongText}
          mutedText={mutedText}
          theme={theme}
          t={t}
          mode="create"
        />
      </Modal>

      <Modal
        open={editModal.open}
        title={t("events.editEventTitle")}
        subtitle={editModal.id ? `${t("events.eventId")}: ${editModal.id}` : ""}
        onClose={closeEditModal}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button onClick={closeEditModal} className={buttonClass}>
              {t("events.cancel")}
            </button>

            <button
              disabled={busyId === editModal.id}
              onClick={submitEdit}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {busyId === editModal.id
                ? t("events.saving")
                : t("events.saveChanges")}
            </button>
          </div>
        }
      >
        <EventForm
          modal={editModal}
          setModal={setEditModal}
          getPreviewSrc={getPreviewSrc}
          inputClass={inputClass}
          textareaClass={textareaClass}
          subCardClass={subCardClass}
          fileInputClass={fileInputClass}
          strongText={strongText}
          mutedText={mutedText}
          theme={theme}
          t={t}
          mode="edit"
        />
      </Modal>

      <Modal
        open={deleteModal.open}
        title={t("events.deleteEventTitle")}
        subtitle={deleteModal.id ? `${t("events.event")}: ${deleteModal.name}` : ""}
        onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
              className={buttonClass}
            >
              {t("events.cancel")}
            </button>

            <button
              disabled={busyId === deleteModal.id}
              onClick={submitDelete}
              className={`${primaryButtonClass} disabled:opacity-50`}
            >
              {busyId === deleteModal.id
                ? t("events.deleting")
                : t("events.delete")}
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
            {t("events.deletePermanentWarning")}
          </div>

          <div className={`text-xs ${softText}`}>
            {t("events.deleteEventDesc")}
          </div>
        </div>
      </Modal>
    </Shell>
  );
}

function EventForm({
  modal,
  setModal,
  getPreviewSrc,
  inputClass,
  textareaClass,
  subCardClass,
  fileInputClass,
  strongText,
  mutedText,
  theme,
  t,
  mode,
}) {
  return (
    <div className="space-y-3">
      <div className={subCardClass}>
        <div className={`text-xs font-semibold ${strongText}`}>
          {t("events.eventName")}
        </div>

        <input
          value={modal.name}
          onChange={(e) => setModal((p) => ({ ...p, name: e.target.value }))}
          placeholder={t("events.eventNamePlaceholder")}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div className={subCardClass}>
        <div className={`text-xs font-semibold ${strongText}`}>
          {mode === "edit" ? t("events.uploadNewImage") : t("events.uploadImage")}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setModal((p) => ({
              ...p,
              imageFile: file,
            }));
          }}
          className={fileInputClass}
        />

        <div className={`mt-2 text-[11px] ${mutedText}`}>
          {mode === "edit"
            ? t("events.uploadNewImageDesc")
            : t("events.uploadImageDesc")}
        </div>
      </div>

      {modal.imageFile || (mode === "edit" && safeStr(modal.imageUrl)) ? (
        <div className={subCardClass}>
          <div className={`text-xs font-semibold ${strongText}`}>
            {t("events.preview")}
          </div>

          <div
            className={`mt-3 overflow-hidden rounded-2xl ${
              theme === "dark"
                ? "border border-white/10 bg-white/5"
                : "border border-gray-200 bg-gray-50"
            }`}
          >
            <img
              src={getPreviewSrc(modal)}
              alt={t("events.preview")}
              className="h-40 w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      ) : null}

      <div className={subCardClass}>
        <div className={`text-xs font-semibold ${strongText}`}>
          {t("events.description")}
        </div>

        <textarea
          value={modal.description}
          onChange={(e) =>
            setModal((p) => ({ ...p, description: e.target.value }))
          }
          placeholder={t("events.descriptionPlaceholder")}
          rows={5}
          className={`mt-2 ${textareaClass}`}
        />
      </div>
    </div>
  );
}