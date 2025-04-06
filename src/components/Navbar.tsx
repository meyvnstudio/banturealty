import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, UserCircle, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">BantuRealty</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/properties" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Home className="h-5 w-5" />
              <span>{t('nav.properties')}</span>
            </Link>
            
            <Link to="/tools" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Calculator className="h-5 w-5" />
              <span>{t('nav.tools')}</span>
            </Link>

            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <UserCircle className="h-5 w-5" />
                <span>{user?.name}</span>
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;