"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal").forEach((el: any) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <div className="bg-[#0b1b2b] text-white">

      {/* HERO */}
      <section className="py-36 px-6 md:px-20 text-center border-b border-white/10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto">
          Building Reliable Workforce Solutions
          <br /> For Modern India with SpeedFix
        </h1>

        <p className="mt-8 text-lg opacity-70 max-w-3xl mx-auto">
          SpeedFix delivers disciplined, verified and professionally managed
          doorstep workforce services designed to support residential and
          commercial environments with consistency and accountability.
        </p>
      </section>

      {/* COMPANY OVERVIEW */}
      <section className="py-28 px-6 md:px-20 max-w-6xl mx-auto reveal">
        <h2 className="text-3xl font-semibold mb-8 text-white">
          About SpeedFix
        </h2>

        <p className="leading-8 text-lg opacity-80">
          SpeedFix is a structured workforce service company committed to
          delivering dependable manpower solutions across major cities.
          Our focus is on professional conduct, punctual deployment, and
          maintaining consistent service standards.
        </p>

        <p className="leading-8 text-lg opacity-80 mt-6">
          We operate with a disciplined approach to workforce management,
          ensuring every service assignment reflects reliability, respect,
          and operational efficiency.
        </p>
      </section>

      {/* SERVICES BLOCK */}
      <section className="py-28 px-6 md:px-20 bg-[#071420] reveal">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-16 text-white">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-16">

            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Home Workforce Services
              </h3>
              <p className="opacity-80 leading-8">
                Professional maids and domestic support staff for daily
                household operations, ensuring structured assistance and
                reliable service continuity.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Cleaning & Hygiene Solutions
              </h3>
              <p className="opacity-80 leading-8">
                Systematic cleaning services for residential and commercial
                properties, maintaining hygiene, presentation, and operational
                standards.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Facility Support Staff
              </h3>
              <p className="opacity-80 leading-8">
                Reliable workforce deployment for offices, residential
                complexes, and organized environments where structured manpower
                is essential.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-28 px-6 md:px-20 max-w-5xl mx-auto text-center reveal">
        <h2 className="text-3xl font-semibold mb-8 text-white">
          Our Commitment
        </h2>

        <p className="text-lg leading-8 opacity-80">
          SpeedFix is committed to strengthening service reliability through
          disciplined workforce deployment, verified staffing processes, and
          consistent operational standards.
        </p>

        <p className="text-lg leading-8 opacity-80 mt-6">
          We aim to build long-term trust by delivering dependable service
          experiences that meet the expectations of modern households and
          professional environments.
        </p>
      </section>

    </div>
  );
}