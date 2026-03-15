"use client";

import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      name: "Electrician",
      slug: "electrician",
      price: 149,
      image: "/services/electrician.png",
      description: "Wiring, switch repair, installations and more.",
    },
    {
      name: "Plumbing",
      slug: "plumbing",
      price: 149,
      image: "/services/plumbing.png",
      description: "Leak repair, tap fitting, bathroom installations.",
    },
    {
      name: "AC Service",
      slug: "ac-service",
      price: 299,
      image: "/services/ac-service.png",
      description: "Installation, gas refill, maintenance.",
    },
    {
      name: "Cleaning",
      slug: "cleaning",
      price: 499,
      image: "/services/cleaning.png",
      description: "Deep home cleaning with professional equipment.",
    },
    {
      name: "Appliance Repair",
      slug: "appliance-repair",
      price: 199,
      image: "/services/appliance-repair.png",
      description: "Repair all Home Appliance like Washing Machine, Microwave and more.",
    },
    {
      name: "Electronic goods Installation",
      slug: "fan-installation",
      price: 99,
      image: "/services/fan-installation.png",
      description: "Help to install kind of electronic items at your house"      
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-12 text-center">
          Our Services
        </h1>

     <div className="grid md:grid-cols-3 gap-8">
  {services.map((service) => (
    <Link
      key={service.slug}
      href={`/services/${service.slug}`}
      className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition group"
    >
      <img
        src={service.image}
        alt={service.name}
        className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-500 transition">
          {service.name}
        </h3>

        <p className="text-gray-600 mb-4 text-sm">
          {service.description}
        </p>

        <div className="text-orange-500 font-semibold">
          Starting at ₹{service.price}
        </div>
      </div>
    </Link>
  ))}
</div>

      </div>
    </section>
  );
}