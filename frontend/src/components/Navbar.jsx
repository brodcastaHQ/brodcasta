import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-4 z-50 mx-4">
        <div className="max-w-7xl mx-auto ">
          <div className="bg-base-100/90  border border-base-300 rounded-full px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2">
                  <img src="/logo.svg" alt="Brodcastay" className="w-8 h-8" />
                  <span className="text-lg font-bold text-base-content">Brodcastay</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-6">
                  <a href="#features" className="text-sm text-base-content/70 hover:text-base-content transition-colors">Features</a>
                  <a href="/pricing" className="text-sm text-base-content/70 hover:text-base-content transition-colors">Pricing</a>
                  <a href="#docs" className="text-sm text-base-content/70 hover:text-base-content transition-colors">Docs</a>
                  <a href="#blog" className="text-sm text-base-content/70 hover:text-base-content transition-colors">Blog</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hidden md:block text-sm text-base-content/70 hover:text-base-content transition-colors">
                  Sign In
                </Link>
                <Link to="/dashboard" className="bg-primary text-primary-content px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-focus transition-colors">
                  Get Started
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-base-100/95 backdrop-blur-lg">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#features" className="text-lg text-base-content/70 hover:text-base-content transition-colors">Features</a>
            <a href="#pricing" className="text-lg text-base-content/70 hover:text-base-content transition-colors">Pricing</a>
            <a href="#docs" className="text-lg text-base-content/70 hover:text-base-content transition-colors">Docs</a>
            <a href="#blog" className="text-lg text-base-content/70 hover:text-base-content transition-colors">Blog</a>
            <Link to="/login" className="text-lg text-base-content/70 hover:text-base-content transition-colors">Sign In</Link>
            <Link to="/dashboard" className="bg-primary text-primary-content px-6 py-3 rounded-full text-lg font-medium hover:bg-primary-focus transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingNavbar;
