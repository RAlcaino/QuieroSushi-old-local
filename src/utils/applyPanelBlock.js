import { getPanelBlockConfig } from "src/config/panelBlock";

function normalizeId(id) {
  const asNumber = Number(id);
  return Number.isNaN(asNumber) ? String(id).trim() : asNumber;
}

function isAllowedId(localId, allowedIds = []) {
  const normalizedLocalId = normalizeId(localId);

  return allowedIds.some(
    allowedId => normalizeId(allowedId) === normalizedLocalId
  );
}

function isPanelBlockBypassed(userContext = {}) {
  if (userContext.godMode) {
    return true;
  }

  if (Number(userContext.userId) === -1) {
    return true;
  }

  return String(userContext.role || "").trim() === "God";
}

function isBlockingActive(panelBlock) {
  if (!panelBlock.blockAllAfter) {
    return true;
  }

  return new Date() >= new Date(panelBlock.blockAllAfter);
}

function isEmailAllowed(email, panelBlock) {
  if (!email || !panelBlock.allowedEmails.length) {
    return false;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  return panelBlock.allowedEmails.some(
    allowedEmail => allowedEmail.trim().toLowerCase() === normalizedEmail
  );
}

function shouldBlockLocal(local, options) {
  if (!options.panelBlock.enabled || !options.blockingActive) {
    return false;
  }

  if (options.allowEmail) {
    return false;
  }

  if (isAllowedId(local.id, options.allowedIds)) {
    return false;
  }

  return true;
}

function markBlocked(local) {
  if (local.localStatus === "bloqueado" && local._panelMigrationBlock) {
    return local;
  }

  return {
    ...local,
    localStatus: "bloqueado",
    _panelMigrationBlock: true
  };
}

function clearMigrationBlock(local) {
  if (!local._panelMigrationBlock) {
    return local;
  }

  const restored = { ...local };
  delete restored._panelMigrationBlock;
  restored.localStatus = "normal";
  return restored;
}

export function hasMigrationBlockedLocals(locals = []) {
  return locals.some(local => local._panelMigrationBlock);
}

export function hasActiveLocals(locals = []) {
  return locals.some(local => local.localStatus === "normal");
}

export function shouldShowBlockModal(blockReason, locals = []) {
  if (blockReason === "debt") {
    return locals.some(local => local.localStatus === "bloqueado");
  }

  if (blockReason === "migration") {
    return hasMigrationBlockedLocals(locals);
  }

  return false;
}

export function applyPanelBlock(
  locals = [],
  qdLocals = [],
  userEmail = "",
  userContext = {}
) {
  const panelBlock = getPanelBlockConfig();

  if (!panelBlock.enabled || isPanelBlockBypassed(userContext)) {
    return {
      locals: locals.map(clearMigrationBlock),
      qdLocals: qdLocals.map(clearMigrationBlock),
      isMigrationBlock: false
    };
  }

  const blockingActive = isBlockingActive(panelBlock);
  const allowEmail = isEmailAllowed(userEmail, panelBlock);
  const allowedLocalIds = panelBlock.allowedLocalIds || [];
  const allowedQdLocalIds = panelBlock.allowedQdLocalIds || [];
  let isMigrationBlock = false;

  const nextLocals = locals.map(local => {
    const blocked = shouldBlockLocal(local, {
      panelBlock,
      blockingActive,
      allowEmail,
      allowedIds: allowedLocalIds
    });

    if (!blocked) {
      return clearMigrationBlock(local);
    }

    isMigrationBlock = true;
    return markBlocked(local);
  });

  const nextQdLocals = qdLocals.map(local => {
    const blocked = shouldBlockLocal(local, {
      panelBlock,
      blockingActive,
      allowEmail,
      allowedIds: allowedQdLocalIds
    });

    if (!blocked) {
      return clearMigrationBlock(local);
    }

    isMigrationBlock = true;
    return markBlocked(local);
  });

  return {
    locals: nextLocals,
    qdLocals: nextQdLocals,
    isMigrationBlock
  };
}

export function resolveBlockReason(locals = [], isMigrationBlock = false) {
  if (isMigrationBlock || hasMigrationBlockedLocals(locals)) {
    return "migration";
  }

  if (locals.some(local => local.localStatus === "bloqueado")) {
    return "debt";
  }

  return "none";
}

export function applyPanelBlockToUser(user = {}) {
  const userContext = {
    userId: user.id,
    role: user.role,
    godMode: user.godMode
  };
  const { locals, qdLocals, isMigrationBlock } = applyPanelBlock(
    user.locals || [],
    user.qdLocals || [],
    user.email,
    userContext
  );
  const blockReason = resolveBlockReason(locals, isMigrationBlock);

  return {
    ...user,
    locals,
    qdLocals,
    isMigrationBlock,
    blockReason
  };
}
