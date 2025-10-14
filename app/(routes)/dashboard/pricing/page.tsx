import { PricingTable } from '@clerk/nextjs';
import { Crown, Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
          <PricingTable />
        </div>
      </div>
    </div>
  );
}