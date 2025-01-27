import React from "react"
import { Link } from "react-router-dom"

function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Gateway to Career Success</h1>
        <p className="text-xl mb-8">Connect with top companies and land your dream job right from your campus.</p>
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}

export default Hero

