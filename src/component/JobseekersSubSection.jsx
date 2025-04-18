const JobseekersSubSection = () => {
    return (
      <div className="max-w-6xl w-full mx-auto mt-6 bg-white">
        <div className="flex flex-col lg:flex-row md:float-col">
          {/* Left Sidebar - Applications List */}
          <div className="w-full lg:w-[30%]  p-4">
            <ApplicationsList />
          </div>
  
          {/* Main Content - Job Details */}
          <div className="w-full lg:w-[70%] p-4">
            <JobDetails />
          </div>
        </div>
      </div>
    );
  };
  
  const applications = [
    {
      id: 1,
      title: "Product Designer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      status: "Applied",
      date: "23 May 20",
      logoColor: "bg-blue-400",
      statusColor: "text-green-500",
      statusIcon: "✓",
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      status: "Short Listed",
      date: "23 May 20",
      logoColor: "bg-orange-400",
      statusColor: "text-blue-500",
      statusIcon: "✓",
    },
    {
      id: 3,
      title: "Product Designer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      status: "Hired",
      logoColor: "bg-blue-500",
      statusColor: "text-blue-600",
      statusIcon: "👑",
    },
    {
      id: 4,
      title: "Product Designer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      status: "Interview",
      logoColor: "bg-pink-500",
      statusColor: "text-purple-500",
      statusIcon: "👤",
    },
    {
      id: 5,
      title: "Product Designer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      status: "Rejected",
      logoColor: "bg-blue-400",
      statusColor: "text-red-500",
      statusIcon: "✕",
    },
  ];
  
  const ApplicationsList = () => {
    return (
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center p-2 rounded-lg bg-purple-50"
          >
            <div className={`w-12 h-12 rounded-full ${app.logoColor} mr-4`}></div>
            <div className="flex-1">
              <h3 className="font-semibold">{app.title}</h3>
              <p className="text-sm text-gray-600">
                {app.company} · {app.location}
              </p>
              <div className="mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${app.statusColor}`}
                >
                  {app.status} {app.statusIcon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const JobDetails = () => {
    return (
      <div className="p-6 border-l-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Product Designer</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-2">✈️</span>
            <span className="mr-2">Grameenphone</span>
            <span className="mr-2">Dhaka, Bangladesh</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">Posted on 15 May 20</span>
            <span>Expire on 30 May 20</span>
          </div>
        </div>
  
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
            <div>
              <h3 className="font-medium">Hannah Marsh</h3>
              <p className="text-sm text-gray-600">HR Manager · Grameenphone</p>
            </div>
          </div>
          <button className="text-blue-500">Send Message</button>
        </div>
  
        <div className="space-y-6">
          <section>
            <h2 className="font-bold mb-3">Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Work on and execute design projects from start to finish while
                meeting creative and technical requirements.
              </li>
              <li>
                Collaborate closely with engineers, researchers, clinicians, and
                product managers to iterate rapidly.
              </li>
              <li>
                Work on the entire project lifecycle, from wireframes to detailed
                specs across multiple UX platforms.
              </li>
              <li>
                Participate in regular design reviews and other team-wide design
                efforts; create and contribute to a great design team culture.
              </li>
              <li>
                Participate in user experience research and usability studies.
              </li>
            </ul>
          </section>
  
          <section>
            <h2 className="font-bold mb-3">Qualifications and Skills</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                BA/BS degree in Design, HCI, CS, or related field, or equivalent
                practical experience.
              </li>
              <li>
                3+ years of relevant UX Design experience in consumer products,
                medical devices or other relevant areas.
              </li>
              <li>Portfolio of UX design work.</li>
              <li>
                Proven ability to work across the design process, from developing
                strong conceptual foundations to refining the smallest details
                with high quality and attention to detail.
              </li>
            </ul>
          </section>
  
          <section>
            <h2 className="font-bold mb-3">
              Preferred Qualifications and Skills
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Experience designing for health-related products (software and/or
                hardware).
              </li>
              <li>Experience designing for wearable devices.</li>
              <li>Experience with prototyping.</li>
              <li>
                Self-motivated and able to prioritize and manage workload and meet
                critical project milestones and deadlines.
              </li>
              <li>
                Excellent interpersonal, communication, negotiation, and
                collaboration skills.
              </li>
            </ul>
          </section>
  
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mr-4"></div>
                <div>
                  <h3 className="font-medium">Grameenphone Ltd.</h3>
                  <p className="text-sm text-gray-600">
                    Telecommunications · 6,525 employees · Actively Hiring
                  </p>
                </div>
              </div>
              <button className="text-blue-500">View Page</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default JobseekersSubSection;
  