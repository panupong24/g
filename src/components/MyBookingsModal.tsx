import React from 'react';
import { X, Ticket, ArrowRight, Clock, Armchair, Trash2, Printer } from 'lucide-react';
import { Booking } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
  onDeleteBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">ตั๋วของฉัน (My Bookings)</h3>
              <p className="text-xs text-blue-200">ประวัติการจองตั๋วรถทัวร์ทั้งหมด ({bookings.length} รายการ)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Ticket className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700">ยังไม่มีประวัติการจองตั๋ว</p>
              <p className="text-xs text-slate-400 mt-1">
                เมื่อคุณทำการจองตั๋วรถทัวร์สำเร็จ รายการตั๋วจะถูกบันทึกไว้ที่นี่โดยอัตโนมัติ
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                      #{b.bookingId}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {b.trip.operatorName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({b.trip.busType})
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{b.trip.fromCity}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>{b.trip.toCity}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.travelDate} เวลา {b.trip.departureTime} น.
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-semibold">
                      <Armchair className="w-3.5 h-3.5 text-blue-600" />
                      ที่นั่ง: {b.selectedSeatIds.join(', ')}
                    </span>
                    <span className="font-bold text-slate-800">
                      ฿{b.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectBooking(b);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>ดูตั๋ว E-Ticket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteBooking(b.bookingId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="ลบตั๋วนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
