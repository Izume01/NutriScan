import { ArrowRight, Leaf, BarChart3, Globe, Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate  } from "react-router";
export default function Landing() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      {/* Header with scroll effect */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}>
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 z-20"
          >
            <Leaf className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">CarbonZero</span>
          </motion.div>

          {/* Desktop Navigation */}


          {/* Mobile Menu Toggle */}
          <div className="md:hidden z-20">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8 text-lg font-semibold z-20">

            <div className="flex items-center gap-3">
              <motion.button

                onClick={() => navigate('/login')}
                className="text-purple-400 border border-purple-500/30 hover:border-purple-500 font-semibold rounded-full px-5 py-2 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-full px-5 py-2 shadow-lg shadow-purple-700/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>

          </div>

        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`fixed inset-0 bg-gray-900/95 backdrop-blur-lg flex flex-col items-center justify-center z-10 ${isMenuOpen ? 'flex' : 'hidden'} md:hidden`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col items-center gap-8 text-xl">
            {["Features", "Benefits", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-full px-8 py-3">
              Get Started
            </button>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 md:py-40">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
            Reduce Your Carbon Footprint <span className="text-purple-500">Today</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the movement to create a sustainable future. Track, reduce, and offset your carbon emissions with our
            innovative platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg rounded-full px-8 py-6 flex items-center shadow-lg shadow-purple-700/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Reducing
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>

          </div>
        </motion.div>
        <motion.div
          className="mt-20 relative h-[400px] md:h-[800px] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50"></div>
          <img
            src={'https://wallpapercave.com/wp/wp5856474.jpg'}
            alt="Carbon reduction visualization"
            className="object-cover w-full h-full"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 py-24 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0xLjEuOS0yIDItMmgxMmMxLjEgMCAyIC45IDIgMnYxMmMwIDEuMS0uOSAyLTIgMkgzOGMtMS4xIDAtMi0uOS0yLTJWMzR6TTEyIDM0YzAtMS4xLjktMiAyLTJoMTJjMS4xIDAgMiAuOSAyIDJ2MTJjMCAxLjEtLjkgMi0yIDJIMTRjLTEuMSAwLTItLjktMi0yVjM0ek0zNCAxMmMwLTEuMS45LTIgMi0yaDEyYzEuMSAwIDIgLjkgMiAydjEyYzAgMS4xLS45IDItMiAySDM2Yy0xLjEgMC0yLS45LTItMlYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5"></div>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">How We Help You Reduce Carbon</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our platform provides powerful tools to help individuals and businesses track and reduce their carbon
              footprint.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
                title: "Carbon Tracking",
                description: "Accurately measure your carbon emissions across all aspects of your life or business with our advanced tracking tools."
              },
              {
                icon: <Globe className="h-8 w-8 text-purple-500" />,
                title: "Offset Projects",
                description: "Support verified carbon offset projects around the world that align with your values and sustainability goals."
              },
              {
                icon: <Zap className="h-8 w-8 text-purple-500" />,
                title: "Reduction Strategies",
                description: "Get personalized recommendations to reduce your carbon footprint based on your unique lifestyle or business operations."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-purple-900/30 p-3 rounded-full w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of the sections with similar enhancements */}
      {/* ... */}

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="h-8 w-8 text-purple-500" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">CarbonZero</span>
              </div>
              <p className="text-gray-400 mb-6">
                Join the movement to create a sustainable future. Track, reduce, and offset your carbon emissions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {["Features", "Benefits", "About", "Contact"].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Instagram", "GitHub"].map(social => (
                  <a key={social} href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-900/50 transition-colors">
                    <span className="sr-only">{social}</span>
                    {/* Social icons would go here */}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800/50 text-center text-gray-500">
            <p>© {new Date().getFullYear()} CarbonZero. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}