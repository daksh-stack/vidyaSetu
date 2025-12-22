"use client";

import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Github, Twitter, Youtube, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden bg-slate-950 text-slate-200">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 pt-20">
        <div className="relative z-10 max-w-4xl space-y-8">
          {/* Overline */}
          <p className="text-sm md:text-base font-medium tracking-[0.4em] text-indigo-400 mb-6 font-mono uppercase">
            Designed for the relentless
          </p>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight">
            SILENCE BRINGS <br />
            <span className="text-indigo-500">CLARITY</span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-slate-400 leading-relaxed max-w-2xl mx-auto">
            VidyaSetu is the quiet space where ambition meets preparation. <br />
            <span className="text-slate-200 font-normal">Train. Focus. Conquer.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link href="/login">
              <Button className="h-14 px-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/20">
                Enter the Void
              </Button>
            </Link>
            <div className="flex gap-6">
              <SocialLink href="#" icon={Github} />
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Youtube} />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="relative py-20 px-6 md:px-24 bg-slate-900/50">
        {/* Chapter 1 */}
        <div className="mb-32 flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="md:w-1/2">
            <h2 className="text-6xl md:text-8xl font-heading text-slate-800 font-bold opacity-20 select-none mb-4">
              01
            </h2>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-heading text-white mb-6">Deep Work</h3>
              <p className="text-lg text-slate-400 leading-relaxed font-light max-w-md">
                Immerse yourself in distraction-free coding environments.
                The interface fades away, leaving only you and the logic.
                Dark mode optimized for long night sessions.
              </p>
              <Link href="/practice/coding" className="inline-flex items-center gap-2 mt-8 text-indigo-400 hover:text-white transition-colors group">
                <span className="tracking-widest uppercase text-sm font-bold">Start Coding</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Simple Visual */}
          <div className="md:w-1/3 relative border border-slate-800 p-8 rounded-3xl bg-slate-900">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
              <Star className="w-5 h-5" />
            </div>
            <div className="space-y-4">
              <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
              <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
              <div className="h-2 w-full bg-slate-800 rounded-full" />
            </div>
          </div>
        </div>

        {/* Chapter 2 */}
        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-20">
          <div className="md:w-1/2 text-right">
            <h2 className="text-6xl md:text-8xl font-heading text-slate-800 font-bold opacity-20 select-none mb-4">
              02
            </h2>
            <div className="relative z-10 flex flex-col items-end">
              <h3 className="text-4xl md:text-5xl font-heading text-white mb-6">Reflect & Refine</h3>
              <p className="text-lg text-slate-400 leading-relaxed font-light max-w-md">
                Analyze your performance with moonlit analytics.
                Identify weak points in your armor and fortify them with targeted practice sets.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 mt-8 text-indigo-400 hover:text-white transition-colors group">
                <span className="tracking-widest uppercase text-sm font-bold">View Analytics</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Simple Visual */}
          <div className="md:w-1/3 relative border border-slate-800 p-8 rounded-3xl bg-slate-900 flex flex-col justify-end">
            <div className="flex items-end gap-2 h-32">
              <div className="w-1/4 h-[60%] bg-indigo-900/50 rounded-t-lg" />
              <div className="w-1/4 h-[80%] bg-indigo-800/50 rounded-t-lg" />
              <div className="w-1/4 h-[40%] bg-indigo-900/30 rounded-t-lg" />
              <div className="w-1/4 h-[90%] bg-indigo-600 rounded-t-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 flex flex-col items-center justify-center text-center">
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tighter">
            BEGIN THE <br />
            <span className="text-indigo-500">ASCENT</span>
          </h2>
          <Link href="/signup">
            <Button size="lg" className="h-20 px-12 text-xl rounded-full bg-white text-black hover:bg-slate-200 transition-all font-bold tracking-wide">
              Start Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-xs font-mono uppercase tracking-[0.2em]">
        © 2024 VidyaSetu · Crafted in the Void
      </footer>
    </main>
  );
}

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a href={href} className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 transition-all">
    <Icon className="w-4 h-4" />
  </a>
);
