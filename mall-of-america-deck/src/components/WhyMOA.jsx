import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const WhyMOA = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const reasons = [
    {
      icon: '📍',
      title: 'Prime Location',
      description: 'Situated in the heart of the Minneapolis-St. Paul metropolitan area, accessible to 3.6M residents within a 30-minute drive.',
      stat: '3.6M',
      statLabel: 'Metro Population'
    },
    {
      icon: '✈️',
      title: 'Unmatched Access',
      description: '5 minutes from Minneapolis-St. Paul International Airport. Direct access via light rail. Over 11,000 parking spaces.',
      stat: '5 min',
      statLabel: 'From MSP Airport'
    },
    {
      icon: '💰',
      title: 'Affluent Demographics',
      description: 'Average household income of $95,000+ within primary trade area. High discretionary spending power.',
      stat: '$95K+',
      statLabel: 'Avg Household Income'
    },
    {
      icon: '🌍',
      title: 'Tourist Magnet',
      description: '#1 tourist destination in the Midwest. Attracts visitors from all 50 states and 120+ countries annually.',
      stat: '120+',
      statLabel: 'Countries Represented'
    },
    {
      icon: '📊',
      title: 'Proven Performance',
      description: 'Consistently high sales per square foot. Strong tenant retention. Best-in-class operational standards.',
      stat: '$500+',
      statLabel: 'Sales PSF'
    },
    {
      icon: '🎯',
      title: 'Captive Audience',
      description: 'Average dwell time of 3+ hours. Multiple reasons to visit beyond retail. Year-round traffic drivers.',
      stat: '3+ hrs',
      statLabel: 'Avg Dwell Time'
    },
  ]

  return (
    <section id="why-moa" className="relative py-32 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Why </span>
            <span className="bg-gradient-to-r from-moa-blue to-moa-red bg-clip-text text-transparent">
              Mall of America
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            More than a shopping center—a proven platform for retail success, 
            brand elevation, and unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-moa-blue transition-all cursor-pointer"
            >
              <div className="text-5xl mb-4">{reason.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {reason.description}
              </p>
              <div className="pt-4 border-t border-gray-700">
                <div className="text-3xl font-bold text-moa-gold mb-1">
                  {reason.stat}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {reason.statLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Map Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-br from-moa-blue/20 to-moa-red/20 rounded-3xl p-12 border border-gray-700"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">
                Strategic Regional Hub
              </h3>
              <ul className="space-y-4">
                {[
                  'Twin Cities Metro: 3.6M population',
                  'Primary Trade Area: 8M+ within 3 hours',
                  'Regional Draw: 10-state radius',
                  'International Gateway: MSP Airport connectivity',
                  'Transit Access: Blue Line Light Rail direct access',
                ].map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center text-gray-300"
                  >
                    <span className="text-moa-red mr-3 text-2xl">→</span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-8 flex items-center justify-center h-80">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-400 italic">
                  Interactive map visualization
                  <br />
                  (Integrate with actual MOA location data)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyMOA
