"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { BsFileText, BsPeople, BsBook } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";

const plans = [
  {
    id: "yearly",
    name: "Premium Plus Yearly",
    price: "$99.99",
    period: "/year",
    description: "7-day free trial included",
  },
  {
    id: "monthly",
    name: "Premium Monthly",
    price: "$9.99",
    period: "/month",
    description: "No trial included",
  },
];

const features = [
  {
    icon: <FaFileAlt className="w-6 h-6" />,
    text: "Key ideas in few min",
    subtext: "with many books to read",
  },
  {
    icon: <RiPlantFill className="w-6 h-6" />,
    text: "3 million",
    subtext: "people growing with Summarist everyday",
  },
  {
    icon: <FaHandshake className="w-6 h-6" />,
    text: "Precise recommendations",
    subtext: "collections curated by experts",
  },
];

const faqs = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires.",
  },
  {
    question: "Can I switch subscriptions from monthly to yearly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio.",
  },
  {
    question: "Can I cancel during my trial?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion.",
  },
];

export default function ChoosePlanPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleStartTrial = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    console.log(`Selected plan: ${selectedPlan}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue header with rounded bottom corners */}
      <div
        className="bg-[#032b41] pt-16 pb-8"
        style={{
          borderRadius: "0px",
        }}
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Get unlimited access to many amazing books to read
          </h1>
          <p className="text-lg text-gray-300">
            Turn ordinary moments into amazing learning opportunities
          </p>
        </div>
      </div>

        <div
        className="bg-[#032b41]"
        style={{
          borderRadius: "0px 0px 260px 260px",
        }}
      >
        <div
          className="mx-auto bg-white overflow-hidden"
          style={{
            borderRadius: "180px 180px 0 0", // TOP curved (180px), BOTTOM flat (0)
            maxWidth: "340px",
          }}
        >
          <img
            alt="pricing"
            src="/assets/pricing-top.png"
            width="860"
            height="722"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* White content section */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Features */}
<div className="grid grid-cols-3 gap-6 mb-12">
  {features.map((feature, idx) => (
    <div key={idx} className="flex flex-col items-center text-center gap-2">
      <div className="text-[#032b41] mb-1">{feature.icon}</div>
      <div className="text-sm text-gray-600">
        <b className="text-[#032b41]">{feature.text}</b>
      </div>
      <div className="text-sm text-gray-600">{feature.subtext}</div>
    </div>
  ))}
</div>

        {/* Section Title */}
        <div className="text-xl font-bold text-[#032b41] text-center mb-8">
          Choose the plan that fits you
        </div>

        {/* Plan Cards */}
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`flex items-center gap-4 p-6 border-2 rounded-lg cursor-pointer mb-4 transition-all
              ${selectedPlan === plan.id ? "border-[#2bd97c] bg-[#f7faf9]" : "border-gray-200 hover:border-gray-300"}
            `}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${selectedPlan === plan.id ? "border-[#2bd97c]" : "border-gray-300"}
            `}
            >
              {selectedPlan === plan.id && (
                <div className="w-3 h-3 rounded-full bg-[#2bd97c]"></div>
              )}
            </div>
            <div>
              <div className="font-bold text-[#032b41]">{plan.name}</div>
              <div className="text-lg font-semibold text-[#032b41]">
                {plan.price}
                <span className="text-sm font-normal text-gray-500">
                  {plan.period}
                </span>
              </div>
              <div className="text-sm text-gray-500">{plan.description}</div>
            </div>
          </div>
        ))}

        {/* Separator */}
        <div className="flex items-center justify-center my-6">
          <div className="text-gray-400 font-medium">or</div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleStartTrial}
            className="bg-[#2bd97c] hover:bg-[#20ba68] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            style={{ width: 300 }}
          >
            Start your free 7-day trial
          </button>
          <div className="text-sm text-gray-500 mt-4">
            Cancel your trial at any time before it ends, and you won't be
            charged.
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200">
              <div
                className="flex items-center justify-between py-4 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="font-semibold text-[#032b41]">
                  {faq.question}
                </div>
                <FaChevronDown
                  className={`text-gray-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                />
              </div>
              {openFaq === idx && (
                <div className="text-gray-600 pb-4 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f7faf9] py-12 px-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8 text-sm text-gray-600">
            <div>
              <div className="font-bold text-[#032b41] mb-4">Actions</div>
              <div className="space-y-2">
                <div>
                  <a href="#" className="hover:underline">
                    Summarist Magazine
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Cancel Subscription
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Help
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Contact us
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[#032b41] mb-4">Useful Links</div>
              <div className="space-y-2">
                <div>
                  <a href="#" className="hover:underline">
                    Pricing
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Summarist Business
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Gift Cards
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Authors & Publishers
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[#032b41] mb-4">Company</div>
              <div className="space-y-2">
                <div>
                  <a href="#" className="hover:underline">
                    About
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Partners
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Code of Conduct
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[#032b41] mb-4">Other</div>
              <div className="space-y-2">
                <div>
                  <a href="#" className="hover:underline">
                    Sitemap
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Legal Notice
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Terms of Service
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:underline">
                    Privacy Policies
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            Copyright © 2023 Summarist.
          </div>
        </div>
      </footer>
    </div>
  );
}
