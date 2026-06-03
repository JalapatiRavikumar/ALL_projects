import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MediaShowcase from './MediaShowcase'

const Attractions = ({ onPlayVideo }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const attractions = [
    {
      name: 'Nickelodeon Universe',
      description: '7-acre indoor theme park with 20+ rides and attractions',
      icon: '🎢',
      stats: ['7 acres', '20+ rides', '4M+ annual visitors'],
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'SEA LIFE Minnesota Aquarium',
      description: '1.2M gallon aquarium with 10,000+ sea creatures',
      icon: '🐠',
      stats: ['1.2M gallons', '10K+ creatures', '300+ species'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'FlyOver America',
      description: 'Immersive flight simulation ride experience',
      icon: '✈️',
      stats: ['4D Experience', 'Virtual flight', 'State-of-the-art'],
      color: 'from-sky-500 to-blue-500'
    },
    {
      name: 'Crayola Experience',
      description: 'Interactive creative attraction for families',
      icon: '🎨',
      stats: ['25+ activities', 'All ages', 'Creative play'],
      color: 'from-purple-500 to-pink-500'
    },
  ]

  return (
    <section id="attractions" className="relative py-32 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-moa-blue via-moa-red to-moa-gold bg-clip-text text-transparent">
              Attractions & Entertainment
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            This is what sets us apart. World-class entertainment that transforms 
            shopping into an unforgettable destination experience.
          </p>
        </motion.div>

        {/* Main Video Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <MediaShowcase
            title="Attractions Highlight Reel"
            subtitle="Nickelodeon Universe & Beyond"
            bgImage="https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=2500&auto=format&fit=crop"
            onPlay={() => onPlayVideo('nbN0nIGiT2g')} // Nickelodeon Universe Attraction Guide
          />
        </motion.div>

        {/* Attraction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {attractions.map((attraction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-moa-blue transition-all"
            >
              <div className={`h-2 bg-gradient-to-r ${attraction.color}`} />
              <div className="p-8">
                <div className="text-6xl mb-4">{attraction.icon}</div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {attraction.name}
                </h3>
                <p className="text-gray-400 mb-6 text-lg">
                  {attraction.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {attraction.stats.map((stat, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-moa-blue/20 to-moa-gold/20 rounded-3xl p-12 border border-gray-700"
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            The Attraction Advantage
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Extended Visits',
                description: 'Attractions keep visitors on-property longer, driving more store visits and purchases',
                stat: '4+ hours',
                icon: '⏰'
              },
              {
                title: 'Year-Round Traffic',
                description: 'Indoor attractions eliminate seasonality, ensuring consistent foot traffic 365 days',
                stat: '365 days',
                icon: '📅'
              },
              {
                title: 'Family Appeal',
                description: 'Multi-generational draw brings high-value family groups with strong spending power',
                stat: '3.5 people',
                icon: '👨‍👩‍👧‍👦'
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <div className="text-3xl font-bold text-moa-gold mb-2">
                  {benefit.stat}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Entertainment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Plus More Entertainment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { icon: '🎮', label: 'Gaming' },
              { icon: '🎳', label: 'Activities' },
              { icon: '🎪', label: 'Live Shows' },
              { icon: '🎬', label: 'Cinema' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="text-gray-400">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Attractions
