import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, Shield, CheckCircle, Phone, MapPin, Clock, Calendar, AlertTriangle, 
  Search, Filter, ChevronRight, Lock, Key, Mail, RefreshCw, Eye, EyeOff, 
  Send, ExternalLink, Navigation, User, Home as HomeIcon, Settings, LogOut, Check, X, Inbox
} from 'lucide-react';

const OWNER_EMAIL = 'msacservice00@gmail.com';
const OWNER_PHONE = '+919989309424';
const BACKEND_URL = 'https://msacservice-backend.onrender.com';

const INITIAL_SERVICES = [
  { 
    id: '1', 
    type: 'service', 
    name: 'Jet Motor Service', 
    price: 1300, 
    value: 'Jet Motor Service — ₹1300',
    desc: 'Deep high-pressure water jet cleaning for inner coils, filters & outer unit.' 
  },
  { 
    id: '2', 
    type: 'service', 
    name: 'Normal AC Service', 
    price: 700, 
    value: 'Normal AC Service — ₹700',
    desc: 'Standard filter cleaning, airflow inspection, basic sanitization & leak check.' 
  },
  { 
    id: '3', 
    type: 'repair', 
    name: 'AC Cooling Issue', 
    price: 700, 
    value: 'AC Cooling Issue — ₹700 (Inspection)',
    desc: 'Attendance / Inspection fee. Diagnoses gas leaks, compressor & fan motor issues.' 
  },
  { 
    id: '4', 
    type: 'repair', 
    name: 'AC Water Leakage', 
    price: 700, 
    value: 'AC Water Leakage — ₹700 (Inspection)',
    desc: 'Attendance / Inspection fee. Diagnoses drain pipe blockages & tray overflow.' 
  },
  { 
    id: '5', 
    type: 'repair', 
    name: 'AC Power ON/OFF Issue', 
    price: 700, 
    value: 'AC Power ON/OFF Issue — ₹700 (Inspection)',
    desc: 'Attendance / Inspection fee. Diagnoses PCB board faults, wiring & relay switches.' 
  }
];

const AC_BRANDS = ['Voltas', 'Daikin', 'LG', 'Samsung', 'Blue Star', 'Carrier', 'Godrej', 'Lloyd', 'Hitachi', 'Panasonic', 'O General', 'Whirlpool', 'Other'];
const AC_TYPES = ['Split AC', 'Window AC', 'Cassette AC', 'Tower AC'];

const formatINR = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const resolveServiceOptionValue = (inputName) => {
  if (!inputName) return INITIAL_SERVICES[0].value;
  const match = INITIAL_SERVICES.find(s => 
    s.name.toLowerCase() === inputName.toLowerCase() || 
    s.value.toLowerCase().includes(inputName.toLowerCase())
  );
  return match ? match.value : INITIAL_SERVICES[0].value;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState('');

  const handleBookNow = (serviceName) => {
    const resolvedValue = resolveServiceOptionValue(serviceName);
    setSelectedServiceForBooking(resolvedValue);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">MS<span className="text-cyan-400">acservice</span></span>
                <p className="text-xs text-slate-400 font-medium">Expert AC Care & Repair</p>
              </div>
            </div>

            <nav className="flex items-center space-x-1 overflow-x-auto py-2">
              {[
                { id: 'home', label: 'Home', icon: HomeIcon },
                { id: 'services', label: 'Services & Pricing', icon: Wrench },
                { id: 'booking', label: 'Book Now', icon: Calendar },
                { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
                { id: 'owner', label: isOwnerLoggedIn ? 'Owner Dashboard' : 'Owner Portal', icon: Lock }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-3">
              <a
                href={`tel:${OWNER_PHONE}`}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+91 9989309424</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {activeTab === 'home' && <HomeTab onNavigateBooking={handleBookNow} />}
        {activeTab === 'services' && <ServicesTab onSelectService={handleBookNow} />}
        {activeTab === 'booking' && (
          <BookingTab 
            preselectedService={selectedServiceForBooking} 
            onBookingCreated={(newBooking) => setBookings(prev => [newBooking, ...prev])}
          />
        )}
        {activeTab === 'complaints' && (
          <ComplaintsTab 
            onComplaintCreated={(newComp) => setComplaints(prev => [newComp, ...prev])} 
          />
        )}
        {activeTab === 'owner' && (
          <OwnerDashboardTab 
            bookings={bookings}
            setBookings={setBookings}
            complaints={complaints}
            setComplaints={setComplaints}
            isLoggedIn={isOwnerLoggedIn}
            setIsLoggedIn={setIsOwnerLoggedIn}
          />
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-slate-950" />
                </div>
                <span className="text-xl font-bold text-white">MSacservice</span>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Tagline: Expert AC Care. Honest Pricing. Comfort You Can Trust. Professional air conditioner servicing and repair specialists.
              </p>
              <p className="text-xs text-slate-500 italic">
                Business Policy: We specialize exclusively in AC servicing and repairs. We do not sell air conditioners.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition">Home</button></li>
                <li><button onClick={() => setActiveTab('services')} className="hover:text-cyan-400 transition">Services & Fixed Pricing</button></li>
                <li><button onClick={() => setActiveTab('booking')} className="hover:text-cyan-400 transition">Book AC Service</button></li>
                <li><button onClick={() => setActiveTab('complaints')} className="hover:text-cyan-400 transition">Customer Complaints</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Direct Contact</h4>
              <p className="text-xs text-slate-400 mb-1">Phone & WhatsApp:</p>
              <a href={`https://wa.me/${OWNER_PHONE.replace('+', '')}`} target="_blank" rel="noreferrer" className="text-cyan-400 font-bold hover:underline text-sm block mb-3">
                +91 9989309424
              </a>
              <p className="text-xs text-slate-500">Registered Owner: {OWNER_EMAIL}</p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} MSacservice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomeTab({ onNavigateBooking }) {
  return (
    <div className="space-y-16 py-8">
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Shield className="w-4 h-4" />
              <span>Certified AC Technicians</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Expert AC Care. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Honest Pricing.</span> <br />
              Comfort You Can Trust.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Fast, dependable AC motor servicing and repair diagnostics directly at your doorstep. No account or login required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onNavigateBooking('Jet Motor Service')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-lg shadow-cyan-500/25 hover:opacity-95 transition flex items-center justify-center space-x-2"
              >
                <span>Book Jet Service (₹1300)</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigateBooking('Normal AC Service')}
                className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-base transition flex items-center justify-center space-x-2"
              >
                <span>Normal AC Service (₹700)</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-slate-700/60 pb-4">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>Fixed Pricing & Inspection Menu</span>
            </h3>

            <div className="space-y-3">
              <div 
                onClick={() => onNavigateBooking('Jet Motor Service')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex justify-between items-center cursor-pointer hover:border-cyan-500/50 transition"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">Jet Motor Service</h4>
                  <p className="text-xs text-slate-400">Deep pressure washing for cooling coils</p>
                </div>
                <span className="text-base font-black text-cyan-400">₹1,300</span>
              </div>

              <div 
                onClick={() => onNavigateBooking('Normal AC Service')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex justify-between items-center cursor-pointer hover:border-cyan-500/50 transition"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">Normal AC Service</h4>
                  <p className="text-xs text-slate-400">Standard filter & airflow service</p>
                </div>
                <span className="text-base font-black text-cyan-400">₹700</span>
              </div>

              <div 
                onClick={() => onNavigateBooking('AC Cooling Issue')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 flex justify-between items-center cursor-pointer hover:border-cyan-500/50 transition"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">AC Repair Inspection</h4>
                  <p className="text-xs text-slate-400">Cooling, leak & power diagnostics</p>
                </div>
                <span className="text-base font-black text-cyan-400">₹700</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center italic pt-2">
              *Repair costs are attendance/inspection charges. Additional spare parts & labor are quoted after diagnosis and require your explicit approval.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicesTab({ onSelectService }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Services & Transparent Pricing</h2>
        <p className="text-slate-400 text-base">
          All service charges are fixed. For repairs, our standard ₹700 attendance fee covers complete site inspection and fault diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INITIAL_SERVICES.map(service => (
          <div 
            key={service.id}
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  service.type === 'service' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {service.type === 'service' ? 'Standard Service' : 'Repair Inspection'}
                </span>
                <span className="text-2xl font-black text-white">{formatINR(service.price)}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{service.name}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{service.desc}</p>
            </div>
            <button
              onClick={() => onSelectService(service.name)}
              className="mt-6 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition"
            >
              Select & Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingTab({ preselectedService, onBookingCreated }) {
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    address: '',
    landmark: '',
    acBrand: AC_BRANDS[0],
    acType: AC_TYPES[0],
    serviceSelected: resolveServiceOptionValue(preselectedService),
    description: '',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '10:00 AM - 12:00 PM',
    lat: 17.3850,
    lng: 78.4867
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [geoStatus, setGeoStatus] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceSelected: resolveServiceOptionValue(preselectedService) }));
    }
  }, [preselectedService]);

  useEffect(() => {
    let isMounted = true;
    const initMap = () => {
      if (!mapContainerRef.current || leafletMapRef.current || !isMounted) return;
      try {
        const L = window.L;
        const map = L.map(mapContainerRef.current).setView([formData.lat, formData.lng], 13);
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker([formData.lat, formData.lng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on('dragend', function (e) {
          const coord = e.target.getLatLng();
          if (isMounted) {
            setFormData(prev => ({ ...prev, lat: coord.lat, lng: coord.lng }));
          }
        });
      } catch (err) {
        console.error('Leaflet Map Error:', err);
      }
    };

    if (!window.L) {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => { if (isMounted) initMap(); };
        document.head.appendChild(script);
      }
    } else {
      initMap();
    }

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }
    setGeoStatus('Fetching current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
        setGeoStatus('Location acquired successfully!');
        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 15);
          markerRef.current.setLatLng([latitude, longitude]);
        }
      },
      (error) => {
        setGeoStatus(`Location error: ${error.message}. Please enter address manually.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Full Name is required.';
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) errors.mobile = 'Mobile Phone Number is required.';
    else if (cleanMobile.length !== 10) errors.mobile = 'Enter a valid 10-digit mobile number.';
    if (!formData.address.trim()) errors.address = 'Service Address is required.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeoStatus('Connecting to database...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          mobile: formData.mobile.replace(/\D/g, ''),
          email: formData.email,
          serviceSelected: formData.serviceSelected,
          acBrand: formData.acBrand,
          acType: formData.acType,
          address: formData.address,
          landmark: formData.landmark,
          lat: formData.lat,
          lng: formData.lng,
          description: formData.description
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeoStatus('');
        onBookingCreated(data.booking);
        setBookingConfirmed(data.booking);
      } else {
        setGeoStatus('');
        alert(`Booking Failed: ${data.error || 'Database write failed.'}`);
      }
    } catch (err) {
      setGeoStatus('');
      alert('Could not connect to backend server at http://localhost:5000. Please ensure your Express backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    const waText = encodeURIComponent(
      `Hello MSacservice, I have submitted a booking!\n\nReference: ${bookingConfirmed.id}\nName: ${bookingConfirmed.customerName}\nMobile: ${bookingConfirmed.mobile}\nService: ${bookingConfirmed.serviceSelected}\nAddress: ${bookingConfirmed.address}`
    );
    const waUrl = `https://wa.me/${OWNER_PHONE.replace('+', '')}?text=${waText}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/40">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Booking Saved to Database!</h2>
        <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-left space-y-3 font-mono text-sm">
          <p><span className="text-slate-400">Booking Reference:</span> <strong className="text-cyan-400">{bookingConfirmed.id}</strong></p>
          <p><span className="text-slate-400">Customer Name:</span> <span className="text-white">{bookingConfirmed.customerName}</span></p>
          <p><span className="text-slate-400">Selected Service:</span> <span className="text-white">{bookingConfirmed.serviceSelected}</span></p>
          <p><span className="text-slate-400">AC Type / Brand:</span> <span className="text-white">{bookingConfirmed.acType} ({bookingConfirmed.acBrand})</span></p>
          <p><span className="text-slate-400">Saved Address:</span> <span className="text-white">{bookingConfirmed.address}</span></p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm via WhatsApp</span>
          </a>
          <button
            onClick={() => {
              setBookingConfirmed(null);
              setFormData(prev => ({
                ...prev,
                customerName: '',
                mobile: '',
                email: '',
                address: '',
                landmark: '',
                description: ''
              }));
            }}
            className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-700 transition"
          >
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">Book AC Service & Repair</h2>
        <p className="text-slate-400 text-sm">No login required. Details save directly to database.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              className={`w-full bg-slate-900 border ${validationErrors.customerName ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500`}
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Mobile Number (10 Digits) *</label>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
              className={`w-full bg-slate-900 border ${validationErrors.mobile ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500`}
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Selected Service or Repair *</label>
            <select
              value={formData.serviceSelected}
              onChange={e => setFormData({ ...formData, serviceSelected: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              {INITIAL_SERVICES.map(s => (
                <option key={s.id} value={s.value}>{s.value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">AC Brand *</label>
            <select
              value={formData.acBrand}
              onChange={e => setFormData({ ...formData, acBrand: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              {AC_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">AC Type *</label>
            <select
              value={formData.acType}
              onChange={e => setFormData({ ...formData, acType: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              {AC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Service Location & Map Marker</span>
              </h4>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="px-3.5 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/20 transition flex items-center space-x-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Use My Current Location</span>
            </button>
          </div>

          {geoStatus && <p className="text-xs text-cyan-400 italic">{geoStatus}</p>}

          <div ref={mapContainerRef} className="w-full h-64 rounded-xl border border-slate-700 overflow-hidden bg-slate-950" />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Service Address *</label>
            <textarea
              required
              rows={3}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
              placeholder="House/Flat No., Street Name, Area..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
        >
          {isSubmitting ? 'Saving to Database...' : 'Confirm & Save Booking'}
        </button>
      </form>
    </div>
  );
}

function ComplaintsTab({ onComplaintCreated }) {
  const [compData, setCompData] = useState({ customerName: '', mobile: '', bookingRef: '', description: '' });
  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmpId = `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    onComplaintCreated({ ...compData, id: cmpId, status: 'Open', createdAt: new Date().toISOString() });
    setSubmittedId(cmpId);
  };

  if (submittedId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto" />
        <h3 className="text-2xl font-bold text-white">Complaint Registered</h3>
        <p className="text-slate-400 text-sm">Reference ID: <strong className="text-cyan-400 font-mono">{submittedId}</strong></p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h2 className="text-3xl font-extrabold text-white text-center">Customer Support & Complaints</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <input type="text" required placeholder="Full Name *" value={compData.customerName} onChange={e => setCompData({ ...compData, customerName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
        <input type="tel" required maxLength={10} placeholder="Mobile Number *" value={compData.mobile} onChange={e => setCompData({ ...compData, mobile: e.target.value.replace(/\D/g, '') })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
        <textarea required rows={4} placeholder="Complaint Description *" value={compData.description} onChange={e => setCompData({ ...compData, description: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
        <button type="submit" className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold">Submit Complaint</button>
      </form>
    </div>
  );
}

function OwnerDashboardTab({ bookings, setBookings, complaints, setIsLoggedIn, isLoggedIn }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/owner/session`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.authenticated) setIsLoggedIn(true); })
      .catch(() => {});
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${BACKEND_URL}/api/bookings`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success) setBookings(data.bookings);
        })
        .catch(() => {});
    }
  }, [isLoggedIn, setBookings]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/owner/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) setStep(2);
      else setErrorMsg(data.error || 'Request failed.');
    } catch (err) {
      setErrorMsg('Could not connect to backend server at http://localhost:5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/owner/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: otpInput })
      });
      const data = await res.json();
      if (data.success) setIsLoggedIn(true);
      else setErrorMsg(data.error || 'Verification failed.');
    } catch (err) {
      setErrorMsg('Could not connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/owner/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setIsLoggedIn(false);
    setStep(1);
    setPassword('');
    setOtpInput('');
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (e) {
      alert('Failed to update status in database.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Owner Portal Login</h2>
        {errorMsg && <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">{errorMsg}</div>}
        {step === 1 ? (
          <form onSubmit={handlePasswordSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
            <input type="email" disabled value={email} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 text-sm" />
            <input type="password" required placeholder="Owner Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm">
              {isLoading ? 'Connecting to Backend...' : 'Validate Password & Send Email OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
            <input type="text" required maxLength={6} placeholder="123456" value={otpInput} onChange={e => setOtpInput(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono text-white" />
            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
              {isLoading ? 'Verifying...' : 'Verify OTP & Access Dashboard'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-white">Owner Operations Dashboard</h2>
          <p className="text-xs text-slate-400">Authenticated: {email}</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-slate-900 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <span>Database Bookings ({bookings.length})</span>
        </h3>

        {bookings.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-12 text-center space-y-3">
            <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-300">No database bookings yet</h4>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-xs font-bold uppercase text-slate-400 bg-slate-900/50">
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-4 font-mono font-bold text-cyan-400">{b.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{b.customerName}</p>
                      <p className="text-xs text-slate-400">{b.mobile}</p>
                    </td>
                    <td className="p-4">{b.serviceSelected}</td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={e => updateBookingStatus(b.id, e.target.value)}
                        className="bg-slate-900 text-xs font-bold text-white rounded p-1 border border-slate-700"
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {b.lat && (
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 font-bold underline">
                          Navigate
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}