import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, DollarSign, Settings } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Find Your Perfect Property
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover affordable real estate options with our comprehensive property management platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/properties"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </Link>
          <Link
            to="/auth"
            className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            List Your Property
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Property Search</h3>
          <p className="text-gray-600">
            Find properties that match your criteria with our advanced search filters.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Affordable Access</h3>
          <p className="text-gray-600">
            Pay just $2 to unlock property details and connect with owners directly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Property Management</h3>
          <p className="text-gray-600">
            Access powerful tools to manage your properties for just $5/month.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 -mx-4 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            For Property Owners & Brokers
          </h2>
          <p className="text-lg text-gray-600">
            List your properties and access our comprehensive property management tools.
          </p>
          <ul className="grid md:grid-cols-2 gap-4 text-left">
            <li className="bg-white p-4 rounded-lg shadow flex items-start space-x-3">
              <Building2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Property Listing</h4>
                <p className="text-gray-600">List one property at a time with our self-listing option.</p>
              </div>
            </li>
            {/* Add more features */}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;