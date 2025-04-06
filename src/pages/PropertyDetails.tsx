import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Building2, MapPin, Ruler, BedDouble, Bath, Car, Heart, Share2, Lock, Phone, Mail } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProperty, loading, error, fetchPropertyById, checkUnlockStatus } = usePropertyStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyById(id);
      checkUnlockStatus(id).then(setIsUnlocked);
    }
  }, [id, fetchPropertyById]);

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { redirect: `/properties/${id}` } });
      return;
    }

    setUnlocking(true);
    try {
      const response = await fetch('/api/create-unlock-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          propertyId: id,
          userId: user?.id,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Failed to create unlock session:', error);
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !currentProperty) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Property not found'}</p>
        <button
          onClick={() => navigate('/properties')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  const { title, description, price, size, type, status, location, images, amenities, contact_details } = currentProperty;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="h-96 bg-gray-200">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                {location.city}, {location.district}
                {isUnlocked && `, ${location.sector}, ${location.neighborhood}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                ${price.toLocaleString()}
              </p>
              <p className="text-gray-600">For {status === 'sale' ? 'Sale' : 'Rent'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y">
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-gray-600" />
              <span>{size} sqft</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600" />
              <span>{type}</span>
            </div>
            {amenities.length > 0 && (
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-gray-600" />
                <span>{amenities.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600">{description}</p>
          </div>

          {isUnlocked ? (
            <div className="space-y-4 border-t pt-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <a href={`tel:${contact_details?.phone}`} className="text-blue-600 hover:underline">
                    {contact_details?.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <a href={`mailto:${contact_details?.email}`} className="text-blue-600 hover:underline">
                    {contact_details?.email}
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="h-5 w-5" />
              {unlocking ? 'Processing...' : 'Unlock Contact Details ($2)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;