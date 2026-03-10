import {
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { WarningCircle, CheckCircle } from "@phosphor-icons/react";
import s from "./Input.module.css";

type MessageType = "error" | "attention" | "success";

interface IconProps {
  size?: number | string;
  weight?: "regular";
  "aria-hidden"?: boolean | "true" | "false";
}

type InputSize = "sm" | "md" | "lg";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Tamanho do input — combina com Button sizes (default: "md") */
  size?: InputSize;
  label?: ReactNode;
  leftIcon?: ComponentType<IconProps>;
  rightIcon?: ComponentType<IconProps>;
  message?: string;
  messageType?: MessageType;
}

const ICON_SIZES: Record<InputSize, number> = { sm: 14, md: 16, lg: 20 };

const messageIconMap: Record<MessageType, ComponentType<IconProps>> = {
  error: WarningCircle,
  attention: WarningCircle,
  success: CheckCircle,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      label,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      message,
      messageType,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = rest.id ?? autoId;
    const messageId = `${inputId}-msg`;
    const hasMessage = !!message && !!messageType;
    const isError = messageType === "error";
    const iconSize = ICON_SIZES[size];

    const wrapperClasses = [s.wrapper, className ?? ""].filter(Boolean).join(" ");

    const inputBoxClasses = [
      s.inputBox,
      s[size],
      isError ? s.error : "",
      disabled ? s.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    const MsgIcon = messageType ? messageIconMap[messageType] : null;

    return (
      <div className={wrapperClasses}>
        {label && <label className={s.label} htmlFor={inputId}>{label}</label>}
        <div className={inputBoxClasses}>
          {LeftIcon && <LeftIcon size={iconSize} aria-hidden="true" />}
          <input
            ref={ref}
            id={inputId}
            className={s.input}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            {...rest}
          />
          {RightIcon && <RightIcon size={iconSize} aria-hidden="true" />}
        </div>
        {hasMessage && (
          <div id={messageId} className={`${s.message} ${s[messageType]}`}>
            {MsgIcon && <MsgIcon size={14} aria-hidden="true" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
