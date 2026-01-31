import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar fixed top-0 z-50 px-4 py-3 transition-all duration-300 md:px-8 bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <div className="">
            <img src="./logo.svg" alt="logo" className='w-16 h-16' />
          </div>
          <span className='text-xl font-bold'>Brocasta</span>
        </Link>
      </div>
      <div className="flex gap-4">
        <ul className="menu menu-horizontal px-1 hidden sm:flex font-medium text-base-content/70">
          <li><a className="hover:text-primary">Features</a></li>
          <li><a className="hover:text-primary">Pricing</a></li>
          <li><a className="hover:text-primary">About</a></li>
        </ul>
        <Link to="/signup" className="btn btn-primary text-white px-6 rounded-xl shadow-lg shadow-primary/20">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
