import {
  type ComponentType,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { WarningCircle, CheckCircle } from "@phosphor-icons/react";
import s from "./Textarea.module.css";

type MessageType = "error" | "attention" | "success";

interface IconProps {
  size?: number | string;
  weight?: "regular";
}

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: ReactNode;
  message?: string;
  messageType?: MessageType;
}

const messageIconMap: Record<MessageType, ComponentType<IconProps>> = {
  error: WarningCircle,
  attention: WarningCircle,
  success: CheckCircle,
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      message,
      messageType,
      disabled = false,
      className,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const textareaId = rest.id ?? autoId;
    const messageId = `${textareaId}-message`;
    const hasMessage = !!message && !!messageType;
    const isError = messageType === "error";

    const wrapperClasses = [s.wrapper, className ?? ""]
      .filter(Boolean)
      .join(" ");

    const boxClasses = [
      s.textareaBox,
      isError ? s.error : "",
      disabled ? s.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    const MsgIcon = messageType ? messageIconMap[messageType] : null;

    return (
      <div className={wrapperClasses}>
        {label && <label className={s.label} htmlFor={textareaId}>{label}</label>}
        <div className={boxClasses}>
          <textarea
            ref={ref}
            id={textareaId}
            className={s.textarea}
            disabled={disabled}
            rows={rows}
            aria-invalid={isError || undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            {...rest}
          />
        </div>
        {hasMessage && (
          <div id={messageId} className={`${s.message} ${s[messageType]}`}>
            {MsgIcon && <MsgIcon size={14} />}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
