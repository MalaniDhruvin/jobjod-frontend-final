"use client";
import { useState } from "react";
import { Clock } from "lucide-react";

function TimePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label = "Timing",
}) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  // Generate time options in 30-minute intervals
  const timeOptions = generateTimeOptions();

  function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const formattedHour = displayHour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}${period}`);
      }
    }
    return options;
  }

  function renderDropdown(isOpen, setIsOpen, selectedTime, onTimeChange) {
    return (
      isOpen && (
        <div className="absolute z-10 w-[200px] bg-white border border-gray-300 rounded shadow-md">
          <div className="h-[300px] overflow-y-auto">
            {timeOptions.map((time) => (
              <div
                key={time}
                className={[
                  "px-4 py-2 hover:bg-gray-100 cursor-pointer",
                  selectedTime === time &&
                    "bg-purple-50 text-purple-600 font-medium",
                ].join(" ")}
                onClick={() => {
                  onTimeChange(time);
                  setIsOpen(false);
                }}
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      )
    );
  }

  return (
    <div className="space-y-4">
      {label && (
        <div className="text-sm font-medium text-gray-700">{label}</div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 relative">
        {/* Start Time Picker */}
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-left flex items-center space-x-2"
          >
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{startTime || "Start Time"}</span>
          </button>
          {renderDropdown(isStartOpen, setIsStartOpen, startTime, onStartTimeChange)}
        </div>

        <span className="text-gray-500 hidden md:block">-</span>

        {/* End Time Picker */}
        <div className="relative w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => setIsEndOpen(!isEndOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-left flex items-center space-x-2"
          >
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{endTime || "End Time"}</span>
          </button>
          {renderDropdown(isEndOpen, setIsEndOpen, endTime, onEndTimeChange)}
        </div>
      </div>
    </div>
  );
}

export default TimePicker;










// "use client";

// import { useState } from "react";
// import { format } from "date-fns";
// import { CalendarIcon, Clock } from "lucide-react";

// export default function DateTimePicker({
//   startDate,
//   endDate,
//   onStartDateChange,
//   onEndDateChange,
// }) {
//   const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
//   const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);

//   // Format time for display
//   const formatTimeDisplay = (date) => {
//     if (!date) return "";
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? "PM" : "AM";
//     const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
//     return `${displayHour.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")} ${period}`;
//   };

//   // Generate time options (30-minute intervals)
//   const generateTimeOptions = () => {
//     const options = [];
//     for (let hour = 0; hour < 24; hour++) {
//       for (const minute of [0, 30]) {
//         const period = hour >= 12 ? "PM" : "AM";
//         const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//         options.push(
//           `${displayHour.toString().padStart(2, "0")}:${minute
//             .toString()
//             .padStart(2, "0")} ${period}`
//         );
//       }
//     }
//     return options;
//   };

//   const timeOptions = generateTimeOptions();

//   // Handle time selection
//   const handleTimeChange = (timeStr, isStart) => {
//     const [time, period] = timeStr.split(/(?<=\d)(?=AM|PM)/);
//     const [hours, minutes] = time.split(":").map(Number);
//     const adjustedHours =
//       period === "PM" && hours !== 12
//         ? hours + 12
//         : period === "AM" && hours === 12
//         ? 0
//         : hours;

//     if (isStart && startDate) {
//       const newDate = new Date(startDate);
//       newDate.setHours(adjustedHours, minutes);
//       onStartDateChange(newDate);
//     } else if (!isStart && endDate) {
//       const newDate = new Date(endDate);
//       newDate.setHours(adjustedHours, minutes);
//       onEndDateChange(newDate);
//     }
//   };

//   const formatTimeDisplay = (date) => {
//     if (!date) return "";
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? "PM" : "AM";
//     const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
//     return `${displayHour.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")} ${period}`;
//   };
  
//   // Handle date selection
//   const handleDateChange = (date, isStart) => {
//     if (isStart) {
//       onStartDateChange(date);
//     } else {
//       onEndDateChange(date);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Start Date and Time */}
//         <div className="space-y-2">
//           <div className="text-sm text-gray-500">Start</div>
//           {/* Date Picker */}
//           <div className="relative">
//             <button
//               className="w-full px-4 py-2 border border-gray-300 rounded flex items-center space-x-2"
//               onClick={() => alert("Implement date picker here")}
//             >
//               <CalendarIcon className="h-4 w-4 text-gray-500" />
//               <span>
//                 {startDate ? format(startDate, "MMMM do, yyyy") : "Select date"}
//               </span>
//             </button>
//           </div>

//           {/* Time Picker */}
//           <div className="relative">
//             <button
//               onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
//               className="w-full px-4 py-2 border border-gray-300 rounded flex items-center space-x-2"
//             >
//               <Clock className="h-4 w-4 text-gray-500" />
//               <span>
//                 {startDate ? formatTimeDisplay(startDate) : "Select time"}
//               </span>
//             </button>
//             {isStartTimeOpen && (
//               <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-[200px] overflow-auto">
//                 {timeOptions.map((time) => (
//                   <div
//                     key={time}
//                     className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//                       formatTimeDisplay(startDate) === time
//                         ? "bg-blue-100 text-blue-600 font-medium"
//                         : ""
//                     }`}
//                     onClick={() => {
//                       handleTimeChange(time, true);
//                       setIsStartTimeOpen(false);
//                     }}
//                   >
//                     {time}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* End Date and Time */}
//         <div className="space-y-2">
//           <div className="text-sm text-gray-500">End</div>
//           {/* Date Picker */}
//           <div className="relative">
//             <button
//               className="w-full px-4 py-2 border border-gray-300 rounded flex items-center space-x-2"
//               onClick={() => alert("Implement date picker here")}
//             >
//               <CalendarIcon className="h-4 w-4 text-gray-500" />
//               <span>{endDate ? format(endDate, "MMMM do, yyyy") : "Select date"}</span>
//             </button>
//           </div>

//          {/* End Date and Time */}
// <div className="space-y-2">
//   <div className="text-sm text-gray-500">End</div>

//   {/* Date Picker */}
//   <div className="relative">
//     <button
//       onClick={() => alert("Implement date picker here")}
//       className="w-full px-4 py-2 border border-gray-300 rounded flex items-center space-x-2"
//     >
//       <CalendarIcon className="h-4 w-4 text-gray-500" />
//       <span>{endDate ? format(endDate, "MMMM do, yyyy") : "Select date"}</span>
//     </button>
//   </div>

//   {/* Time Picker */}
//   <div className="relative">
//     <button
//       onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
//       className="w-full px-4 py-2 border border-gray-300 rounded flex items-center space-x-2"
//     >
//       <Clock className="h-4 w-4 text-gray-500" />
//       <span>{endDate ? formatTimeDisplay(endDate) : "Select time"}</span>
//     </button>
//     {isEndTimeOpen && (
//       <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-[200px] overflow-auto">
//         {timeOptions.map((time) => (
//           <div
//             key={time}
//             className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//               formatTimeDisplay(endDate) === time
//                 ? "bg-blue-100 text-blue-600 font-medium"
//                 : ""
//             }`}
//             onClick={() => {
//               handleTimeChange(time, false);
//               setIsEndTimeOpen(false);
//             }}
//           >
//             {time}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </div>

//         </div>
//       </div>
//     </div>
//   );
// }
