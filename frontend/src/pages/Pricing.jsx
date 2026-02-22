import { ArrowRight, Check, CheckCircleIcon, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-linear-to-r from-cyan-500 to-blue-500">
      {/* Header */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Simple, transparent pricing
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content mb-6">
            Pricing for Every
            <span className="block text-primary">Scale</span>
          </h1>
          
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprises. 
            Only pay for what you use.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-base-content/60">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-success mr-1" />
              Free tier included
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-success mr-1" />
              Cancel anytime
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-success mr-1" />
              No setup fees
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Starter */}
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-base-content mb-2">Starter</h3>
                <p className="text-base-content/70">Perfect for side projects and learning</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-base-content">$0</span>
                  <span className="text-base-content/70 ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">1,000 daily connections</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">100 MB data transfer</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Community support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">1 project</span>
                </li>
              </ul>
              
              <Link to="/dashboard" className="w-full inline-flex items-center justify-center px-6 py-3 border border-base-300 rounded-full font-medium hover:bg-base-200 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-primary rounded-2xl border border-primary p-8 hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-accent text-accent-content px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-8 mt-4">
                <h3 className="text-xl font-semibold text-primary-content mb-2">Pro</h3>
                <p className="text-primary-content/80">For growing applications</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-primary-content">$29</span>
                  <span className="text-primary-content/80 ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">10,000 daily connections</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">10 GB data transfer</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">Custom domains</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-content/90">API access</span>
                </li>
              </ul>
              
              <Link to="/dashboard" className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-content rounded-full font-medium hover:bg-accent-focus transition-colors">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-base-100 rounded-2xl border border-base-300 p-8 hover:shadow-sm transition-shadow">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-base-content mb-2">Enterprise</h3>
                <p className="text-base-content/70">For large-scale applications</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-base-content">Custom</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Unlimited connections</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Unlimited data transfer</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Custom analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">SLA guarantee</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">On-premise option</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base-content/80">Custom contracts</span>
                </li>
              </ul>
              
              <a href="mailto:sales@pingly.dev" className="w-full inline-flex items-center justify-center px-6 py-3 border border-base-300 rounded-full font-medium hover:bg-base-200 transition-colors">
                Contact Sales
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-base-content/70">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base-content mb-2">
                    What's included in the free tier?
                  </h3>
                  <p className="text-base-content/70">
                    The free tier includes 1,000 daily connections, 100 MB of data transfer, 
                    basic analytics, and community support. It's perfect for small projects 
                    and learning the platform.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base-content mb-2">
                    Can I change plans anytime?
                  </h3>
                  <p className="text-base-content/70">
                    Yes! You can upgrade or downgrade your plan at any time. 
                    Changes take effect immediately, and we'll prorate any differences.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base-content mb-2">
                    What happens if I exceed my limits?
                  </h3>
                  <p className="text-base-content/70">
                    We'll never cut you off. If you exceed your plan limits, 
                    we'll continue to serve your requests and bill you at the 
                    pay-as-you-go rate for the overage.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base-content mb-2">
                    Do you offer discounts for startups?
                  </h3>
                  <p className="text-base-content/70">
                    Yes! We offer special pricing for qualified startups and open-source projects. 
                    Contact our sales team to learn more about our startup program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-base-content/70 mb-8">
              Join thousands of developers building real-time applications with Pingly.
            </p>
            <Link to="/dashboard" className="inline-flex items-center px-8 py-4 bg-primary text-primary-content rounded-full font-medium hover:bg-primary-focus transition-colors">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
