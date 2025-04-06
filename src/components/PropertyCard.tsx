import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Ruler } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-sm rounded">
          For {property.status === 'sale' ? 'Sale' : 'Rent'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location.city}, {property.location.district}</span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Ruler className="h-4 w-4 mr-1" />
          <span>{property.size} sqft</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">{formatPrice(property.price)}</span>
          <Link
            to={`/properties/${property.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;