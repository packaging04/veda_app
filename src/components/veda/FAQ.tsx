import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Veda work for elderly people who aren't tech-savvy?",
      answer:
        "Veda is designed with accessibility at its core. For those who prefer traditional communication, our AI simply calls them on their regular phone. There's no app to download, no buttons to press—just answer the phone and have a conversation. Family members can set up the schedule and customize questions remotely, making it effortless for the elder.",
    },
    {
      question: "What makes Veda different from just recording interviews?",
      answer:
        "Traditional recordings capture what someone says, but Veda captures how they think. Our AI uses layered questioning techniques to understand decision-making patterns, emotional responses, and life philosophy. The result isn't just a recording—it's an interactive wisdom model that can respond to new questions in the way your loved one would have.",
    },
    {
      question: "How long does the wisdom extraction process take?",
      answer:
        "The journey typically spans 3-6 months, depending on your chosen plan. This extended timeline allows for deep, meaningful conversations rather than rushed interviews. The AI builds understanding gradually, asking follow-up questions based on previous conversations to create a comprehensive picture of your loved one's wisdom.",
    },
    {
      question: "Can we upload existing recordings or videos?",
      answer:
        "Absolutely. Veda can analyze existing audio recordings, video interviews, speeches, or even casual family videos. These 'legacy assets' help establish a baseline understanding of personality and wisdom, which is then enriched through our AI-led conversations.",
    },
    {
      question: "What is the 'validation phase' and why is it important?",
      answer:
        "The validation phase is what sets Veda apart. While your loved one is still with you, we present the AI's understanding back to them through scenario-based questions. They can correct or refine the AI's responses, ensuring the final wisdom model truly represents how they think. This human-in-the-loop approach guarantees authenticity.",
    },
    {
      question: "Who can access the wisdom model after it's complete?",
      answer:
        "Access is controlled by your family. Depending on your plan, you can grant access to immediate family, extended family, or future generations. The wisdom model is preserved securely and can be accessed through our app or web platform, with the option to receive a physical Legacy USB archive.",
    },
    {
      question: "Is the data secure and private?",
      answer:
        "Security is paramount. All conversations are encrypted end-to-end, and data is stored on secure, HIPAA-compliant servers. Your family retains full ownership of all recordings and the wisdom model. We never share data with third parties, and you can request complete data deletion at any time.",
    },
    {
      question: "What happens if my loved one passes during the process?",
      answer:
        "We understand this is a sensitive possibility. If your loved one passes before completion, we work with whatever data has been collected to create the most complete wisdom model possible. Our team provides compassionate support throughout, and we offer a partial refund or credit toward memorial services.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">
            QUESTIONS & ANSWERS
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#1a2332]/70">
            Everything you need to know about preserving your family's wisdom
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-[#d4af37] shadow-lg"
                  : "border-[#1a2332]/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-[#f5f1e8]/50 transition-colors"
              >
                <span
                  className={`font-medium pr-4 ${
                    openIndex === index ? "text-[#1a2332]" : "text-[#1a2332]/80"
                  }`}
                >
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[#d4af37] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-[#1a2332]/70 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#1a2332]/60 mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center text-[#d4af37] font-medium hover:text-[#c9a227] transition-colors"
          >
            Contact our legacy consultants
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
