export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b">
        <h1 className="text-2xl font-bold text-blue-900">
          SpeedFix
        </h1>

        <div className="space-x-6 hidden md:flex items-center">
          <a href="#" className="hover:text-blue-700 transition">Services</a>
          <a href="#" className="hover:text-blue-700 transition">How It Works</a>
          <a href="#" className="hover:text-blue-700 transition">Cities</a>
          <a href="#" className="hover:text-blue-700 transition">About</a>
          <a href="/founder" className="text-sm text-gray-600 hover:text-blue-700 transition">
            Founder Login
          </a>
        </div>

        <button className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-teal-700 transition">
          Book Service
        </button>
      </nav>


      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-bold text-blue-900 leading-tight mb-6">
          Smart On-Demand Services.
          <br /> Delivered Nationwide.
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Verified technicians. Transparent pricing. Fast response.
          Experience a premium service marketplace built for modern India.
        </p>

        <div className="space-x-4">
          <button className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
            Book a Service
          </button>

          <button className="border border-blue-900 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Explore Services
          </button>
        </div>
      </section>


      {/* Services Section */}
      <section className="px-10 py-20 bg-gray-50">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Our Services
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "AC Repair",
            "Electrician",
            "Plumbing",
            "Appliance Repair",
            "CCTV Installation",
            "Cleaning Services"
          ].map((service) => (
            <div
              key={service}
              className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <h4 className="text-xl font-semibold mb-3 text-blue-900">
                {service}
              </h4>
              <p className="text-gray-600 text-sm">
                Professional, verified technicians with transparent pricing
                and fast response times.
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* Trust Section */}
      <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold text-blue-900 mb-12">
          Trusted Nationwide
        </h3>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div>
            <p className="text-4xl font-bold text-teal-600">10,000+</p>
            <p className="text-gray-600">Services Completed</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-teal-600">500+</p>
            <p className="text-gray-600">Verified Technicians</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-teal-600">25+</p>
            <p className="text-gray-600">Cities Covered</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-teal-600">4.8★</p>
            <p className="text-gray-600">Customer Rating</p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-blue-900 text-white py-10 text-center">
        <p className="font-semibold text-lg mb-2">SpeedFix</p>
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} SpeedFix. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
