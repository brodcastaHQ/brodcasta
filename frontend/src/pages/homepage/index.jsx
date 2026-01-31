import { ArrowRight, ChevronRight, Globe, Network, Zap } from "lucide-react";
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
            {/* Primary Button: Arrow in circle with lighter color */}
            <button className="btn btn-primary text-white btn-lg rounded-full px-8 pl-10 gap-4 group">
              Start functionality
              <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:translate-x-2">
                <ArrowRight className="w-4 h-4" />
              </div>

            </button>

            {/* Secondary Button: Gradient outline */}
            <div className="p-px rounded-full bg-linear-to-r from-primary to-secondary">
              <button className="btn btn-lg rounded-full px-8 gap-2 group bg-base-100 hover:bg-base-200 border-none text-base-content min-w-[200px]">
                Explore a demo
                <div className="bg-base-content/10 p-2 rounded-full group-hover:bg-base-content/20 transition-all duration-300 group-hover:translate-x-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Trusted Text */}
          <div className="pt-20 opacity-50 text-sm font-medium tracking-widest uppercase">
            Trusted by modern teams worldwide
          </div>
        </div>

      </div>

      {/* Benefits Section with Arched Top */}
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
                <span className="text-primary opacity-80 decoration-4 underline decoration-yellow-400">stress less</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Don't waste time building socket infrastructure. Brodcasta gives you a battle-tested realtime engine instantly.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-900">
                Limitless <br />
                <span className="text-primary opacity-80 decoration-4 underline decoration-yellow-400">Scalability</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                From 10 to 10 million concurrent connections. Our architecture handles the load so you never have to worry about downtime.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-900">
                Developer <br />
                <span className="text-primary opacity-80 decoration-4 underline decoration-yellow-400">Experience First</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Simple APIs, comprehensive SDKs, and world-class documentation. Integration takes minutes, not months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
