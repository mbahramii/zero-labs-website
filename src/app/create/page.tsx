"use client";

import { useState, useRef, useEffect, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { Paperclip, Send, Sparkles } from "lucide-react";

type FlowStep =
  | "idle"
  | "waiting_caption"
  | "choosing_source"
  | "choosing_video_option"
  | "waiting_video_upload"
  | "choosing_platform"
  | "choosing_account"
  | "choosing_ig_publish_type"
  | "done";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
  filePreview?: string;
  fileType?: "photo" | "video";
  caption?: string;
};

type QuickReply = { label: string; value: string };

const PLATFORMS: QuickReply[] = [
  { label: "📸 اینستاگرام", value: "send_instagram" },
  { label: "🎵 تیک‌تاک", value: "send_tiktok" },
  { label: "📢 تلگرام", value: "send_telegram" },
  { label: "💬 واتساپ", value: "send_whatsapp" },
  { label: "📡 ایتا", value: "send_eitaa" },
  { label: "🔵 بله", value: "send_bale" },
  { label: "🟣 روبیکا", value: "send_rubika" },
];

const BABY_WOMEN: QuickReply[] = [
  { label: "👶 نوزاد", value: "baby" },
  { label: "👗 زنانه", value: "women" },
];

const WA_SOURCE: QuickReply[] = [
  { label: "کامروا ایران", value: "wa_hoseini" },
  { label: "کامروا عراق", value: "wa_kamrava" },
];

const IG_PUBLISH_TYPE: QuickReply[] = [
  { label: "📸 پست", value: "instagram_post" },
  { label: "📖 استوری", value: "instagram_story" },
];

const PLATFORM_NAMES: Record<string, string> = {
  send_instagram: "اینستاگرام",
  send_tiktok: "تیک‌تاک",
  send_telegram: "تلگرام",
  send_whatsapp: "واتساپ",
  send_eitaa: "ایتا",
  send_bale: "بله",
  send_rubika: "روبیکا",
};

export default function CreatePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", text: "سلام 👋 یه عکس یا ویدیو بفرست تا شروع کنیم." },
  ]);
  const [step, setStep] = useState<FlowStep>("idle");
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [captionInput, setCaptionInput] = useState("");
  const [flowData, setFlowData] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const captionInputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef(2);
  const pendingFileRef = useRef<{ preview: string; type: "photo" | "video" } | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quickReplies]);

  const addMessage = (
    role: "bot" | "user",
    text: string,
    filePreview?: string,
    fileType?: "photo" | "video",
    caption?: string
  ) => {
    setMessages((prev) => [...prev, { id: messageIdRef.current++, role, text, filePreview, fileType, caption }]);
  };

  // Handle file upload
  const handleFile = (file: File, isPromoVideo = false) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      addMessage("bot", "این نوع فایل پشتیبانی نمی‌شه، لطفاً عکس یا ویدیو بفرست. ❌");
      return;
    }

    const preview = URL.createObjectURL(file);
    const fileType: "photo" | "video" = isVideo ? "video" : "photo";

    if (isPromoVideo) {
      addMessage("user", "ویدیوی تبلیغاتی 🎥", preview, fileType);
      setFlowData((prev) => ({ ...prev, video_option: "own_video" }));
      setStep("choosing_platform");
      setQuickReplies(PLATFORMS);
      addMessage("bot", "👇 محتوا کجا منتشر بشه؟");
    } else {
      // Save file data
      setFlowData((prev) => ({
        ...prev,
        file_type: fileType,
        file_name: file.name,
        caption: captionInput.trim(),
      }));

      // Show user's file with caption if exists
      const caption = captionInput.trim();
      addMessage("user", caption ? "فایل ارسال شد" : "فایل ارسال شد", preview, fileType, caption || undefined);
      setCaptionInput("");

      // If no caption, ask if they want to add one
      if (!caption) {
        pendingFileRef.current = { preview, type: fileType };
        setStep("waiting_caption");
        setQuickReplies([
          { label: "✍️ بله، متن اضافه کن", value: "add_caption" },
          { label: "❌ نه، ادامه بده", value: "skip_caption" },
        ]);
        addMessage("bot", "می‌خوای متنی هم همراه این فایل بفرستی؟");
      } else {
        // Caption exists, go directly to source choice
        proceedToSourceChoice(fileType);
      }
    }
  };

  // After caption is decided, proceed to source choice
  const proceedToSourceChoice = (fileType: "photo" | "video") => {
    setStep("choosing_source");
    setQuickReplies([
      { label: "📤 انتشار همین فایل", value: "use_own_content" },
      { label: "🤖 ادیت هوش مصنوعی", value: "use_ai" },
    ]);
    addMessage("bot", "فایل دریافت شد! می‌خوای همین محتوا رو مستقیماً منتشر کنم یا هوش مصنوعی ادیتش کنه؟");
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file, step === "waiting_video_upload");
    e.target.value = "";
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, step === "waiting_video_upload");
  };

  // Send caption text
  const sendCaption = () => {
    const text = captionInput.trim();
    if (!text) return;

    setFlowData((prev) => ({ ...prev, caption: text }));
    addMessage("user", text);
    setCaptionInput("");
    setQuickReplies([]);
    
    const fileType = pendingFileRef.current?.type || "photo";
    proceedToSourceChoice(fileType);
  };

  const onCaptionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === "waiting_caption") {
        sendCaption();
      }
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    addMessage("user", reply.label);
    setQuickReplies([]);

    switch (step) {
      case "waiting_caption":
        if (reply.value === "add_caption") {
          // Focus the caption input
          captionInputRef.current?.focus();
          addMessage("bot", "متنت رو بنویس و Enter بزن. ✍️");
          setStep("waiting_caption"); // Stay in this step but hide buttons
          return;
        } else {
          const fileType = pendingFileRef.current?.type || "photo";
          proceedToSourceChoice(fileType);
          return;
        }

      case "choosing_source":
        setFlowData((prev) => ({ ...prev, use_ai: reply.value === "use_ai" ? "بله" : "خیر" }));
        setStep("choosing_video_option");
        setQuickReplies([
          { label: "✅ بساز با AI", value: "ai_video" },
          { label: "🎥 خودم می‌فرستم", value: "own_video" },
          { label: "❌ نه، فقط عکس/ویدیوی فعلی", value: "no_video" },
        ]);
        addMessage("bot", "🎬 می‌خوای ویدیوی تبلیغاتی هم کنار این محتوا داشته باشی؟");
        break;

      case "choosing_video_option":
        if (reply.value === "own_video") {
          setStep("waiting_video_upload");
          addMessage("bot", "عالیه! ویدیو رو همینجا بفرست. 📎");
        } else {
          setFlowData((prev) => ({ ...prev, video_option: reply.label }));
          setStep("choosing_platform");
          setQuickReplies(PLATFORMS);
          addMessage("bot", "👇 محتوا کجا منتشر بشه؟");
        }
        break;

      case "choosing_platform":
        setFlowData((prev) => ({ ...prev, platform: reply.value }));
        if (reply.value === "send_whatsapp") {
          setStep("choosing_account");
          setQuickReplies(WA_SOURCE);
          addMessage("bot", "💬 از کدوم اکانت واتساپ ارسال بشه؟");
        } else {
          setStep("choosing_account");
          setQuickReplies(BABY_WOMEN);
          const name = PLATFORM_NAMES[reply.value];
          addMessage("bot", `کدوم پیج ${name}؟`);
        }
        break;

      case "choosing_account":
        setFlowData((prev) => ({ ...prev, account: reply.label }));
        if (flowData.platform === "send_instagram") {
          setStep("choosing_ig_publish_type");
          setQuickReplies(IG_PUBLISH_TYPE);
          addMessage("bot", "پست باشه یا استوری؟");
        } else {
          publishContent({ ...flowData, account: reply.label });
        }
        break;

      case "choosing_ig_publish_type":
        publishContent({ ...flowData, ig_publish_type: reply.label });
        break;
    }
  };

  const publishContent = (data: Record<string, string>) => {
    setStep("done");
    const summary =
      `✅ آماده انتشار:\n` +
      `پلتفرم: ${PLATFORM_NAMES[data.platform] || data.platform}\n` +
      `اکانت: ${data.account || "-"}\n` +
      `نوع فایل: ${data.file_type}\n` +
      `کپشن: ${data.caption || "ندارد"}\n` +
      `AI ادیت: ${data.use_ai}\n` +
      `ویدیوی تبلیغاتی: ${data.video_option || "ندارد"}\n\n` +
      `⚠️ اتصال واقعی به API این پلتفرم هنوز پیاده‌سازی نشده — این فقط یک تاییدیه‌ی تست است.`;
    addMessage("bot", summary);
  };

  const resetFlow = () => {
    setMessages([{ id: 1, role: "bot", text: "ریست شد. یه عکس یا ویدیو جدید بفرست. 👋" }]);
    setStep("idle");
    setQuickReplies([]);
    setFlowData({});
    setCaptionInput("");
    pendingFileRef.current = null;
    messageIdRef.current = 2;
  };

  return (
    <main
      className="flex min-h-screen flex-col bg-bg"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-accent/10 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-accent bg-bg px-10 py-8 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-accent" />
            <p className="font-bold text-text-primary">فایل رو اینجا رها کن</p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg/80 px-6 py-4 backdrop-blur-lg">
        <div>
          <h1 className="text-lg font-bold text-text-primary">تولید و انتشار</h1>
          <p className="text-xs text-text-secondary">دستیار هوشمند انتشار محتوا</p>
        </div>
        <button
          onClick={resetFlow}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-red-500 hover:text-red-500"
        >
          شروع مجدد
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "border border-border bg-surface-soft text-text-primary"
              }`}
            >
              {msg.filePreview && (
                msg.fileType === "photo" ? (
                  <img
                    src={msg.filePreview}
                    alt="Uploaded file"
                    className="mb-2 max-h-64 rounded-xl object-cover"
                  />
                ) : (
                  <video src={msg.filePreview} controls className="mb-2 max-h-64 rounded-xl" />
                )
              )}
              {msg.caption && (
                <p className={`mb-1 text-xs ${msg.role === "user" ? "text-white/80" : "text-text-secondary"}`}>
                  {msg.caption}
                </p>
              )}
              <span className="whitespace-pre-line">{msg.text}</span>
            </div>
          </div>
        ))}

        {quickReplies.length > 0 && (
          <div className={`grid gap-2 ${quickReplies.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {quickReplies.map((reply) => (
              <button
                key={reply.value}
                onClick={() => handleQuickReply(reply)}
                className="rounded-xl border border-border bg-surface-soft px-4 py-3 text-sm font-medium text-text-primary transition-all hover:border-accent hover:bg-accent/10"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom input bar */}
      <div className="sticky bottom-0 border-t border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-6 py-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Caption text input */}
          <input
            ref={captionInputRef}
            type="text"
            value={captionInput}
            onChange={(e) => setCaptionInput(e.target.value)}
            onKeyDown={onCaptionKeyDown}
            placeholder={
              step === "waiting_caption"
                ? "متنت رو بنویس و Enter بزن..."
                : step === "waiting_video_upload"
                ? "ویدیوی تبلیغاتی رو ارسال کن..."
                : "متن همراه فایل (اختیاری)..."
            }
            className="flex-1 rounded-full border border-border bg-surface-soft px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />

          <button
            type="button"
            onClick={sendCaption}
            disabled={!captionInput.trim()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all ${
              captionInput.trim()
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-accent/40 text-white cursor-not-allowed"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={onFileInputChange}
        />
      </div>
    </main>
  );
}