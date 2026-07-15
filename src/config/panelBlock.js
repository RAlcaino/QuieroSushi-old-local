const DEFAULT_PANEL_BLOCK = {
  enabled: true,
  allowClose: true,
  allowedLocalIds: [],
  allowedQdLocalIds: [],
  allowedEmails: [],
  blockAllAfter: "2026-07-07T08:00:00-04:00",
  newPanelUrl: "https://local.qsushi.cl",
  finalPanelUrl: "https://local.quierosushi.cl",
  supportWhatsApp: "56983916149",
  supportWhatsAppMessage:
    "Hola, no tengo acceso a mi correo registrado y necesito actualizarlo para usar el nuevo panel."
};

let runtimeConfig = { ...DEFAULT_PANEL_BLOCK };

function readArray(config, key) {
  return Array.isArray(config[key]) ? config[key] : DEFAULT_PANEL_BLOCK[key];
}

function readIdArray(config, key) {
  if (!Array.isArray(config[key])) {
    return DEFAULT_PANEL_BLOCK[key];
  }

  return config[key].map(id => {
    const asNumber = Number(id);
    return Number.isNaN(asNumber) ? String(id).trim() : asNumber;
  });
}

function normalizeConfig(config = {}) {
  return {
    ...DEFAULT_PANEL_BLOCK,
    ...config,
    allowedLocalIds: readIdArray(config, "allowedLocalIds"),
    allowedQdLocalIds: readIdArray(config, "allowedQdLocalIds"),
    allowedEmails: readArray(config, "allowedEmails")
  };
}

export function getPanelBlockConfig() {
  return runtimeConfig;
}

export function setPanelBlockConfig(config = {}) {
  runtimeConfig = normalizeConfig(config);
}

export async function loadPanelBlockConfig() {
  const baseUrl = process.env.BASE_URL || "/";
  const configUrl = `${baseUrl}config/panelBlock.json?_=${Date.now()}`;

  try {
    const response = await fetch(configUrl, { cache: "no-store" });

    if (!response.ok) {
      console.warn(
        `[panelBlock] No se pudo cargar ${configUrl}, usando valores por defecto`
      );
      return runtimeConfig;
    }

    const config = await response.json();
    setPanelBlockConfig(config);
    return runtimeConfig;
  } catch (error) {
    console.warn("[panelBlock] Error cargando configuración remota:", error);
    return runtimeConfig;
  }
}

export const PANEL_BLOCK = new Proxy(
  {},
  {
    get(_target, prop) {
      return runtimeConfig[prop];
    }
  }
);
