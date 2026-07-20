"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function MarketTabs({ value, onValueChange }: MarketTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="bg-[#0B0F1A] flex-wrap">
        <TabsTrigger 
          value="stocks" 
          className="text-[#A1A7B3] data-[state=active]:text-white data-[state=active]:bg-[#2563EB]"
        >
          Stocks
        </TabsTrigger>
        <TabsTrigger 
          value="etfs" 
          className="text-[#A1A7B3] data-[state=active]:text-white data-[state=active]:bg-[#2563EB]"
        >
          ETFs
        </TabsTrigger>
        <TabsTrigger 
          value="crypto" 
          className="text-[#A1A7B3] data-[state=active]:text-white data-[state=active]:bg-[#2563EB]"
        >
          Crypto
        </TabsTrigger>
        <TabsTrigger 
          value="fx" 
          className="text-[#A1A7B3] data-[state=active]:text-white data-[state=active]:bg-[#2563EB]"
        >
          FX
        </TabsTrigger>
        <TabsTrigger 
          value="indices" 
          className="text-[#A1A7B3] data-[state=active]:text-white data-[state=active]:bg-[#2563EB]"
        >
          Indices & Proxies
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
