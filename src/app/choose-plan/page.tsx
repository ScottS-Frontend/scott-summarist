"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { FaFileAlt, FaHandshake } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";
import { startCheckout, loadSubscription } from "@/store/subscriptionSlice";
import { openModal } from "@/store/modalSlice";
import { getProducts, Product } from "@/lib/payments";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { AppDispatch } from "@/store/store";
import ChoosePlanSkeleton from "@/components/SkeletonChoosePlan";

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

const footerLinks = {
  actions: ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"],
  usefulLinks: [
    "Pricing",
    "Summarist Business",
    "Gift Cards",
    "Authors & Publishers",
  ],
  company: ["About", "Careers", "Partners", "Code of Conduct"],
  other: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"],
};

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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { processing, subscription } = useSelector(
    (state: RootState) => state.subscription,
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        dispatch(openModal("login"));
        router.push("/");
      }
    });

    const loadProducts = async () => {
      try {
        const prods = await getProducts();
        setProducts(prods);
        if (prods.length > 0 && prods[0].prices.length > 0) {
          setSelectedPlan(prods[0].prices[0].id);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    return () => unsubscribe();
  }, [dispatch, router]);

  useEffect(() => {
    if (user) {
      dispatch(loadSubscription());
    }
  }, [user, dispatch]);

  const handleStartTrial = async () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }

    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    await dispatch(startCheckout(selectedPlan));
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const getPlanCardClasses = (priceId: string) => {
    const isSelected = selectedPlan === priceId;
    return `flex items-center gap-4 p-6 border-2 rounded-lg cursor-pointer mb-4 transition-all ${
      isSelected
        ? "border-[#2bd97c] bg-[#f7faf9]"
        : "border-gray-200 hover:border-gray-300"
    }`;
  };

  const getRadioCircleClasses = (priceId: string) => {
    const isSelected = selectedPlan === priceId;
    return `w-6 h-6 rounded-full border-2 flex items-center justify-center ${
      isSelected ? "border-[#2bd97c]" : "border-gray-300"
    }`;
  };

  if (loading) {
    return <ChoosePlanSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#032b41] pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-[48px] font-bold text-white mb-6">
            Get unlimited access to many amazing books to read
          </h1>
          <p className="text-[20px] text-gray-300">
            Turn ordinary moments into amazing learning opportunities
          </p>
        </div>
      </header>

      <section className="bg-[#032b41] pb-0 rounded-b-[260px]">
        <div className="mx-auto bg-white overflow-hidden max-w-[340px] rounded-t-[180px]">
          <img
            alt="pricing"
            src="/assets/pricing-top.png"
            width="860"
            height="722"
            className="w-full h-auto block"
          />
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <section className="grid grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => (
            <article
              key={idx}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="text-[#032b41] w-[60px] h-[60px]">
                {feature.icon}
              </div>
              <div className="text-sm text-[#032b41] font-bold">
                {feature.title}
              </div>
              <div className="text-sm text-gray-600">{feature.description}</div>
            </article>
          ))}
        </section>

        {subscription && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              You already have an active subscription!
            </p>
            <button
              onClick={() => router.push("/for-you")}
              className="mt-2 bg-[#2bd97c] hover:bg-[#20ba68] text-white font-semibold py-2 px-6 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        <section className="max-w-[680px] mx-auto">
          <h2 className="text-xl font-bold text-[#032b41] text-center mb-8">
            Choose the plan that fits you
          </h2>

          {products.map((product) => (
            <div key={product.id}>
              {product.prices.map((price) => (
                <article
                  key={price.id}
                  onClick={() => setSelectedPlan(price.id)}
                  className={getPlanCardClasses(price.id)}
                >
                  <div className={getRadioCircleClasses(price.id)}>
                    {selectedPlan === price.id && (
                      <div className="w-3 h-3 rounded-full bg-[#2bd97c]" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-[#032b41]">
                      {product.name}
                    </div>
                    <div className="text-lg font-semibold text-[#032b41]">
                      {formatPrice(price.unit_amount, price.currency)}
                      <span className="text-sm font-normal text-gray-500">
                        /{price.interval || "one-time"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.description || "Full access to all features"}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}

          {!products.length && !loading && (
            <div className="text-center text-gray-500 mb-8">
              <p>No plans available yet.</p>
            </div>
          )}
        </section>

        <div className="flex items-center justify-center my-6">
          <span className="text-gray-400 font-medium">or</span>
        </div>

        <section className="text-center">
          <button
            onClick={handleStartTrial}
            disabled={processing || !!subscription || !selectedPlan}
            className="bg-[#2bd97c] hover:bg-[#20ba68] text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
            style={{ width: 300 }}
          >
            {processing
              ? "Processing..."
              : subscription
                ? "Already Subscribed"
                : "Start your free 7-day trial"}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Cancel your trial at any time before it ends, and you won&apos;t be
            charged.
          </p>
        </section>

        <section className="mt-12">
          {faqs.map((faq, idx) => (
            <article key={idx} className="border-b border-gray-200">
              <div
                className="flex items-center justify-between py-4 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <h3 className="font-semibold text-[#032b41]">{faq.question}</h3>
                <FaChevronDown
                  className={`text-gray-400 transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openFaq === idx && (
                <p className="text-gray-600 pb-4 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </article>
          ))}
        </section>
      </main>

      <footer className="bg-[#f7faf9] py-12 px-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div className="space-y-2">
              <h4 className="font-bold text-[#032b41] mb-4">Actions</h4>
              {footerLinks.actions.map((link) => (
                <div key={link}>
                  <a href="#" className="text-sm text-gray-600 hover:underline">
                    {link}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#032b41] mb-4">Useful Links</h4>
              {footerLinks.usefulLinks.map((link) => (
                <div key={link}>
                  <a href="#" className="text-sm text-gray-600 hover:underline">
                    {link}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#032b41] mb-4">Company</h4>
              {footerLinks.company.map((link) => (
                <div key={link}>
                  <a href="#" className="text-sm text-gray-600 hover:underline">
                    {link}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#032b41] mb-4">Other</h4>
              {footerLinks.other.map((link) => (
                <div key={link}>
                  <a href="#" className="text-sm text-gray-600 hover:underline">
                    {link}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Copyright © 2023 Summarist.
          </p>
        </div>
      </footer>

      <style>{brandColors}</style>
    </div>
  );
}
