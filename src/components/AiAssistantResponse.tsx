import { createContext, memo, useContext, useId, type ComponentProps } from "react";
import Markdown, { type ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Checkbox } from "./Checkbox";
import { Table, TableContent, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "./Table";
import s from "./AiAssistantResponse.module.css";

const plugins = [remarkGfm, remarkBreaks];
const InsideLink = createContext(false);
const ChecklistLabel = createContext("Item da lista");

// Inline formatting belongs in the name; nested list items have their own labels.
function checklistText(node: NonNullable<ExtraProps["node"]>): string {
  if (["input", "ul", "ol"].includes(node.tagName)) return "";
  if (node.tagName === "br") return " ";
  if (node.tagName === "img") return String(node.properties.alt || "");
  return node.children.map(child => child.type === "text" ? child.value
    : child.type === "element" ? checklistText(child) : "").join("");
}

function ResponseCheckbox({ checked }: ComponentProps<"input">) {
  const label = useContext(ChecklistLabel);
  return <Checkbox size="sm" checked={Boolean(checked)} disabled readOnly aria-label={label} className={s.taskCheckbox} />;
}

// Model-authored image URLs are opened deliberately, not fetched by the chat.
function ResponseImage({ src, alt }: ComponentProps<"img">) {
  const insideLink = useContext(InsideLink);
  const label = alt || "Ver imagem";
  if (insideLink || typeof src !== "string" || !src) return <>{label}</>;
  return <a href={src} target="_blank" rel="noopener noreferrer">{label}</a>;
}

/** Response presentation only; copying and applying keep the original string. */
export const AiAssistantResponse = memo(function AiAssistantResponse({ content }: { content: string }) {
  const prefix = `bud-response-${useId()}-`;

  return (
    <div className={s.response}>
      <Markdown
        remarkPlugins={plugins}
        skipHtml
        remarkRehypeOptions={{ clobberPrefix: prefix, footnoteLabel: "Notas", footnoteBackLabel: "Voltar para a referência" }}
        components={{
          a({ children, href, id, title, className, "aria-describedby": describedBy, "aria-label": label }) {
            if (!href) return <>{children}</>;
            return (
              <InsideLink.Provider value={true}>
                <a
                  href={href}
                  id={id}
                  title={title}
                  className={className}
                  aria-label={label}
                  aria-describedby={describedBy === "footnote-label" ? `${prefix}footnote-label` : describedBy}
                  target={href.startsWith("#") ? undefined : "_blank"}
                  rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
                >{children}</a>
              </InsideLink.Provider>
            );
          },
          h2({ children, id }) {
            return <h2 id={id === "footnote-label" ? `${prefix}footnote-label` : id}>{children}</h2>;
          },
          li({ children, className, node, ...rest }) {
            const item = <li {...rest} className={className}>{children}</li>;
            return className?.split(" ").includes("task-list-item") && node
              ? <ChecklistLabel.Provider value={checklistText(node).trim() || "Item da lista"}>{item}</ChecklistLabel.Provider>
              : item;
          },
          input: ResponseCheckbox,
          table({ children }) {
            return <Table density="compact" elevated={false}><TableContent aria-label="Tabela da resposta">{children}</TableContent></Table>;
          },
          thead({ children }) { return <TableHead>{children}</TableHead>; },
          tbody({ children }) { return <TableBody>{children}</TableBody>; },
          tr({ children }) { return <TableRow>{children}</TableRow>; },
          th({ children, style }) { return <TableHeaderCell style={style}>{children}</TableHeaderCell>; },
          td({ children, style }) { return <TableCell style={style}>{children}</TableCell>; },
          pre({ children }) {
            return <pre tabIndex={0} aria-label="Trecho de código">{children}</pre>;
          },
          img: ResponseImage,
        }}
      >{content}</Markdown>
    </div>
  );
});
