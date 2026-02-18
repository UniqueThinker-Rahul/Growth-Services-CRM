import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

// --- Data Constants (Types are inferred automatically) ---
const servicesData = [
  {
    icon: "language",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    title: "Web Development",
    features: ["Custom Website Design", "E-commerce Solutions", "Responsive Development", "Website Maintenance"]
  },
  {
    icon: "campaign",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    title: "Digital Marketing",
    features: ["SEO Optimization", "Social Media Marketing", "Content Strategy", "PPC Campaigns"]
  },
  {
    icon: "palette",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    title: "Branding",
    features: ["Logo & Identity", "Brand Strategy", "Graphic Design", "Marketing Materials"]
  },
  {
    icon: "query_stats",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    title: "Business Solutions",
    features: ["Lead Generation", "CRM Setup", "Analytics & Reporting", "Consultation"]
  }
];

const processData = [
  { step: "01", icon: "search", color: "bg-blue-500", title: "Discovery", desc: "We understand your business goals and target audience." },
  { step: "02", icon: "assignment", color: "bg-orange-500", title: "Strategy", desc: "Create a customized plan with clear objectives and timeline." },
  { step: "03", icon: "rocket_launch", color: "bg-red-500", title: "Execution", desc: "Our expert team implements the approved strategy." },
  { step: "04", icon: "trending_up", color: "bg-green-500", title: "Optimization", desc: "Continuous monitoring and improvement for best results." },
];

const Website: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className={`font-body bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen`}>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 text-xs font-medium bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsContactModalOpen(true)} className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[16px]">call</span> Book a Call
          </button>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 cursor-help" title="We are a full-service digital agency">
            <span className="material-symbols-outlined text-[16px]">info</span> About Us
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="flex items-center gap-1 text-primary font-bold hover:underline cursor-pointer">
            <span className="material-symbols-outlined text-[16px] fill-current">login</span> CLIENT LOGIN
          </Link>
          <div className="flex space-x-2 text-slate-400 dark:text-slate-500">
            <i className="fab fa-facebook hover:text-primary cursor-pointer transition-colors"></i>
            <i className="fab fa-twitter hover:text-primary cursor-pointer transition-colors"></i>
            <i className="fab fa-instagram hover:text-primary cursor-pointer transition-colors"></i>
            <i className="fab fa-linkedin hover:text-primary cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-glow">GS</div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">GrowthService</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Digital Growth Partner</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
              <button onClick={() => scrollToSection('services')} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Services</button>
              <button onClick={() => scrollToSection('process')} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Process</button>
              <button onClick={() => scrollToSection('clients')} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Clients</button>
              <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Login</Link>
              <button onClick={() => setIsContactModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-glow hover:opacity-90 transition-all transform hover:-translate-y-0.5">Free Audit</button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                {isDarkMode ? <span className="material-symbols-outlined">light_mode</span> : <span className="material-symbols-outlined">dark_mode</span>}
              </button>
            </div>
             <div className="lg:hidden flex items-center">
              <button onClick={toggleMobileMenu} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none">
                <span className="material-symbols-outlined text-3xl">menu</span>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {['Services', 'Process', 'Clients'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">{item}</button>
              ))}
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Employee Login</Link>
              <div className="mt-4 flex items-center justify-between px-3">
                 <button onClick={() => { setIsContactModalOpen(true); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full text-sm font-medium">Free Audit</button>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">{isDarkMode ? "Switch to Light" : "Switch to Dark"}</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative bg-hero-bg dark:bg-slate-950 overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-semibold tracking-wider text-purple-300 mb-6 backdrop-blur-sm">GROW YOUR BUSINESS TODAY</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Transform Your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">Digital Presence</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 font-light">Professional Web & Marketing Solutions. Custom websites, SEO optimization, and social media strategies to grow your business online.</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setIsContactModalOpen(true)} className="px-8 py-4 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg shadow-lg hover:shadow-glow hover:scale-105 transition-all duration-300">Start Your Project</button>
            <button onClick={() => setIsContactModalOpen(true)} className="px-8 py-4 rounded-lg border border-slate-600 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"><span className="material-symbols-outlined">calendar_month</span> Schedule Consultation</button>
          </div>
          <div className="mt-12 flex justify-center gap-2">
            <div className="w-8 h-1.5 bg-white rounded-full"></div>
            <div className="w-2 h-1.5 bg-slate-600 rounded-full"></div>
            <div className="w-2 h-1.5 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our <span className="text-primary">Services</span></h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive digital solutions tailored to your business needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((service, index) => (
              <div key={index} className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-soft dark:shadow-none dark:border dark:border-slate-700 hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.bgColor} ${service.color}`}>
                  <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-500 text-xs">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our <span className="text-primary">Process</span></h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">A structured approach to ensure successful project delivery</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-slate-200 via-primary/50 to-slate-200 dark:from-slate-700 dark:via-primary/50 dark:to-slate-700 z-0"></div>
            {processData.map((proc, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 shadow-md flex items-center justify-center mb-6 relative">
                  <span className={`material-symbols-outlined text-4xl ${proc.color.replace('bg-', 'text-')}`}>{proc.icon}</span>
                  <div className={`absolute -top-2 ${proc.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>{proc.step}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{proc.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">{proc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our <span className="text-primary">Technology</span> Stack</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Modern tools and technologies for cutting-edge solutions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-80 dark:opacity-70">
            {[{ icon: "fab fa-react", color: "text-blue-400", name: "React.js" }, { icon: "fab fa-node-js", color: "text-green-500", name: "Node.js" }, { icon: "fas fa-database", color: "text-green-700", name: "MongoDB" }, { custom: "N", color: "bg-black dark:bg-white text-white dark:text-black", name: "Next.js" }, { icon: "fab fa-css3-alt", color: "text-cyan-500", name: "Tailwind" }, { icon: "fab fa-js", color: "text-yellow-400", name: "TypeScript" }, { icon: "fas fa-server", color: "text-slate-500", name: "Express" }, { icon: "fas fa-project-diagram", color: "text-pink-600", name: "GraphQL" }].map((tech, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                {tech.custom ? ( <div className={`w-10 h-10 ${tech.color} rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform`}>{tech.custom}</div> ) : ( <i className={`${tech.icon} text-4xl ${tech.color} group-hover:scale-110 transition-transform`}></i> )}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Clients Grid */}
      <section id="clients" className="py-16 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our <span className="text-primary">Trusted Clients</span></h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Successfully served businesses across various industries</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[{ icon: "fas fa-shopping-cart", color: "text-blue-500", name: "Fragsook", type: "E-commerce" }, { icon: "fas fa-bullhorn", color: "text-orange-500", name: "Digimarcy", type: "Digital Marketing" }, { icon: "fas fa-praying-hands", color: "text-purple-500", name: "Pujhelp.in", type: "Religious Services" }, { icon: "fas fa-hotel", color: "text-yellow-600", name: "Radhikasedan", type: "Hospitality" }, { icon: "fas fa-globe", color: "text-blue-400", name: "360Egaleweb", type: "Web Development" }, { icon: "fas fa-rocket", color: "text-red-500", name: "Dizigrow", type: "Digital Agency" }, { icon: "fas fa-hard-hat", color: "text-yellow-500", name: "Ceclift", type: "Construction" }, { icon: "fas fa-laptop-code", color: "text-slate-700 dark:text-slate-300", name: "TechCorp", type: "Technology" }].map((client, idx) => (
                    <div key={idx} className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all">
                        <i className={`${client.icon} text-2xl ${client.color}`}></i>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{client.name}</span>
                        <span className="text-[10px] text-slate-400">{client.type}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- RESTORED SECTIONS START HERE --- */}

      {/* What We Offer */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">What We <span className="text-secondary">Offer</span></h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive digital services for your business growth</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Website Development", desc: "Custom websites built with modern technologies for optimal performance and user experience.", items: ["Mobile-First Design", "Fast Loading", "SEO Optimized", "Easy CMS"] },
              { title: "SEO Services", desc: "Improve search rankings with comprehensive on-page and off-page optimization strategies.", items: ["Keyword Research", "Technical SEO", "Content Creation", "Performance Tracking"] },
              { title: "Social Media Management", desc: "Complete social media strategy and management to build your brand presence.", items: ["Content Planning", "Community Management", "Campaign Analysis", "Growth Strategy"] },
              { title: "E-commerce Solutions", desc: "Complete online store setup with payment integration and inventory management.", items: ["Secure Payments", "Product Management", "Order Processing", "Analytics Dashboard"] },
              { title: "Content Marketing", desc: "Strategic content creation to engage your audience and drive conversions.", items: ["Blog Writing", "Video Content", "Infographics", "Content Strategy"] },
              { title: "Email Marketing", desc: "Targeted email campaigns to nurture leads and retain customers.", items: ["Automation", "Segmentation", "Analytics", "Template Design"] },
            ].map((offer, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-slate-700 rounded-xl p-8 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{offer.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{offer.desc}</p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {offer.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-[#1a103c] to-[#311b92] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Why Choose <span className="text-blue-300">Us</span></h2>
          <p className="text-slate-300 mb-12">We combine expertise with dedication to deliver exceptional results</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
                { icon: "fas fa-users", grad: "from-yellow-400 to-orange-500", title: "Expert Team", desc: "Certified professionals with years of industry experience" },
                { icon: "fas fa-bolt", grad: "from-yellow-400 to-yellow-600", title: "Fast Delivery", desc: "Quick turnaround without compromising on quality" },
                { icon: "fas fa-bullseye", grad: "from-red-400 to-red-600", title: "Custom Solutions", desc: "Tailored strategies for your unique business needs" },
                { icon: "fas fa-headset", grad: "from-green-400 to-blue-500", title: "Ongoing Support", desc: "Continuous support and maintenance services" },
             ].map((why, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${why.grad} rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-lg`}>
                        <i className={`${why.icon} text-white`}></i>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{why.title}</h3>
                    <p className="text-sm text-slate-200">{why.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Client <span className="text-primary">Testimonials</span></h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12">Hear what our clients say about working with us</p>
          <div className="bg-white dark:bg-surface-dark p-10 rounded-2xl shadow-xl relative">
            <span className="absolute top-6 left-8 text-6xl text-slate-100 dark:text-slate-700 font-serif">"</span>
            <div className="flex justify-center mb-4">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
            </div>
            <p className="text-lg md:text-xl italic text-slate-600 dark:text-slate-300 mb-8 relative z-10">
              "Their team delivered exactly what we needed on time. Professional and highly skilled! The attention to detail and communication throughout the project was outstanding."
            </p>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Sarah Johnson</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Marketing Director</p>
              <p className="text-xs text-primary font-semibold">TechCorp Solutions</p>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Let's discuss how we can help you achieve your digital goals with a tailored strategy.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setIsContactModalOpen(true)} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold flex items-center justify-center gap-2 transition-colors">
              <i className="fab fa-whatsapp text-xl"></i> Chat on WhatsApp
            </button>
            <button onClick={() => setIsContactModalOpen(true)} className="px-8 py-3 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined">call</span> Call Us Now
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="text-red-500">📍</span> Pan India Service</span>
            <span className="flex items-center gap-1"><span className="text-orange-500">🕒</span> 24/7 Support</span>
            <span className="flex items-center gap-1"><span className="text-blue-500">🗓️</span> 10+ Years Experience</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1438] dark:bg-[#0b0f19] text-slate-300 py-16 text-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* About */}
            <div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">verified_user</span> ABOUT COMPANY
                </h4>
                <ul className="space-y-2">
                    {['About Growth Service', 'Our Team', 'Careers', 'Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Client Success Stories'].map(item => (
                        <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>
            {/* Solutions */}
            <div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">edit_note</span> DIGITAL SOLUTIONS
                </h4>
                <ul className="space-y-2">
                    {['Digital Marketing', 'Social Media Management', 'SEO Services', 'Meta Ads Management', 'Google Business Profile', 'Website Development', 'Brand Strategy', 'E-commerce Solutions'].map(item => (
                        <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>
            {/* Resources */}
            <div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-400">layers</span> RESOURCES
                </h4>
                <ul className="space-y-2">
                    {['Blog & Articles', 'Case Studies', 'Free Digital Audit', 'Digital Marketing Guides', 'Video Tutorials', 'Webinars', 'Help Center', 'FAQs'].map(item => (
                        <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>
            {/* Head Office */}
            <div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400">location_on</span> HEAD OFFICE
                </h4>
                <address className="not-italic text-slate-400 space-y-4">
                    <p>Radhika Sadan,<br/>Pushpa Garden<br/>Kailash Nagar, Vrindavan<br/>Uttar Pradesh 281121</p>
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">call</span> +91 93414 36937 (India)</p>
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">call</span> +977 9757362481 (WhatsApp)</p>
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">mail</span> info@growthservice...</p>
                </address>
                <div className="mt-4 text-xs">
                    <p className="font-bold text-white">Business Hours:</p>
                    <p>Mon-Sat: 10:00 AM - 7:00 PM</p>
                    <p>Sunday: 10:00 AM - 3:00 PM</p>
                </div>
            </div>
            {/* Quick Connect */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-400">bolt</span> QUICK CONNECT
                </h4>
                <p className="text-xs mb-4">Ready to grow your business with digital solutions? Get in touch with us today for a <span className="text-yellow-400 font-bold underline">FREE consultation!</span></p>
                <div className="space-y-3">
                    <button onClick={() => setIsContactModalOpen(true)} className="block w-full text-center py-2 rounded bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs hover:opacity-90">📅 Book Free Call</button>
                    <button onClick={() => setIsContactModalOpen(true)} className="block w-full text-center py-2 rounded bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700">📝 Contact Form</button>
                    <button onClick={() => setIsContactModalOpen(true)} className="block w-full text-center py-2 rounded border border-yellow-500 text-yellow-400 font-bold text-xs hover:bg-yellow-500/10">🕵️ Free Website Audit</button>
                </div>
                <div className="mt-6">
                    <p className="text-xs mb-2 font-semibold">Follow Our Journey</p>
                    <div className="flex gap-2">
                        {['facebook-f', 'instagram', 'linkedin-in', 'youtube'].map(icon => (
                            <a key={icon} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <i className={`fab fa-${icon} text-xs text-white`}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2024 <span className="text-white font-bold">Growth Service</span>. Your Trusted Digital Growth Partner.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Refund Policy</a>
                <a href="#" className="hover:text-white">Sitemap</a>
            </div>
        </div>
      </footer>

      {/* Floating Whatsapp */}
      <a href="#" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-bounce">
        <i className="fab fa-whatsapp text-white text-3xl"></i>
      </a>

    </div>
  );
};

export default Website;