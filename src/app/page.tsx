'use client';
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Ghost, Mail, Phone, MapPin } from 'lucide-react';
import { FaReact, FaNodeJs, FaPhp, FaJava, FaAws, FaDocker, FaGitAlt, FaAngular, FaGithub, FaExternalLinkAlt, FaLinkedin, FaInstagram, FaArrowDown } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiExpress, SiMongodb, SiMysql } from 'react-icons/si';
import TypingAnimation from './TypingAnimation';
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle component

// Update the ThemeContext type
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

// Custom hook to use the theme
const useTheme = () => useContext(ThemeContext);

const NavBar = () => {
  const { isDark } = useTheme();
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 z-10 bg-opacity-90 backdrop-blur-sm transition-colors duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-md">
        <div className="text-xl font-bold text-gray-900 dark:text-white">SAMAR</div>
        <ul className="flex space-x-6">
          {['Overview', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <li key={item}>
              <Link href={`#${item.toLowerCase()}`} className="text-gray-900 dark:text-white hover:text-yellow-400 transition-colors duration-300">
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
      <div className="h-px bg-yellow-400 w-full"></div>
    </>
  );
};

const Overview = () => {
  return (
    <section id="overview" className="min-h-screen flex flex-col items-center justify-center relative text-gray-900 dark:text-white bg-white dark:bg-gray-900">
      <Image 
        src="/me.jpg" 
        alt="Samar" 
        width={288} 
        height={288} 
        className="w-72 h-72 rounded-full mb-8 object-cover border-4 border-yellow-400 shadow-lg" 
      />
      <h1 className="text-4xl font-bold mb-4 text-yellow-400">
        Hi, I am <TypingAnimation text="Samar" speed={150} />
      </h1>
      <p className="text-2xl mb-8">Full Stack Developer | ML Enthusiast</p>
      <div className="flex space-x-4 mb-12">
        <Link href="#about" className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300">
          About Me
        </Link>
        <Link href="#projects" className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition duration-300">
          My Projects
        </Link>
      </div>
      <div className="absolute bottom-10 animate-bounce text-yellow-400">
        <FaArrowDown size={24} />
      </div>
    </section>
  );
};



const About = () => (
  <section id="about" className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8">
    <h2 className="text-6xl font-bold mb-12 text-yellow-400 space-y-8 max-w-4xl mx-auto">About</h2>
    
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h3 className="text-2xl font-semibold text-yellow-400 mb-4">01 Myself</h3>
        <p>
        Hi, my name is Samar, and I am currently a third-year Computing Science student at Thompson Rivers University. I have a deep passion for full stack development, machine learning, and automation.
        </p>
        <p className="mt-2">
        Outside of my studies, I enjoy playing football, video games, and watching movies—Game of Thrones being one of my all-time favorites, and I&apos;m always up for a conversation about it!
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
  <section id="skills" className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8">
    <h2 className="text-6xl font-bold mb-12 text-yellow-400 space-y-8 max-w-4xl mx-auto">Skills</h2>
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Frontend */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Frontend</h3>
        <div className="grid grid-cols-4 gap-4">
          <FaReact size={60} /> {/* React Icon */}
          <SiNextdotjs size={60} /> {/* Next.js Icon */}
          <SiTypescript size={60} /> {/* TypeScript Icon */}
          <FaAngular size={60} /> {/* Angular Icon */}
        </div>
      </div>

      {/* Backend */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Backend</h3>
        <div className="grid grid-cols-4 gap-4">
          <FaNodeJs size={60} /> {/* Node.js Icon */}
          <SiExpress size={60} /> {/* Express.js Icon */}
          <FaPhp size={60} /> {/* PHP Icon */}
          <FaJava size={60} /> {/* Java Icon */}
        </div>
      </div>

      {/* Databases */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Databases</h3>
        <div className="grid grid-cols-4 gap-4">
          <SiMongodb size={60} /> {/* MongoDB Icon */}
          <SiMysql size={60} /> {/* MySQL Icon */}
        </div>
      </div>

      {/* DevOps */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">DevOps</h3>
        <div className="grid grid-cols-4 gap-4">
          <FaGitAlt size={60} /> {/* Git Icon */}
          <FaDocker size={60} /> {/* Docker Icon */}
          <FaAws size={60} /> {/* AWS Icon */}
          <FaGithub size={60} />
        </div>
      </div>
    </div>
  </section>
);

interface Project {
  name: string;
  category: string;
  description: string;
  image: string;
  githubLink: string;
  demoLink?: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
    <Image src={project.image} alt={project.name} width={400} height={200} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-yellow-400">{project.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{project.category}</p>
      <p className="text-gray-800 dark:text-gray-300 mb-4">{project.description}</p>
      <div className="flex space-x-4">
        {project.demoLink && (
          <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300">
            <FaExternalLinkAlt className="mr-2" />
            Demo
          </a>
        )}
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300">
            <FaGithub className="mr-2" />
            GitHub
          </a>
        )}
      </div>
    </div>
  </div>
);

const projectData: Project[] = [
  { 
    name: "AI Flappy Bird",
    category: "Game",
    description: "A Python-based Flappy Bird clone using Pygame and NEAT, where AI birds evolve over generations to improve their gameplay.",
    image: '/flappy.png',
    githubLink: "https://github.com/SUMMERxKx/Flappy-Bird",
  },
  { 
    name: "Medical Device Monitor", 
    category: "Health",
    description: "A comprehensive system simulating medical devices, processing real-time data, and visualizing metrics on a web dashboard.",
    image: '/medic.png',
    githubLink: "https://github.com/SUMMERxKx/medical-device-monitor",
  },
  { 
    name: "Cohere Chatbot", 
    category: "Social",
    description: "A Cohere-themed chatbot built with React and integrated with the Gemini API, providing users with seamless answers.",
    image: '/cohera.png',
    githubLink: "https://github.com/SUMMERxKx/cohere",
    demoLink: "https://cohere-two.vercel.app/"
  },
  { 
    name: "Portfolio", 
    category: "Social",
    description: "A personal portfolio built with React and Next.js, showcasing projects and skills in a modern, responsive design.",
    image: '/port.png',
    githubLink: "https://github.com/SUMMERxKx/Portfolio"
  },
  { 
    name: "Real Estate ML Model", 
    category: "Financial",
    description: "A machine learning model built to predict real estate prices based on attributes like crime rate, property tax, and room count.",
    image: '/ml.png',
    githubLink: "https://github.com/SUMMERxKx/Dragon-Estate-ML"
  },
  { 
    name: "Silver Spoon", 
    category: "Restaurant",
    description: "A responsive restaurant website built with HTML, CSS, and JavaScript, showcasing a fictional restaurant.",
    image: '/silver.png',
    githubLink: "https://github.com/SUMMERxKx/Silver-Spoon",
    demoLink: "https://summerxkx.github.io/Silver-Spoon/"
  },
  { 
    name: "Plagiarism Form", 
    category: "Tool",
    description: "A C# and Python-based application that streamlines the submission of ED-05 plagiarism forms.",
    image: '/plag.png',
    githubLink: "https://github.com/SUMMERxKx/Plagiarism-Form"
  },
  { 
    name: "Currency Changer", 
    category: "Tool",
    description: "A simple application that converts amounts between different currencies using real-time exchange rates.",
    image: '/curr.png',
    githubLink: "https://github.com/SUMMERxKx/Currency-Changer"
  }
];

const Projects = () => (
  <section id="projects" className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-6xl font-bold mb-12 text-yellow-400 space-y-8 max-w-4xl mx-auto">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectData.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8">
    <h2 className="text-6xl font-bold mb-12 text-yellow-400 space-y-8 max-w-4xl mx-auto">Contact</h2>
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
        <p>I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
        
        {/* Email and Phone */}
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
          <span>Kamloops, BC, Canada</span>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center space-x-6 mt-6">
          <a href="https://www.linkedin.com/in/samar-khajuria-b70591264/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="text-yellow-400 hover:text-yellow-500 transition duration-300" size={32} />
          </a>
          <a href="https://www.instagram.com/summerrrr28/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="text-yellow-400 hover:text-yellow-500 transition duration-300" size={32} />
          </a>
          <a href="https://github.com/SUMMERxKx" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-yellow-400 hover:text-yellow-500 transition duration-300" size={32} />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <>
    <div className="h-px accent-bg w-full"></div>
    <footer className="p-4 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <p>&copy; 2024 Samar. All rights reserved.</p>
    </footer>
  </>
);


const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function Home() {
  useEffect(() => {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      if (href) {
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener('click', handleScroll as unknown as EventListener));

    return () => {
      links.forEach(link => link.removeEventListener('click', handleScroll as unknown as EventListener));
    };
  }, []);


  return (
    <ThemeProvider>
      <div className="transition-colors duration-300">
        <NavBar />
        <Overview />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
