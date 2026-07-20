export const marketOverview = {
  indices: [
    { name: "S&P 500", value: "5,892.45", change: "+0.82%", positive: true },
    { name: "Nasdaq", value: "18,673.21", change: "+1.24%", positive: true },
    { name: "Dow Jones", value: "42,156.78", change: "-0.31%", positive: false },
    { name: "Russell 2000", value: "2,345.67", change: "+0.45%", positive: true },
  ],
  trending: [
    { symbol: "NVDA", name: "NVIDIA", price: "$145.67", change: "+3.2%" },
    { symbol: "AAPL", name: "Apple", price: "$178.34", change: "+1.1%" },
    { symbol: "MSFT", name: "Microsoft", price: "$412.89", change: "+0.8%" },
    { symbol: "AMD", name: "AMD", price: "$156.23", change: "-0.5%" },
    { symbol: "GOOGL", name: "Alphabet", price: "$175.45", change: "+2.3%" },
  ],
  portfolio: {
    totalValue: "$847,293.56",
    dailyChange: "+$12,847.34",
    dailyChangePercent: "+1.54%",
    positive: true,
  },
  aiSummary: "Markets showed strength today with technology leading the gains. NVIDIA outperformed following strong AI chip demand. Fed rate cut expectations remain steady at 65% probability for December. Volatility index (VIX) eased to 15.3, indicating reduced market anxiety. Energy sector lagged due to falling oil prices.",
  news: [
    { title: "Fed signals potential rate cuts in December", source: "Financial Times", time: "2h ago" },
    { title: "NVIDIA AI chip demand surges 40% QoQ", source: "Bloomberg", time: "3h ago" },
    { title: "Tech sector leads market rally, S&P 500 hits new high", source: "Reuters", time: "4h ago" },
    { title: "Oil prices decline amid demand concerns", source: "WSJ", time: "5h ago" },
  ],
  watchlist: [
    { symbol: "NVDA", name: "NVIDIA", price: 145.67, change: 3.2 },
    { symbol: "AAPL", name: "Apple", price: 178.34, change: 1.1 },
    { symbol: "MSFT", name: "Microsoft", price: 412.89, change: 0.8 },
    { symbol: "AMD", name: "AMD", price: 156.23, change: -0.5 },
    { symbol: "GOOGL", name: "Alphabet", price: 175.45, change: 2.3 },
    { symbol: "AMZN", name: "Amazon", price: 189.67, change: 1.7 },
  ],
};

export const chartData = [
  { time: "9:30", value: 100 },
  { time: "10:00", value: 102 },
  { time: "10:30", value: 101 },
  { time: "11:00", value: 105 },
  { time: "11:30", value: 103 },
  { time: "12:00", value: 107 },
  { time: "12:30", value: 106 },
  { time: "13:00", value: 109 },
  { time: "13:30", value: 108 },
  { time: "14:00", value: 112 },
  { time: "14:30", value: 110 },
  { time: "15:00", value: 113 },
  { time: "15:30", value: 115 },
  { time: "16:00", value: 114 },
];
