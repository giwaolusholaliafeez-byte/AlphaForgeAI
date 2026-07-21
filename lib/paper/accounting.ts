export interface PaperPositionState { quantity: number; averageCost: number; }
export interface PaperAccountState { cash: number; positions: Record<string, PaperPositionState>; realizedPnl: number; }
export interface PaperExecution { side: "buy" | "sell"; symbol: string; quantity: number; price: number; orderValue: number; cashBefore: number; cashAfter: number; realizedPnl: number; position: PaperPositionState | null; }

const SCALE = 100000000;
export function roundMoney(value: number): number { return Math.round(value * SCALE) / SCALE; }
export function validateTrade(quantity: number, price: number): void { if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("Quantity must be greater than zero."); if (!Number.isFinite(price) || price <= 0) throw new Error("Price must be greater than zero."); }
export function executePaperTrade(account: PaperAccountState, symbol: string, side: "buy" | "sell", quantity: number, price: number): { account: PaperAccountState; execution: PaperExecution } {
  validateTrade(quantity, price);
  const existing = account.positions[symbol];
  const orderValue = roundMoney(quantity * price);
  const cashBefore = account.cash;
  if (side === "buy") {
    if (account.cash < orderValue) throw new Error("Insufficient buying power.");
    const totalQuantity = (existing?.quantity ?? 0) + quantity;
    const averageCost = roundMoney(((existing?.quantity ?? 0) * (existing?.averageCost ?? 0) + orderValue) / totalQuantity);
    const position = { quantity: roundMoney(totalQuantity), averageCost };
    const next = { ...account, cash: roundMoney(account.cash - orderValue), positions: { ...account.positions, [symbol]: position } };
    return { account: next, execution: { side, symbol, quantity, price, orderValue, cashBefore, cashAfter: next.cash, realizedPnl: 0, position } };
  }
  if (!existing || existing.quantity < quantity) throw new Error("Insufficient position quantity.");
  const realizedPnl = roundMoney((price - existing.averageCost) * quantity);
  const remainingQuantity = roundMoney(existing.quantity - quantity);
  const positions = { ...account.positions };
  const position = remainingQuantity === 0 ? null : { ...existing, quantity: remainingQuantity };
  if (position) positions[symbol] = position; else delete positions[symbol];
  const next = { ...account, cash: roundMoney(account.cash + orderValue), positions, realizedPnl: roundMoney(account.realizedPnl + realizedPnl) };
  return { account: next, execution: { side, symbol, quantity, price, orderValue, cashBefore, cashAfter: next.cash, realizedPnl, position } };
}

export function calculateUnrealizedPnl(position: PaperPositionState, currentPrice: number): number { validateTrade(position.quantity, currentPrice); return roundMoney((currentPrice - position.averageCost) * position.quantity); }
export function calculateEquity(account: PaperAccountState, prices: Record<string, number>): number { return roundMoney(account.cash + Object.entries(account.positions).reduce((total, [symbol, position]) => total + position.quantity * (prices[symbol] ?? position.averageCost), 0)); }
