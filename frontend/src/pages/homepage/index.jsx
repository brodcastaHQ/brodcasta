import { ArrowRight, ChevronRight, Globe, Network, Zap, Code, Shield, Users, MessageSquare, Activity, Github, Twitter, Linkedin, Terminal, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const Homepage = () => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [
    { component: Network, color: "text-primary" },
    { component: Globe, color: "text-secondary" },
    { component: Zap, color: "text-accent" },
  ];

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIconIndex((prev) => (prev + 1) % icons.length);
        setIsAnimating(false);
      }, 500); // Wait for exit animation to finish
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[iconIndex].component;
  const iconColor = icons[iconIndex].color;

  // Calculate next icon for the sliding effect
  const nextIndex = (iconIndex + 1) % icons.length;
  const NextIcon = icons[nextIndex].component;
  const nextIconColor = icons[nextIndex].color;

  return (
    <>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="w-full bg-base-100 flex flex-col items-center justify-center text-center relative overflow-hidden pt-36 pb-48">

        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Right Side Grid Pattern */}
        <div
          className="absolute top-0 right-0 w-3/4 h-full pointer-events-none"
          style={{
            backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to right, transparent, black 60%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 60%)'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Connect with the world <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              in real-time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            The ultimate infrastructure for live experiences.
            Reliable, scalable, and designed for modern applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {/* Primary Button */}
            <button className="btn btn-primary text-white btn-lg rounded-full px-8 pl-10 gap-4 group">
              Get Started
              <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:translate-x-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Secondary Button */}
            <div className="p-px rounded-full bg-linear-to-r from-primary to-secondary">
              <button className="btn btn-lg rounded-full px-8 gap-2 group bg-base-100 hover:bg-base-200 border-none text-base-content min-w-[200px]">
                View Documentation
                <div className="bg-base-content/10 p-2 rounded-full group-hover:bg-base-content/20 transition-all duration-300 group-hover:translate-x-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          <div className="pt-20 opacity-50 text-sm font-medium tracking-widest uppercase">
            Powering the next generation of apps
          </div>
        </div>

      </div>

      {/* --- BENEFITS SECTION --- */}
      <div
        className="relative z-20 bg-white text-gray-900 -mt-20 pt-32 pb-20 px-4"
        style={{ borderRadius: '50% 50% 0 0 / 120px 120px 0 0' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-indigo-900">Why Brodcasta?</h2>

          <div className="grid md:grid-cols-3 gap-12 text-left px-4">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-900">
                Ship faster, <br />
                {/* Replaced decoration-yellow-400 with decoration-secondary */}
                <span className="text-primary opacity-80 decoration-4 underline decoration-secondary">stress less</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Don't waste time building socket infrastructure. Brodcasta gives you a battle-tested realtime engine instantly.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-900">
                Limitless <br />
                <span className="text-primary opacity-80 decoration-4 underline decoration-secondary">Scalability</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                From 10 to 10 million concurrent connections. Our architecture handles the load so you never have to worry about downtime.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-900">
                Developer <br />
                <span className="text-primary opacity-80 decoration-4 underline decoration-secondary">Experience First</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Simple APIs, comprehensive SDKs, and world-class documentation. Integration takes minutes, not months.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: CODE INTEGRATION (Deep Dark) --- */}
      <div className="bg-base-100 py-24 text-base-content relative">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="badge badge-secondary badge-outline mb-4">Developer Ready</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Integrate in <br />
              <span className="text-secondary">minutes, not days.</span>
            </h2>
            <p className="text-xl opacity-70">
              Our SDKs are designed to be intuitive. Just a few lines of code and you have full real-time capabilities.
            </p>

            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-success h-6 w-6" />
                <span className="text-lg">Type-safe SDKs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-success h-6 w-6" />
                <span className="text-lg">Automatic reconnection logic</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-success h-6 w-6" />
                <span className="text-lg">End-to-end encryption support</span>
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="mockup-code bg-[#1e1e1e] text-white shadow-2xl rounded-xl border border-white/10">
              <pre data-prefix="1"><code className="text-gray-500">import &#123; Brodcasta &#125; from '@brodcasta/js';</code></pre>
              <pre data-prefix="2"><code></code></pre>
              <pre data-prefix="3"><code className="text-purple-400">const client = new Brodcasta('API_KEY');</code></pre>
              <pre data-prefix="4"><code></code></pre>
              <pre data-prefix="5"><code className="text-blue-400">const channel = client.subscribe('news');</code></pre>
              <pre data-prefix="6"><code></code></pre>
              <pre data-prefix="7"><code>channel.on('message', (data) => &#123;</code></pre>
              <pre data-prefix="8"><code>  console.log('Received:', data);</code></pre>
              <pre data-prefix="9"><code>&#125;);</code></pre>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: USE CASES (Light) --- */}
      <div className="bg-white text-gray-900 py-24 rounded-[3rem] mx-4 md:mx-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for every use case</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From fintech to gaming, Brodcasta powers the interactions that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Chat</h3>
              <p className="text-gray-600">Seamless 1-on-1 and group chat with typing indicators, read receipts, and file sharing.</p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-pink-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6 text-pink-600">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Dashboards</h3>
              <p className="text-gray-600">Push stock tickers, sports scores, and analytics updates instantly to millions of screens.</p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Collaborative Editing</h3>
              <p className="text-gray-600">Build multiplayer documents and whiteboards with conflict-free data synchronization.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 5: STATS (Dark) --- */}
      <div className="bg-base-100 py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-4">
              <div className="text-5xl font-black text-secondary mb-2">99.99%</div>
              <div className="text-sm uppercase tracking-widest opacity-60">Uptime SLA</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-black text-primary mb-2">&lt;25ms</div>
              <div className="text-sm uppercase tracking-widest opacity-60">Global Latency</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-black text-accent mb-2">10B+</div>
              <div className="text-sm uppercase tracking-widest opacity-60">Messages/Day</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-black text-white mb-2">50+</div>
              <div className="text-sm uppercase tracking-widest opacity-60">Data Centers</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 6: TESTIMONIALS (Light) --- */}
      <div
        className="bg-white text-gray-900 py-24 relative"
        style={{ borderRadius: '50% 50% 0 0 / 60px 60px 0 0' }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Loved by developers</h2>
          <div className="bg-gray-50 p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="flex gap-1 text-yellow-400">
                {"★★★★★"}
              </div>
            </div>
            <p className="text-2xl font-medium mb-8 leading-relaxed">
              "Brodcasta completely changed how we build. We removed 20,000 lines of spaghetti code and replaced it with a simple, rock-solid API. It just works."
            </p>
            <div>
              <div className="font-bold text-lg">Sarah Jenkins</div>
              <div className="text-gray-500">CTO at TechFlow</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 7: FOOTER / CTA (Dark) --- */}
      <div className="bg-neutral text-neutral-content pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
              <p className="text-xl opacity-70">Get started for free. No credit card required.</p>
            </div>
            <button className="btn btn-primary btn-lg rounded-full px-10">Start Building Now</button>
          </div>

          <div className="divider opacity-20 my-10"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-sm">
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-100 transition-opacity">Documentation</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Pricing</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Status</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Blog</a>
            </div>
            <div className="flex gap-4">
              <Github className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            </div>
            <div>© 2026 Brodcasta Inc.</div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Homepage;
