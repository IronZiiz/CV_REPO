

STACK CARDS,PROJECT CARDSS
It must be match with the website design 
I wanna see the pictures in background. This cards need to have a link to a visulization of this projects
You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
tech-stack.tsx
'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface Tech {
  name: string;
  url: string;
  color: string;
}

interface ComponentProps {
  techStack: Tech[];
}

export const Component: React.FC<ComponentProps> = ({ techStack }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lightSize = 80; 

  const lightX = useTransform(x, (value) => value - lightSize / 2);
  const lightY = useTransform(y, (value) => value - lightSize / 2);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <div className='flex justify-center items-center py-20 '>
        <div
      className="relative bg-black/50 overflow-hidden w-96 h-60 pb-3 rounded-lg shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <Image
        src="https://cdn.21st.dev/assets/mirror/10/1006d647f30b527eb0afa10adbc252a51c8941e87b9330b49490cc0cb10e7b94.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-3xl  "
        width={96}
        height={96}
      />

      
      <div className="absolute inset-0 bg-black/50 rounded-lg border border-zinc-600 backdrop-blur-xl "></div>

      
      {isHovered && (
        <motion.div
          className="absolute rounded-full pointer-events-none "
          style={{
            width: lightSize,
            height: lightSize,
            background: 'rgba(255, 255, 255, 0.2)',
            filter: 'blur(30px)',
            x: lightX,
            y: lightY,
          }}
        ></motion.div>
      )}

      
      <div className="relative z-10 flex flex-col justify-between p-6 ">
        <div className="flex justify-between ">
          <div className="flex items-center gap-2 mb-2 text-sm text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file-code mb-4"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="m10 13-2 2 2 2"></path>
              <path d="m14 17 2-2-2-2"></path>
            </svg>
            <p className="font-medium mb-3 text-base">Techstack</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech, index) => (
            <a key={index} target="_blank" rel="noopener noreferrer" href={tech.url}>
              <div className="inline-flex items-center rounded-full border border-zinc-800 px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white hover:bg-white/10">
                <div className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: tech.color }}></div>
                {tech.name}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

demo.tsx
// This is a demo of a preview
'use client'
import { Component } from "@/components/ui/tech-stack";

const DemoOne = () => {
  const techStack = [
    { name: 'Next.js', url: 'https://nextjs.org/', color: '#FFFFFF' },
    { name: 'React', url: 'https://react.dev/', color: '#61DAFB' },
    { name: 'TypeScript', url: 'https://www.typescriptlang.org/', color: '#3178C6' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', color: '#06B6D4' },
    { name: 'Framer Motion', url: 'https://www.framer.com/motion/', color: '#0055FF' },
    { name: 'Node.js', url: 'https://nodejs.org/en', color: '#68A063' },
    { name: 'Vercel', url: 'https://vercel.com/', color: '#000000' },
  ];

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Component techStack={techStack} />
    </div>
  );
};

export default DemoOne;
```

Install NPM dependencies:
```bash
next, framer-motion
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
