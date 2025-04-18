"use client"
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import 'devicon/devicon.min.css';
import * as THREE from 'three';



// Interfaces
interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
}

interface Skill {
  name: string;
  iconClass: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
}

interface Experience {
  position: string;
  company: string;
  period: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  
  // Refs for canvas animations
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeCanvasRef = useRef<HTMLDivElement | null>(null);
  
  // Section refs for scroll navigation
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  // Skills data
  const skills: Skill[] = [
    { name: 'React', iconClass: 'devicon-react-original colored' },
    { name: 'Next.js', iconClass: 'devicon-nextjs-plain' },
    { name: 'TypeScript', iconClass: 'devicon-typescript-plain colored' },
    { name: 'Node.js', iconClass: 'devicon-nodejs-plain colored' },
    { name: 'Tailwind', iconClass: 'devicon-tailwindcss-plain colored' },
    { name: 'MongoDB', iconClass: 'devicon-mongodb-plain colored' },
    { name: 'JavaScript', iconClass: 'devicon-javascript-plain colored' },
    { name: 'HTML5', iconClass: 'devicon-html5-plain colored' },
    { name: 'CSS3', iconClass: 'devicon-css3-plain colored' },
    { name: 'Git', iconClass: 'devicon-git-plain colored' },
    { name: 'C#', iconClass: 'devicon-csharp-line colored' },
    { name: 'Python', iconClass: 'devicon-python-plain colored' },
    { name: 'C++', iconClass: 'devicon-cplusplus-plain colored' }
  ];

  // Projects data
  const projects: Project[] = [
    {
      id: 1,
      title: 'AI Enhanced Fitness and Nutrition App',
      description: 'A web app that uses AI to provide personalized fitness and nutrition plans.',
      image: "/project1.webp",
      tech: ['TensorFlow', 'React', 'Node.js', 'Python'],
      link: 'https://github.com/prathyushaa5/MajorProject_.git'
    },
    {
      id: 2,
      title: 'StockWise Trading Platform',
      description: 'Stock trading platform for selling and buying stocks',
      image: '/project2.jpg',
      tech: ['C#', 'ASP.NET', 'React', 'Redux', 'TypeScript'],
      link: 'https://github.com/prathyushaa5/StockWise.git'
    },
    {
      id: 3,
      title: 'BookBridge',
      description: 'A platform for users to buy and sell books with requests sent.',
      image: '/project3.jpg',
      tech: ['MERN', 'Firebase'],
      link: 'https://github.com/prathyushaa5/Book-Store.git'
    },
    {
      id: 4,
      title: 'MemoirIt',
      description: 'A personal blog platform for sharing thoughts and experiences.',
      image: '/project4.avif',
      tech: ['MERN'],
      link: 'https://github.com/prathyushaa5/MemoirIt.git'
    }
  ];

  // Experience data
  const experiences: Experience[] = [
    { position: 'FullStack Intern', company: 'SafeSend Technologies', period: 'Feb 2025 - Present' },
    { position: 'Web Development Intern', company: 'Zephyr Technologies', period: 'Sep 2023 - Nov 2023' }
  ];

  // Education data
  const education: Education[] = [
    {
      degree: "Bachelor Of Engineering in Computer Science",
      institution: "St Joseph Engineering College",
      period: "2021 - 2024",
      description: "Pursuing a degree in Computer Science with a focus on software development and web technologies."
    },
    {
      degree: "Pre University",
      institution: "Govinda Dasa Pre University College",
      period: "2019 - 2021",
      description: "Completed Pre-University education with a focus on Physics, Chemistry, Mathematics, Computer Science."
    },
    {
      degree: "Senior Secondary Schooling",
      institution: "Delhi Public School",
      period: "2007 - 2019",
      description: "Completed schooling with a strong foundation in Mathematics and Science."
    }
  ];

  // Resume download handler
  const handleResumeDownload = () => {
    const resumeUrl = "/Resume.pdf";
    
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Prathyusha_Acharya_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigation handler with smooth scrolling
  const navigateTo = (section: string) => {
    setActiveSection(section);
    setMenuOpen(false);
    
    let ref;
    switch(section) {
      case 'home': ref = homeRef; break;
      case 'about': ref = aboutRef; break;
      case 'projects': ref = projectsRef; break;
      case 'contact': ref = contactRef; break;
      default: ref = homeRef;
    }
    
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll for section detection
  useEffect(() => {
    const handleScroll = (): void => {
      setScrollPosition(window.scrollY);
      
      // Update active section based on scroll position
      const sections = [
        { id: 'home', ref: homeRef },
        { id: 'about', ref: aboutRef },
        { id: 'projects', ref: projectsRef },
        { id: 'contact', ref: contactRef }
      ];
      
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Canvas animation effect (2D particles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 100;
    
    // Set canvas dimensions
    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create particles with smaller radius
    const createParticles = (): void => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 0.1 + 0.1,
          color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1
        });
      }
    };
    
    // Animation loop with improved scrolling response
    const animate = (): void => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Use a very small scroll influence factor to minimize jerky movement
      const scrollInfluence = scrollPosition * 0.000001;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Move particle with minimal scroll influence
        p.x += p.speedX + (scrollInfluence * p.x * 0.01);
        p.y += p.speedY;
        
        // Wrap particles around the screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Connect particles that are close to each other
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 50, 255, ${0.1 * (1 - distance / 80)})`;
            ctx.lineWidth = 0.3;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scrollPosition]);
  
  // 3D Background using Three.js
  useEffect(() => {
    if (!threeCanvasRef.current) return;
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Clear any previous canvases
    while (threeCanvasRef.current.firstChild) {
      threeCanvasRef.current.removeChild(threeCanvasRef.current.firstChild);
    }
    
    threeCanvasRef.current.appendChild(renderer.domElement);
    
    // Create a geometry for the 3D background
    const geometry = new THREE.IcosahedronGeometry(10, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x8A2BE2,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Add small light points around the sphere
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 1000;
    const positions = new Float32Array(pointsCount * 3);
    
    for (let i = 0; i < pointsCount; i++) {
      const radius = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xAA88FF,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
    
    camera.position.z = 20;
    
    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;
      
      points.rotation.x += 0.0005;
      points.rotation.y += 0.001;
      
      // Make the rotation responsive to scrolling
      const scrollFactor = scrollPosition * 0.0005;
      sphere.rotation.x = scrollFactor;
      sphere.rotation.y = scrollFactor * 0.5;
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
    };
  }, [scrollPosition]);

  const navItems: string[] = ['home', 'about', 'projects', 'contact'];

  return (
    <div className="text-white min-h-screen overflow-x-hidden relative bg-black m-4">
      {/* Black background */}
      <div className="fixed inset-0 z-0 bg-black" />
      
      {/* 3D background */}
      <div ref={threeCanvasRef} className="fixed inset-0 z-0" />
      
      {/* Canvas background animation */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-5" 
        style={{ 
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Header */}
      <header className="fixed w-full z-50 backdrop-blur-sm bg-black/90">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold relative overflow-hidden">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            <img 
  src="https://img.icons8.com/?size=100&id=JfInOjtNIBYp&format=png&color=FFFFFF"
  alt="Logo" 
  className="w-8 h-8 object-cover"
/>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => navigateTo(item)}
                className={`uppercase text-sm tracking-wider hover:text-purple-400 transition-colors ${
                  activeSection === item ? 'text-purple-400 font-bold' : 'text-gray-300'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden absolute w-full bg-black py-4">
            <div className="flex flex-col space-y-4 px-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => navigateTo(item)}
                  className={`uppercase text-sm tracking-wider hover:text-purple-400 transition-colors ${
                    activeSection === item ? 'text-purple-400 font-bold' : 'text-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Home Section */}
        <section 
          ref={homeRef} 
          id="home" 
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20"
        >
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Hi, I'm Prathyusha
            </h1>
            <div className="absolute -inset-1 blur-lg opacity-30 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg"></div>
          </div>
          <h2 className="text-xl md:text-xl mb-6 text-gray-300">
            Crafting digital experiences that push boundaries
          </h2>
          <div className="flex space-x-4">
            <button 
              className="border border-white hover:border-purple-400 hover:text-purple-400 px-6 py-2 rounded-lg transition-all hover:scale-105"
              onClick={() => navigateTo('projects')}
            >
              <span>View Projects</span>
            </button>
            <button 
              className="border border-white hover:border-purple-400 hover:text-purple-400 px-6 py-2 rounded-lg transition-all hover:scale-105"
              onClick={() => navigateTo('contact')}
            >
              Contact Me
            </button>
            <button
              onClick={handleResumeDownload}
              className="border border-white hover:border-purple-400 hover:text-purple-400 px-8 py-2 rounded-lg transition-all hover:scale-105"
            >
              Resume
            </button>
          </div>
        </section>

        {/* About Section */}
        <section 
          ref={aboutRef} 
          id="about" 
          className="min-h-screen py-24 px-6 flex items-center"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              About Me
            </h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left - Profile Picture */}
              <div className="flex justify-center">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 shadow-xl">
                <img
        src="/myphoto.jpg"
        alt="Profile Photo"
        className="w-full h-full object-cover"
      />
                </div>
              </div>
              
              {/* Right - Content */}
              <div className="text-gray-300 space-y-6">
                <p className="text-lg leading-relaxed">
                  Hey! I'm <span className="text-purple-400 font-semibold">Prathyusha</span>, a 20-year-old engineering student from Mangaluru, Karnataka. Currently, I am in my fourth year of studying Computer Science at St. Joseph Engineering College, Mangalore. Passionate about technology and problem-solving, I am eager to continue expanding my knowledge and skills in the field of computer science.
                </p>
                
                {/* Experience Timeline */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-8">
                  <h4 className="text-white font-semibold mb-3">Experience</h4>
                  <div className="space-y-2">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative pl-8 pb-3">
                         <div className="absolute left-0 top-1 h-full w-0.5 bg-purple-500"></div>
                         <div className="absolute left-[-4] top-5 w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                        <h5 className="text-white font-medium">{exp.position}</h5>
                        <p className="text-sm text-gray-400">{exp.company} • {exp.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Education Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8 text-white">Education</h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {education.map((edu, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-900 border border-gray-800 rounded-lg p-6 transition-all hover:shadow-lg hover:border-purple-500"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500 bg-opacity-20">
                          {/* Placeholder icon */}
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 19v-5" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                        <h5 className="text-purple-400 font-medium">{edu.institution}</h5>
                        <p className="text-sm text-gray-400 mt-1">{edu.period}</p>
                        <p className="text-gray-300 mt-2">{edu.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="mt-16">
              <h3 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Skills & Technologies
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-lg py-4 flex flex-col items-center transition-all hover:scale-105 border border-gray-800"
                  >
                    <i className={`text-4xl ${skill.iconClass}`}></i>
                    <span className="text-sm font-medium mt-2">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section 
          ref={projectsRef} 
          id="projects" 
          className="min-h-screen py-20 px-4 flex items-center"
        >
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-800"
                >
                  <div 
                    className="h-48 bg-gray-800 relative flex items-center justify-center" 
                    onClick={() => window.open(project.link, '_blank')}
                  >
                   <img src={project.image} alt={`Project ${project.title}`} className="w-full h-full object-cover opacity-60" />

                    <div className="absolute inset-0 bg-purple-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button className="bg-black/50 p-2 rounded-full">
                        <ExternalLink size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, index) => (
                        <span key={index} className="bg-gray-800 px-2 py-1 text-xs rounded">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section 
          ref={contactRef} 
          id="contact" 
          className="min-h-screen py-20 px-4 flex items-center"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Les Connect
              </h2>
            </div>
            
            {/* Main content with glass-like effect */}
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Left side - Contact Info */}
                <div className="md:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
                    <p className="text-gray-300 mb-8">
                      Feel free to reach out for opportunities or just to say hello!
                    </p>
                    
                    <div className="space-y-6">
                      <a href="mailto:prathyushaacharya050@gmail.com" className="flex items-center group">
                        <div className="w-10 h-10 rounded-full bg-purple-800/30 flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors">
                          <Mail size={20} className="text-purple-400 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white group-hover:text-purple-400 transition-colors">prathyushaacharya050@gmail.com</p>
                        </div>
                      </a>
                      
                      <a href="https://github.com/prathyushaa5" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                        <div className="w-10 h-10 rounded-full bg-purple-800/30 flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors">
                          <Github size={20} className="text-purple-400 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                  <p className="text-sm text-gray-400">GitHub</p>
                  {/* <p className="text-white group-hover:text-purple-400 transition-colors">github.com/yourusername</p> */}
                </div>
              </a>
              
              <a href="https://linkedin.com/in/prathyusha-acharya/" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-purple-800/30 flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors">
                  <Linkedin size={20} className="text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">LinkedIn</p>
                  {/* <p className="text-white group-hover:text-purple-400 transition-colors"></p> */}
                </div>
              </a>
            </div>
          </div>
          
          <div className="hidden md:block mt-12 pt-8 border-t border-gray-700/50">
            <p className="text-gray-400 text-sm">
              Current location: <span className="text-white">Mangaluru,Karnataka</span>
            </p>
          </div>
        </div>
        
        {/* Right side - Contact Form */}
        <div className="md:col-span-3 p-8">
          <h3 className="text-2xl font-bold mb-6 text-white">Send me a message</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-800/70 rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all placeholder-gray-500" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-800/70 rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all placeholder-gray-500" 
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
              <textarea 
                rows={5} 
                className="w-full bg-gray-800/70 rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all placeholder-gray-500" 
                placeholder="message"
              />
            </div>
            
           
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all hover:shadow-lg hover:shadow-purple-500/20 focus:ring-2 focus:ring-purple-500/50 outline-none group"
            >
              <span className="flex items-center justify-center">
                Send Message
                <svg 
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
    
    {/* Additional Info */}
   
  </div>
</section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 relative z-10">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Prathyusha Acharya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}