import logo1 from "../image/Logo1.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { RiBasketballLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:w-[85%]">
        
        {/* JobJod Section */}
        <div className="text-center lg:text-left">
          <Link to="/">
            <img src={logo1} alt="JobJod" className="mx-auto lg:mx-0" />
          </Link>
          <p className="text-gray-400 mt-4">
            Great platform for the job seeker that is passionate about startups.
            Find your dream job easier.
          </p>
        </div>

        {/* About Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-bold mb-4">About</h2>
          <ul className="text-gray-400 space-y-2">
            <li><Link to="#" className="hover:text-white">Companies</Link></li>
            <li><Link to="#" className="hover:text-white">Pricing</Link></li>
            <li><Link to="#" className="hover:text-white">Terms</Link></li>
            <li><Link to="#" className="hover:text-white">Advice</Link></li>
            <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-bold mb-4">Resources</h2>
          <ul className="text-gray-400 space-y-2">
            <li><Link to="#" className="hover:text-white">Help Docs</Link></li>
            <li><Link to="#" className="hover:text-white">Guide</Link></li>
            <li><Link to="#" className="hover:text-white">Updates</Link></li>
            <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        {/* Job Notifications Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-bold mb-4">Get job notifications</h2>
          <p className="text-gray-400 mb-6">The latest job news, articles, sent to your inbox weekly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-2">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-grow p-2 border border-gray-700 bg-white text-black text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            <button className="bg-purple-700 text-white px-4 py-2 text-sm hover:bg-purple-600">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center md:flex md:justify-between md:items-center w-[85%] mx-auto">
        <p className="text-gray-400">2025 @ JobJod. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-xl text-gray-400">
          <FaFacebook className="hover:text-white" />
          <FaInstagram className="hover:text-white" />
          <RiBasketballLine className="hover:text-white" />
          <FaLinkedinIn className="hover:text-white" />
          <FaTwitter className="hover:text-white" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
