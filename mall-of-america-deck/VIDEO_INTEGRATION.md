# Video Integration Guide

## Overview

The Mall of America interactive deck now includes **real YouTube video playback** through an elegant modal system.

## How It Works

### 1. Components

**MediaShowcase** (`src/components/MediaShowcase.jsx`)
- Displays an attractive video thumbnail with background image
- Shows play button overlay
- Hover effects indicate it's clickable
- Takes `onPlay` callback to trigger video modal

**VideoModal** (`src/components/VideoModal.jsx`)
- Full-screen modal with YouTube iframe player
- Backdrop blur effect
- Auto-plays video when opened
- Close via ESC key, X button, or clicking outside
- Prevents body scroll when open
- Smooth animations on open/close

### 2. Video IDs Used

Each section uses a specific YouTube video about Mall of America:

| Section | Video Title | YouTube ID |
|---------|-------------|------------|
| **Retail** | Full Tour of America's Largest Mall | `ioHfrWD1AFU` |
| **Dining** | Mall of America Food Tour | `MdsaFN8DtsY` |
| **Attractions** | Nickelodeon Universe Guide | `nbN0nIGiT2g` |
| **Events** | Live Concert at MOA | `m_hhVboXmWo` |

### 3. Implementation Flow

```jsx
// 1. App.jsx manages modal state
const [isModalOpen, setIsModalOpen] = useState(false)
const [currentVideoId, setCurrentVideoId] = useState('')

const openVideoModal = (videoId) => {
  setCurrentVideoId(videoId)
  setIsModalOpen(true)
}

// 2. Pass handler to sections
<Retail onPlayVideo={openVideoModal} />

// 3. Section uses MediaShowcase
<MediaShowcase
  title="Retail Environment"
  subtitle="Full Mall Walkthrough"
  bgImage="https://..."
  onPlay={() => onPlayVideo('ioHfrWD1AFU')}
/>

// 4. Modal plays the video
<VideoModal
  isOpen={isModalOpen}
  onClose={closeVideoModal}
  videoId={currentVideoId}
/>
```

## Usage

### Adding a New Video

1. **Find YouTube Video ID**:
   - YouTube URL: `https://www.youtube.com/watch?v=ioHfrWD1AFU`
   - Video ID: `ioHfrWD1AFU` (the part after `v=`)

2. **Add MediaShowcase to your section**:
```jsx
import MediaShowcase from './MediaShowcase'

const YourSection = ({ onPlayVideo }) => {
  return (
    <MediaShowcase
      title="Your Title"
      subtitle="Your Subtitle"
      bgImage="https://images.unsplash.com/..."
      onPlay={() => onPlayVideo('YOUR_VIDEO_ID')}
    />
  )
}
```

3. **Pass onPlayVideo prop in App.jsx**:
```jsx
<YourSection onPlayVideo={openVideoModal} />
```

### Customizing the Video Player

**Auto-play settings**:
```jsx
// In VideoModal.jsx, modify the iframe src
src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`}
//                                              ↑           ↑      ↑
//                                          autoplay    unmuted  no related
```

**Available parameters**:
- `autoplay=1` - Start playing immediately
- `mute=0/1` - Muted or unmuted
- `rel=0` - Don't show related videos at end
- `controls=0/1` - Show/hide player controls
- `modestbranding=1` - Minimal YouTube branding
- `start=30` - Start at 30 seconds
- `end=90` - End at 90 seconds

### Replacing Background Images

Use high-quality images from Unsplash or your own:

```jsx
bgImage="https://images.unsplash.com/photo-1234567890?q=80&w=2500&auto=format&fit=crop"
```

**Tips**:
- Use `q=80` for quality
- Use `w=2500` for width
- Use `auto=format` for WebP when supported
- Use `fit=crop` for proper cropping

## Features

✅ **Click to Play** - Intuitive play button overlay
✅ **Full-Screen Modal** - Immersive viewing experience
✅ **Keyboard Support** - Press ESC to close
✅ **Click Outside to Close** - User-friendly closing
✅ **Auto-play** - Video starts immediately
✅ **Smooth Animations** - Framer Motion transitions
✅ **Body Scroll Lock** - Prevents background scrolling
✅ **Responsive** - Works on all screen sizes
✅ **Accessible** - Keyboard navigation and ARIA labels

## Browser Compatibility

The YouTube iframe API works on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lazy Loading**: Videos only load when modal opens
- **No Autoplay on Thumbnails**: Saves bandwidth
- **Clean Unmounting**: Video stops when modal closes
- **Optimized Images**: Unsplash images are compressed

## Troubleshooting

**Video won't play:**
- Check if YouTube video ID is correct
- Verify video is not age-restricted or private
- Check browser console for errors

**Modal won't close:**
- Ensure `onClose` is properly wired
- Check for JavaScript errors in console

**Styling issues:**
- Modal uses `z-50` - ensure nothing else uses higher z-index
- Check Tailwind classes are being purged correctly

## Future Enhancements

Possible improvements:
- **Video Playlist**: Play multiple videos in sequence
- **Chapters**: Jump to specific timestamps
- **Captions**: Add subtitles/closed captions
- **Analytics**: Track video engagement
- **Thumbnails**: Generate custom preview images
- **Quality Selector**: Let users choose video quality
- **Speed Control**: Playback speed options

## Example: Adding Hero Video

Want to add a video to the Hero section?

```jsx
// 1. Update Hero.jsx
import MediaShowcase from './MediaShowcase'

const Hero = ({ onPlayVideo }) => {
  return (
    <>
      {/* Existing hero content */}
      
      {/* Add video showcase */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => onPlayVideo('YOUR_VIDEO_ID')}
          className="px-6 py-3 bg-white/20 rounded-full"
        >
          Watch Video
        </button>
      </div>
    </>
  )
}
```

```jsx
// 2. Update App.jsx
<Hero onPlayVideo={openVideoModal} />
```

## Credits

Videos are sourced from:
- Mall of America official YouTube channel
- Travel/tourism content creators
- Public promotional content

---

**Enjoy the enhanced video experience! 🎥**
