import { useState, useEffect } from "react"
import logo2 from "../image/logo2.png"
import { Link } from "react-router-dom"

function Dheader3() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    location: "",
    gender: "",
    mobileNumber: "",
    dateOfBirth: ""
  })

  // Add effect to prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent scrolling on the body when menu is open
      document.body.style.overflow = "hidden"
    } else {
      // Re-enable scrolling when menu is closed
      document.body.style.overflow = "auto"
    }

    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMenuOpen])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav className="w-full relative bg-gradient-to-r from-purple-100 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group-y8VIQbQhSCi7xcFqUiFvxXXwZtkvps.svg"
            alt="Background Pattern"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="w-[93%] p-4 relative z-10">
          <div className="flex justify-between items-center">
            {/* Logo and Navigation Links */}
            <div className="flex items-center">
              <div className="text-2xl font-bold lg:ml-24 ">
                <Link to="/">
                  <img
                    src={logo2 || "/placeholder.svg"}
                    alt="JobJod"
                    className="h-10"
                  />
                </Link>
              </div>
              <nav className="hidden md:flex ml-10 space-x-6">
                <Link
                  to="/JobListingPage"
                  className="text-gray-800 font-semibold hover:text-purple-600 transition-colors"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/browsecompany"
                  className="text-gray-800 font-semibold hover:text-purple-600 transition-colors"
                >
                  Browse Company
                </Link>
              </nav>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/Login_Signin"
                className="text-gray-800 font-semibold hover:text-purple-600 transition-colors"
              >
                Hire Now <span className="text-gray-400 ml-1">|</span>
              </Link>
              <Link to="/Login_Signin">
                <button
                  variant="default"
                  className="bg-black text-white hover:bg-gray-800 rounded-full p-2"
                >
                  Login / Signup
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-800 focus:outline-none z-20"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 30 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="5" rx="2" fill="#000" />
                <rect y="10" width="30" height="5" rx="2" fill="#000" />
                <rect y="20" width="30" height="5" rx="2" fill="#000" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Separate from main content */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[70%] max-w-[300px] bg-gradient-to-r from-purple-100 via-white to-purple-50 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-purple-600 relative"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4 px-4 mt-4">
          <Link
            to="/JobListingPage"
            className="text-gray-800 font-medium py-2 hover:text-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Find Jobs
          </Link>
          <Link
            to="/browsecompany"
            className="text-gray-800 font-medium py-2 hover:text-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Browse Company
          </Link>
          <Link
            to="/Login_Signin"
            className="text-gray-800 font-medium py-2 hover:text-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Hire Now
          </Link>
          <Link to="/Login_Signin" onClick={toggleMenu}>
            <button className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-2">
              Login / Signup
            </button>
          </Link>
        </nav>
      </div>
    </>
  )
}

export default Dheader3
