import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Check } from 'lucide-react';

export const PricingView: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [activePlan, setActivePlan] = useState<'free' | 'pro' | 'team'>('free');
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleUpgrade = (planName: string) => {
    if (planName === 'Pro') {
      setActivePlan('pro');
      setModalMessage('Successfully upgraded to Pro Job Hunter! You now have unlimited scans & AI rewrites.');
    } else if (planName === 'Team') {
      setModalMessage('Sales inquiry submitted! Our team will contact your institution within 24 hours.');
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-12 space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#c0c1ff] to-[#d0bcff] bg-clip-text text-transparent">
          Transparent Pricing, Powerful Tools
        </h1>
        <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto">
          Choose the plan that fits your career trajectory. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      {/* Toggle Section */}
      <div className="flex justify-center items-center space-x-4">
        <span
          className={`text-sm font-semibold transition-colors ${
            !isYearly ? 'text-[#dae2fd]' : 'text-[#c7c4d7]'
          }`}
        >
          Monthly
        </span>

        <button
          onClick={() => setIsYearly(!isYearly)}
          className="relative w-14 h-7 rounded-full bg-[#2d3449] transition-colors duration-300 focus:outline-none p-1 cursor-pointer"
        >
          <span
            className={`block w-5 h-5 rounded-full bg-[#c0c1ff] transition-transform duration-300 ease-in-out ${
              isYearly ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>

        <span
          className={`text-sm font-semibold flex items-center space-x-2 transition-colors ${
            isYearly ? 'text-[#c0c1ff]' : 'text-[#dae2fd]'
          }`}
        >
          <span>Yearly</span>
          <span className="bg-[#00885d] text-[#000703] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Save 20%
          </span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {/* Free Tier */}
        <div className="bg-[#131b2e]/80 backdrop-blur-xl rounded-xl border border-[#464554]/30 p-8 flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1 text-[#dae2fd]">Free Student</h3>
              <p className="text-xs text-[#c7c4d7]">Essential tools to get your foot in the door.</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-[#dae2fd]">$0</span>
              <span className="text-sm text-[#c7c4d7]">/mo</span>
            </div>

            <button
              disabled={activePlan === 'free'}
              onClick={() => setActivePlan('free')}
              className={`w-full py-2.5 rounded-lg border text-sm font-semibold mb-8 transition-colors ${
                activePlan === 'free'
                  ? 'border-[#464554] text-[#908fa0] bg-[#1d2538] cursor-default'
                  : 'border-[#c0c1ff] text-[#c0c1ff] hover:bg-[#8083ff]/10 cursor-pointer'
              }`}
            >
              {activePlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </button>

            <ul className="space-y-4 text-xs text-[#dae2fd]">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>3 Scans per month</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Basic ATS Formatting</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Standard Keyword Match</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Tier (Highlighted) */}
        <div className="bg-[#171f33]/90 backdrop-blur-2xl rounded-xl border-2 border-[#8083ff] p-8 flex flex-col justify-between relative overflow-hidden transform md:scale-105 shadow-[0_0_30px_rgba(128,131,255,0.2)] z-10">
          <div className="absolute top-0 right-0 bg-[#c0c1ff] text-[#1000a9] px-3 py-1 rounded-bl-lg text-[10px] uppercase tracking-wider font-extrabold">
            Most Popular
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1 text-[#c0c1ff]">Pro Job Hunter</h3>
              <p className="text-xs text-[#c7c4d7]">Advanced insights for serious applicants.</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-[#dae2fd]">
                ${isYearly ? '9.60' : '12'}
              </span>
              <span className="text-sm text-[#c7c4d7]">/mo</span>
              <div className="text-[11px] text-[#4edea3] h-4 mt-1 font-medium">
                {isYearly ? 'Billed annually at $115.20' : 'Flexible monthly billing'}
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('Pro')}
              className={`w-full py-2.5 rounded-lg font-bold text-sm mb-8 transition-all shadow-[0_0_15px_rgba(192,193,255,0.3)] border-t border-white/20 cursor-pointer ${
                activePlan === 'pro'
                  ? 'bg-[#4edea3] text-[#003824]'
                  : 'bg-[#c0c1ff] text-[#1000a9] hover:bg-[#e1e0ff]'
              }`}
            >
              {activePlan === 'pro' ? 'Current Plan (Pro Active)' : 'Upgrade to Pro'}
            </button>

            <ul className="space-y-4 text-xs text-[#dae2fd]">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span className="font-semibold text-white">Unlimited Scans</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Advanced AI Rewriting Suggestions</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Deep Keyword Analysis & Gap ID</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Export to PDF/Word Reports</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Tier */}
        <div className="bg-[#131b2e]/80 backdrop-blur-xl rounded-xl border border-[#464554]/30 p-8 flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1 text-[#dae2fd]">Team / Campus</h3>
              <p className="text-xs text-[#c7c4d7]">Scale optimization for groups.</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-[#dae2fd]">
                ${isYearly ? '39.20' : '49'}
              </span>
              <span className="text-sm text-[#c7c4d7]">/mo</span>
              <div className="text-[11px] text-[#4edea3] h-4 mt-1 font-medium">
                {isYearly ? 'Billed annually at $470.40' : 'Flexible seat billing'}
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('Team')}
              className="w-full py-2.5 rounded-lg border border-[#464554] text-[#c7c4d7] hover:bg-[#2d3449] hover:text-white transition-colors text-sm font-semibold mb-8 cursor-pointer"
            >
              Contact Sales
            </button>

            <ul className="space-y-4 text-xs text-[#dae2fd]">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Up to 10 Seats</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Centralized Analytics Dashboard</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff] shrink-0 mt-0.5" />
                <span>Priority Support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Toast/Modal */}
      {modalMessage && (
        <div className="fixed bottom-6 right-6 bg-[#171f33] border border-[#8083ff] text-[#dae2fd] px-5 py-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 max-w-md animate-fade-in">
          <Sparkles className="w-6 h-6 text-[#4edea3] shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[#c0c1ff]">Account Updated</p>
            <p className="text-[#c7c4d7] mt-0.5">{modalMessage}</p>
          </div>
          <button
            onClick={() => setModalMessage(null)}
            className="ml-auto text-[#908fa0] hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
