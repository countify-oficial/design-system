// Ícones da Countify (os da @countify/ui 0.1.0): traço de 1,8 numa caixa de 22 × 22, na cor do texto (currentColor).
// O mesmo desenho na web (<svg> do Icon do core) e no celular (SvgXml do react-native-svg, no Icon do native).

/** Caixa (viewBox) e traço dos ícones. */
export const iconGrid = { box: 22, stroke: 1.8 } as const;

export const icons = {
  back: '<path d="M14 4l-7 7 7 7"/>',
  "chevron-right": '<path d="M8 4l6 7-6 7"/>',
  "chevron-down": '<path d="M6 9l5 5 5-5"/>',
  close: '<path d="M5 5l12 12M17 5L5 17"/>',
  plus: '<path d="M11 5v12M5 11h12"/>',
  minus: '<path d="M5 11h12"/>',
  check: '<path d="M4 11l5 5 9-10"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l4 4"/>',
  edit: '<path d="M14 4l4 4-10 10H4v-4z"/>',
  bookmark: '<path d="M6 3h10v16l-5-4-5 4z"/>',
  trash: '<path d="M4 6h14M9 6V4h4v2M6 6l1 13h8l1-13"/>',
  download: '<path d="M11 3v11M6 9l5 5 5-5M4 19h14"/>',
  upload: '<path d="M6 3h7l4 4v12H6zM13 3v4h4M9 13l2-2 2 2M11 11v6"/>',
  "arrow-up": '<path d="M11 18V5M5 11l6-6 6 6"/>',
  "arrow-down": '<path d="M11 4v13M5 11l6 6 6-6"/>',
  eye: '<path d="M2 11s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="11" cy="11" r="2.5"/>',
  "eye-off": '<path d="M2 11s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="11" cy="11" r="2.5"/><path d="M3 3l16 16"/>',
  help: '<circle cx="11" cy="11" r="8"/><path d="M8.8 8.6a2.3 2.3 0 0 1 4.4.9c0 1.5-2.2 2-2.2 3.2M11 15.4v.01"/>',
  info: '<circle cx="11" cy="11" r="8"/><path d="M11 10v5M11 7v.01"/>',
  alert: '<path d="M11 3l9 16H2zM11 9v4M11 16v.01"/>',
  clock: '<circle cx="11" cy="11" r="8"/><path d="M11 7v4l3 2"/>',
  calendar: '<rect x="3" y="5" width="16" height="14" rx="2"/><path d="M3 9h16M7 3v4M15 3v4"/>',
  email: '<path d="M3 6h16v11H3zM3 6l8 6 8-6"/>',
  key: '<circle cx="7" cy="14" r="3.5"/><path d="M9.5 11.5L18 3M15 6l2 2M13 8l2 2"/>',
  wifi: '<path d="M2 8a13 13 0 0 1 18 0M5 11.5a8 8 0 0 1 12 0M8 15a3.5 3.5 0 0 1 6 0M11 18v.01"/>',
  store: '<path d="M4 9h14v10H4zM3 9l2-5h12l2 5M9 19v-5h4v5"/>',
  group: '<path d="M11 3l8 4-8 4-8-4 8-4zM3 11l8 4 8-4M3 15l8 4 8-4"/>',
  person: '<circle cx="11" cy="8" r="3.5"/><path d="M4 19c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  people: '<circle cx="8" cy="8" r="3"/><path d="M2 18c0-3 2.7-5 6-5s6 2 6 5M15 5.5a3 3 0 0 1 0 5.5M17 13c2 .6 3.5 2.3 3.5 5"/>',
  face: '<path d="M4 8V5a1 1 0 0 1 1-1h3M14 4h3a1 1 0 0 1 1 1v3M18 14v3a1 1 0 0 1-1 1h-3M8 18H5a1 1 0 0 1-1-1v-3"/><circle cx="11" cy="10" r="2.5"/><path d="M7.5 16c.6-1.7 2-2.5 3.5-2.5s2.9.8 3.5 2.5"/>',
  camera: '<path d="M3 7h3l2-3h6l2 3h3v11H3z"/><circle cx="11" cy="12" r="3.5"/>',
  door: '<path d="M5 19V4h12v15M3 19h16M13 12v.01"/>',
  computer: '<path d="M4 5h14v9H4zM8 18h6M11 14v4"/>',
  windows: '<path d="M3 5l7-1v7H3zM12 4l7-1v8h-7zM3 13h7v7l-7-1zM12 13h7v8l-7-1z"/>',
  linux: '<path d="M11 3c-2 0-3 2-3 4v3l-3 5c-1 2 0 4 2 4h8c2 0 3-2 2-4l-3-5V7c0-2-1-4-3-4zM9 8h.01M13 8h.01"/>',
  dashboard: '<path d="M4 18V11M9 18V5M14 18V9M19 18V13"/>',
  analytics: '<path d="M3 3v16h16M6 14l4-4 3 3 5-6"/>',
  bell: '<path d="M6 9a5 5 0 0 1 10 0c0 5 2 6 2 6H4s2-1 2-6M9 18a2 2 0 0 0 4 0"/>',
  settings: '<g transform="scale(0.9167)"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></g>',
  sliders: '<path d="M4 6h14M4 11h14M4 16h14"/><circle cx="8" cy="6" r="2"/><circle cx="14" cy="11" r="2"/><circle cx="9" cy="16" r="2"/>',
  "bar-chart": '<path d="M5 18V8M11 18V4M17 18v-7"/>',
  number: '<rect x="4" y="4" width="14" height="14" rx="2"/><path d="M10 9l2-1v6"/>',
  ranking: '<path d="M4 6h14M4 11h10M4 16h6"/>',
  scatter: '<path d="M3 3v16h16"/><circle cx="8" cy="13" r="1.3"/><circle cx="12" cy="9" r="1.3"/><circle cx="16" cy="6" r="1.3"/><circle cx="14" cy="13" r="1.3"/>',
  heatmap: '<rect x="3" y="3" width="4.5" height="4.5" rx="1"/><rect x="8.75" y="3" width="4.5" height="4.5" rx="1"/><rect x="14.5" y="3" width="4.5" height="4.5" rx="1"/><rect x="3" y="8.75" width="4.5" height="4.5" rx="1"/><rect x="8.75" y="8.75" width="4.5" height="4.5" rx="1"/><rect x="14.5" y="8.75" width="4.5" height="4.5" rx="1"/><rect x="3" y="14.5" width="4.5" height="4.5" rx="1"/><rect x="8.75" y="14.5" width="4.5" height="4.5" rx="1"/><rect x="14.5" y="14.5" width="4.5" height="4.5" rx="1"/>',
  funnel: '<path d="M3 4h16l-6 7v6l-4 2v-8z"/>',
  table: '<rect x="3" y="4" width="16" height="14" rx="2"/><path d="M3 9h16M3 14h16M9 4v14"/>',
  // estrela: acrescentada no passo 7 para o Rating, no traço do conjunto (não estava na 0.1.0)
  star: '<path d="M11 3l2.4 5 5.4.6-4 3.7 1.1 5.4L11 15l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/>',
  logout: '<path d="M9 4H5v14h4M13 7l4 4-4 4M17 11H8"/>',
};

export type IconName = keyof typeof icons;

/** O <svg> completo de um ícone, com a cor pedida (padrão: currentColor) e, se pedido, o preenchimento (a estrela cheia). */
export const iconSvg = (name: IconName, color = "currentColor", fill = "none"): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${iconGrid.box} ${iconGrid.box}" fill="${fill}" stroke="${color}" stroke-width="${iconGrid.stroke}" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
