import { type InputHTMLAttributes, forwardRef } from "react";
import { Check, Minus } from "@phosphor-icons/react";
import s from "./Checkbox.module.css";

type CheckboxSize = "sm" | "md";

export interface DecorativeCheckboxProps {
  /**
   * Renderiza só a caixa visual, sem `<label>` nem `<input>`, com `aria-hidden`.
   * Para itens em que outro elemento (um `<button>`) é o controle interativo e
   * carrega o estado com `aria-checked`. Evita o clique duplo que a ativação do
   * `<label>` provoca quando o checkbox fica dentro de um elemento clicável.
   *
   * Neste modo o `ref` não é anexado: não há `<input>` a referenciar.
   */
  decorative: true;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: CheckboxSize;
  className?: string;
}

export interface InteractiveCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Padrão `false`. Ver {@link DecorativeCheckboxProps.decorative}. */
  decorative?: false;
  size?: CheckboxSize;
  indeterminate?: boolean;
  label?: string;
  description?: string;
}

export type CheckboxProps = DecorativeCheckboxProps | InteractiveCheckboxProps;

const boxSize: Record<CheckboxSize, number> = { sm: 16, md: 20 };
const iconSize: Record<CheckboxSize, number> = { sm: 12, md: 16 };

function CheckboxBox({
  size,
  indeterminate,
}: {
  size: CheckboxSize;
  indeterminate: boolean;
}) {
  const iSize = iconSize[size];

  return (
    <span
      className={`${s.box} ${s[size]}`}
      style={{
        width: boxSize[size],
        height: boxSize[size],
      }}
    >
      {indeterminate ? (
        <Minus size={iSize} className={s.icon} />
      ) : (
        <Check size={iSize} className={s.icon} />
      )}
    </span>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    if (props.decorative) {
      const {
        size = "md",
        checked = false,
        indeterminate = false,
        disabled = false,
        className,
      } = props;

      const wrapperClasses = [
        s.wrapper,
        s.decorative,
        checked ? s.checked : "",
        indeterminate ? s.indeterminate : "",
        disabled ? s.disabled : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <span className={wrapperClasses} aria-hidden="true">
          <CheckboxBox size={size} indeterminate={indeterminate} />
        </span>
      );
    }

    const {
      // Retirado para não chegar ao <input> como atributo desconhecido.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      decorative: _decorative,
      size = "md",
      indeterminate = false,
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
          ref={(node) => {
            if (node) node.indeterminate = indeterminate;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="checkbox"
          className={s.input}
          disabled={disabled}
          {...rest}
        />
        <CheckboxBox size={size} indeterminate={indeterminate} />
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

Checkbox.displayName = "Checkbox";
