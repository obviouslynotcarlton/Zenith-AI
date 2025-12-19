
import React from 'react';

const MainBrowserView: React.FC = () => {
  return (
    <div className="flex-1 bg-white h-full flex flex-col overflow-hidden">
      {/* Browser Chrome Header */}
      <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center px-4 gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-md h-7 flex items-center px-3 text-[11px] text-gray-500 shadow-sm">
          https://news.zenith.tech/article/the-future-of-browser-integrated-ai
        </div>
      </div>

      {/* Simulated Article Content */}
      <div className="flex-1 overflow-y-auto p-12 max-w-3xl mx-auto">
        <header className="mb-10">
          <div className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4">Tech Insights • 5 min read</div>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            The Multi-Model Era: Why Sidebar AI is the New OS.
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <img src="https://picsum.photos/seed/author/100/100" className="w-10 h-10 rounded-full grayscale" />
            <div>
              <div className="text-sm font-bold text-slate-800">Carlton Otieno</div>
              <div className="text-xs text-gray-500 font-medium">Lead Architect @ Zenith AI</div>
            </div>
          </div>
        </header>

        <div id="semantic-core" className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
            Building a "Sider-like" extension (a universal AI sidebar) is a massive step up in complexity because you are no longer just manipulating the page; you are building a unified bridge between the browser's data and dozens of external AI brains.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Layer 1: The Context Scraper</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The Job: Instead of just sending a URL, it extracts the Semantic Core of the tab. Problem it solves: Sending a 20MB HTML file to an AI is expensive and slow. How: Use Readability.js to strip junk and only send the core article text to the AI.
          </p>

          <div className="my-10 p-8 bg-indigo-50 rounded-3xl border border-indigo-100 italic text-indigo-900 font-medium">
            "We don't want the user to wait 30 seconds for a full answer; you need the text to 'drip' into the UI as it's generated."
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The BYOK Revolution</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Sider and other clones are expensive because they charge you a markup on the AI usage. The "Real World" Gap: There is no high-quality, Open Source sidebar that lets users input their own API keys from local payment systems like Safaricom M-Pesa.
          </p>

          <p className="text-slate-600 mb-6 leading-relaxed">
            Problem: Privacy. Sider sees every prompt you send. Solution: Build a "Zero-Knowledge Sidebar" where keys are stored only in chrome.storage.local (encrypted) and never touch your servers.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-12">
            <img src="https://picsum.photos/seed/tech1/800/600" className="rounded-2xl shadow-lg border border-gray-100" />
            <img src="https://picsum.photos/seed/tech2/800/600" className="rounded-2xl shadow-lg border border-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBrowserView;
