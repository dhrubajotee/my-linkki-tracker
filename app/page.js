'use client';

import { useEffect, useState } from 'react';
import stops from './data/stops.json';
import routes from './data/routes.json';
import BusMap from './components/BusMap';

const sortedStops = stops.slice().sort((a, b) => a.stop_name.localeCompare(b.stop_name));
const routeMap = {};
routes.forEach(r => {
  routeMap[r.route_id] = r;
});


export default function Home() {
  const [stopId, setStopId] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favourite, setFavourite] = useState('Stoppage List');
  const [hasFetchedBuses, setHasFetchedBuses] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStops = sortedStops.filter(stop =>
    stop.stop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stopIdStoppage = [
    {
      "stop_id": "207506",
      "stop_name": "Myllypolku 1"
    },
    {
      "stop_id": "207650",
      "stop_name": "Myllypolku 2"
    },
    {
      "stop_id": "490118",
      "stop_name": "Keskusta 9"
    },
    {
      "stop_id": "207483",
      "stop_name": "Yliopisto 2"
    },
    {
      "stop_name": "Stoppage List"
    }
  ];

  const openModal = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBus(null);
  };

  const fetchBuses = async () => {
    if (!stopId) return alert('Please select a stop');
    setLoading(true);

    try {
      const vehicleres = await fetch(`/api/waltti/jyvaskyla/vehicleposition`);
      const vehicledata = await vehicleres.json();
      const res = await fetch(`/api/waltti/jyvaskyla/tripupdate`);
      const data = await res.json();
      const stopIdFilteredBuses = data.entity
        .filter(e => e.tripUpdate)
        .map(e => e.tripUpdate)
        .flatMap(trip => {
          return trip.stopTimeUpdate
            .filter(s => s.stopId === stopId)
            .map(s => ({
              tripId: trip.trip.tripId,
              vehicleId: trip.vehicle.id,
              routeId: trip.trip.routeId,
              headsign: trip.vehicle.label || 'Unknown',
              arrival: s.arrival?.time ? new Date(s.arrival.time * 1000) : null,
              departure: s.departure?.time ? new Date(s.departure.time * 1000) : null
            }));
        })
        .filter(s => s.departure)
        .sort((a, b) => a.departure - b.departure);

      const updatedBuses = stopIdFilteredBuses.map(bus => {
        const vehicle = vehicledata.entity.find(v => v.id === bus.vehicleId);

        return {
          ...bus,
          vehicleLabel: vehicle?.vehicle.vehicle.label || 'Unknown',
          licensePlate: vehicle?.vehicle.vehicle.licensePlate || '',
          latitude: vehicle?.vehicle.position?.latitude || null,
          longitude: vehicle?.vehicle.position?.longitude || null,
          startDate: vehicle?.vehicle.trip?.startDate || null,
          speed: vehicle?.vehicle.position?.speed || null,
          fullroute: routeMap[vehicle?.vehicle.trip?.routeId].route_long_name || null,
          currentStopSequence: vehicle?.vehicle.currentStopSequence || null,
          currentStatus: vehicle?.vehicle.currentStatus || null
        };
      });
      if (updatedBuses.length > 0) {
        setBuses(updatedBuses);
      }
      else {
        setHasFetchedBuses(true);
      }

    } catch (err) {
      console.error(err);
      alert('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleStoppageClick = (clickedStoppageName) => {
    if (clickedStoppageName.stop_name === 'Stoppage List') {
      setFavourite(clickedStoppageName.stop_name);
      setStopId('');
      setBuses([]);
      return;
    }
    setFavourite(clickedStoppageName.stop_name);
    clickedStoppageName.stop_name !== 'Stoppage List' && setStopId(clickedStoppageName.stop_id);
  };

  useEffect(() => {
    if (favourite && favourite !== 'Stoppage List') {
      fetchBuses();
    }
  }, [stopId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <BusMap
        bus={selectedBus}
        isOpen={isModalOpen}
        onClose={closeModal}
        routeMap={routeMap}
      />

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col flex-1 w-full">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Linkki Tracker</h1>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
            {stopIdStoppage.map((stoppageName) => (
              <button
                key={stoppageName.stop_name}
                onClick={() => handleStoppageClick(stoppageName)}
                className={`px-6 py-3 md:px-6 md:py-3 text-xl md:text-xl font-bold rounded-full backdrop-blur-sm border transition-all duration-200
            ${favourite === stoppageName.stop_name
                    ? 'bg-white text-blue-900 border-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] scale-105'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105'
                  }`}
              >
                {stoppageName.stop_name}
              </button>
            ))}
          </div>

          {favourite === 'Stoppage List' && (
            <div className="w-full max-w-2xl mx-auto mb-6 md:mb-8 px-2">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/30 shadow-xl">
                <div className="mb-4 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search for a stop..."
                    className="w-full p-3 md:p-4 text-lg md:text-lg font-semibold bg-white text-blue-900 
          rounded-xl focus:outline-none focus:ring-4 focus:ring-white/50
          transition-all duration-200 shadow-lg
          border-2 border-white/40"
                  />

                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-white/40 max-h-60 overflow-y-auto">
                      {filteredStops.length > 0 ? (
                        filteredStops.map(stop => (
                          <div
                            key={stop.stop_id}
                            onClick={() => {
                              setStopId(stop.stop_id);
                              setSearchTerm(stop.stop_name);
                              setShowDropdown(false);
                            }}
                            className="p-3 md:p-4 text-blue-900 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-semibold">{stop.stop_name}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500 text-center">No stops found</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={fetchBuses}
                  disabled={!stopId}
                  className="w-full bg-white text-blue-900 py-3 md:py-4 px-6 rounded-xl 
        font-bold text-lg md:text-lg
        hover:scale-105 active:scale-95
        transition-all duration-200 
        shadow-lg border-2 border-white/40
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Show Next Buses
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="w-full max-w-4xl mx-auto mb-6 md:mb-8 px-2">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-white/40 shadow-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-white text-lg md:text-xl font-semibold">
                    Loading bus schedules...
                  </p>
                </div>
              </div>
            </div>
          )}

          {buses.length > 0 && (
            <div className="w-full mx-auto mb-6 md:mb-8 px-2">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 md:p-6 border-2 border-white/40 shadow-2xl">
                <h2 className="text-2xl md:text-2xl font-bold text-white mb-4 text-center">Next Buses</h2>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {buses.map((bus, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white/70 text-lg font-bold">Bus</span>
                        <span className="text-white font-bold text-2xl">
                          {routeMap[bus.routeId].route_short_name || bus.routeId}
                        </span>
                      </div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white/70 text-lg font-bold">Destination</span>
                        <span className="text-white font-semibold text-lg text-right">
                          {bus.headsign}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white/70 text-lg font-bold">Departure Time</span>
                        <span className="text-white font-bold text-xl">
                          {bus.departure ? bus.departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </span>
                      </div>
                      <button
                        onClick={() => openModal(bus)}
                        className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl font-bold transition-all duration-200 border border-white/40"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-white/50">
                        <th className="px-4 py-3 text-left text-m font-bold text-white">Bus</th>
                        <th className="px-4 py-3 text-left text-m font-bold text-white">Destination</th>
                        <th className="px-4 py-3 text-left text-m font-bold text-white">Departure Time</th>
                        <th className="px-4 py-3 text-center text-m font-bold text-white">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buses.map((bus, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-white/30 hover:bg-white/20 transition-all duration-200"
                        >
                          <td className="px-4 py-3 text-white font-bold text-sm">
                            {routeMap[bus.routeId].route_short_name || bus.routeId}
                          </td>
                          <td className="px-4 py-3 text-white font-semibold text-sm">
                            {bus.headsign}
                          </td>

                          <td className="px-4 py-3 text-white font-bold text-sm">
                            {bus.departure ? bus.departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => openModal(bus)}
                              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 border border-white/40"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {hasFetchedBuses && buses.length === 0 && stopId && (
            <div className="w-full max-w-4xl mx-auto px-2">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/40">
                <p className="text-center text-white text-xl font-semibold">
                  No upcoming buses found for this stop.
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-auto text-blue-200 text-sm pt-6">
            <p className="mt-2">Built with React & Next.js by Dhrubajotee Howlader</p>
          </div>
        </div>
      </div>
    </>
  );
}