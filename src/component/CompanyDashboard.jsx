import React, { useState } from "react";
import dashboard from "../image/dashboard.png";
import { RxDashboard } from "react-icons/rx";
import { PiBagSimpleFill } from "react-icons/pi";
import { PiMonitorFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import logo2 from "../image/logo2.png";
import Dheader from "./Dheader";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Chartdashboard from "./Chartdashboard";

import DashSidebar from "./DashSidebar";

ChartJS.register(ArcElement, Tooltip, Legend);

function CompanyDashboard() {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location=useLocation();
  const substrLocation=location.pathname.substring(1)
  const data2 = {
    labels: ["Shortlisted", "Hired", "Rejected"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(0 0 0)",
          "rgb(250 151 108)",
          "rgba(158, 134, 224)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const applicationData = [
    { id: 0, label: "Shortlisted", count: 300, color: "rgb(0, 0, 0)" },
    { id: 1, label: "Hired", count: 50, color: "rgb(250, 151, 108)" },
    { id: 2, label: "Rejected", count: 100, color: "rgba(158, 134, 224)" },
  ];
  const totalApplications = applicationData.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const dataWithPercentage = applicationData.map((item) => ({
    ...item,
    percentage: Math.round((item.count / totalApplications) * 100),
  }));
  const chartData = {
    labels: applicationData.map((item) => item.label),
    datasets: [
      {
        data: applicationData.map((item) => item.count),
        backgroundColor: applicationData.map((item) => item.color),
        hoverOffset: 4,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend as we're creating a custom one
      },
      tooltip: {
        enabled: false, // Disable default tooltip as we're creating a custom one
      },
    },
    onHover: (event, elements) => {
      if (elements && elements.length === 1) {
        setHoveredSegment(elements[0].index);
      } else {
        setHoveredSegment(null);
      }
    },
  };

  const config = {
    type: "pie",
    data: data2,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, chartElement) => {
        if (chartElement.length === 1) {
          setHoveredSegment(chartElement[0].index);
        } else {
          setHoveredSegment(null);
        }
      },
    },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
    {/* dashboard sidebar code start */}
    <DashSidebar substrLocation={substrLocation}/> 

    {/* dashboard sidebar code end */}
      {/* Main Content */}  
      <div className="flex-1 flex flex-col overflow-auto ">
        {/* Header */}
        <Dheader />
        {/* <Chartdashboard/> */}

        {/* Content Area */}
        <main className="flex-1 p-3 overflow-y-auto">
          {/* Dashboard Content */}

          <div className="bg-white p-0 rounded-lg">
            {/* Adjust grid-cols based on screen size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"></div>
            <Chartdashboard />
            {/* Adjust grid-cols based on screen size */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Application Response Chart */}
              <div className="bg-white rounded-xl p-4 w-full max-w-4xl mx-auto border ">
                <h2 className="text-gray-700 font-bold text-lg md:text-xl mb-4">
                  Application Response
                </h2>

                <div className="relative flex flex-col md:flex-row items-start justify-between gap-6 py-4">
                  {/* Chart container - LEFT SIDE */}
                  <div className="relative w-full md:w-1/2 h-64 md:h-72">
                    <Pie data={chartData} options={chartOptions} />
                    {hoveredSegment !== null && (
                      <div className="absolute top-0 left-0 right-0 -mt-10 flex justify-center pointer-events-none ">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm ">
                          {dataWithPercentage[hoveredSegment].label}:{" "}
                          {dataWithPercentage[hoveredSegment].count} (
                          {dataWithPercentage[hoveredSegment].percentage}%)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legend - RIGHT SIDE */}
                  <div className="flex flex-col space-y-3 w-full md:w-1/2 md:min-w-[180px] pt-12">
                    {dataWithPercentage.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                        style={{
                          opacity:
                            hoveredSegment !== null &&
                            hoveredSegment !== item.id
                              ? 0.5
                              : 1,
                        }}
                        onMouseEnter={() => setHoveredSegment(item.id)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <div className="flex justify-between w-full">
                          <span className="text-sm md:text-base">
                            {item.label}:
                          </span>
                          <span className="text-sm md:text-base font-bold ml-2">
                            {item.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <div className="flex justify-between w-full">
                        <span className="text-sm md:text-base">Total:</span>
                        <span className="text-sm md:text-base font-bold ml-2">
                          {totalApplications.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Job Posts */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 ">
                <div className="flex flex-col md:flex-row justify-end mb-4">
                  <h2 className="font-bold mr-auto text-2xl">
                    Recent Job Post
                  </h2>
                  <div className="flex space-x-1 ">
                    <button className="bg-gray-100 text-gray-700 rounded-l-full px-2 py-2 text-sm">
                      Monthly
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-2 py-2 text-sm">
                      Weekly
                    </button>
                    <button className="bg-violet-400 text-white font-semibold rounded-r-full px-2 py-2 text-sm">
                      Today
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Openings
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Applications
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2">UI UX Designer</td>
                        <td className="px-4 py-2">Full Time</td>
                        <td className="px-4 py-2">12</td>
                        <td className="px-4 py-2">135</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            className="bg-emerald-400 text-white px-4 py-2 rounded-xl "
                          >
                            Active
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Full Stack Dev</td>
                        <td className="px-4 py-2">Full Time</td>
                        <td className="px-4 py-2">08</td>
                        <td className="px-4 py-2">100</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            className="bg-orange-400 text-white px-2 py-2 rounded-xl "
                          >
                            Inactive
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">DevOps</td>
                        <td className="px-4 py-2">Internship</td>
                        <td className="px-4 py-2">12</td>
                        <td className="px-4 py-2">05</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            className="bg-emerald-400 text-white px-4 py-2 rounded-xl "
                          >
                            Active
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Android Dev</td>
                        <td className="px-4 py-2">Full Time</td>
                        <td className="px-4 py-2">04</td>
                        <td className="px-4 py-2">45</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            className="bg-emerald-400 text-white px-4 py-2 rounded-xl "
                          >
                            Active
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">IOS Developer</td>
                        <td className="px-4 py-2">Full Time</td>
                        <td className="px-4 py-2">18</td>
                        <td className="px-4 py-2">96</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            className="bg-orange-400 text-white px-2 py-2 rounded-xl "
                          >
                            Inactive
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CompanyDashboard;
