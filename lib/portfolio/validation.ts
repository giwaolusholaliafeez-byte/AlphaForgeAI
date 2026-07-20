import { z } from 'zod';

export const PortfolioFormSchema = z.object({
  name: z.string()
    .min(2, 'Portfolio name must be at least 2 characters')
    .max(60, 'Portfolio name must be at most 60 characters')
    .trim(),
});

export const HoldingFormSchema = z.object({
  assetType: z.enum(['stock', 'etf', 'crypto', 'fx', 'index_proxy']),
  assetId: z.string().min(1, 'Asset ID is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  assetName: z.string().min(1, 'Asset name is required'),
  quantity: z.number()
    .positive('Quantity must be greater than 0')
    .finite('Quantity must be a valid number'),
  averageCost: z.number()
    .min(0, 'Average cost cannot be negative')
    .finite('Average cost must be a valid number'),
  acquiredAt: z.string().nullable().optional(),
  notes: z.string()
    .max(500, 'Notes must be at most 500 characters')
    .nullable()
    .optional(),
});

export const CashBalanceSchema = z.object({
  cashBalance: z.number()
    .min(0, 'Cash balance cannot be negative')
    .finite('Cash balance must be a valid number'),
});

export const PortfolioActionSchema = z.object({
  portfolioId: z.string().uuid('Invalid portfolio ID'),
});

export const HoldingActionSchema = z.object({
  holdingId: z.string().uuid('Invalid holding ID'),
});

export function validatePortfolioName(name: string): { valid: boolean; error?: string } {
  try {
    PortfolioFormSchema.parse({ name });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Invalid portfolio name' };
    }
    return { valid: false, error: 'Invalid portfolio name' };
  }
}

export function validateHoldingData(data: any): { valid: boolean; error?: string } {
  try {
    HoldingFormSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Invalid holding data' };
    }
    return { valid: false, error: 'Invalid holding data' };
  }
}
