'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCode, FaPalette, FaLightbulb } from 'react-icons/fa';
import { IconType } from 'react-icons';

// Image URLs
const imageUrls = [
  "https://utfs.io/f/96880736-3268-40ed-a320-320ee71f4ce1-j7jra4.15.55.png",
  "https://utfs.io/f/d10755c4-0c4c-48d9-8304-8669ca0f956a-j7jra4.16.51.png",
  "https://utfs.io/f/2c93fba6-1ede-4f0f-8c06-0c3a6a57be4a-j7jra4.17.15.png",
  "https://utfs.io/f/1c057317-dc36-4f20-a6f4-ad9d25b0a19e-j7jra4.17.33.png",
  "https://utfs.io/f/40a19059-824e-49a4-99dd-dc5c2037be4a-j7jra4.17.57.png",
  "https://utfs.io/f/23a1226a-460a-4291-bdd0-8b4e3c24a7cf-j7jra4.19.00.png",
  "https://utfs.io/f/5f03dc65-e157-45e0-abad-e6db1c5d94ef-j7jra4.19.18.png",
  "https://utfs.io/f/0fcc963c-4a8d-4154-8f70-9a041752e0e2-lgj5hh.png",
  "https://utfs.io/f/21c67114-9837-448c-b66c-045679a17247-g8rou.png",
  "https://utfs.io/f/58d059ff-4695-4449-ae95-f8f21a015928-ugkxw7.png",
  "https://utfs.io/f/53663f72-2573-43ac-b8ac-35fbaf3360b6-nmdfrt.png",
  "https://utfs.io/f/c90d3a3c-acd7-4211-9fef-747ab633a14e-tn2qsc.png",
  "https://utfs.io/f/9f31fd42-a94d-43d5-9488-67a97b654ca1-d8l29i.png",
  "https://utfs.io/f/f054e908-fa20-4c0f-bc44-79f4840c5e0e-dcgv6z.png",
  "https://utfs.io/f/ff16cc8a-6a51-41fe-acd6-e5c9ada7ac90-f9tyxs.png",
  "https://utfs.io/f/14adec04-eb8f-4fae-86f4-032a6fc412c3-jgaxpj.pdf.1.png",
  "https://utfs.io/f/4b1e1486-b96a-4d2a-a4e5-10fecc84b40f-iuqz9d.pdf.1.png",
  "https://utfs.io/f/9b3ba0a3-3185-4454-92d4-006811de52e2-t6z6lr.png",
  "https://utfs.io/f/0edcc2b5-259e-4ee4-9b6e-1b69ece7f098-aaq5cg.png",
  "https://utfs.io/f/d95391e4-2f66-4c3c-9487-db42c1a76ca9-i7g4p1.png",
  "https://utfs.io/f/a55da38e-cddf-4afa-8212-11411da4698e-p7t9q2.pdf.1.png",
  "https://utfs.io/f/3cad51b9-2919-48ec-ad3b-44e0500cdef3-p7t9q1.pdf.1.png",
  "https://utfs.io/f/baf63424-20e8-4f4f-a29b-456e42eeb328-ii1x4x.pdf.1.png",
  "https://utfs.io/f/86432a76-e78c-419f-8a20-bb58a776fbbe-795wqn.pdf.1.png",
  "https://utfs.io/f/926175b2-8a20-49df-9e93-d00a56a5dab1-mmy41s.pdf.1.png",
  "https://utfs.io/f/777c493f-2e6f-4759-b0df-938960b526a2-be23ni.pdf.1.png"
];

// Define union type for grid items with aspect ratio options
type GridItem = 
  | { 
      type: 'image'; 
      src: string; 
      width: number;
      height: number;
    } 
  | { type: 'filler'; id: string };

// Update dimensions to be slightly smaller for better mobile view
const dimensions = {
  square: { width: 280, height: 280 },
  portrait: { width: 280, height: 380 },
  landscape: { width: 380, height: 280 },
  wide: { width: 580, height: 280 }
};

// Update imageData with specific dimensions
const imageData: GridItem[] = imageUrls.map((url) => {
  let size = dimensions.landscape; // default size

  if (url.includes('pdf.1.png')) {
    size = dimensions.portrait;
  } else if (url.includes('15.55.png') || url.includes('16.51.png')) {
    size = dimensions.square;
  } else if (url.includes('17.15.png') || url.includes('17.33.png')) {
    size = dimensions.wide;
  }

  return {
    type: 'image',
    src: url,
    width: size.width,
    height: size.height
  };
});

// Reduce number of filler boxes


type CardType = {
  type: 'hero' | 'feature' | 'stat';
  span: string;
  title: string;
  description?: string;
  icon?: IconType;
  number?: string;
  label?: string;
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export default function BentoGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4"
      >
        {/* Hero Section - First Row */}
        <motion.div
          className="break-inside-avoid mb-4 col-span-full md:col-span-3"
          variants={fadeInUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Hero Card */}
            <div className="md:col-span-3 rounded-2xl bg-white dark:bg-[#242424] p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h1 className="text-4xl md:text-5xl font-bold text-left mb-6 text-[var(--accent-light)] dark:text-[var(--accent-dark)] leading-tight">
                Digital Media & Graphic Design
              </h1>
              <p className="text-lg text-left text-[#4C4C4C] dark:text-[#F5F5F5] leading-relaxed">
                Creating intuitive digital experiences with a focus on user-centered design
              </p>
            </div>
            
            {/* Stats and Features */}
            {/* <div className="rounded-2xl bg-white dark:bg-[#242424] p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
              <FaCode className="text-[var(--accent-light)] dark:text-[var(--accent-dark)] text-3xl mb-2 mx-auto" />
              <span className="text-3xl font-bold text-[var(--accent-light)] dark:text-[var(--accent-dark)] block">5+</span>
              <span className="text-sm text-[#4C4C4C] dark:text-[#F5F5F5]">Years Experience</span>
            </div>
            
            <div className="rounded-2xl bg-white dark:bg-[#242424] p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <FaPalette className="text-[var(--accent-light)] dark:text-[var(--accent-dark)] text-2xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2 text-[var(--accent-light)] dark:text-[var(--accent-dark)] text-center">UI/UX</h3>
              <p className="text-sm text-[#4C4C4C] dark:text-[#F5F5F5] text-center">User-Centered Design</p>
            </div>
            
            <div className="rounded-2xl bg-white dark:bg-[#242424] p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <FaLightbulb className="text-[var(--accent-light)] dark:text-[var(--accent-dark)] text-2xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2 text-[var(--accent-light)] dark:text-[var(--accent-dark)] text-center">Strategy</h3>
              <p className="text-sm text-[#4C4C4C] dark:text-[#F5F5F5] text-center">Design Solutions</p>
            </div> */}
          </div>
        </motion.div>

        {/* Image Grid */}
        {imageData.map((item, index) => (
          <motion.div
            key={item.type === 'image' ? item.src : item.id}
            className="break-inside-avoid mb-4"
            variants={fadeInUp}
          >
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#242424] shadow-sm hover:shadow-lg transition-all duration-300">
              {item.type === 'image' ? (
                <div className="relative w-full">
                  <Image
                    src={item.src}
                    alt={`Portfolio piece ${index + 1}`}
                    width={item.width}
                    height={item.height}
                    className="w-full h-auto scale-102 hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full bg-[var(--accent-light)]/5 dark:bg-[var(--accent-dark)]/10 h-[200px]" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 