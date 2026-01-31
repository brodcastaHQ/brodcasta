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
      <div className="min-h-screen w-full bg-base-100 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">

        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />



        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Build a community that <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              powers connectivity
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Drive engagement, secure communications, and grow your network —
            directly inside your customized workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {/* Primary Button: Arrow in circle with lighter color */}
            <button className="btn btn-primary text-white btn-lg rounded-full px-8 pl-10 gap-4 group">
              Start functionality
              <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

            </button>

            {/* Secondary Button: Gradient outline */}
            <div className="p-px rounded-full bg-linear-to-r from-primary to-secondary">
              <button className="btn btn-lg rounded-full px-8 gap-2 group bg-base-100 hover:bg-base-200 border-none text-base-content min-w-[200px]">
                Explore a demo
                <div className="bg-base-content/10 p-2 rounded-full group-hover:bg-base-content/20 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
    </>
  );
};

export default Homepage;
