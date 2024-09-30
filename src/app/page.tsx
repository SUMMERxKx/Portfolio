'use client'

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import Link from 'next/link';

const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-900 text-white z-10">
    <div className="text-xl font-bold">SAMAR</div>
    <ul className="flex space-x-4">
      {['Overview', 'About', 'Experience', 'Skills', 'Projects', 'Contact'].map((item) => (
        <li key={item}>
          <Link href={`#${item.toLowerCase()}`} className="hover:text-yellow-400">
            {item}
          </Link>
        </li>
      ))}
    </ul>
    <button className="text-xl">🌓</button>
  </nav>
);

const Overview = () => (
  <section id="overview" className="min-h-screen bg-gray-900 text-yellow-400 flex flex-col items-center justify-center">
<img src="/me.jpg" alt="Your Name" className="w-48 h-48 rounded-lg mb-4 object-cover" />
<h1 className="text-4xl font-bold mb-4">Hi I am Samar</h1>
    <div className="space-x-4">
      <button className="bg-yellow-500 text-white px-4 py-2 rounded">Contact</button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded">Projects</button>
    </div>
  </section>
);

const Skills = () => (
  <section id="skills" className="min-h-screen bg-gray-900 text-white p-8">
    <h2 className="text-6xl font-bold mb-8">Skills</h2>
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
    <h2 className="text-6xl font-bold mb-8">Projects</h2>
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
      <Overview />
      <Skills />
      <Projects />
      {/* Add other sections here */}
    </div>
  );
}
