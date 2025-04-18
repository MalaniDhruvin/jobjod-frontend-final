import React from "react";
import Marquee from "react-fast-marquee";
import Group from '../image/Group 4.png';
import Group5 from '../image/Group 5.png';
import Group6 from '../image/Group 6.png';

const LogoSlider = ({ direction = "left", speed = 50 }) => {
  // Sample company data - replace with your actual data
  const companies = [
    {
      // name: "Airplane",
      logo: Group6
    },
    {
      // name: "Railway",
      logo: Group
    },
    {
      // name: "Resend",
      logo: Group5
    },
    {
      // name: "CodeSendBox",
      logo: Group6
    },
    {
      // name: "Clerk",
      logo: Group5
    },
    {
      // name: "Inngest",
      logo: Group6
    },
    {
      // name: "Crowddev",
      logo: Group
    },
    {
      // name: "Airplane",
      logo: Group5
    }
  ];

  return (
    <section className="w-full py-12 bg-white relative overflow-hidden">

<div className="w-full py-8">
      <h2 className="text-center text-xl font-medium text-gray-900 dark:text-gray-100">
        Companies our talent has worked at:
      </h2>
    </div>
      <div className="relative">
        {/* Left fade effect */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10" />
        
        <Marquee play={true} direction={direction} speed={speed} gradient={false}>
          {/* Double the array to ensure smooth infinite scroll */}
          {[...companies, ...companies].map((company, index) => (
            <div
              key={`company-${index}`}
              className="mx-8 flex flex-col items-center justify-center gap-3"
            >
              <div className="grayscale hover:grayscale-0 transition-all duration-200">
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </Marquee>

        {/* Right fade effect */}
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </section>
  );
};

export default LogoSlider;
