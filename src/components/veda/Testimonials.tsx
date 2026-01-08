import React, { useState } from 'react';

const Testimonials: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "My father passed away three months after we completed his Veda journey. Last week, my daughter asked 'Grandpa' for advice on her first job interview. Hearing his voice, his wisdom—it was like he was still here with us.",
      name: "Sarah Mitchell",
      role: "Daughter & Mother",
      image: "https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180517552_720502db.jpg",
      location: "Boston, MA",
    },
    {
      quote: "I was skeptical at first—I'm not good with technology. But the phone calls felt like chatting with an old friend. The AI asked questions no one had ever asked me before. It helped me understand my own life better.",
      name: "Robert Williams",
      role: "Grandfather of 7",
      image: "https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180532470_842c9f53.jpg",
      location: "Chicago, IL",
    },
    {
      quote: "We gave Veda to my mother for her 80th birthday. She was hesitant at first, but now she looks forward to her weekly calls. She says it's like having someone who truly wants to hear her stories.",
      name: "Jennifer Chen",
      role: "Daughter",
      image: "https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180546983_c83e4037.jpg",
      location: "San Francisco, CA",
    },
    {
      quote: "The validation phase was incredible. When the AI responded to a scenario exactly as I would have, I knew my grandchildren would truly know me—not just facts about me, but how I think.",
      name: "Maria Rodriguez",
      role: "Grandmother of 4",
      image: "https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180599011_fee6e92b.png",
      location: "Miami, FL",
    },
    {
      quote: "As a hospice nurse, I've seen families lose so much when a loved one passes. Veda is different—it preserves the essence of who they are. I recommend it to every family I work with.",
      name: "Dr. James Thompson",
      role: "Hospice Care Specialist",
      image: "https://d64gsuwffb70l.cloudfront.net/69550825a301a2b0fa97fbbd_1767180567023_eab27416.png",
      location: "Seattle, WA",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#1a2332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">STORIES OF CONNECTION</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#f5f1e8] mb-6">
            Families Share Their Journey
          </h2>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Image */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -inset-2 bg-[#d4af37]/20 rounded-full blur-xl" />
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover mx-auto border-4 border-[#d4af37]/30"
                  />
                </div>
              </div>

              {/* Quote */}
              <div className="lg:col-span-2">
                <svg className="w-12 h-12 text-[#d4af37]/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-xl lg:text-2xl text-[#f5f1e8] leading-relaxed mb-8 font-serif italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <div>
                  <p className="text-[#d4af37] font-medium text-lg">{testimonials[activeTestimonial].name}</p>
                  <p className="text-[#f5f1e8]/60">{testimonials[activeTestimonial].role}</p>
                  <p className="text-[#f5f1e8]/40 text-sm">{testimonials[activeTestimonial].location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center gap-4 flex-wrap">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`relative group transition-all duration-300 ${
                activeTestimonial === index ? 'scale-110' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className={`w-16 h-16 rounded-full object-cover border-2 transition-all ${
                  activeTestimonial === index ? 'border-[#d4af37]' : 'border-transparent'
                }`}
              />
              {activeTestimonial === index && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#d4af37] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-[#d4af37]/20">
          {[
            { value: '2,500+', label: 'Legacies Preserved' },
            { value: '98%', label: 'Family Satisfaction' },
            { value: '15,000+', label: 'Hours of Wisdom Captured' },
            { value: '50+', label: 'Countries Served' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl lg:text-4xl font-serif text-[#d4af37] mb-2">{stat.value}</p>
              <p className="text-[#f5f1e8]/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
