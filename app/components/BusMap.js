'use client';

import { useEffect, useState } from 'react';

export default function BusModal({ bus, isOpen, onClose, routeMap }) {
  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    const parts = [];
    if (address.house_number && address.road) {
      parts.push(`${address.road} ${address.house_number}`);
    } else if (address.road) {
      parts.push(address.road);
    }
    if (address.suburb) {
      parts.push(address.suburb);
    }
    if (address.town) {
      parts.push(address.town);
    }
    if (address.city && address.city !== address.town) {
      parts.push(address.city);
    }
    return parts.join(', ') || 'Address not available';
  };

  const formatStartDate = (startDate) => {
    if (!startDate || startDate.length !== 8) return 'Date not available';
    const year = Number(startDate.slice(0, 4));
    const month = Number(startDate.slice(4, 6)) - 1;
    const day = Number(startDate.slice(6, 8));
    return new Date(year, month, day).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    async function fetchAddress() {
      if (bus?.latitude && bus?.longitude) {
        try {
          const response = await fetch(
        `/api/reverse?lat=${bus.latitude}&lon=${bus.longitude}`
      );
          const data = await response.json();
          setAddressData(data.address);
        } catch (error) {
          console.error('Error fetching address:', error);
          setAddressData(null);
        } finally {
          setLoading(false);
        }
      }
    }
    if (isOpen) {
      fetchAddress();
    }
  }, [bus, isOpen]);

  if (!isOpen || !bus) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Bus - {routeMap[bus.routeId]?.route_short_name || bus.routeId}
              </h2>
              <p className="text-blue-100 text-lg">{bus.headsign}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Location Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Current Location
            </h3>
            <p className="text-blue-800 text-base">
              {loading ? 'Loading address...' : formatAddress(addressData)}
            </p>
            {addressData && addressData.postcode && (
              <p className="text-blue-600 text-sm mt-1">{addressData.postcode}</p>
            )}
          </div>

          {/* Departure Time */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-700 text-sm mb-1">Departure Time</p>
            <p className="font-bold text-green-900 text-lg">
              {formatStartDate(bus.startDate)}
            </p>
            <p className="font-bold text-green-900 text-xl">
              {bus.departure ? bus.departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </p>
          </div>

          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Vehicle Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Label:</span>
                <span className="font-semibold text-gray-900">{bus.vehicleLabel || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">License Plate:</span>
                <span className="font-semibold text-gray-900">{bus.licensePlate || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-semibold text-gray-900">{bus.fullroute || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Speed:</span>
                <span className="font-semibold text-gray-900">{bus.speed ? `${(bus.speed * 3.6).toFixed(1)} km/h` : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Map Link */}
          {bus.latitude && bus.longitude && (
            <a
              href={`https://www.google.com/maps?q=${bus.latitude},${bus.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-bold transition-colors"
            >
              View on Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  )
}