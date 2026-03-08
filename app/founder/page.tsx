export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* Navbar */}
      <header className="flex justify-between items-center px-12 py-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide">
          SPEEDFIX
        </h1>

        <nav className="space-x-8 text-sm font-medium">
          <a href="#" className="hover:text-blue-600">Services</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">How It Works</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </nav>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
          Book Service
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-20 py-28 text-center bg-gray-50">
        <h2 className="text-5xl font-bold leading-tight mb-6">
          India’s Trusted On-Demand Service Network
        </h2>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          Fast, verified and professional technicians across India. 
          From appliance repair to home services — SpeedFix delivers reliability at scale.
        </p>

        <button className="bg-black text-white px-8 py-3 rounded-md text-lg hover:opacity-90 transition">
          Schedule a Service
        </button>
      </section>

      {/* Trust Section */}
      <section className="px-20 py-20 grid md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 className="text-3xl font-bold mb-3">10,000+</h3>
          <p className="text-gray-600">Verified Technicians</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold mb-3">100+</h3>
          <p className="text-gray-600">Cities Covered</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold mb-3">98%</h3>
          <p className="text-gray-600">Customer Satisfaction</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-12 py-10 text-sm">
        <div className="flex justify-between">
          <p>© 2026 SpeedFix Technologies Pvt. Ltd.</p>
          <a href="/founder" className="opacity-60 hover:opacity-100">
            Admin
          </a>
        </div>
      </footer>

    </div>
  )
}
