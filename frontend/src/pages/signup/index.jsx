import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-neutral relative overflow-hidden items-center justify-center p-12 text-primary-content">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 z-0"></div>
        <div className="relative z-10 max-w-lg">
           <Link to="/" className="flex items-center gap-2 mb-12 opacity-80 hover:opacity-100 transition-opacity text-white">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </div>
            <span className="font-medium">Back to Home</span>
           </Link>

          <h2 className="text-4xl font-bold mb-6 text-white">Join the community of innovators.</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Create an account to access powerful tools, real-time analytics, and a seamless development experience.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-white">
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-1">10k+</h3>
                <p className="text-white/50 text-sm">Active Developers</p>
             </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-1">99.9%</h3>
                <p className="text-white/50 text-sm">Uptime Guarantee</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full">
            <div className="mb-10 text-center lg:text-left">
                 <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8 text-sm font-medium text-base-content/60">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 1 previous user request did not specify any content for this file, so I will infer that it should be a standard App component with routing.2h18" />
                    </svg>
                    Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-base-content mb-2">Create an account</h1>
                <p className="text-base-content/60">Enter your details to get started.</p>
            </div>

            <form className="space-y-5">
                <div className="fieldset">
                    <legend className="fieldset-legend font-medium text-base-content/70">Email Address</legend>
                    <input type="email" placeholder="name@company.com" className="input input-bordered w-full" />
                </div>
                
                <div className="fieldset">
                     <legend className="fieldset-legend font-medium text-base-content/70">Password</legend>
                    <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                </div>

                 <div className="form-control">
                     <label className="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                        <span className="label-text text-base-content/70">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a></span>
                    </label>
                </div>

                <button className="btn btn-primary w-full text-white text-lg rounded-xl shadow-lg shadow-primary/20 mt-2">
                    Create Account
                </button>
            </form>

            <div className="divider text-base-content/40 text-sm my-8">OR CONTINUE WITH</div>

            <div className="grid grid-cols-2 gap-4">
                <button className="btn btn-outline font-medium">
                   Google
                </button>
                <button className="btn btn-outline font-medium">
                   GitHub
                </button>
            </div>

             <p className="mt-8 text-center text-base-content/60">
                Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
