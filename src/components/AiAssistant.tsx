import { useState, useRef, useLayoutEffect, type FormEvent } from "react";
import {
  Lightning,
  SidebarSimple,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  FileArrowUp,
  Link,
  MagnifyingGlass,
  File as FileIcon,
} from "@phosphor-icons/react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Popover, type PopoverItem } from "./Popover";
import { AiAssistantResponse } from "./AiAssistantResponse";
import s from "./AiAssistant.module.css";

interface MessageContext {
  fileCount: number;
  missionCount: number;
}

interface Message {
  id: string;
  requestId: string;
  role: "user" | "assistant";
  content: string;
  context?: MessageContext;
}

export interface AiAssistantInteractionEvent {
  phase: "submitted" | "response_received" | "response_presented" | "request_failed" | "response_not_presented" | "copy_succeeded" | "copy_failed";
  requestId: string;
  /** Monotonic browser time (performance.now), in milliseconds. No message content. */
  timestampMs: number;
}

type InteractionPhase = AiAssistantInteractionEvent["phase"];
type InteractionObserver = (event: AiAssistantInteractionEvent) => void;

interface PendingRequest {
  id: string;
  observer?: InteractionObserver;
  received: boolean;
  presentationReported: boolean;
}

function reportInteraction(observer: InteractionObserver | undefined, requestId: string, phase: InteractionPhase) {
  try {
    observer?.({ phase, requestId, timestampMs: performance.now() });
  } catch {
    // Optional instrumentation must not interrupt the conversation.
  }
}

function reportPresentation(request: PendingRequest, phase: "response_presented" | "response_not_presented") {
  if (request.presentationReported) return;
  request.presentationReported = true;
  reportInteraction(request.observer, request.id, phase);
}

export interface MissionItem {
  id: string;
  label: string;
}

export interface AiAssistantProps {
  title?: string;
  heading?: string;
  suggestions?: string[];
  placeholder?: string;
  onClose?: () => void;
  /** Returns a complete Markdown response (CommonMark + GFM). Raw HTML is not rendered. */
  onMessage?: (text: string) => Promise<string>;
  /** Maps transport failures to safe user guidance; never renders raw errors by default. */
  getErrorMessage?: (error: unknown) => string;
  /** Optional lifecycle/copy events. Includes only an ephemeral request ID and local time. */
  onInteraction?: InteractionObserver;
  /** Called when user clicks "Usar como base" on an assistant message */
  onUseAsBase?: (messageContent: string) => void;
  allowUpload?: boolean;
  missions?: MissionItem[];
  selectedMissions?: string[];
  onMissionsChange?: (ids: string[]) => void;
}

let nextId = 0;
function uid() {
  return `msg-${++nextId}-${Date.now()}`;
}

export function AiAssistant({
  title = "Assistente de criação",
  heading = "Tenha ajuda na criação das suas missões",
  suggestions = [
    "Faça uma revisão do meu Q1",
    "Dê sugestões de OKR",
    "Sugestões de PDI com base na minha performance",
  ],
  placeholder = "Pergunte ao bud...",
  onClose,
  onMessage,
  getErrorMessage,
  onInteraction,
  onUseAsBase,
  allowUpload,
  missions,
  selectedMissions,
  onMissionsChange,
}: AiAssistantProps) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasUnreadReply, setHasUnreadReply] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [missionSearch, setMissionSearch] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [pendingUpload, setPendingUpload] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const attachButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);
  const activeRequestRef = useRef<PendingRequest | null>(null);
  const followMessagesRef = useRef(true);

  const hasAttach = !!(allowUpload || missions);

  function scrollToBottom() {
    const el = messageListRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const request = activeRequestRef.current;
      if (request?.received) reportPresentation(request, "response_not_presented");
    };
  }, []);

  useLayoutEffect(() => {
    if (followMessagesRef.current) {
      scrollToBottom();
    } else if (messages.at(-1)?.role === "assistant") {
      setHasUnreadReply(true);
    }

    const request = activeRequestRef.current;
    if (!busy && request?.received && messages.at(-1)?.requestId === request.id) {
      activeRequestRef.current = null;
      reportPresentation(request, "response_presented");
    }
  }, [messages, busy]);

  useLayoutEffect(() => {
    if (pendingUpload) {
      setPendingUpload(false);
      fileInputRef.current?.click();
    }
  }, [pendingUpload]);

  async function sendMessage(text: string) {
    // React may batch two clicks before busy is committed to the DOM.
    if (activeRequestRef.current) return;
    const fileCount = attachedFiles.length;
    const missionCount = selectedMissionCount;
    const context: MessageContext | undefined =
      fileCount > 0 || missionCount > 0
        ? { fileCount, missionCount }
        : undefined;

    const request: PendingRequest = { id: uid(), observer: onInteraction, received: false, presentationReported: false };
    if (onMessage) activeRequestRef.current = request;
    followMessagesRef.current = true;
    setHasUnreadReply(false);
    setFeedback("");
    const userMsg: Message = { id: request.id, requestId: request.id, role: "user", content: text, context };
    setMessages((prev) => [...prev, userMsg]);
    setValue("");
    setAttachedFiles([]);
    inputRef.current?.focus({ preventScroll: true });

    if (!onMessage) {
      if (missionCount > 0) onMissionsChange?.([]);
      return;
    }

    setBusy(true);
    reportInteraction(request.observer, request.id, "submitted");

    try {
      if (missionCount > 0) onMissionsChange?.([]);
      const response = await onMessage(text);
      request.received = true;
      reportInteraction(request.observer, request.id, "response_received");
      if (!mountedRef.current) {
        reportPresentation(request, "response_not_presented");
        activeRequestRef.current = null;
        return;
      }
      const aiMsg: Message = { id: uid(), requestId: request.id, role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      activeRequestRef.current = null;
      reportInteraction(request.observer, request.id, "request_failed");
      if (mountedRef.current) {
        setValue((draft) => draft || text);
        let message = "Não foi possível receber a resposta. Confira os dados antes de repetir uma alteração.";
        try {
          message = getErrorMessage?.(error) || message;
        } catch {
          // A consumer's formatter must not hide the failure or block recovery.
        }
        setFeedback(message);
      }
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }

  async function copyResponse(message: Message) {
    setFeedback("");
    try {
      await navigator.clipboard.writeText(message.content);
      reportInteraction(onInteraction, message.requestId, "copy_succeeded");
      if (mountedRef.current) setFeedback("Resposta copiada.");
    } catch {
      reportInteraction(onInteraction, message.requestId, "copy_failed");
      if (mountedRef.current) setFeedback("Não foi possível copiar. Selecione o texto da resposta e copie manualmente.");
    }
  }

  function handleMessageScroll() {
    const el = messageListRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= 32;
    followMessagesRef.current = nearBottom;
    if (nearBottom) setHasUnreadReply(false);
  }

  function revealReply() {
    followMessagesRef.current = true;
    scrollToBottom();
    setHasUnreadReply(false);
    messageListRef.current?.focus({ preventScroll: true });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !busy) {
      sendMessage(trimmed);
    }
  }

  function handleSuggestion(text: string) {
    if (!busy) {
      sendMessage(text);
    }
  }

  function handleToggleAttach() {
    if (busy) return;
    setAttachOpen((prev) => {
      if (prev) setMissionSearch("");
      return !prev;
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
    e.target.value = "";
  }

  function handleMissionToggle(id: string) {
    if (!onMissionsChange || !selectedMissions) return;
    const next = selectedMissions.includes(id)
      ? selectedMissions.filter((m) => m !== id)
      : [...selectedMissions, id];
    onMissionsChange(next);
  }

  const filteredMissions = missions?.filter((m) =>
    m.label.toLowerCase().includes(missionSearch.toLowerCase()),
  );

  const selectedMissionCount = selectedMissions?.filter((id) =>
    missions?.some((m) => m.id === id),
  ).length ?? 0;
  const hasContext = attachedFiles.length > 0 || selectedMissionCount > 0;
  const hasMessages = messages.length > 0 || busy;

  return (
    <div className={s.container} role="region" aria-label={title}>
      <div className={s.header}>
        <Lightning size={16}  className={s.headerIcon} />
        <h2 className={s.title}>{title}</h2>
        {onClose && (
          <Button
            variant="tertiary"
            size="md"
            leftIcon={SidebarSimple}
            onClick={onClose}
            aria-label="Recolher assistente"
          />
        )}
      </div>

      {!hasMessages ? (
        <div className={s.body}>
          <div className={s.symbol} aria-hidden="true">
            <BudSymbol />
          </div>
          <p className={s.heading}>{heading}</p>
          {suggestions.length > 0 && (
            <div className={s.suggestions}>
              {suggestions.map((text) => (
                <button
                  key={text}
                  type="button"
                  className={s.suggestion}
                  onClick={() => handleSuggestion(text)}
                >
                  <Lightning size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className={s.messageList}
          ref={messageListRef}
          role="log"
          aria-label="Conversa com o assistente"
          aria-live="polite"
          aria-relevant="additions"
          tabIndex={0}
          onScroll={handleMessageScroll}
        >
          {messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className={s.userMessage}>
                {msg.context && (
                  <div className={s.userContext}>
                    {msg.context.fileCount > 0 && (
                      <span className={s.userContextBadge}>
                        <FileIcon size={10} aria-hidden="true" />
                        {msg.context.fileCount} {msg.context.fileCount === 1 ? "arquivo" : "arquivos"}
                      </span>
                    )}
                    {msg.context.missionCount > 0 && (
                      <span className={s.userContextBadge}>
                        <Link size={10} aria-hidden="true" />
                        {msg.context.missionCount} {msg.context.missionCount === 1 ? "missão / pesquisa" : "missões / pesquisas"}
                      </span>
                    )}
                  </div>
                )}
                <p className={s.userText}>{msg.content}</p>
              </div>
            ) : (
              <div key={msg.id} className={s.aiMessage}>
                <Lightning
                  size={16}
                  className={s.aiIcon}
                  aria-hidden="true"
                />
                <div className={s.aiContent}>
                  <AiAssistantResponse content={msg.content} />
                  <div className={s.messageActions}>
                    <Button variant="tertiary" size="sm" leftIcon={Copy} onClick={() => { void copyResponse(msg); }}>
                      Copiar resposta
                    </Button>
                    {onUseAsBase && (
                      <button
                        type="button"
                        className={s.useAsBaseBtn}
                        onClick={() => onUseAsBase(msg.content)}
                      >
                        <ArrowUp size={12} aria-hidden="true" />
                        Usar como base
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {hasUnreadReply && (
        <Button variant="tertiary" size="sm" leftIcon={ArrowDown} className={s.newReply} onClick={revealReply}>
          Ver nova resposta
        </Button>
      )}
      <div className={s.status} role="status" aria-live="polite" aria-atomic="true">
        {busy && (
          <span className={s.waiting}>
            <span className={s.typingDots} aria-hidden="true">
              <span className={s.dot} />
              <span className={s.dot} />
              <span className={s.dot} />
            </span>
            Analisando…
          </span>
        )}
        {feedback && <span>{feedback}</span>}
      </div>

      <form className={s.inputArea} onSubmit={handleSubmit}>
        <div className={s.inputGlow} aria-hidden="true" />
        {allowUpload && (
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className={s.fileInput}
            onChange={handleFileChange}
            tabIndex={-1}
          />
        )}
        <div className={s.inputBox}>
          {hasContext && (
            <div className={s.contextStrip}>
              {attachedFiles.length > 0 && (
                <span className={s.contextBadge}>
                  <FileIcon size={12} className={s.contextBadgeIcon} />
                  <span className={s.contextBadgeLabel}>
                    {attachedFiles.length} {attachedFiles.length === 1 ? "arquivo" : "arquivos"}
                  </span>
                  <button
                    type="button"
                    className={s.contextBadgeRemove}
                    onClick={() => setAttachedFiles([])}
                    aria-label="Remover todos os arquivos"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedMissionCount > 0 && (
                <span className={s.contextBadge}>
                  <Link size={12} className={s.contextBadgeIcon} />
                  <span className={s.contextBadgeLabel}>
                    {selectedMissionCount} {selectedMissionCount === 1 ? "missão / pesquisa" : "missões / pesquisas"}
                  </span>
                  <button
                    type="button"
                    className={s.contextBadgeRemove}
                    onClick={() => onMissionsChange?.([])}
                    aria-label="Remover todas as missões e pesquisas"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
          <div className={s.inputRow}>
            <input
              ref={inputRef}
              className={s.input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
            />
            {hasAttach && (
              <>
                <button
                  type="button"
                  className={s.attachButton}
                  ref={attachButtonRef}
                  onClick={handleToggleAttach}
                  aria-label="Opções de anexo"
                  disabled={busy}
                >
                  <Plus size={14} />
                </button>
                <Popover
                  items={(() => {
                    const menuItems: PopoverItem[] = [];
                    if (allowUpload) {
                      menuItems.push({
                        id: "upload",
                        label: "Enviar arquivo",
                        icon: FileArrowUp,
                        onClick: () => setPendingUpload(true),
                      });
                    }
                    if (missions && missions.length > 0) {
                      menuItems.push({
                        id: "missions",
                        label: "Missão / Pesquisa",
                        icon: Link,
                        badge: selectedMissionCount,
                        submenu: (
                          <>
                            <div className={s.missionSearchBox}>
                              <MagnifyingGlass
                                size={14}
                                className={s.missionSearchIcon}
                              />
                              <input
                                className={s.missionSearchInput}
                                value={missionSearch}
                                onChange={(e) => setMissionSearch(e.target.value)}
                                placeholder="Buscar missão..."
                                aria-label="Buscar missão"
                              />
                            </div>
                            <div className={s.missionList}>
                              {filteredMissions?.map((m) => (
                                <label key={m.id} className={s.missionListItem}>
                                  <Checkbox
                                    size="sm"
                                    checked={
                                      selectedMissions?.includes(m.id) ?? false
                                    }
                                    onChange={() => handleMissionToggle(m.id)}
                                  />
                                  <span className={s.missionLabel}>
                                    {m.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </>
                        ),
                      });
                    }
                    return menuItems;
                  })()}
                  open={attachOpen}
                  onClose={() => {
                    setAttachOpen(false);
                    setMissionSearch("");
                  }}
                  anchorRef={attachButtonRef}
                />
              </>
            )}
            <button
              type="submit"
              className={s.submitButton}
              aria-label="Enviar mensagem"
              disabled={!value.trim() || busy}
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function BudSymbol() {
  return (
    <svg viewBox="0 0 240 92" fill="none" className={s.budSymbol}>
      <path
        d="M239.986 44.8463C239.406 21.0338 220.559 1.4407 196.862 0.0776031C189.718 -0.333 182.901 0.900098 176.753 3.43709V3.43451L155.54 12.2361C153.849 12.9376 151.913 12.6686 150.476 11.532L148.329 9.83555C140.532 3.67521 130.693 0.000373357 119.999 0.000373357C113.82 0.000373357 107.926 1.22832 102.545 3.45511V3.45253L6.85696 43.3789L6.85439 43.3802L6.50423 43.5269L6.47217 43.5398V43.5411C5.14977 44.1216 3.9659 44.9634 2.98469 45.9983C1.13641 47.947 0 50.5831 0 53.4869C0 56.3882 1.13385 59.0243 2.9834 60.9756C4.41226 62.4816 6.26695 63.5757 8.35507 64.0648L8.37816 64.0712L107.653 90.31C111.58 91.4105 115.722 91.9987 119.999 91.9987C130.693 91.9987 140.53 88.3239 148.329 82.1635C148.969 81.6577 149.595 81.1364 150.207 80.5984C151.668 79.3138 153.718 78.9521 155.513 79.7012L176.325 88.3844L176.755 88.5646C182.124 90.7785 188.003 92 194.166 92C214.255 92 231.327 79.0306 237.515 60.9782C239.243 55.9364 240.124 50.5046 239.986 44.8463ZM148.33 46.2827V46.3342C148.33 46.3754 148.33 46.4166 148.329 46.4565C148.245 51.7789 146.704 56.7447 144.087 60.9743C141.591 65.0083 138.118 68.3678 133.998 70.7207C129.87 73.0788 125.094 74.4264 120.004 74.4264C115.121 74.4264 110.528 73.1869 106.52 71.0052C102.178 68.6419 98.5204 65.1731 95.9217 60.9743C94.498 58.6729 93.3924 56.1539 92.6664 53.4754C92.02 51.0915 91.6762 48.5854 91.6762 45.997C91.6762 43.3287 92.0418 40.7441 92.7293 38.2946C94.5083 31.9335 98.4383 26.4734 103.683 22.7586C108.297 19.4879 113.927 17.5675 120.006 17.5675C125.053 17.5675 129.792 18.892 133.897 21.2153C142.39 26.019 148.167 35.0947 148.33 45.5387C148.331 45.5799 148.331 45.6198 148.331 45.6597V45.7112C148.334 45.8065 148.334 45.9017 148.334 45.997C148.333 46.0922 148.333 46.1875 148.33 46.2827ZM218.252 60.9743C213.256 69.05 204.338 74.4264 194.169 74.4264C187.602 74.4264 181.558 72.1829 176.755 68.4205C174.119 66.3572 171.857 63.8344 170.087 60.9743C167.396 56.625 165.842 51.4931 165.842 45.9983C165.842 36.8878 170.113 28.7774 176.755 23.576C181.558 19.8123 187.602 17.5701 194.169 17.5701C209.814 17.5701 222.498 30.2975 222.498 45.9995C222.497 51.4931 220.943 56.6237 218.252 60.9743Z"
        fill="currentColor"
      />
    </svg>
  );
}
