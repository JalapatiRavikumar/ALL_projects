import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MediaShowcase from './MediaShowcase'

const Dining = ({ onPlayVideo }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const diningCategories = [
    {
      name: 'Fine Dining',
      count: '10+',
      examples: ['Twin City Grill', 'Crave', 'The Oceanaire'],
      icon: '🍽️'
    },
    {
      name: 'Fast Casual',
      count: '30+',
      examples: ['Shake Shack', 'Chipotle', 'Noodles & Company'],
      icon: '🍜'
    },
    {
      name: 'Food Court',
      count: '20+',
      examples: ['Multiple cuisines', 'Quick service', 'International flavors'],
      icon: '🍕'
    },
    {
      name: 'Specialty',
      count: '15+',
      examples: ['Desserts', 'Coffee', 'Smoothies & Juice'],
      icon: '☕'
    },
  ]

  return (
    <section id="dining" className="relative py-32 px-4 bg-gradient-to-b from-black via-moa-red/10 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Dining & </span>
            <span className="text-moa-red">Lifestyle</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            60+ dining destinations transforming meals into experiences. 
            From quick bites to memorable occasions.
          </p>
        </motion.div>

        {/* Hero Image/Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <MediaShowcase
            title="Dining Experience"
            subtitle="Culinary Montage"
            bgImage="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2500&auto=format&fit=crop"
            onPlay={() => onPlayVideo('MdsaFN8DtsY')} // Mall of America Food Tour
          />
        </motion.div>

        {/* Dining Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {diningCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-moa-red transition-all"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <div className="text-3xl font-bold text-moa-red mb-2">
                {category.count}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.examples.map((example, i) => (
                  <li key={i} className="text-gray-400 text-sm flex items-center">
                    <span className="text-moa-gold mr-2">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Extended Dwell Time',
              description: 'Dining drives longer visits and increased spending across all categories',
              stat: '3+ hours',
              icon: '⏱️'
            },
            {
              title: 'Multiple Occasions',
              description: 'From quick coffee to celebratory dinners, we serve every need',
              stat: '60+ options',
              icon: '🎉'
            },
            {
              title: 'High-Traffic Locations',
              description: 'Premium positioning ensures maximum visibility and foot traffic',
              stat: '40M visitors',
              icon: '👥'
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <div className="text-3xl font-bold text-moa-red mb-2">
                {feature.stat}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Food & Beverage Opportunities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-moa-red/20 to-orange-500/20 rounded-3xl p-12 border border-gray-700"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">
                F&B Opportunities
              </h3>
              <ul className="space-y-4">
                {[
                  'High-visibility restaurant spaces',
                  'Food court and quick-service locations',
                  'Pop-up and seasonal concepts',
                  'Bar and nightlife venues',
                  'Specialty food retail',
                ].map((opportunity, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.4 + i * 0.1 }}
                    className="flex items-center text-gray-300 text-lg"
                  >
                    <span className="text-moa-red mr-3 text-2xl">✓</span>
                    {opportunity}
                  </motion.li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 bg-moa-red text-white rounded-full font-semibold text-lg shadow-lg"
              >
                Explore F&B Spaces
              </motion.button>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-8 flex items-center justify-center h-80">
              <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-400">
                  Available F&B Spaces
                  <br />
                  Floor Plans & Specifications
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Dining
