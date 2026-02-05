import { HelpCircle, Menu, MessageSquare, Search } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="h-16 border-b border-base-200 bg-base-100 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Left: could be breadcrumbs or mobile toggle */}
            <div className="flex items-center gap-4">
                <button className="lg:hidden btn btn-ghost btn-square btn-md">
                    <Menu size={20} />
                </button>
                <div className="hidden md:flex items-center px-3 py-1.5 bg-base-200 rounded-full text-xs font-medium text-base-content/70">
                    <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                    Free account
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button className="btn btn-ghost btn-md gap-2 font-normal text-base-content/70">
                    <Search size={16} />
                    <span className="hidden sm:inline">Ask AI</span>
                </button>

                <button className="btn btn-ghost btn-md gap-2 font-normal text-base-content/70">
                    <MessageSquare size={16} />
                    <span className="hidden sm:inline">Feedback</span>
                </button>

                <button className="btn btn-ghost btn-square btn-md text-base-content/70">
                    <HelpCircle size={18} />
                </button>

                <div className="divider divider-horizontal mx-1 my-3"></div>

                <button className="btn btn-circle btn-md bg-neutral text-neutral-content text-xs font-medium">
                    CD
                </button>
            </div>
        </header>
    );
};

export default Topbar;
