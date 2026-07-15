function formatLocalLine(local) {
  const name = local.name || "Sin nombre";
  const commune = local.commune || "Sin comuna";
  return `- ${name} (${commune})`;
}

export function buildSupportWhatsAppMessage(baseMessage, locals = []) {
  const intro =
    baseMessage ||
    "Hola, no tengo acceso a mi correo registrado y necesito actualizarlo para usar el nuevo panel.";

  const lines = [intro];

  if (locals.length === 1) {
    const local = locals[0];
    const name = local.name || "Sin nombre";
    const commune = local.commune || "Sin comuna";
    lines.push("", `Local: ${name} (${commune})`);
  } else if (locals.length > 1) {
    lines.push("", "Locales:");
    locals.forEach(local => {
      lines.push(formatLocalLine(local));
    });
  }

  return lines.join("\n");
}
