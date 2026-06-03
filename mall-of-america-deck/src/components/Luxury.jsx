import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Luxury = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const luxuryBrands = [
    'Louis Vuitton',
    'Gucci',
    'Tiffany & Co.',
    'Burberry',
    'Coach',
    'Kate Spade',
    'Michael Kors',
    'Tory Burch',
  ]

  const luxuryFeatures = [
    {
      title: 'Elevated Environment',
      description: 'Premium finishes, sophisticated ambiance, VIP services',
      icon: '✨'
    },
    {
      title: 'Affluent Clientele',
      description: 'High-net-worth visitors seeking premium experiences',
      icon: '👑'
    },
    {
      title: 'Personal Shopping',
      description: 'Dedicated concierge and personal shopping services',
      icon: '🛍️'
    },
    {
      title: 'Exclusive Events',
      description: 'Private trunk shows, product launches, VIP previews',
      icon: '🎭'
    },
  ]

  return (
    <section id="luxury" className="relative py-32 px-4 bg-black">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="inline-block mb-6"
          >
            <span className="text-6xl">💎</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Luxury </span>
            <span className="text-moa-gold">Redefined</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Where the world's most prestigious brands connect with discerning customers 
            in an environment designed for elevated experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Video/Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-moa-gold/30 via-gray-800 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <p className="text-gray-400">
                  Luxury Wing Showcase
                  <br />
                  <span className="text-sm">(Insert premium retail environment footage)</span>
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Content Section */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-4xl font-bold text-white mb-8">
                The Midwest's Premier Luxury Destination
              </h3>
              
              <div className="space-y-6 mb-12">
                {luxuryFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-moa-gold/20 to-transparent p-6 rounded-xl border-l-4 border-moa-gold"
              >
                <p className="text-gray-300 italic">
                  "Mall of America provides the perfect platform for luxury brands 
                  to reach an affluent, engaged audience in an environment that 
                  celebrates premium experiences."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Luxury Brand Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border border-gray-800"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Prestigious Brand Portfolio
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {luxuryBrands.map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + index * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center justify-center text-center transition-all"
              >
                <span className="text-gray-300 font-medium">{brand}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-moa-gold text-black rounded-full font-semibold text-lg shadow-lg"
          >
            Inquire About Luxury Spaces
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Luxury
