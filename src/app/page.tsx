'use client';

import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/store/modalSlice';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  AiFillFileText, 
  AiFillBulb, 
  AiFillAudio 
} from 'react-icons/ai';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { BiCrown } from 'react-icons/bi';
import { RiLeafLine } from 'react-icons/ri';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeHeading, setActiveHeading] = useState(0);

  // Rotating headings effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeading((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const headings1 = [
    "Enhance your knowledge",
    "Achieve greater success",
    "Improve your health",
    "Develop better parenting skills",
    "Increase happiness",
    "Be the best version of yourself!"
  ];

  const headings2 = [
    "Expand your learning",
    "Accomplish your goals",
    "Strengthen your vitality",
    "Become a better caregiver",
    "Improve your mood",
    "Maximize your abilities"
  ];

  return (
    <div className="min-h-screen bg-white font-roboto">
      <AuthModal />
      
      {/* Navbar - Always shows guest menu */}
      <nav className="py-10 bg-white">
        <div className="flex justify-between items-center max-w-[1070px] w-full h-full mx-auto px-6">
          <figure className="max-w-[200px]">
            <Image 
              src="/assets/logo.png" 
              alt="Summarist" 
              width={160} 
              height={40}
              className="w-full h-full object-contain"
            />
          </figure>
          
          <ul className="flex gap-6 list-none m-0 p-0">
            <li 
              className="text-[#032b41] cursor-pointer hover:text-[#2bd97c] transition-colors font-normal m-0"
              onClick={() => dispatch(openModal('login'))}
            >
              Login
            </li>
            <li className="text-[#032b41] cursor-not-allowed hidden md:block m-0">About</li>
            <li className="text-[#032b41] cursor-not-allowed hidden md:block m-0">Contact</li>
            <li className="text-[#032b41] cursor-not-allowed hidden md:block m-0">Help</li>
          </ul>
        </div>
      </nav>

      {/* Landing Section */}
      <section className="py-10 bg-white">
        <div className="max-w-[1070px] mx-auto px-6 pb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full">
              <h1 className="text-[40px] font-bold text-[#032b41] mb-6 leading-tight">
                Gain more knowledge<br className="hidden md:block" />
                in less time
              </h1>
              <p className="text-[20px] font-light text-[#394547] mb-6 leading-[1.5]">
                Great summaries for busy people,<br className="hidden md:block" />
                individuals who barely have time to read,<br className="hidden md:block" />
                and even people who don't like to read.
              </p>
              <button 
                className="bg-[#2bd97c] text-[#032b41] w-full max-w-[300px] h-10 rounded text-[16px] transition-colors hover:bg-[#20ba68] flex items-center justify-center font-normal"
                onClick={() => user ? router.push('/for-you') : dispatch(openModal('login'))}
              >
                Login
              </button>
            </div>
            <figure className="w-full hidden md:flex justify-end mt-10">
              <Image 
                src="/assets/landing.png" 
                alt="Landing" 
                width={400} 
                height={400}
                className="w-full max-w-[400px] h-auto"
                priority
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white">
        <div className="max-w-[1070px] mx-auto px-6">
          <h2 className="text-[32px] text-[#032b41] text-center mb-8 font-bold">
            Understand books in few minutes
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 mb-24">
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center mb-2 text-[#032b41]">
                <AiFillFileText className="w-[60px] h-[60px]" />
              </div>
              <h3 className="text-[24px] text-[#032b41] mb-4 font-medium">Read or listen</h3>
              <p className="text-[18px] text-[#394547] font-light">
                Save time by getting the core ideas from the best books.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center mb-2 text-[#032b41]">
                <AiFillBulb className="w-[60px] h-[60px]" />
              </div>
              <h3 className="text-[24px] text-[#032b41] mb-4 font-medium">Find your next read</h3>
              <p className="text-[18px] text-[#394547] font-light">
                Explore book lists and personalized recommendations.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center mb-2 text-[#032b41]">
                <AiFillAudio className="w-[60px] h-[60px]" />
              </div>
              <h3 className="text-[24px] text-[#032b41] mb-4 font-medium">Briefcasts</h3>
              <p className="text-[18px] text-[#394547] font-light">
                Gain valuable insights from briefcasts
              </p>
            </div>
          </div>

          {/* Statistics Row 1 */}
          <div className="flex flex-col md:flex-row gap-20 mb-24">
            <div className="w-full flex flex-col justify-center">
              {headings1.map((heading, index) => (
                <div 
                  key={index}
                  className={`text-[32px] font-medium mb-4 transition-colors duration-500 ${
                    index === activeHeading ? 'text-[#2bd97c]' : 'text-[#6b757b]'
                  }`}
                >
                  {heading}
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col justify-center gap-6 bg-[#f1f6f4] p-10">
              <div className="flex gap-4">
                <div className="text-[#0365f2] text-[20px] font-semibold mt-1">93%</div>
                <div className="text-[20px] font-light text-[#394547]">
                  of Summarist members <b>significantly increase</b> reading frequency.
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-[#0365f2] text-[20px] font-semibold mt-1">96%</div>
                <div className="text-[20px] font-light text-[#394547]">
                  of Summarist members <b>establish better</b> habits.
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-[#0365f2] text-[20px] font-semibold mt-1">90%</div>
                <div className="text-[20px] font-light text-[#394547]">
                  have made <b>significant positive</b> change to their lives.
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Row 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-20 mb-24">
            <div className="w-full flex flex-col justify-center md:items-end">
              {headings2.map((heading, index) => (
                <div 
                  key={index}
                  className={`text-[32px] font-medium mb-4 transition-colors duration-500 md:text-right ${
                    index === activeHeading ? 'text-[#2bd97c]' : 'text-[#6b757b]'
                  }`}
                >
                  {heading}
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col justify-center gap-6 bg-[#f1f6f4] p-10 order-2 md:order-1">
              <div className="flex gap-4">
                <div className="text-[#0365f2] text-[20px] font-semibold mt-1">91%</div>
                <div className="text-[20px] font-light text-[#394547]">
                  of Summarist members <b>report feeling more productive</b> after incorporating the service into their daily routine.
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-[#0365f2] text-[20px] font-semibold mt-1">94%</div>
                <div className="text-[20px] font-light text-[#394547]">
                  of Summarist members have <b>noticed an improvement</b> in their overall comprehension and retention of information.
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-[#0365f2] text-[20px] font-semibold mt-1">88%</div>
                <div className="text-[20px] font-light text-[#394547]">
                  of Summarist members <b>feel more informed</b> about current events and industry trends since using the platform.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-10 bg-white">
        <div className="max-w-[1070px] mx-auto px-6">
          <h2 className="text-[32px] text-[#032b41] text-center mb-8 font-bold">
            What our members say
          </h2>
          
          <div className="max-w-[600px] mx-auto">
            <div className="bg-[#fff3d7] p-4 mb-8 rounded">
              <div className="flex gap-2 mb-2 text-[#032b41]">
                <div className="font-bold">Hanna M.</div>
                <div className="flex text-[#0564f1]">
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                </div>
              </div>
              <p className="text-[#394547] tracking-[0.3px] leading-[1.4] font-light">
                This app has been a <b>game-changer</b> for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.
              </p>
            </div>
            
            <div className="bg-[#fff3d7] p-4 mb-8 rounded">
              <div className="flex gap-2 mb-2 text-[#032b41]">
                <div className="font-bold">David B.</div>
                <div className="flex text-[#0564f1]">
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                </div>
              </div>
              <p className="text-[#394547] tracking-[0.3px] leading-[1.4] font-light">
                I love this app! It provides <b>concise and accurate summaries</b> of books in a way that is easy to understand. It's also very user-friendly and intuitive.
              </p>
            </div>
            
            <div className="bg-[#fff3d7] p-4 mb-8 rounded">
              <div className="flex gap-2 mb-2 text-[#032b41]">
                <div className="font-bold">Nathan S.</div>
                <div className="flex text-[#0564f1]">
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                </div>
              </div>
              <p className="text-[#394547] tracking-[0.3px] leading-[1.4] font-light">
                This app is a great way to get the main takeaways from a book without having to read the entire thing. <b>The summaries are well-written and informative.</b> Definitely worth downloading.
              </p>
            </div>
            
            <div className="bg-[#fff3d7] p-4 mb-8 rounded">
              <div className="flex gap-2 mb-2 text-[#032b41]">
                <div className="font-bold">Ryan R.</div>
                <div className="flex text-[#0564f1]">
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                  <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                </div>
              </div>
              <p className="text-[#394547] tracking-[0.3px] leading-[1.4] font-light">
                If you're a busy person who <b>loves reading but doesn't have the time</b> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="bg-[#2bd97c] text-[#032b41] w-full max-w-[300px] h-10 rounded text-[16px] transition-colors hover:bg-[#20ba68] flex items-center justify-center font-normal"
              onClick={() => user ? router.push('/for-you') : dispatch(openModal('login'))}
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-10">
        <div className="max-w-[1070px] mx-auto px-6">
          <h2 className="text-[32px] text-[#032b41] text-center mb-8 font-bold">
            Start growing with Summarist now
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 pb-10 rounded-[12px]">
              <div className="flex items-center h-[60px] mb-4">
                <BiCrown className="w-12 h-12 text-[#0365f2]" />
              </div>
              <div className="text-[40px] text-[#032b41] font-semibold mb-4">3 Million</div>
              <div className="text-[#394547] font-light">Downloads on all platforms</div>
            </div>
            
            <div className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 pb-10 rounded-[12px]">
              <div className="flex items-center h-[60px] mb-4 gap-1">
                <BsStarFill className="w-5 h-5 text-[#0365f2]" />
                <BsStarFill className="w-5 h-5 text-[#0365f2]" />
                <BsStarFill className="w-5 h-5 text-[#0365f2]" />
                <BsStarFill className="w-5 h-5 text-[#0365f2]" />
                <BsStarHalf className="w-5 h-5 text-[#0365f2]" />
              </div>
              <div className="text-[40px] text-[#032b41] font-semibold mb-4">4.5 Stars</div>
              <div className="text-[#394547] font-light">Average ratings on iOS and Google Play</div>
            </div>
            
            <div className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 pb-10 rounded-[12px]">
              <div className="flex items-center h-[60px] mb-4">
                <RiLeafLine className="w-12 h-12 text-[#0365f2]" />
              </div>
              <div className="text-[40px] text-[#032b41] font-semibold mb-4">97%</div>
              <div className="text-[#394547] font-light">Of Summarist members create a better reading habit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f1f6f4] pt-16 pb-8">
        <div className="max-w-[1070px] mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8 mb-16 relative z-10">
            <div>
              <h4 className="font-semibold mb-4 text-[18px] text-[#032b41]">Actions</h4>
              <ul className="space-y-3 text-[14px] text-[#394547] list-none cursor-not-allowed">
                <li>Summarist Magazine</li>
                <li>Cancel Subscription</li>
                <li>Help</li>
                <li>Contact us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[18px] text-[#032b41]">Useful Links</h4>
              <ul className="space-y-3 text-[14px] text-[#394547] list-none cursor-not-allowed">
                <li>Pricing</li>
                <li>Summarist Business</li>
                <li>Gift Cards</li>
                <li>Authors & Publishers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[18px] text-[#032b41]">Company</h4>
              <ul className="space-y-3 text-[14px] text-[#394547] list-none cursor-not-allowed">
                <li>About</li>
                <li>Careers</li>
                <li>Partners</li>
                <li>Code of Conduct</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[18px] text-[#032b41]">Other</h4>
              <ul className="space-y-3 text-[14px] text-[#394547] list-none cursor-not-allowed">
                <li>Sitemap</li>
                <li>Legal Notice</li>
                <li>Terms of Service</li>
                <li>Privacy Policies</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center items-center border-t border-gray-200 pt-8">
            <div className="text-[#032b41] font-medium text-[14px]">
              Copyright © 2023 Summarist.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}