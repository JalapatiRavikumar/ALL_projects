import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Venues = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const venues = [
    {
      name: 'Rotunda',
      description: 'Iconic central space perfect for large-scale brand activations',
      capacity: '5,000+',
      size: '15,000 sq ft',
      features: ['Central location', 'High visibility', '4-story atrium', 'Premium finishes'],
      icon: '🏛️'
    },
    {
      name: 'North Food Court',
      description: 'High-traffic event space with built-in audience',
      capacity: '2,000+',
      size: '8,000 sq ft',
      features: ['Adjacent dining', 'Stage capability', 'Built-in seating', 'AV ready'],
      icon: '🎭'
    },
    {
      name: 'Meeting Rooms',
      description: 'Professional spaces for corporate events and conferences',
      capacity: '50-500',
      size: 'Various',
      features: ['Meeting facilities', 'Presentation tech', 'Catering available', 'Private access'],
      icon: '💼'
    },
    {
      name: 'Pop-Up Spaces',
      description: 'Flexible locations throughout the property',
      capacity: 'Varies',
      size: '500-5,000 sq ft',
      features: ['Multiple locations', 'Flexible terms', 'Turnkey setup', 'High foot traffic'],
      icon: '🏪'
    },
  ]

  const technicalCapabilities = [
    { feature: 'Professional AV', icon: '🎵' },
    { feature: 'High-Speed WiFi', icon: '📡' },
    { feature: 'LED Displays', icon: '📺' },
    { feature: 'Lighting Systems', icon: '💡' },
    { feature: 'Stage & Rigging', icon: '🎬' },
    { feature: 'Live Streaming', icon: '📹' },
  ]

  return (
    <section id="venues" className="relative py-32 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Venue </span>
            <span className="text-moa-gold">Capabilities</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            World-class event spaces with the technical infrastructure and 
            professional support to execute any vision.
          </p>
        </motion.div>

        {/* Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {venues.map((venue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-moa-gold transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-5xl mb-4">{venue.icon}</div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {venue.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {venue.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Capacity</div>
                  <div className="text-xl font-bold text-moa-gold">{venue.capacity}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Size</div>
                  <div className="text-xl font-bold text-moa-gold">{venue.size}</div>
                </div>
              </div>

              <div className="space-y-2">
                {venue.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-gray-300 text-sm">
                    <span className="text-moa-gold mr-2">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 border border-gray-800 mb-20"
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Technical Infrastructure
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technicalCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{capability.icon}</div>
                <div className="text-gray-400 text-sm">{capability.feature}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service & Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Full-Service Event Support
            </h3>
            <div className="space-y-4">
              {[
                'Dedicated event planning team',
                'In-house AV and technical support',
                'Preferred vendor network',
                'Security and crowd management',
                'Marketing and promotional support',
                'On-site logistics coordination',
                'Post-event analytics and reporting',
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <span className="text-moa-gold mr-3 text-2xl">→</span>
                  {service}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-8 flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400">
                Venue Floor Plans & Specs
                <br />
                <span className="text-sm">(Interactive venue selector & 3D views)</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Case Studies Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
          className="bg-gradient-to-br from-moa-gold/20 to-moa-blue/20 rounded-3xl p-12 border border-gray-700"
        >
          <h3 className="text-4xl font-bold text-white text-center mb-8">
            Proven Track Record
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              { title: 'Super Bowl Week', metric: '500K+', label: 'Attendees' },
              { title: 'Fashion Events', metric: '50+', label: 'Annual Shows' },
              { title: 'Corporate Meetings', metric: '200+', label: 'Per Year' },
            ].map((caseStudy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.8 + index * 0.1 }}
                className="bg-gray-900/50 p-6 rounded-xl text-center"
              >
                <h4 className="text-xl font-bold text-white mb-3">
                  {caseStudy.title}
                </h4>
                <div className="text-4xl font-bold text-moa-gold mb-2">
                  {caseStudy.metric}
                </div>
                <div className="text-gray-400 text-sm">{caseStudy.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-moa-gold text-black rounded-full font-semibold text-lg shadow-lg"
            >
              View Full Case Studies
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Venues
