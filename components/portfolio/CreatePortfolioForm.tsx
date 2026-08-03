"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortfolio } from '@/lib/portfolio/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface CreatePortfolioFormProps {
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreatePortfolioForm({ onSuccess, open, onOpenChange }: CreatePortfolioFormProps) {
  const router = useRouter();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    if (!isControlled) setInternalOpen(next);
  };
  const [name, setName] = useState('');
  const [cashBalance, setCashBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('cashBalance', cashBalance);

    try {
      const result = await createPortfolio(formData);
      
      if (result.success) {
        setName('');
        setCashBalance('');
        setIsOpen(false);
        router.refresh();
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Failed to create portfolio');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Create portfolio error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setCashBalance('');
    setError(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    if (isControlled) return null;
    return (
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Portfolio
      </Button>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#1E293B] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Create New Portfolio</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          aria-label="Close create portfolio form"
          className="text-[#A1A7B3] hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="portfolio-name" className="text-white text-sm">
            Portfolio Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="portfolio-name"
            type="text"
            placeholder="My Portfolio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
            required
            minLength={2}
            maxLength={60}
            disabled={isLoading}
          />
          <p className="text-xs text-[#A1A7B3]">2-60 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cash-balance" className="text-white text-sm">
            Starting Cash Balance (USD)
          </Label>
          <Input
            id="cash-balance"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={cashBalance}
            onChange={(e) => setCashBalance(e.target.value)}
            className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading}
          />
          <p className="text-xs text-[#A1A7B3]">Enter 0 or leave blank to start with no cash</p>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
          >
            {isLoading ? 'Creating...' : 'Create Portfolio'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
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
