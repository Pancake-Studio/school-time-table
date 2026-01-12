import React, { useState } from 'react';
import { 
  Clock, BookOpen, Coffee, Sun, Edit3, Check, 
  Settings, User, MapPin, Download, Plus, Trash2, X
} from 'lucide-react';

const App = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Settings State - ปรับเวลาเริ่มเรียนเป็น 08:10 ตามคำขอ
  const [settings, setSettings] = useState({
    startTime: '08:10',
    periodDuration: 40,
    shortBreakDuration: 10,
    shortBreakAfter: 2,
    lunchTime: '12:20',
    lunchDuration: 50,
    totalPeriods: 8
  });

  // Schedule Data State
  const initialSubjects = {
    'จันทร์': Array(12).fill({ name: '', teacher: '', room: '' }),
    'อังคาร': Array(12).fill({ name: '', teacher: '', room: '' }),
    'พุธ': Array(12).fill({ name: '', teacher: '', room: '' }),
    'พฤหัสบดี': Array(12).fill({ name: '', teacher: '', room: '' }),
    'ศุกร์': Array(12).fill({ name: '', teacher: '', room: '' }),
  };

  const [scheduleData, setScheduleData] = useState(initialSubjects);
  const [editingCell, setEditingCell] = useState(null);

  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

  // Time Calculation Logic
  const generateTimeline = () => {
    let timeline = [];
    let [h, m] = settings.startTime.split(':').map(Number);
    let current = new Date();
    current.setHours(h, m, 0);

    const formatTime = (date) => date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

    for (let i = 1; i <= settings.totalPeriods; i++) {
      const start = formatTime(current);
      current.setMinutes(current.getMinutes() + parseInt(settings.periodDuration));
      const end = formatTime(current);
      
      timeline.push({ id: i, start, end, type: 'class' });

      // Check Short Break
      if (i === parseInt(settings.shortBreakAfter)) {
        const bStart = formatTime(current);
        current.setMinutes(current.getMinutes() + parseInt(settings.shortBreakDuration));
        const bEnd = formatTime(current);
        timeline.push({ id: `break-${i}`, start: bStart, end: bEnd, type: 'break', label: 'พักเบรก' });
      }

      // Check Lunch Time
      const currentTimeStr = formatTime(current);
      if (currentTimeStr === settings.lunchTime) {
        const lStart = formatTime(current);
        current.setMinutes(current.getMinutes() + parseInt(settings.lunchDuration));
        const lEnd = formatTime(current);
        timeline.push({ id: 'lunch', start: lStart, end: lEnd, type: 'lunch', label: 'พักเที่ยง' });
      }
    }
    return timeline;
  };

  const timeline = generateTimeline();

  const handleCellChange = (day, idx, field, value) => {
    const newData = { ...scheduleData };
    const dayData = [...newData[day]];
    dayData[idx] = { ...dayData[idx], [field]: value };
    newData[day] = dayData;
    setScheduleData(newData);
  };

  const getDayTheme = (day) => {
    const themes = {
      'จันทร์': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'อังคาร': 'bg-pink-100 text-pink-700 border-pink-300',
      'พุธ': 'bg-green-100 text-green-700 border-green-300',
      'พฤหัสบดี': 'bg-orange-100 text-orange-700 border-orange-300',
      'ศุกร์': 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return themes[day];
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 print:hidden">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="text-indigo-600 w-6 h-6" /> ตารางเรียนของฉัน
            </h1>
            <p className="text-slate-500 text-xs text-left">คลิกที่ช่องเพื่อแก้ไขวิชา/ชื่อครู</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all"
            >
              <Settings className="w-4 h-4" /> ตั้งค่าเวลา
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> บันทึก / พิมพ์
            </button>
          </div>
        </div>

        {/* Config Panel */}
        {isConfigOpen && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-100 grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">เริ่มเรียน</label>
              <input type="time" value={settings.startTime} onChange={(e) => setSettings({...settings, startTime: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">นาที/คาบ</label>
              <input type="number" value={settings.periodDuration} onChange={(e) => setSettings({...settings, periodDuration: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">เริ่มพักเที่ยง</label>
              <input type="time" value={settings.lunchTime} onChange={(e) => setSettings({...settings, lunchTime: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">จำนวนคาบ</label>
              <input type="number" max="12" value={settings.totalPeriods} onChange={(e) => setSettings({...settings, totalPeriods: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none" />
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 border-b text-center w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    วัน
                  </th>
                  {timeline.map((slot) => (
                    <th key={slot.id} className="p-3 border-b border-slate-100 min-w-[120px]">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">
                          {slot.type === 'class' ? `คาบ ${slot.id}` : 'พัก'}
                        </span>
                        <span className="text-sm font-bold text-slate-700 leading-none mt-1">{slot.start}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className="border-b border-slate-50 last:border-0">
                    <td className="p-2 border-r border-slate-50">
                      <div className={`py-4 px-2 rounded-xl font-bold text-center text-xs border ${getDayTheme(day)}`}>
                        {day}
                      </div>
                    </td>
                    
                    {(() => {
                      let classIdx = 0;
                      return timeline.map((slot) => {
                        if (slot.type === 'break' || slot.type === 'lunch') {
                          return (
                            <td key={slot.id} className={`p-2 bg-slate-50/50 text-center`}>
                              <div className="flex flex-col items-center justify-center opacity-30">
                                {slot.type === 'lunch' ? <Sun className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                                <span className="text-[8px] font-bold uppercase mt-1">{slot.label}</span>
                              </div>
                            </td>
                          );
                        }

                        const currentIdx = classIdx++;
                        const subject = scheduleData[day][currentIdx] || { name: '', teacher: '', room: '' };
                        const isEditing = editingCell === `${day}-${currentIdx}`;

                        return (
                          <td 
                            key={slot.id} 
                            className={`p-2 relative transition-all cursor-pointer hover:bg-indigo-50/30 ${isEditing ? 'bg-indigo-50 shadow-inner' : ''}`}
                            onClick={() => setEditingCell(`${day}-${currentIdx}`)}
                          >
                            {isEditing ? (
                              <div className="space-y-1 bg-white p-2 rounded-lg shadow-xl border border-indigo-300 absolute inset-0 z-10 min-w-[150px] m-1 print:hidden text-left">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-indigo-500">คาบที่ {slot.id}</span>
                                  <X className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditingCell(null); }} />
                                </div>
                                <input 
                                  autoFocus
                                  className="w-full p-1 text-xs font-bold border rounded outline-none focus:border-indigo-500"
                                  placeholder="ชื่อวิชา"
                                  value={subject.name}
                                  onChange={(e) => handleCellChange(day, currentIdx, 'name', e.target.value)}
                                />
                                <input 
                                  className="w-full p-1 text-[10px] border rounded outline-none"
                                  placeholder="ครูผู้สอน"
                                  value={subject.teacher}
                                  onChange={(e) => handleCellChange(day, currentIdx, 'teacher', e.target.value)}
                                />
                                <input 
                                  className="w-full p-1 text-[10px] border rounded outline-none"
                                  placeholder="ห้องเรียน"
                                  value={subject.room}
                                  onChange={(e) => handleCellChange(day, currentIdx, 'room', e.target.value)}
                                />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingCell(null); }}
                                  className="w-full py-1 bg-indigo-600 text-white text-[10px] rounded font-bold"
                                >
                                  บันทึก
                                </button>
                              </div>
                            ) : (
                              <div className="min-h-[60px] flex flex-col justify-center items-center text-center p-1">
                                <span className={`text-sm font-bold leading-tight ${!subject.name ? 'text-slate-200 italic font-normal' : 'text-slate-700'}`}>
                                  {subject.name || 'เพิ่มวิชา'}
                                </span>
                                {subject.teacher && (
                                  <div className="flex items-center gap-1 mt-1 opacity-60">
                                    <User className="w-2 h-2" />
                                    <span className="text-[9px] truncate max-w-[80px]">{subject.teacher}</span>
                                  </div>
                                )}
                                {subject.room && (
                                  <div className="flex items-center gap-1 opacity-60">
                                    <MapPin className="w-2 h-2" />
                                    <span className="text-[9px]">{subject.room}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      });
                    })()}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Table */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-700">ตารางเรียนประจำภาคเรียน</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Smart Timetable Pro</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">จัดทำโดย</p>
              <p className="text-xs font-bold text-indigo-500">ระบบสร้างตารางอัตโนมัติ</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; padding: 0; margin: 0; }
          .print\\:hidden { display: none !important; }
          .rounded-2xl { border-radius: 0 !important; }
          .shadow-xl { box-shadow: none !important; }
          table { width: 100% !important; border: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
};

export default App;