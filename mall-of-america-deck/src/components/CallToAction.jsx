import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const CallToAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [selectedInterest, setSelectedInterest] = useState('')

  const interests = [
    { value: 'retail', label: 'Retail Leasing', icon: '🏪', color: 'moa-blue' },
    { value: 'luxury', label: 'Luxury Spaces', icon: '💎', color: 'moa-gold' },
    { value: 'dining', label: 'F&B Opportunities', icon: '🍽️', color: 'moa-red' },
    { value: 'events', label: 'Event Booking', icon: '🎪', color: 'moa-blue' },
    { value: 'sponsorship', label: 'Sponsorship', icon: '🤝', color: 'moa-gold' },
    { value: 'other', label: 'General Inquiry', icon: '💬', color: 'moa-red' },
  ]

  const contactInfo = [
    { label: 'Leasing', phone: '(952) 883-8800', email: 'leasing@mallofamerica.com' },
    { label: 'Events', phone: '(952) 883-8800', email: 'events@mallofamerica.com' },
    { label: 'Sponsorship', phone: '(952) 883-8800', email: 'partnerships@mallofamerica.com' },
  ]

  return (
    <section id="cta" className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Let's </span>
            <span className="bg-gradient-to-r from-moa-blue via-moa-red to-moa-gold bg-clip-text text-transparent">
              Make It Happen
            </span>
          </h2>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
            Join the world's most successful brands at America's premier destination.
          </p>
        </motion.div>

        {/* Interest Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            I'm Interested In
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {interests.map((interest, index) => (
              <motion.button
                key={interest.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedInterest(interest.value)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedInterest === interest.value
                    ? `border-${interest.color} bg-${interest.color}/20`
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="text-4xl mb-3">{interest.icon}</div>
                <div className="text-white font-semibold">{interest.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border border-gray-800 mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <h4 className="text-xl font-bold text-white mb-4">{contact.label}</h4>
                <div className="space-y-2">
                  <div className="text-moa-blue font-semibold">{contact.phone}</div>
                  <div className="text-gray-400 text-sm">{contact.email}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(227, 24, 55, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-moa-red text-white rounded-full font-bold text-lg shadow-lg"
            >
              Schedule a Tour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 61, 165, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-moa-blue text-white rounded-full font-bold text-lg shadow-lg"
            >
              Request Information
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border-2 border-white/20"
            >
              Download Brochure
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats Reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: '5.6M', label: 'Square Feet' },
            { value: '40M+', label: 'Annual Visitors' },
            { value: '520+', label: 'Stores' },
            { value: '#1', label: 'Midwest Destination' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.5 + index * 0.1 }}
              className="text-center bg-gray-900/50 p-6 rounded-xl border border-gray-800"
            >
              <div className="text-4xl font-bold text-moa-gold mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
          className="text-center border-t border-gray-800 pt-12"
        >
          <div className="flex items-center justify-center space-x-2 text-3xl font-bold mb-4">
            <span className="text-white">MALL</span>
            <span className="text-moa-blue">OF</span>
            <span className="text-moa-red">AMERICA</span>
          </div>
          <p className="text-gray-500 mb-6">
            60 East Broadway, Bloomington, MN 55425
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Visit</a>
            <a href="#" className="hover:text-white transition-colors">News</a>
            <a href="#" className="hover:text-white transition-colors">Careers</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-8 text-gray-600 text-sm">
            © {new Date().getFullYear()} Mall of America. All rights reserved.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
