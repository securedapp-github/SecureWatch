import React, { useState } from 'react';
const DateRangePicker = ({ onApply, onCancel }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [endTime, setEndTime] = useState({ hours: "23", minutes: "00", seconds: "00" });


  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);


    const days = [];
    const startingDay = firstDay.getDay();


    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }


    // Add the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }


    return days;
  };


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  const handlePrevMonth = (setDate) => {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };


  const handleNextMonth = (setDate) => {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };


  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      options.push(i.toString().padStart(2, '0'));
    }
    return options;
  };


  const generateMinuteOptions = () => {
    const options = [];
    for (let i = 0; i < 60; i++) {
      options.push(i.toString().padStart(2, '0'));
    }
    return options;
  };


  const generateSecondOptions = () => {
    const options = [];
    for (let i = 0; i < 60; i++) {
      options.push(i.toString().padStart(2, '0'));
    }
    return options;
  };


  const handleApply = () => {
    const finalStartTime = `${startTime.hours}:${startTime.minutes}:${startTime.seconds}`;
    const finalEndTime = `${endTime.hours}:${endTime.minutes}:${endTime.seconds}`;
    onApply(startDate, endDate, finalStartTime, finalEndTime);
  };


  // Helper function to check if a date is between start and end dates
  const isDateInRange = (date) => {
    if (!date) return false;
   
    // Create copies of dates without time component for comparison
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
   
    return current > start && current < end;
  };


  // Helper function to get the appropriate class for a date
  const getDateClass = (day, currentDate) => {
    if (!day) return 'invisible';
   
    if (day.toDateString() === currentDate.toDateString()) {
      return 'bg-blue-600 text-white';
    } else if (isDateInRange(day)) {
      return 'bg-blue-100';
    } else {
      return 'hover:bg-gray-100';
    }
  };


  return (
    <div className="p-7 fixed inset-0 mt-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[800px] font-bold">
        <h2 className="text-xl font-bold mb-4 text-center">Select Date Range</h2>


        <div className="grid grid-cols-2 gap-8">
          {/* Start Date Calendar */}
          <div>
            <div className="text-blue-600 mb-2 text-center font-bold">Start Date</div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handlePrevMonth(setStartDate)}
                className="p-2 bg-gray-100 rounded-full shadow border border-gray-200 hover:bg-gray-200 transition-colors font-bold"
              >
                ←
              </button>
              <div className="font-bold">
                {monthNames[startDate.getMonth()]} {startDate.getFullYear()}
              </div>
              <button
                onClick={() => handleNextMonth(setStartDate)}
                className="p-2 bg-gray-100 rounded-full shadow border border-gray-200 hover:bg-gray-200 transition-colors font-bold"
              >
                →
              </button>
            </div>


            <div className="grid grid-cols-7 gap-1">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="text-center text-gray-500 text-sm py-1 border-b font-bold">{day}</div>
              ))}
              {generateCalendarDays(startDate).map((day, index) => (
                <button
                  key={index}
                  className={`
                    p-2 text-center rounded-full font-bold
                    ${getDateClass(day, startDate)}
                  `}
                  onClick={() => day && setStartDate(day)}
                  disabled={!day}
                >
                  {day?.getDate()}
                </button>
              ))}
            </div>
          </div>


          {/* End Date Calendar */}
          <div>
            <div className="text-blue-600 mb-2 text-center font-bold">End Date</div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handlePrevMonth(setEndDate)}
                className="p-2 bg-gray-100 rounded-full shadow border border-gray-200 hover:bg-gray-200 transition-colors font-bold"
              >
                ←
              </button>
              <div className="font-bold">
                {monthNames[endDate.getMonth()]} {endDate.getFullYear()}
              </div>
              <button
                onClick={() => handleNextMonth(setEndDate)}
                className="p-2 bg-gray-100 rounded-full shadow border border-gray-200 hover:bg-gray-200 transition-colors font-bold"
              >
                →
              </button>
            </div>


            <div className="grid grid-cols-7 gap-1">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="text-center text-gray-500 text-sm py-1 border-b font-bold">{day}</div>
              ))}
              {generateCalendarDays(endDate).map((day, index) => (
                <button
                  key={index}
                  className={`
                    p-2 text-center rounded-full font-bold
                    ${getDateClass(day, endDate)}
                  `}
                  onClick={() => day && setEndDate(day)}
                  disabled={!day}
                >
                  {day?.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <div className="text-gray-700 mb-2 text-center font-bold">Start Time</div>
            <div className="flex items-center justify-center space-x-2">
              <select
                className="border rounded-md p-2 shadow-lg font-bold"
                value={startTime.hours}
                onChange={(e) => setStartTime(prev => ({ ...prev, hours: e.target.value }))}
              >
                {generateTimeOptions().map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              <span className="font-bold">:</span>
              <select
                className="border rounded-md p-2 shadow-lg font-bold"
                value={startTime.minutes}
                onChange={(e) => setStartTime(prev => ({ ...prev, minutes: e.target.value }))}
              >
                {generateMinuteOptions().map(minute => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
              <span className="font-bold">:</span>
              <select
                className="border rounded-md p-2 shadow-lg font-bold"
                value={startTime.seconds}
                onChange={(e) => setStartTime(prev => ({ ...prev, seconds: e.target.value }))}
              >
                {generateSecondOptions().map(second => (
                  <option key={second} value={second}>{second}</option>
                ))}
              </select>
            </div>
          </div>


          <div>
            <div className="text-gray-700 mb-2 text-center font-bold">End Time</div>
            <div className="flex items-center justify-center space-x-2">
              <select
                className="border rounded-md p-2 shadow-lg font-bold"
                value={endTime.hours}
                onChange={(e) => setEndTime(prev => ({ ...prev, hours: e.target.value }))}
              >
                {generateTimeOptions().map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              <span className="font-bold">:</span>
              <select
                className="border rounded-md p-2 shadow-lg font-bold"
                value={endTime.minutes}
                onChange={(e) => setEndTime(prev => ({ ...prev, minutes: e.target.value }))}
              >
                {generateMinuteOptions().map(minute => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
              <span className="font-bold">:</span>
              <select
                className="border rounded-md p-2 shadow-lg font-bold"
                value={endTime.seconds}
                onChange={(e) => setEndTime(prev => ({ ...prev, seconds: e.target.value }))}
              >
                {generateSecondOptions().map(second => (
                  <option key={second} value={second}>{second}</option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};


export default DateRangePicker;