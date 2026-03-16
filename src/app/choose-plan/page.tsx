"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { FaFileAlt, FaHandshake } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";

// Plan data
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

// Feature data with large icons
const features = [
  {
    icon: <FaFileAlt className="w-[60px] h-[60px]" />,
    title: "Key ideas in few min",
    description: "with many books to read",
  },
  {
    icon: <RiPlantFill className="w-[60px] h-[60px]" />,
    title: "3 million",
    description: "people growing with Summarist everyday",
  },
  {
    icon: <FaHandshake className="w-[60px] h-[60px]" />,
    title: "Precise recommendations",
    description: "collections curated by experts",
  },
];

// FAQ data
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

// Footer links data
const footerLinks = {
  actions: ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"],
  usefulLinks: ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"],
  company: ["About", "Careers", "Partners", "Code of Conduct"],
  other: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"],
};

// Semantic style definitions
const styles = {
  // Page layout
  page: "min-h-screen bg-white",

  // Header section - dark blue background with text
  headerSection: "bg-brand-dark pt-16 pb-8",
  headerContainer: "max-w-4xl mx-auto px-8 text-center",
  headerTitle: "text-[48px] font-bold text-white mb-6",
  headerSubtitle: "text-[20px] text-gray-300",

  // Image section - dark blue with curved bottom, white pill with image
  imageSection: "bg-brand-dark pb-0",
  imageSectionRounded: "rounded-b-[260px]",
  imagePill: "mx-auto bg-white overflow-hidden max-w-[340px]",
  imagePillRounded: "rounded-t-[180px]",
  image: "w-full h-auto block",

  // Main content area
  contentContainer: "max-w-4xl mx-auto px-8 py-12",

  // Features section
  featuresGrid: "grid grid-cols-3 gap-6 mb-12",
  featureItem: "flex flex-col items-center text-center gap-2",
  featureIcon: "text-brand-dark w-[60px] h-[60px]",
  featureTitle: "text-sm text-brand-dark font-bold",
  featureDescription: "text-sm text-gray-600",

  // Section headings
  sectionTitle: "text-xl font-bold text-brand-dark text-center mb-8",

  // Plan selection cards
  planCard: "flex items-center gap-4 p-6 border-2 rounded-lg cursor-pointer mb-4 transition-all",
  planCardSelected: "border-brand-green bg-brand-light",
  planCardUnselected: "border-gray-200 hover:border-gray-300",
  planRadioCircle: "w-6 h-6 rounded-full border-2 flex items-center justify-center",
  planRadioCircleSelected: "border-brand-green",
  planRadioCircleUnselected: "border-gray-300",
  planRadioDot: "w-3 h-3 rounded-full bg-brand-green",
  planName: "font-bold text-brand-dark",
  planPrice: "text-lg font-semibold text-brand-dark",
  planPricePeriod: "text-sm font-normal text-gray-500",
  planDescription: "text-sm text-gray-500",

  // Separator
  separatorContainer: "flex items-center justify-center my-6",
  separatorText: "text-gray-400 font-medium",

  // Call to action
  ctaContainer: "text-center",
  ctaButton: "bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors",
  ctaDisclaimer: "text-sm text-gray-500 mt-4",

  // FAQ accordion
  faqContainer: "mt-12",
  faqItem: "border-b border-gray-200",
  faqQuestion: "flex items-center justify-between py-4 cursor-pointer",
  faqQuestionText: "font-semibold text-brand-dark",
  faqIcon: "text-gray-400 transition-transform",
  faqIconOpen: "rotate-180",
  faqAnswer: "text-gray-600 pb-4 text-sm leading-relaxed",

  // Footer
  footer: "bg-brand-light py-12 px-8 mt-12",
  footerContainer: "max-w-4xl mx-auto",
  footerGrid: "grid grid-cols-4 gap-8 mb-8",
  footerColumn: "space-y-2",
  footerColumnTitle: "font-bold text-brand-dark mb-4",
  footerLink: "text-sm text-gray-600 hover:underline",
  footerCopyright: "text-center text-sm text-gray-500",
};

// Brand colors as Tailwind custom classes
const brandColors = `
  .bg-brand-dark { background-color: #032b41; }
  .text-brand-dark { color: #032b41; }
  .bg-brand-green { background-color: #2bd97c; }
  .bg-brand-green-dark { background-color: #20ba68; }
  .text-brand-green { color: #2bd97c; }
  .border-brand-green { border-color: #2bd97c; }
  .bg-brand-light { background-color: #f7faf9; }
`;

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

  const getPlanCardClasses = (planId: string) => {
    const isSelected = selectedPlan === planId;
    return `${styles.planCard} ${
      isSelected ? styles.planCardSelected : styles.planCardUnselected
    }`;
  };

  const getRadioCircleClasses = (planId: string) => {
    const isSelected = selectedPlan === planId;
    return `${styles.planRadioCircle} ${
      isSelected ? styles.planRadioCircleSelected : styles.planRadioCircleUnselected
    }`;
  };

  return (
    <div className={styles.page}>
      {/* Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>
            Get unlimited access to many amazing books to read
          </h1>
          <p className={styles.headerSubtitle}>
            Turn ordinary moments into amazing learning opportunities
          </p>
        </div>
      </header>

      {/* Image Section with Pill Shape */}
      <section className={`${styles.imageSection} ${styles.imageSectionRounded}`}>
        <div className={`${styles.imagePill} ${styles.imagePillRounded}`}>
          <img
            alt="pricing"
            src="/assets/pricing-top.png"
            width="860"
            height="722"
            className={styles.image}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.contentContainer}>
        {/* Features */}
        <section className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <article key={idx} className={styles.featureItem}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <div className={styles.featureTitle}>{feature.title}</div>
              <div className={styles.featureDescription}>
                {feature.description}
              </div>
            </article>
          ))}
        </section>

        {/* Plan Selection */}
        <section>
          <h2 className={styles.sectionTitle}>Choose the plan that fits you</h2>

          {plans.map((plan) => (
            <article
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={getPlanCardClasses(plan.id)}
            >
              <div className={getRadioCircleClasses(plan.id)}>
                {selectedPlan === plan.id && (
                  <div className={styles.planRadioDot} />
                )}
              </div>
              <div>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  {plan.price}
                  <span className={styles.planPricePeriod}>{plan.period}</span>
                </div>
                <div className={styles.planDescription}>{plan.description}</div>
              </div>
            </article>
          ))}
        </section>

        {/* Separator */}
        <div className={styles.separatorContainer}>
          <span className={styles.separatorText}>or</span>
        </div>

        {/* Call to Action */}
        <section className={styles.ctaContainer}>
          <button
            onClick={handleStartTrial}
            className={styles.ctaButton}
            style={{ width: 300 }}
          >
            Start your free 7-day trial
          </button>
          <p className={styles.ctaDisclaimer}>
            Cancel your trial at any time before it ends, and you won&apos;t be
            charged.
          </p>
        </section>

        {/* FAQ */}
        <section className={styles.faqContainer}>
          {faqs.map((faq, idx) => (
            <article key={idx} className={styles.faqItem}>
              <div
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <h3 className={styles.faqQuestionText}>{faq.question}</h3>
                <FaChevronDown
                  className={`${styles.faqIcon} ${
                    openFaq === idx ? styles.faqIconOpen : ""
                  }`}
                />
              </div>
              {openFaq === idx && (
                <p className={styles.faqAnswer}>{faq.answer}</p>
              )}
            </article>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            {/* Actions */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Actions</h4>
              {footerLinks.actions.map((link) => (
                <div key={link}>
                  <a href="#" className={styles.footerLink}>
                    {link}
                  </a>
                </div>
              ))}
            </div>

            {/* Useful Links */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Useful Links</h4>
              {footerLinks.usefulLinks.map((link) => (
                <div key={link}>
                  <a href="#" className={styles.footerLink}>
                    {link}
                  </a>
                </div>
              ))}
            </div>

            {/* Company */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Company</h4>
              {footerLinks.company.map((link) => (
                <div key={link}>
                  <a href="#" className={styles.footerLink}>
                    {link}
                  </a>
                </div>
              ))}
            </div>

            {/* Other */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Other</h4>
              {footerLinks.other.map((link) => (
                <div key={link}>
                  <a href="#" className={styles.footerLink}>
                    {link}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className={styles.footerCopyright}>
            Copyright © 2023 Summarist.
          </p>
        </div>
      </footer>

      {/* Inject brand color styles */}
      <style>{brandColors}</style>
    </div>
  );
}