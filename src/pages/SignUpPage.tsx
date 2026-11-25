import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { Cpu, Check, AlertCircle } from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (page: PageId) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: 'Archanaa R.',
    organisation: 'Ford Powertrain Engineering',
    department: 'Chassis & Suspension Core',
    role: 'Design Engineer',
    email: 'archanaa8642@gmail.com',
    password: '••••••••••••',
    confirmPassword: '••••••••••••',
    terms: true,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onNavigate(4); // Go to Dashboard
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 flex flex-col lg:flex-row">
      {/* Left Column: Visual branding */}
      <div className="lg:w-1/2 relative bg-gradient-to-br from-[#081826] to-[#040a10] p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-teal-900/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Cpu className="w-5 h-5 text-[#040c14]" />
          </div>
          <span className="font-bold text-xl tracking-wider text-white">LIFEX</span>
        </div>

        <div className="my-8 relative">
          <div className="rounded-2xl overflow-hidden border border-teal-800/40 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80"
              alt="Automotive Engineering"
              className="w-full h-64 sm:h-80 object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040c14] via-transparent to-transparent" />
          </div>

          <div className="mt-8 space-y-2">
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              ENGINEER · ANALYSE · DOCUMENT · COLLABORATE
            </div>
            <p className="text-slate-300 text-sm max-w-md">
              The unified engineering intelligence platform connecting teardowns, BOM telemetry, failure modes, and lifecycle audits.
            </p>
          </div>
        </div>

        <div className="text-xs text-teal-400/70">
          © 2026 LIFEX Engineering Systems. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Your Account</h2>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1">Join the LIFEX engineering platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                  Organisation
                </label>
                <input
                  type="text"
                  required
                  value={formData.organisation}
                  onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                  className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Ford Motor Co."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Chassis Engineering"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                <option value="Design Engineer">Design Engineer</option>
                <option value="Systems Engineer">Systems Engineer</option>
                <option value="Validation Engineer">Validation Engineer</option>
                <option value="Supplier Quality Engineer">Supplier Quality Engineer</option>
                <option value="Program Manager">Program Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="name@company.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[#0a1824] border border-teal-900/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="w-4 h-4 rounded bg-[#0a1824] border-teal-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-300 select-none cursor-pointer">
                I agree to the <span className="text-cyan-400 hover:underline">Terms and Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-[#04101a] font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/25 cursor-pointer mt-2"
            >
              {submitted ? 'Account Created! Opening...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate(3)}
              className="text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
