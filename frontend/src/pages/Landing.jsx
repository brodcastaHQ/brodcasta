import { ArrowRight, Check, Github, Globe, Play, Shield, Star, Twitter, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen ">
      <LandingNavbar />
      <section className="">
        <div className="absolute inset-0">
          <img 
            src="/hero-bg.svg" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10"></div>
        
        {/* Pattern Lines at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-200/50 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 mt-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Real-time infrastructure for modern apps
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-base-content mb-6">
            Build Real-time Apps
            <span className="block text-primary">Without the Complexity</span>
          </h1>
          
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8">
            Pingly provides WebSocket and Server-Sent Events infrastructure with a simple API. 
            Focus on building your app, not managing connections.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/dashboard" className="inline-flex items-center px-8 py-4 bg-primary text-primary-content rounded-full font-medium hover:bg-primary-focus transition-colors">
              Start Building
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a href="#demo" className="inline-flex items-center px-8 py-4 border border-base-300 rounded-full font-medium hover:bg-base-100 transition-colors">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-base-content/60">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-success mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-success mr-1" />
              Free tier available
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-success mr-1" />
              Setup in minutes
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Everything You Need for Real-time
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Built for developers who want to ship real-time features without the headache.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">Lightning Fast</h3>
              <p className="text-base-content/70">
                Sub-millisecond latency with global edge deployment. Your messages arrive instantly.
              </p>
            </div>
            
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">Secure by Default</h3>
              <p className="text-base-content/70">
                Built-in authentication, encryption, and security features. No extra configuration needed.
              </p>
            </div>
            
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-info" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">Millions of Connections</h3>
              <p className="text-base-content/70">
                Scale from 1 to 1 million connections seamlessly. Auto-scaling included.
              </p>
            </div>
            
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">Global Reach</h3>
              <p className="text-base-content/70">
                Deployments across 50+ regions. Your users get the best performance worldwide.
              </p>
            </div>
            
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <Github className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">Developer First</h3>
              <p className="text-base-content/70">
                Simple APIs, SDKs for every language, and comprehensive documentation.
              </p>
            </div>
            
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">99.9% Uptime</h3>
              <p className="text-base-content/70">
                Enterprise-grade reliability with built-in monitoring and alerting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-base-content/70 mb-8">
              Join thousands of developers building the next generation of real-time applications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="inline-flex items-center px-8 py-4 bg-primary text-primary-content rounded-full font-medium hover:bg-primary-focus transition-colors">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#pricing" className="inline-flex items-center px-8 py-4 border border-primary/30 rounded-full font-medium hover:bg-primary/10 transition-colors">
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-100 border-t border-base-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-content" />
                </div>
                <span className="text-lg font-bold text-base-content">Pingly</span>
              </div>
              <p className="text-sm text-base-content/70">
                Real-time infrastructure for modern applications.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-base-content mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-base-content/70 hover:text-base-content transition-colors">Features</a>
                <a href="#pricing" className="block text-sm text-base-content/70 hover:text-base-content transition-colors">Pricing</a>
                <a href="#docs" className="block text-sm text-base-content/70 hover:text-base-content transition-colors">Documentation</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-base-content mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-sm text-base-content/70 hover:text-base-content transition-colors">About</a>
                <a href="#blog" className="block text-sm text-base-content/70 hover:text-base-content transition-colors">Blog</a>
                <a href="#careers" className="block text-sm text-base-content/70 hover:text-base-content transition-colors">Careers</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-base-content mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-base-300 pt-8 text-center">
            <p className="text-sm text-base-content/70">
              © 2024 Pingly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
