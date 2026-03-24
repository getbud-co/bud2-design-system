/** Mapa de nome -> SVG innerHTML (paths internos, sem wrapper <svg>) */
const registry = new Map<string, string>();

/** Registra um icone customizado */
export function registerIcon(name: string, svgContent: string): void {
  registry.set(name, svgContent);
}

/** Registra multiplos icones de uma vez */
export function registerIcons(icons: Record<string, string>): void {
  for (const [name, svg] of Object.entries(icons)) {
    registry.set(name, svg);
  }
}

/** Renderiza um icone como string SVG */
export function renderIcon(
  name: string,
  size: number = 16,
  className = "",
): string {
  const paths = registry.get(name);
  if (!paths) return "";
  const cls = className ? ` class="${className}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" fill="currentColor"${cls} aria-hidden="true">${paths}</svg>`;
}

/** Verifica se um icone esta registrado */
export function hasIcon(name: string): boolean {
  return registry.has(name);
}
