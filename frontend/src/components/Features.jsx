import React from "react"
import { Newspaper, Send, ClipboardList, Star } from "lucide-react"

const features = [
  {
    icon: <Newspaper size={40} />,
    title: "Job Feed",
    description: "Stay updated with the latest job postings tailored for your skills and interests.",
  },
  {
    icon: <Send size={40} />,
    title: "Easy Job Application",
    description: "Apply to multiple jobs with just a few clicks using your saved profile.",
  },
  {
    icon: <ClipboardList size={40} />,
    title: "Job Application Management",
    description: "Track all your applications in one place and never miss an update.",
  },
  {
    icon: <Star size={40} />,
    title: "Placed Students Company Review",
    description: "Get insights from alumni about their experiences with different companies.",
  },
]

function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

