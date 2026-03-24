export { registerIcon, registerIcons, renderIcon, hasIcon } from "./registry";

import { registerIcons } from "./registry";
import { phosphorIcons } from "./phosphor";

/** Registra todos os icones Phosphor usados internamente pelo DS */
export function registerBuiltinIcons(): void {
  registerIcons(phosphorIcons);
}
