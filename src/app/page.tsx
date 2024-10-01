'use client'

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Ghost, Mail, Phone, MapPin } from 'lucide-react';

const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 bg-gray-900 text-white z-10 ">
    <div className="text-xl font-bold">SAMAR</div>
    <ul className="flex space-x-6">
      {['Overview', 'About', 'Experience', 'Skills', 'Projects', 'Contact'].map((item) => (
        <li key={item}>
          <Link href={`#${item.toLowerCase()}`} className="hover:text-yellow-400">
            {item}
          </Link>
        </li>
      ))}
    </ul>
    <button className="text-xl">
      <Ghost size={24} />
    </button>
  </nav>
);

const Overview = () => (
  <section id="overview" className="min-h-screen bg-gray-900 text-yellow-400 flex flex-col items-center justify-center">
    <img src="/me.jpg" alt="Your Name" className="w-72 h-72 rounded-lg mb-4 object-cover" />
    <h1 className="text-4xl font-bold mb-4">Hi I am Samar</h1>
    <div className="space-x-4">
      <button className="bg-yellow-500 text-white px-4 py-2 rounded">Contact</button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded">Projects</button>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="min-h-screen bg-gray-900 text-white p-8">
    <h2 className="text-6xl font-bold mb-12 text-yellow-400 space-y-8 max-w-4xl mx-auto">About</h2>
    
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h3 className="text-2xl font-semibold text-yellow-400 mb-4">01 Myself</h3>
        <p>
        Hi, my name is Samar, and I am currently a third-year Computing Science student at Thompson Rivers University. I have a deep passion for full stack development, machine learning, and automation.
        </p>
        <p className="mt-2">
        Outside of my studies, I enjoy playing football, video games, and watching movies—Game of Thrones being one of my all-time favorites, and I'm always up for a conversation about it!
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-yellow-400 mb-4">02 My Passion</h3>
        <p>
        My passion for gaming initially sparked my interest in computer science. The curiosity of how games and technologies are built drove me to dive deeper into the field.        
        </p>
        <p className="mt-2">
        Over time, this passion turned into a desire to solve real-world problems, and my competitive nature continues to fuel my drive to learn new technologies every day.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-yellow-400 mb-4">03 My Goals</h3>
        <p>
        My ultimate goal is to become a skilled software developer, capable of creating impactful solutions in the industry. I am driven by the desire to help others by solving their challenges, and I look forward to making meaningful contributions to the tech world.        
        </p>
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="skills" className="min-h-screen bg-gray-900 text-white p-8">
    <h2 className="text-6xl font-bold mb-8 text-yellow-400">Skills</h2>
    <div className="grid grid-cols-2 gap-8">
      {['Frontend', 'Backend', 'Databases', 'DevOps'].map((category) => (
        <div key={category} className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">{category}</h3>
          <div className="grid grid-cols-4 gap-4">
            {/* Add your skill icons here */}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Projects = () => (
  <section id="projects" className="min-h-screen bg-gray-900 text-white p-8">
    <h2 className="text-6xl font-bold mb-8 text-yellow-400">Projects</h2>
    <div className="grid grid-cols-3 gap-8">
      {['Blockchain Wallet', 'Policy Planner', 'Movie Space'].map((project) => (
        <div key={project} className="bg-gray-800 rounded-lg overflow-hidden">
          <img src={`/path-to-${project.toLowerCase().replace(' ', '-')}-image.jpg`} alt={project} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{project}</h3>
            <p className="text-gray-400 mb-4">Project description goes here...</p>
            <div className="flex space-x-4">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded">Demo</button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded">GitHub</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);


const Contact = () => (
  <section id="contact" className="min-h-screen bg-gray-900 text-white p-8">
    <h2 className="text-6xl font-bold mb-12 text-yellow-400">Contact</h2>
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
        <p>I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
        <div className="flex items-center space-x-4">
          <Mail className="text-yellow-400" />
          <span>samar.k.khajuria@gmail.com</span>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="text-yellow-400" />
          <span>+1 (587) 435 - 7443</span>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="text-yellow-400" />
          <span>Kamloops,BC, Canada</span>
        </div>
      </div>
      
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white p-4 text-center">
    <p>&copy; 2024 Samar. All rights reserved.</p>
  </footer>
);

export default function Home() {
  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (href) {
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener('click', handleScroll));

    return () => {
      links.forEach(link => link.removeEventListener('click', handleScroll));
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      <NavBar />
      <div className="h-px bg-gray-700 mx-4"></div> {/* Line to distinguish NavBar */}
      <Overview />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <div className="h-px bg-gray-700 mx-4"></div> {/* Line to distinguish Footer */}
      <Footer />
    </div>
  );
}