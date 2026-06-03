import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import WhyMOA from './components/WhyMOA'
import Retail from './components/Retail'
import Luxury from './components/Luxury'
import Dining from './components/Dining'
import Attractions from './components/Attractions'
import Events from './components/Events'
import Venues from './components/Venues'
import CallToAction from './components/CallToAction'
import LoadingScreen from './components/LoadingScreen'
import VideoModal from './components/VideoModal'

function App() {
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState('')

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const openVideoModal = (videoId) => {
    setCurrentVideoId(videoId)
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setIsModalOpen(false)
    // Delay clearing videoId to allow exit animation
    setTimeout(() => setCurrentVideoId(''), 300)
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="bg-black text-white">
      <Navigation />
      <main>
        <Hero />
        <WhyMOA />
        <Retail onPlayVideo={openVideoModal} />
        <Luxury />
        <Dining onPlayVideo={openVideoModal} />
        <Attractions onPlayVideo={openVideoModal} />
        <Events onPlayVideo={openVideoModal} />
        <Venues />
        <CallToAction />
      </main>
      
      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={closeVideoModal}
        videoId={currentVideoId}
      />
    </div>
  )
}

export default App
