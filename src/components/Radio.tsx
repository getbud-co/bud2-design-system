import { type InputHTMLAttributes, forwardRef } from "react";
import s from "./Radio.module.css";

type RadioSize = "sm" | "md";

export interface DecorativeRadioProps {
  /**
   * Renderiza só a caixa visual, sem `<label>` nem `<input>`, com `aria-hidden`.
   * Para itens em que outro elemento (um `<button>`) é o controle interativo e
   * carrega o estado com `aria-checked`. Evita o clique duplo que a ativação do
   * `<label>` provoca quando o radio fica dentro de um elemento clicável.
   *
   * Neste modo o `ref` não é anexado: não há `<input>` a referenciar.
   */
  decorative: true;
  checked?: boolean;
  disabled?: boolean;
  size?: RadioSize;
  className?: string;
}

export interface InteractiveRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Padrão `false`. Ver {@link DecorativeRadioProps.decorative}. */
  decorative?: false;
  size?: RadioSize;
  label?: string;
  description?: string;
}

export type RadioProps = DecorativeRadioProps | InteractiveRadioProps;

const boxSize: Record<RadioSize, number> = { sm: 16, md: 20 };

function RadioBox({ size }: { size: RadioSize }) {
  return (
    <span
      className={`${s.box} ${s[size]}`}
      style={{
        width: boxSize[size],
        height: boxSize[size],
      }}
    >
      <span className={s.dot} />
    </span>
  );
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (props, ref) => {
    if (props.decorative) {
      const {
        size = "md",
        checked = false,
        disabled = false,
        className,
      } = props;

      const wrapperClasses = [
        s.wrapper,
        s.decorative,
        checked ? s.checked : "",
        disabled ? s.disabled : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <span className={wrapperClasses} aria-hidden="true">
          <RadioBox size={size} />
        </span>
      );
    }

    const {
      // Retirado para não chegar ao <input> como atributo desconhecido.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      decorative: _decorative,
      size = "md",
      label,
      description,
      disabled = false,
      className,
      ...rest
    } = props;

    const wrapperClasses = [
      s.wrapper,
      label ? s.hasLabel : "",
      disabled ? s.disabled : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={wrapperClasses}>
        <input
          ref={ref}
          type="radio"
          className={s.input}
          disabled={disabled}
          {...rest}
        />
        <RadioBox size={size} />
        {label && (
          <span className={`${s.text} ${s[`text_${size}`]}`}>
            <span className={s.title}>{label}</span>
            {description && (
              <span className={s.description}>{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";
