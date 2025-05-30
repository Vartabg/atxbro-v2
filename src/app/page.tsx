import VetNav from "@/components/VetNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">ATX Bro</h1>
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="text-white hover:text-blue-200 transition-colors">Home</a>
            <a href="#services" className="text-white hover:text-blue-200 transition-colors">Services</a>
            <a href="#vetnav" className="text-white hover:text-blue-200 transition-colors">VetNav</a>
            <a href="#about" className="text-white hover:text-blue-200 transition-colors">About</a>
            <a href="#contact" className="text-white hover:text-blue-200 transition-colors">Contact</a>
          </div>
          <button className="md:hidden text-white text-xl">☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            ATX Bro Digital Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Modern web development for Austin businesses
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
              Get Started
            </button>
            <button className="bg-blue-600/80 backdrop-blur-md text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300">
              View Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/30 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Web Development</h3>
              <p className="text-blue-100">Modern, responsive websites built with the latest technologies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500/30 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Mobile Apps</h3>
              <p className="text-blue-100">Cross-platform mobile applications for iOS and Android</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/30 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Digital Strategy</h3>
              <p className="text-blue-100">Comprehensive digital transformation consulting</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6 text-white">About ATX Bro</h2>
            <p className="text-xl text-blue-100 mb-8">
              We're Austin-based digital solution specialists committed to helping businesses thrive in the digital age.
            </p>
            <p className="text-blue-100">
              From startups to established enterprises, we bring modern web technologies and veteran expertise to every project.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-4xl font-bold text-center mb-8 text-white">Contact Us</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2 font-medium">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white mb-2 font-medium">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-white mb-2 font-medium">Message</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" 
                  placeholder="Tell us about your project..."
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600/80 backdrop-blur-md text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <VetNav />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center text-blue-200">
          <p>&copy; 2025 ATX Bro Digital Solutions. Made with ❤️ in Austin, TX</p>
        </div>
      </footer>
    </div>
  );
}
