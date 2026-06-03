import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MediaShowcase from './MediaShowcase'

const Events = ({ onPlayVideo }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const eventTypes = [
    {
      type: 'Concerts & Live Music',
      description: 'Major artists and performances',
      icon: '🎤',
      examples: ['National touring acts', 'Local artists', 'Music festivals']
    },
    {
      type: 'Brand Activations',
      description: 'Immersive brand experiences',
      icon: '🎯',
      examples: ['Product launches', 'Pop-up shops', 'Interactive installations']
    },
    {
      type: 'Celebrity Appearances',
      description: 'Meet & greets, signings',
      icon: '⭐',
      examples: ['Athletes', 'Entertainers', 'Influencers']
    },
    {
      type: 'Fashion Shows',
      description: 'Runway events and previews',
      icon: '👗',
      examples: ['Designer showcases', 'Trend previews', 'Style events']
    },
    {
      type: 'Seasonal Celebrations',
      description: 'Holiday and special events',
      icon: '🎉',
      examples: ['Holiday celebrations', 'Summer festivals', 'Cultural events']
    },
    {
      type: 'Corporate Events',
      description: 'Business gatherings',
      icon: '💼',
      examples: ['Conferences', 'Team building', 'Product demos']
    },
  ]

  const pastEvents = [
    'Taylor Swift Meet & Greet',
    'NFL Draft Experience',
    'Nickelodeon SlimeFest',
    'Fashion Week Events',
    'Holiday Tree Lighting',
    'Super Bowl Week Activations',
  ]

  return (
    <section id="events" className="relative py-32 px-4 bg-gradient-to-b from-black via-moa-blue/10 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Events & </span>
            <span className="text-moa-blue">Platform</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            More than a venue—a global platform for brands, artists, and experiences 
            that demand attention. 40 million impressions annually.
          </p>
        </motion.div>

        {/* Hero Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <MediaShowcase
            title="Events & Activations"
            subtitle="Concerts & Brand Showreel"
            bgImage="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2500&auto=format&fit=crop"
            onPlay={() => onPlayVideo('m_hhVboXmWo')} // Live Concert at MOA
          />
        </motion.div>

        {/* Event Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {eventTypes.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-moa-blue transition-all"
            >
              <div className="text-5xl mb-4">{event.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {event.type}
              </h3>
              <p className="text-gray-400 mb-4">
                {event.description}
              </p>
              <ul className="space-y-2">
                {event.examples.map((example, i) => (
                  <li key={i} className="text-sm text-gray-500 flex items-center">
                    <span className="text-moa-blue mr-2">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* The Numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-moa-blue/20 to-purple-900/20 rounded-3xl p-12 border border-gray-700 mb-20"
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Event Platform Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Annual Events' },
              { value: '40M', label: 'Event Impressions' },
              { value: '50+', label: 'Event Spaces' },
              { value: '24/7', label: 'Event Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-moa-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Events */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Notable Past Events
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pastEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center hover:border-moa-blue transition-all"
              >
                <span className="text-gray-300 font-medium">{event}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border border-gray-800 text-center"
        >
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Activate?
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            From intimate brand experiences to large-scale productions, 
            we have the space, audience, and expertise to make your vision reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 61, 165, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-moa-blue text-white rounded-full font-semibold text-lg shadow-lg"
            >
              Book an Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border border-white/20"
            >
              View Event Calendar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Events
