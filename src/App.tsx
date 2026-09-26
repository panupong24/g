import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { SearchHero } from './components/SearchHero';
import { TripList } from './components/TripList';
import { SeatMap } from './components/SeatMap';
import { PassengerForm } from './components/PassengerForm';
import { BookingConfirmation } from './components/BookingConfirmation';
import { MyBookingsModal } from './components/MyBookingsModal';
import { BusTrip, BookingStep, Booking, PassengerInfo, ContactInfo } from './types';
import { MOCK_TRIPS } from './data/mockData';
import { Bus, Shield, HeartHandshake, Phone, MapPin, Award } from 'lucide-react';

export default function App() {
  // Navigation & Step State
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');

  // Search parameters (Default to Hat Yai - Bangkok as requested for testing)
  const [origin, setOrigin] = useState('หาดใหญ่ (สงขลา)');
  const [destination, setDestination] = useState('กรุงเทพมหานคร');
  
  // Default travel date: Tomorrow
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [passengersCount, setPassengersCount] = useState(1);

  // Booking Flow State
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Saved Bookings in localStorage
  const [savedBookings, setSavedBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('bus_bookings_list');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bus_bookings_list', JSON.stringify(savedBookings));
    } catch {
      // Ignore write errors
    }
  }, [savedBookings]);

  // Filter trips based on origin and destination
  const matchedTrips = React.useMemo(() => {
    const exact = MOCK_TRIPS.filter(
      (t) => t.fromCity === origin && t.toCity === destination
    );
    if (exact.length > 0) return exact;

    // Fallback trips if user picks a custom pair: adapt sample trips with the chosen names
    return MOCK_TRIPS.slice(0, 4).map((t, idx) => ({
      ...t,
      id: `${t.id}-custom-${idx}`,
      fromCity: origin,
      toCity: destination,
    }));
  }, [origin, destination]);

  // Handle Search Click
  const handleSearch = () => {
    setCurrentStep('search');
    const el = document.getElementById('trip-results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Select Trip
  const handleSelectTrip = (trip: BusTrip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]); // reset seat selection
    setCurrentStep('seat_selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Toggle Seat in 2+2 layout
  const handleToggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length < passengersCount) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        // If max passengers reached, replace the first seat or alert
        if (passengersCount === 1) {
          setSelectedSeats([seatId]);
        } else {
          // Replace earliest selected
          const updated = [...selectedSeats.slice(1), seatId];
          setSelectedSeats(updated);
        }
      }
    }
  };

  // Handle Proceed from Seat Map to Passenger Form
  const handleProceedToPassenger = () => {
    if (selectedSeats.length === passengersCount && selectedTrip) {
      setCurrentStep('passenger_info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Submit Booking & Payment
  const handleSubmitBooking = (data: {
    passengers: PassengerInfo[];
    contact: ContactInfo;
    paymentMethod: 'promptpay' | 'credit_card' | 'counter_service' | 'mobile_banking';
    totalPrice: number;
    basePrice: number;
    insuranceFee: number;
    serviceFee: number;
  }) => {
    if (!selectedTrip) return;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const codePrefix = selectedTrip.fromCity.includes('หาดใหญ่') ? 'HYBKK' : 'BKS';
    const bookingId = `${codePrefix}-${new Date().getFullYear()}-${randomNum}`;

    const newBooking: Booking = {
      bookingId,
      trip: selectedTrip,
      travelDate,
      passengers: data.passengers,
      contact: data.contact,
      selectedSeatIds: selectedSeats,
      basePrice: data.basePrice,
      insuranceFee: data.insuranceFee,
      serviceFee: data.serviceFee,
      totalPrice: data.totalPrice,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'paid',
      bookingDate: new Date().toISOString(),
    };

    setCurrentBooking(newBooking);
    setSavedBookings((prev) => [newBooking, ...prev]);
    setCurrentStep('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Book Another / Reset
  const handleBookAnother = () => {
    setSelectedTrip(null);
    setSelectedSeats([]);
    setCurrentBooking(null);
    setCurrentStep('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBooking = (bookingId: string) => {
    setSavedBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    if (currentBooking?.bookingId === bookingId) {
      setCurrentBooking(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Prompt',sans-serif]">
      {/* Navbar Header */}
      <Header
        onOpenBookings={() => setIsMyBookingsOpen(true)}
        savedBookingsCount={savedBookings.length}
        onGoHome={handleBookAnother}
      />

      {/* Progress Steps Header */}
      <StepProgress
        currentStep={currentStep}
        canGoToSeats={!!selectedTrip}
        canGoToPassenger={!!selectedTrip && selectedSeats.length === passengersCount}
        onStepClick={(step) => {
          if (step === 'search') {
            setCurrentStep('search');
          } else if (step === 'seat_selection' && selectedTrip) {
            setCurrentStep('seat_selection');
          } else if (step === 'passenger_info' && selectedTrip && selectedSeats.length === passengersCount) {
            setCurrentStep('passenger_info');
          }
        }}
      />

      {/* Main Content Area Based on Step */}
      <main className="flex-1">
        {currentStep === 'search' && (
          <div>
            {/* Search Hero with quick buttons and Hat Yai - Bangkok sample */}
            <SearchHero
              origin={origin}
              destination={destination}
              travelDate={travelDate}
              passengersCount={passengersCount}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onDateChange={setTravelDate}
              onPassengersChange={setPassengersCount}
              onSearch={handleSearch}
            />

            {/* Trip List with filters and prices */}
            <TripList
              trips={matchedTrips}
              origin={origin}
              destination={destination}
              travelDate={travelDate}
              passengersCount={passengersCount}
              onSelectTrip={handleSelectTrip}
            />
          </div>
        )}

        {currentStep === 'seat_selection' && selectedTrip && (
          <SeatMap
            trip={selectedTrip}
            travelDate={travelDate}
            passengersCount={passengersCount}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            onBack={() => setCurrentStep('search')}
            onProceed={handleProceedToPassenger}
          />
        )}

        {currentStep === 'passenger_info' && selectedTrip && (
          <PassengerForm
            trip={selectedTrip}
            travelDate={travelDate}
            selectedSeats={selectedSeats}
            onBack={() => setCurrentStep('seat_selection')}
            onSubmitBooking={handleSubmitBooking}
          />
        )}

        {currentStep === 'confirmation' && currentBooking && (
          <BookingConfirmation
            booking={currentBooking}
            onBookAnother={handleBookAnother}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 sm:py-12 border-t border-slate-800 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            {/* Col 1: Brand info */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <span>Bus Booking</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                ระบบจองตั๋วรถทัวร์ออนไลน์อันดับหนึ่งในไทย รองรับเส้นทาง หาดใหญ่ - กรุงเทพฯ และทุกจังหวัดทั่วประเทศ
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <Shield className="w-4 h-4" />
                <span>จองปลอดภัย ได้ที่นั่งแน่นอน 100%</span>
              </div>
            </div>

            {/* Col 2: Popular routes */}
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm">เส้นทางยอดนิยม</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      setOrigin('หาดใหญ่ (สงขลา)');
                      setDestination('กรุงเทพมหานคร');
                      setCurrentStep('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    • หาดใหญ่ ➔ กรุงเทพฯ (ยอดฮิต)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOrigin('กรุงเทพมหานคร');
                      setDestination('หาดใหญ่ (สงขลา)');
                      setCurrentStep('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    • กรุงเทพฯ ➔ หาดใหญ่
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOrigin('กรุงเทพมหานคร');
                      setDestination('เชียงใหม่');
                      setCurrentStep('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    • กรุงเทพฯ ➔ เชียงใหม่
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOrigin('กรุงเทพมหานคร');
                      setDestination('ภูเก็ต');
                      setCurrentStep('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    • กรุงเทพฯ ➔ ภูเก็ต
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Bus Operators */}
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm">พันธมิตรรถร่วมบริการ</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• สยามเดินรถ (Siam Dernrod)</li>
                <li>• ปิยะรุ่งเรืองทัวร์ (Piya Tour)</li>
                <li>• บขส. 999 (บริษัท ขนส่ง จำกัด)</li>
                <li>• ศรีสยามทัวร์ (Sri Siam Tour)</li>
                <li>• สุวรรณนทีขนส่ง</li>
              </ul>
            </div>

            {/* Col 4: Contact & Support */}
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm">ช่วยเหลือ & ติดต่อ</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call Center: 1690 หรือ 02-123-4567</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>สายด่วนบริการ 24 ชั่วโมง ทุกวัน</span>
                </p>
                <p className="text-slate-500 pt-2 text-[11px]">
                  รองรับการชำระเงินผ่าน PromptPay, Visa, Mastercard, JCB, และเคาน์เตอร์เซอร์วิส
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Bus Booking Thailand. สงวนลิขสิทธิ์ทุกประการ</p>
            <p>ระบบจองตั๋วรถทัวร์ออนไลน์แบบ 2+2 ทันสมัยและปลอดภัย</p>
          </div>
        </div>
      </footer>

      {/* My Bookings History Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={savedBookings}
        onSelectBooking={(b) => {
          setCurrentBooking(b);
          setCurrentStep('confirmation');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteBooking={handleDeleteBooking}
      />
    </div>
  );
}
