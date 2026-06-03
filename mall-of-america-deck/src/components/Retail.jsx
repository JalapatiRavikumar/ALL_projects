import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MediaShowcase from './MediaShowcase'

const Retail = ({ onPlayVideo }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const tenantCategories = [
    {
      name: 'Flagship Anchors',
      count: '4',
      examples: ['Nordstrom', 'Macy\'s', 'H&M', 'Apple'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Fashion & Apparel',
      count: '200+',
      examples: ['Zara', 'Uniqlo', 'Gap', 'Nike'],
      color: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Beauty & Wellness',
      count: '50+',
      examples: ['Sephora', 'Lush', 'MAC', 'Aveda'],
      color: 'from-pink-500 to-pink-700'
    },
    {
      name: 'Tech & Electronics',
      count: '25+',
      examples: ['Apple', 'Microsoft', 'Best Buy', 'T-Mobile'],
      color: 'from-cyan-500 to-cyan-700'
    },
  ]

  const achievements = [
    { label: 'Occupancy Rate', value: '95%+' },
    { label: 'Avg Sales PSF', value: '$500+' },
    { label: 'Annual Foot Traffic', value: '40M+' },
    { label: 'Tenant Retention', value: '90%+' },
  ]

  return (
    <section id="retail" className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Retail <span className="text-moa-blue">Excellence</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            520+ stores representing the world's most sought-after brands. 
            A proven ecosystem for retail success.
          </p>
        </motion.div>

        {/* Tenant Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {tenantCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-moa-blue transition-all"
            >
              <div className={`text-4xl font-bold mb-3 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.count}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.examples.map((brand, i) => (
                  <li key={i} className="text-gray-400 text-sm flex items-center">
                    <span className="text-moa-gold mr-2">•</span>
                    {brand}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Video Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <MediaShowcase
            title="Retail Environment"
            subtitle="Full Mall Walkthrough"
            bgImage="https://images.unsplash.com/photo-1567449303078-57ad995bd3fa?q=80&w=2500&auto=format&fit=crop"
            onPlay={() => onPlayVideo('ioHfrWD1AFU')} // Full Tour of America's Largest Mall
          />
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-moa-blue/20 to-moa-red/20 rounded-3xl p-12 border border-gray-700"
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Proven Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-moa-gold mb-2">
                  {achievement.value}
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leasing Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Available Leasing Opportunities
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            From flagship locations to specialized boutiques, we offer flexible spaces 
            tailored to your brand's needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 61, 165, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-moa-blue text-white rounded-full font-semibold text-lg shadow-lg"
          >
            Explore Leasing Options
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Retail
