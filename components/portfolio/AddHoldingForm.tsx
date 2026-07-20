"use client";

import { useState } from 'react';
import { addHolding } from '@/lib/portfolio/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ASSET_TYPES = [
  { value: 'stock', label: 'Stock' },
  { value: 'etf', label: 'ETF' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'index_proxy', label: 'Index Proxy (ETF)' },
];

interface AddHoldingFormProps {
  portfolioId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SelectedAsset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  source: string;
}

export default function AddHoldingForm({ portfolioId, onSuccess, onCancel }: AddHoldingFormProps) {
  const [assetType, setAssetType] = useState('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
  const [quantity, setQuantity] = useState('');
  const [averageCost, setAverageCost] = useState('');
  const [acquiredAt, setAcquiredAt] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [costError, setCostError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(`/api/markets/search?q=${encodeURIComponent(query)}&type=${assetType}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAsset = (asset: any) => {
    const selected: SelectedAsset = {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      source: asset.source,
    };
    
    if (asset.type === 'crypto') {
      selected.id = asset.id;
      selected.symbol = asset.symbol.toUpperCase();
      selected.name = asset.name;
    }
    
    setSelectedAsset(selected);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const validateQuantity = (value: string): { isValid: boolean; error: string | null } => {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, error: 'Quantity is required' };
    
    const normalized = trimmed.replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { isValid: false, error: 'Enter a quantity greater than zero, such as 2 or 0.02' };
    }
    return { isValid: true, error: null };
  };

  const validateCost = (value: string): { isValid: boolean; error: string | null } => {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, error: 'Average cost is required' };
    
    const normalized = trimmed.replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { isValid: false, error: 'Enter a valid average purchase price, such as 190 or 50000' };
    }
    return { isValid: true, error: null };
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    setQuantityError(validateQuantity(value).error);
  };

  const handleCostChange = (value: string) => {
    setAverageCost(value);
    setCostError(validateCost(value).error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAsset) {
      setError('Please select an asset');
      return;
    }

    const quantityValidation = validateQuantity(quantity);
    if (!quantityValidation.isValid) {
      setQuantityError(quantityValidation.error);
      return;
    }

    const costValidation = validateCost(averageCost);
    if (!costValidation.isValid) {
      setCostError(costValidation.error);
      return;
    }

    setIsLoading(true);

    const normalizedQuantity = quantity.trim().replace(',', '.');
    const normalizedCost = averageCost.trim().replace(',', '.');

    const formData = new FormData();
    formData.append('assetType', selectedAsset.type);
    formData.append('assetId', selectedAsset.id);
    formData.append('symbol', selectedAsset.symbol);
    formData.append('assetName', selectedAsset.name);
    formData.append('quantity', normalizedQuantity);
    formData.append('averageCost', normalizedCost);
    if (acquiredAt) formData.append('acquiredAt', acquiredAt);
    if (notes) formData.append('notes', notes);

    const result = await addHolding(portfolioId, formData);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Failed to add holding');
    }

    setIsLoading(false);
  };

  const handleClearSelection = () => {
    setSelectedAsset(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="bg-[#1E293B] border border-[#1E293B] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Add Holding</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 text-[#A1A7B3] hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <input type="hidden" name="portfolioId" value={portfolioId} />

        {/* Asset Type */}
        <div className="space-y-1.5">
          <Label htmlFor="asset-type" className="text-white text-sm">
            Asset Type <span className="text-red-500">*</span>
          </Label>
          <select
            id="asset-type"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#0B0F1A] border border-[#0B0F1A] text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading || !!selectedAsset}
          >
            {ASSET_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Asset Search */}
        <div className="space-y-1.5">
          <Label htmlFor="asset-search" className="text-white text-sm">
            Search Asset <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
            <Input
              id="asset-search"
              type="text"
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
              disabled={isLoading || !!selectedAsset}
              autoComplete="off"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3] animate-spin" />
            )}
          </div>

          {searchResults.length > 0 && !selectedAsset && (
            <div className="max-h-48 overflow-y-auto rounded-lg bg-[#0B0F1A] border border-[#1E293B]">
              {searchResults.map((result) => (
                <button
                  key={`${result.source}-${result.id}`}
                  type="button"
                  onClick={() => handleSelectAsset(result)}
                  className="w-full text-left px-4 py-2 hover:bg-[#1E293B] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{result.symbol}</p>
                      <p className="text-xs text-[#A1A7B3]">{result.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#A1A7B3] capitalize">{result.type}</span>
                      <span className="text-xs text-[#A1A7B3]">{result.source}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedAsset && (
            <div className="p-3 rounded-lg bg-[#0B0F1A] border border-[#2563EB]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{selectedAsset.symbol}</p>
                  <p className="text-xs text-[#A1A7B3]">{selectedAsset.name}</p>
                  <p className="text-[10px] text-[#A1A7B3] capitalize">{selectedAsset.type} • {selectedAsset.source}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-[#A1A7B3] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-white text-sm">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            type="text"
            inputMode="decimal"
            placeholder="For example, 2 or 0.02"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className={cn(
              "bg-[#0B0F1A] border text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]",
              quantityError ? "border-red-500" : "border-[#0B0F1A]"
            )}
            disabled={isLoading || !selectedAsset}
            autoComplete="off"
          />
          {quantityError && <p className="text-xs text-red-500">{quantityError}</p>}
        </div>

        {/* Average Cost */}
        <div className="space-y-1.5">
          <Label htmlFor="average-cost" className="text-white text-sm">
            Average Purchase Price (USD) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="average-cost"
            type="text"
            inputMode="decimal"
            placeholder="For example, 190 or 50000"
            value={averageCost}
            onChange={(e) => handleCostChange(e.target.value)}
            className={cn(
              "bg-[#0B0F1A] border text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]",
              costError ? "border-red-500" : "border-[#0B0F1A]"
            )}
            disabled={isLoading || !selectedAsset}
            autoComplete="off"
          />
          {costError && <p className="text-xs text-red-500">{costError}</p>}
        </div>

        {/* Acquired At */}
        <div className="space-y-1.5">
          <Label htmlFor="acquired-at" className="text-white text-sm">
            Acquisition Date (Optional)
          </Label>
          <Input
            id="acquired-at"
            type="date"
            value={acquiredAt}
            onChange={(e) => setAcquiredAt(e.target.value)}
            className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading || !selectedAsset}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes" className="text-white text-sm">
            Notes (Optional)
          </Label>
          <Input
            id="notes"
            type="text"
            placeholder="Add notes about this holding"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading || !selectedAsset}
            maxLength={500}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading || !selectedAsset || !quantity || !averageCost || !!quantityError || !!costError}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
          >
            {isLoading ? 'Adding...' : 'Add Holding'}
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
