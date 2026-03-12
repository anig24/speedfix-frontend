import {
  Wrench,
  Zap,
  Droplets,
  ShieldCheck,
  Camera,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-12 py-6 bg-white shadow-sm">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
          SpeedFix
        </h1>

        <div className="hidden md:flex space-x-8 items-center font-medium">
          <a href="#" className="hover:text-red-600 transition">Services</a>
          <a href="#" className="hover:text-red-600 transition">Cities</a>
          <a href="#" className="hover:text-red-600 transition">About</a>
        </div>

        <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition shadow-md">
          Book Service
        </button>
      </nav>


      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-12 py-32 text-center">
        <h2 className="text-6xl font-extrabold leading-tight mb-6">
          India’s Smart Home <br /> Service Platform
        </h2>

        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-10">
          Verified professionals. Fast response. Transparent pricing.
        </p>

        <button className="bg-red-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition shadow-lg">
          Book a Service
        </button>
      </section>


      {/* Services */}
      <section className="px-12 py-24 bg-white">
        <h3 className="text-4xl font-bold text-center text-blue-900 mb-16">
          Our Services
        </h3>

        <div className="grid md:grid-cols-3 gap-12">

          {[
            { name: "AC Repair", icon: Wrench },
            { name: "Electrician", icon: Zap },
            { name: "Plumbing", icon: Droplets },
            { name: "Appliance Repair", icon: ShieldCheck },
            { name: "CCTV Installation", icon: Camera },
            { name: "Deep Cleaning", icon: Sparkles },
          ].map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.name}
                className="bg-white p-10 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <Icon size={32} className="text-blue-900" />
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-blue-900 mb-3">
                  {service.name}
                </h4>

                <p className="text-gray-600 text-sm">
                  Certified technicians with quality assurance and fair pricing.
                </p>
              </div>
            );
          })}

        </div>
      </section>


      {/* Trust Section */}
      <section className="bg-blue-900 text-white py-24 text-center">
        <h3 className="text-4xl font-bold mb-16">
          Trusted Nationwide
        </h3>

        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
          <div>
            <p className="text-5xl font-extrabold text-red-400">10K+</p>
            <p className="opacity-80 mt-2">Services Completed</p>
          </div>

          <div>
            <p className="text-5xl font-extrabold text-red-400">500+</p>
            <p className="opacity-80 mt-2">Verified Technicians</p>
          </div>

          <div>
            <p className="text-5xl font-extrabold text-red-400">25+</p>
            <p className="opacity-80 mt-2">Cities Covered</p>
          </div>

          <div>
            <p className="text-5xl font-extrabold text-red-400">4.8★</p>
            <p className="opacity-80 mt-2">Customer Rating</p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-white border-t py-12 text-center">
        <h4 className="text-2xl font-bold text-blue-900 mb-3">
          SpeedFix
        </h4>
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} SpeedFix. All rights reserved.
        </p>
      </footer>

    </div>
  );
}