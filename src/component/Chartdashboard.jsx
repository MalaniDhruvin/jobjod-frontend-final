import { useEffect, useState, useRef } from "react"

// Animated line chart component
const AnimatedLineChart = ({ color, data, width = 100, height = 40 }) => {
  const pathRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Generate some sample data points if none provided
  const points = data || Array.from({ length: 10 }, () => Math.random() * height)

  // Calculate points for the SVG path
  const pathPoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - point
      return `${x},${y}`
    })
    .join(" L ")

  useEffect(() => {
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength()

      // Set up the initial state of the animation
      pathRef.current.style.strokeDasharray = pathLength
      pathRef.current.style.strokeDashoffset = pathLength

      setIsAnimating(true)

      // Trigger the animation
      setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = "stroke-dashoffset 1.5s ease-in-out"
          pathRef.current.style.strokeDashoffset = "0"
        }
      }, 100)
    }
  }, [])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        ref={pathRef}
        d={`M ${pathPoints}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isAnimating ? "transition-all duration-1500 ease-in-out" : ""}
      />
    </svg>
  )
}

// Metric card component with animated counter
const MetricCard = ({ title, value, change, changeColor, chartColor, chartData }) => {
  const [displayValue, setDisplayValue] = useState("0")
  const numericValue = Number.parseInt(value.replace(/,/g, ""))

  useEffect(() => {
    // Animate the counter
    const start = 0
    const duration = 1500
    const startTime = Date.now()

    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const updateCounter = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration
        const currentValue = Math.floor(progress * numericValue)
        setDisplayValue(formatNumber(currentValue))
        requestAnimationFrame(updateCounter)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(updateCounter)

    return () => {
      // Cleanup
    }
  }, [value, numericValue])

  return (
    <div className="bg-white  rounded-xl p-4 border  ">
      <h3 className="text-gray-700 font-semibold text-lg">{title}</h3>
      <div className="flex items-end justify-between h-24 mt-4">
        <div>
          <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
          <p className={`text-black text-2xl font-bold ${changeColor}`}>{change}</p>
        </div>
        <div className="h-[40px]">
          <AnimatedLineChart color={chartColor} data={chartData} />
        </div>
      </div>
    </div>
  )
}

export default function RecruitmentDashboard() {
  // Sample data for charts - upward trend
  const jobPostsData = [15, 10, 20, 8, 15, 25, 18, 10, 20, 25]

  // Sample data for charts - downward trend
  const applicationsData = [20, 25, 15, 30, 20, 10, 15, 25, 10, 5]

  // Sample data for charts - fluctuating trend
  const meetingsData = [10, 15, 20, 15, 10, 20, 25, 15, 10, 5]

  // Sample data for charts - upward trend
  const hiringsData = [5, 10, 8, 12, 15, 10, 18, 20, 25, 30]

  return (
    <div className="bg-gray-50 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Job Posts"
          value="2,456"
          change="+2.5%"
          changeColor="text-purple-500"
          chartColor="#a78bfa"
          chartData={jobPostsData}
        />

        <MetricCard
          title="Total Application"
          value="4,561"
          change="-4.4%"
          changeColor="text-red-500"
          chartColor="#ef4444"
          chartData={applicationsData}
        />

        <MetricCard
          title="No of Meetings"
          value="125"
          change="+1.5%"
          changeColor="text-orange-300"
          chartColor="#fdba74"
          chartData={meetingsData}
        />

        <MetricCard
          
          title="No of Hirings"
          value="2,456"
          change="+4.5%"
          changeColor="text-black "
          chartColor="#000000"
          chartData={hiringsData}
        />
      </div>
    </div>
  )
}

