/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import CineTixDemo from './components/CineTixDemo';

export default function App() {
  return (
    <div className="bg-[#0A0A0B] min-h-screen text-slate-100 font-sans tracking-tight antialiased selection:bg-rose-500/30 selection:text-rose-400">
      
      {/* Main Interactive Emulator Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <main className="space-y-12">
          <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
            <CineTixDemo />
          </div>
        </main>
      </div>
    </div>
  );
}

