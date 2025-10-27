import {Link } from 'react-router-dom';

const Footer: React.FC = () => {
  
    return (
      <footer className="relative z-30 bg-gradient-to-r from-blue-600 to-indigo-600 py-8 text-center shadow-inner">
        <div className="mx-auto max-w-4xl px-4">


          <div className="flex justify-center gap-6 ">
            <Link 
              to="/kontakt" 
              className="text-white/90 text-sm hover:text-white hover:underline transition"
            >
              Om oss
            </Link>
            <Link 
              to="/salgsvilkar" 
              className="text-white/90 text-sm hover:text-white hover:underline transition"
            >
              Salgsvilkår
            </Link>
          </div>
        </div>
      </footer>
    );
  

};

export default Footer;