"use client";

import { useState } from 'react';
import { updateHolding } from '@/lib/portfolio/actions';
import { PortfolioHolding } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditHoldingFormProps {
  holding: PortfolioHolding;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditHoldingForm({ holding, onSuccess, onCancel }: EditHoldingFormProps) {
  const [quantity, setQuantity] = useState(holding.quantity.toString());
  const [averageCost, setAverageCost] = useState(holding.averageCost.toString());
  const [acquiredAt, setAcquiredAt] = useState(holding.acquiredAt || '');
  const [notes, setNotes] = useState(holding.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('assetType', holding.assetType);
    formData.append('assetId', holding.assetId);
    formData.append('symbol', holding.symbol);
    formData.append('assetName', holding.assetName);
    formData.append('quantity', quantity);
    formData.append('averageCost', averageCost);
    formData.append('acquiredAt', acquiredAt);
    formData.append('notes', notes);

    const result = await updateHolding(holding.id, formData);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Failed to update holding');
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-[#0B0F1A] rounded-lg p-4 border border-[#1E293B]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Symbol</Label>
            <p className="text-sm text-[#A1A7B3]">{holding.symbol}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Asset Name</Label>
            <p className="text-sm text-[#A1A7B3]">{holding.assetName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-quantity" className="text-white text-sm">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-quantity"
              type="number"
              step={holding.assetType === 'crypto' ? '0.0001' : '0.01'}
              min="0.0001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-[#0B0F1A] border-[#1E293B] text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-average-cost" className="text-white text-sm">
              Average Price (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-average-cost"
              type="number"
              step="0.01"
              min="0"
              value={averageCost}
              onChange={(e) => setAverageCost(e.target.value)}
              className="bg-[#0B0F1A] border-[#1E293B] text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-acquired-at" className="text-white text-sm">
            Acquisition Date (Optional)
          </Label>
          <Input
            id="edit-acquired-at"
            type="date"
            value={acquiredAt}
            onChange={(e) => setAcquiredAt(e.target.value)}
            className="bg-[#0B0F1A] border-[#1E293B] text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-notes" className="text-white text-sm">
            Notes (Optional)
          </Label>
          <Input
            id="edit-notes"
            type="text"
            placeholder="Add notes about this holding"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-[#0B0F1A] border-[#1E293B] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading}
            maxLength={500}
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
          >
            {isLoading ? 'Updating...' : 'Update Holding'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-[#1E293B] text-white hover:bg-[#1E293B]"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
