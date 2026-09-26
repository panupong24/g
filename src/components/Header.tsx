import React from 'react';
import { Bus, Ticket, Phone, ShieldCheck, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenBookings: () => void;
  savedBookingsCount: number;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBookings,
  savedBookingsCount,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={onGoHome}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-blue-950 font-['Prompt']">
                  Bus Booking
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  ไทยแลนด์
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบจองตั๋วรถทัวร์ออนไลน์อันดับ 1 ทั่วไทย
              </p>
            </div>
          </button>

          {/* Center quick reassurance (desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>เส้นทางยอดนิยม: หาดใหญ่ - กรุงเทพฯ</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>การันตีที่นั่ง 100% ปลอดภัย</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call Center */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 pr-2 border-r border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 leading-tight">โทรสอบถาม</p>
                <p className="font-semibold text-slate-800 leading-tight">1690 (24 ชม.)</p>
              </div>
            </div>

            {/* My Bookings Button */}
            <button
              id="my-bookings-btn"
              onClick={onOpenBookings}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold border border-blue-200 transition-colors"
            >
              <Ticket className="w-4 h-4 text-blue-700" />
              <span>ตั๋วของฉัน</span>
              {savedBookingsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  {savedBookingsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
