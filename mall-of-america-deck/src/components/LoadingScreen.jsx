import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl font-bold mb-4"
        >
          <span className="text-white">MALL</span>
          <span className="text-moa-blue"> OF </span>
          <span className="text-moa-red">AMERICA</span>
        </motion.div>
        <motion.div
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-moa-blue via-moa-red to-moa-gold mx-auto"
          style={{ maxWidth: '200px' }}
        />
      </div>
    </motion.div>
  )
}

export default LoadingScreen
