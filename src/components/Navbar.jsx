import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/data-preparation', label: 'Data Preparation', icon: 'fas fa-magic' },
    { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/stability-tests', label: 'Stability Tests', icon: 'fas fa-shield-alt' },
    { path: '/models-analysis', label: 'Models & Analysis', icon: 'fas fa-chart-line' },
    { path: '/ai-reports', label: 'AI Reports', icon: 'fas fa-robot' },
    { path: '/contact-us', label: 'Contact Us', icon: 'fas fa-envelope' },
    { path: '/support-us', label: 'Support Us', icon: 'fas fa-donate' }
  ];

  return (
    <>
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <nav className=" top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                🏛️ DataNomics
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {/* <i className={`${item.icon} mr-2`}></i> */}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  menu.classList.toggle('hidden');
                }}
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-menu" className="hidden lg:hidden pb-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => {
                    const menu = document.getElementById('mobile-menu');
                    menu.classList.add('hidden');
                  }}
                >
                  <i className={`${item.icon} mr-3`}></i>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;