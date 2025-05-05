import React, { useState,useEffect } from "react";
import dashboard from "../../image/dashboard.png";
import { RxDashboard } from "react-icons/rx";
import { PiBagSimpleFill } from "react-icons/pi";
import { PiMonitorFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import logo2 from "../../image/logo2.png";
import Dheader from "../Dheader";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Chartdashboard from "../Chartdashboard";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { format, subDays } from "date-fns";
import { BASE_URL, USER_BASE_URL } from "../../config";

// import Jobs from "../../component/SuperAdmin/Jobs";
ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
   const userId = localStorage.getItem("userId");
    const token  = localStorage.getItem("authToken");

    const location=useLocation()
  const substrLocation=location.pathname.substring(1)
  
    const [jobs, setJobs]                 = useState([]);
    const [count, setCount]               = useState(0);
    const [applications, setApplications] = useState(0);
    const [meetings, setMeetings]         = useState(0);
    const [statusCounts, setStatusCounts] = useState({
      shortlisted: 0,
      hired:       0,
      rejected:    0,
    });
  
    // raw arrays
    const [allApps, setAllApps]           = useState([]);
    const [allHires, setAllHires]         = useState([]);
    const [allMeetings, setAllMeetings]   = useState([]);
  
    const [timeSeries, setTimeSeries] = useState({
      jobs:         [],
      applications: [],
      meetings:     [],
      hires:        [],
    });
  
    const [jobStats, setJobStats] = useState([]);
    const [recentFilter, setRecentFilter] = useState("month");
    const [recentSummary, setRecentSummary] = useState({
      today: 0,
      week:  0,
      month: 0,
    });
  
    // 1️⃣ load jobs
    useEffect(() => {
      axios.get(`${BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setJobs(res.data))
      .catch(console.error);
    }, [userId, token]);
  
    // 2️⃣ fetch all applications & build raw arrays
    useEffect(() => {
      if (!jobs.length) return;
  
      (async () => {
        const results = await Promise.allSettled(
          jobs.map(job =>
            axios.get(
              `${USER_BASE_URL}/users/appliedFor/${job.id}/apply`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
  
        const appCounts  = {};
        const rawApps    = [];
  
        results.forEach((r, i) => {
          const id = jobs[i].id;
          if (r.status === "fulfilled") {
            const arr = r.value.data.data?.usersApplied || r.value.data.usersApplied || [];
            appCounts[id] = arr.length;
            rawApps.push(...arr);
          } else {
            appCounts[id] = 0;
          }
        });
  
        console.log("rawApps", rawApps);
  
        setAllApps(rawApps);
        setCount(jobs.length);
        setApplications(rawApps.length);
  
        // split out hires & meetings
        const hires    = rawApps.filter(a => a.status === "Hired");
        const meetings = rawApps.filter(a => a.status === "Interview");
  
        // console.log("hires", hires);
        // console.log("meetings", meetings);
  
        setAllHires(hires);
        setAllMeetings(meetings);
  
        // tally shortlist/hire/reject
        const tally = { shortlisted: 0, hired: 0, rejected: 0, interview: 0 };
        rawApps.forEach(a => {
          if (a.status === "Shortlisted") tally.shortlisted++;
          if (a.status === "Hired")       tally.hired++;
          if (a.status === "Rejected")    tally.rejected++;
          if (a.status === "Interview")  tally.interview++;
        });
        setStatusCounts(tally);
        setMeetings(tally.interview);
  
        // build jobStats for the table
        setJobStats(jobs.map(job => ({
          id:        job.id,
          title:     JSON.parse(job.jobTitle).label,
          count:     appCounts[job.id] || 0,
          createdAt: job.createdAt
        })));
      })();
    }, [jobs, token]);
  
    // 3️⃣ recentSummary counts
    useEffect(() => {
      const now = new Date();
      setRecentSummary({
        today:  jobs.filter(j => new Date(j.createdAt).toDateString() === now.toDateString()).length,
        week:   jobs.filter(j => (now - new Date(j.createdAt)) / 86400000 <= 7).length,
        month:  jobs.filter(j => (now - new Date(j.createdAt)) / 86400000 <= 30).length,
      });
    }, [jobs]);
  
    // 4️⃣ build 10-day time series
    useEffect(() => {
      if (!jobs.length) return;
      const days = Array.from({ length: 10 }, (_, i) => format(subDays(new Date(), 9 - i), "yyyy-MM-dd"));
  
      const byDay = (arr, dateKey="createdAt") =>
        days.map(day => ({
          day,
          count: arr.filter(item => format(new Date(item[dateKey]), "yyyy-MM-dd") === day).length
        }));
  
      setTimeSeries({
        jobs:         byDay(jobs,        "createdAt"),
        applications: byDay(allApps,     "appliedOn"),
        meetings:     byDay(allMeetings, "updatedAt"),
        hires:        byDay(allHires,    "updatedAt"),
      });
    }, [jobs, allApps, allMeetings, allHires]);
  
    // % change helper
  
    console.log("timeSeries", timeSeries);
    const pctChange = arr => {
      if (arr.length < 2) return 0;
      const first = arr[0].count, last = arr[arr.length - 1].count;
      return first === 0 ? 0 : (((last - first) / first) * 100).toFixed(1);
    };
  
    const [jobPct, appPct, meetingPct, hiringPct] = [
      pctChange(timeSeries.jobs),
      pctChange(timeSeries.applications),
      pctChange(timeSeries.meetings),
      pctChange(timeSeries.hires),
    ];
  
    console.log(jobPct, "jobPact");
    console.log(appPct, "appPact");
    console.log(meetingPct, "meetingPact");
    console.log(hiringPct, "hiringPact");
  
  
    // pie‐chart data
    const chartData = {
      labels: ["Shortlisted", "Hired", "Rejected"],
      datasets: [{
        data: [
          statusCounts.shortlisted,
          statusCounts.hired,
          statusCounts.rejected,
        ],
        backgroundColor: ["#000","#FA976C","#9E86E0"],
        hoverOffset: 4,
      }],
    };
  
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar substrLocation={substrLocation} />
        <div className="flex-1 flex flex-col overflow-auto">
          <Dheader />
  
          <main className="flex-1 p-3 overflow-y-auto">
            <Chartdashboard
              count={count}
              meeting={meetings}
              hired={statusCounts.hired}
              totalApps={applications}
              timeSeries={timeSeries}
              jobPct={jobPct + '%'}
              appPct={appPct + '%'}
              meetingPct={meetingPct  + '%'}
              hiringPct={hiringPct + '%'}
            />
  
            {/* Application Response */}
            <div className="bg-white rounded-xl p-4 border mb-6">
              <h2 className="text-lg font-bold mb-4">Application Response</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-1/2 h-64">
                  <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                  {[
                    { label: "Shortlisted", count: statusCounts.shortlisted, color: "#000" },
                    { label: "Hired",       count: statusCounts.hired,      color: "#FA976C" },
                    { label: "Rejected",    count: statusCounts.rejected,   color: "#9E86E0" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between">
                      <span>{item.label}</span>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between">
                    <span>Total</span>
                    <span className="font-bold">
                      {statusCounts.shortlisted + statusCounts.hired + statusCounts.rejected}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Recent Job Posts */}
            <div className="bg-white rounded-xl p-4 border">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-2xl">Recent Job Post</h2>
                <div className="flex space-x-1">
                  {["today","week","month"].map(f => (
                    <button
                      key={f}
                      onClick={() => setRecentFilter(f)}
                      className={`px-2 py-1 ${recentFilter===f ? "bg-purple-400 text-white" : "bg-gray-100"}`}
                    >
                      {`${f.charAt(0).toUpperCase()+f.slice(1)} (${recentSummary[f]})`}
                    </button>
                  ))}
                </div>
              </div>
              <table className="min-w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Job Title</th>
                    <th className="px-4 py-2 text-left">Applications</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobStats.filter(job => {
                    const diffDays = (new Date() - new Date(job.createdAt)) / (1000*60*60*24);
                    return recentFilter==="today"
                      ? new Date(job.createdAt).toDateString()===new Date().toDateString()
                      : recentFilter==="week"
                        ? diffDays<=7
                        : diffDays<=30;
                  }).map(({id,title,count})=>(
                    <tr key={id} className="border-t">
                      <td className="px-4 py-2">{title}</td>
                      <td className="px-4 py-2">{count}</td>
                      <td className="px-4 py-2">
                        <button className={`px-2 py-1 rounded-full ${count>0?"bg-emerald-400 text-white":"bg-orange-400 text-white"}`}>
                          {count>0 ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    );
}

export default AdminDashboard;
