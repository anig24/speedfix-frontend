"use client";
import Image from "next/image";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
const [formData, setFormData] = useState({
  name: "",
  phone: "",
  city: "",
  service: "",
  issue: ""
});

const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [errorMsg, setErrorMsg] = useState("");

const handleChange = (e: any) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async () => {
  setErrorMsg("");
  setSuccess(false);

  if (!formData.name || !formData.phone || !formData.city || !formData.service) {
    setErrorMsg("Please fill all required fields");
    return;
  }

  if (formData.phone.length !== 10) {
    setErrorMsg("Enter valid 10 digit phone number");
    return;
  }

  try {
    setLoading(true);

    await addDoc(collection(db, "bookings"), {
      ...formData,
      createdAt: new Date()
    });

    setSuccess(true);

    setFormData({
      name: "",
      phone: "",
      city: "",
      service: "",
      issue: ""
    });

  } catch (error) {
    setErrorMsg("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <main className="bg-white text-gray-900">

      {/* HERO SECTION */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Smart Home Services
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Verified professionals. Instant booking. Reliable service at your doorstep.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium">
                Book Service
              </button>
              <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium">
                Explore Services
              </button>
            </div>
          </div>

          <div>
            <Image
              src="/services/electrician-troubleshooting.png"
              alt="Electrician Service"
              width={600}
              height={600}
              className="rounded-xl shadow-lg"
            />
          </div>

        </div>
      </section>


{/* CITIES */}
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold mb-10">
      Available In
    </h2>

    <div className="flex flex-wrap justify-center gap-6 text-white text-lg">
      {["Kolkata", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"].map((city, i) => (
        <span key={i} className="px-6 py-3 bg-orange-500 rounded-full">
          {city}
        </span>
      ))}
    </div>

  </div>
</section>

{/* SERVICES SECTION */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold">Our Services</h2>
      <p className="mt-4 text-gray-600">
        Trusted professionals for all your home needs
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-10">

      {[
        {
          title: "Electrician",
          image: "/services/electrician-fan-installation.png",
          desc: "Fan installation, wiring, power issues, safety checks",
        },
        {
          title: "Plumbing",
          image: "/services/plumbing-leak-repair.png",
          desc: "Leak repairs, pipe replacement, bathroom fittings",
        },
        {
          title: "AC Service",
          image: "/services/ac-installation-service.png",
          desc: "Installation, gas refill, maintenance & repair",
        },
        {
          title: "Cleaning / Maid",
          image: "/services/maid-home-cleaning.png",
          desc: "Home cleaning, deep cleaning, regular maid service",
        },
      ].map((service, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2 overflow-hidden"
        >
          <Image
            src={service.image}
            alt={service.title}
            width={500}
            height={350}
            className="w-full h-60 object-cover"
          />

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">
              {service.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4">
              {service.desc}
            </p>

            <button className="text-orange-500 font-medium hover:underline">
              View Details →
            </button>
          </div>
        </div>
      ))}

    </div>
  </div>
</section>

{/* HOW IT WORKS */}
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold mb-16">
      How It Works
    </h2>

    <div className="grid md:grid-cols-3 gap-12">

      {[
        {
          title: "Book Service",
          desc: "Choose your service and schedule in seconds",
        },
        {
          title: "Professional Arrives",
          desc: "Verified expert visits your home on time",
        },
        {
          title: "Secure Payment",
          desc: "Pay securely after service completion",
        },
      ].map((step, index) => (
        <div key={index}>
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {index + 1}
          </div>

          <h3 className="text-xl font-semibold mb-3">
            {step.title}
          </h3>

          <p className="text-gray-600">
            {step.desc}
          </p>
        </div>
      ))}

    </div>
  </div>
</section>

{/* PRICING */}
<section className="py-24 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold mb-16">
      Transparent Pricing
    </h2>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        { title: "Basic Visit", price: "₹299" },
        { title: "Standard Repair", price: "₹799" },
        { title: "Installation", price: "₹1499" },
      ].map((plan, index) => (
        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">
            {plan.title}
          </h3>

          <p className="text-3xl font-bold text-orange-500 mb-6">
            {plan.price}
          </p>

          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
            Book Now
          </button>
        </div>
      ))}

    </div>
  </div>
</section>

{/* REAL-TIME BOOKING SECTION */}
<section className="py-20 px-6 max-w-5xl mx-auto">

  <h2 className="text-3xl font-bold mb-10">
    Book a Service
  </h2>

  <div className="bg-white shadow-lg rounded-xl p-8 grid md:grid-cols-2 gap-6">

    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="border p-3 rounded-lg"
      placeholder="Full Name *"
    />

    <input
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      className="border p-3 rounded-lg"
      placeholder="Phone Number *"
    />

    <input
      name="city"
      value={formData.city}
      onChange={handleChange}
      className="border p-3 rounded-lg"
      placeholder="City *"
    />

    <select
      name="service"
      value={formData.service}
      onChange={handleChange}
      className="border p-3 rounded-lg"
    >
      <option value="">Select Service *</option>
      <option value="Electrician">Electrician</option>
      <option value="Plumbing">Plumbing</option>
      <option value="AC Service">AC Service</option>
      <option value="Cleaning">Cleaning</option>
    </select>

    <textarea
      name="issue"
      value={formData.issue}
      onChange={handleChange}
      className="border p-3 rounded-lg md:col-span-2"
      placeholder="Describe your issue"
    />

    {/* ERROR MESSAGE */}
    {errorMsg && (
      <p className="text-red-500 text-sm md:col-span-2">
        {errorMsg}
      </p>
    )}

    {/* SUCCESS MESSAGE */}
    {success && (
      <p className="text-green-600 text-sm md:col-span-2">
        Booking Confirmed Successfully ✅
      </p>
    )}

    {/* BUTTON */}
    <button
      onClick={handleSubmit}
      disabled={loading}
      className={`md:col-span-2 py-3 rounded-lg font-medium transition 
      ${loading 
        ? "bg-gray-400 cursor-not-allowed text-white" 
        : "bg-orange-500 hover:bg-orange-600 text-white"
      }`}
    >
      {loading ? "Processing..." : "Confirm Booking"}
    </button>

  </div>
</section>

      {/* 24x7 SUPPORT SECTION */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            24x7 Support
          </h2>

          <p className="mt-4 text-gray-300">
            Our team is always available to assist you with bookings and service queries.
          </p>

        </div>
      </section>

    </main>
  );
}