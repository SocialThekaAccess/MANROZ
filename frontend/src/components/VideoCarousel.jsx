import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Video data mapped to products
const videoData = [
  {
    id: 1,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_de8a8e6d-f683-41a2-afe7-7b99c06c1d04.mp4?v=1745571420',
    handle: 'red-coord-set-with-leaf-cut',
    title: 'Red Print Coord Set',
    price: 2099,
    compareAt: 4199,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0626.jpg?v=1746683175',
  },
  {
    id: 2,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_fa7f3e80-04f3-401f-bc0d-3a0347db848a.mp4?v=1745571418',
    handle: 'black-coord-set-with-white-neck-button-flower',
    title: 'Black Coord Set with White Neck',
    price: 1649,
    compareAt: 3299,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0578.jpg?v=1746682774',
  },
  {
    id: 3,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_1080p_43b8b147-58c6-4a4b-84af-ea193ea89151.mp4?v=1745571418',
    handle: 'green-coord-set',
    title: 'Green Coord Set',
    price: 1849,
    compareAt: 3699,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0717.jpg?v=1746684214',
  },
  {
    id: 4,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_1080p_746a7e77-cf5f-4db7-994c-003af3cd3bb6.mp4?v=1745571574',
    handle: 'maroon-golden-coord-set',
    title: 'Maroon Golden Coord Set',
    price: 1549,
    compareAt: 3099,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0647.jpg?v=1746683390',
  },
  {
    id: 5,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_1080p_1b17a09e-fc60-4903-8efe-789c9c8c4a18.mp4?v=1745571452',
    handle: 'white-coord-set-with-black-thread-flowers',
    title: 'White Coord Set Black Flowers',
    price: 1499,
    compareAt: 2999,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0679.jpg?v=1746683653',
  },
  {
    id: 6,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_e3b73d58-007b-4037-8d09-26970bd805ac.mp4?v=1727510116',
    handle: 'black-coord-set-with-pink-neck-work',
    title: 'Black Coord Set with Pink Neck',
    price: 1599,
    compareAt: 3199,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0555.jpg?v=1746682574',
  },
  {
    id: 7,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_a2b144e6-812b-4895-9d8e-e501bec68c12.mp4?v=1727510112',
    handle: 'dark-green-coord-set-with-neck-work',
    title: 'Dark Green Coord Set',
    price: 1699,
    compareAt: 3399,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0601.jpg?v=1746682903',
  },
  {
    id: 8,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_1080p_54e71747-0217-4126-bf91-0a841423d949.mp4?v=1727510121',
    handle: 'beige-coord-set',
    title: 'Beige Coord Set',
    price: 1499,
    compareAt: 2999,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0609.jpg?v=1746683089',
  },
  {
    id: 9,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_1080p_6c031c27-8c01-40df-a80e-b3654b8e725f.mp4?v=1727510116',
    handle: 'light-blue-coord-set',
    title: 'Light Blue Coord Set',
    price: 1699,
    compareAt: 3399,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0666.jpg?v=1746683538',
  },
  {
    id: 10,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_4745eb09-38c6-40bd-a815-70c2fb7a5ca1.mp4?v=1730792949',
    handle: 'white-black-coord-set',
    title: 'White Black Coord Set',
    price: 1999,
    compareAt: 3999,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0691.jpg?v=1746683912',
  },
  {
    id: 11,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_0eda936c-5ccf-4dbd-b9cb-92aee1713574.mp4?v=1730792950',
    handle: 'black-white-neck-coord-set',
    title: 'Black White Neck Coord Set',
    price: 2049,
    compareAt: 4099,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0726.jpg?v=1746684380',
  },
  {
    id: 12,
    video: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/whatmore_tn_f032225d-535e-4c55-a1cb-3ebc60b2a050.mp4?v=1745571457',
    handle: 'flower-coord-set-with-golden-neck-work',
    title: 'Flower Coord Set Golden Neck',
    price: 1999,
    compareAt: 3999,
    thumb: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0538.jpg?v=1746682371',
  },
];

// Single video card
const VideoCard = ({ item, isActive, isAdjacent, isPrev, isNext, isPrev2, isNext2, onClick }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const discount = Math.round(((item.compareAt - item.price) / item.compareAt) * 100);

  return (
    <div
      className={`vc-card ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''} ${isPrev2 ? 'adjacent prev-2' : ''} ${isNext2 ? 'adjacent next-2' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={item.title}
    >
      <div className="vc-video-wrap">
        <video
          ref={videoRef}
          src={item.video}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          poster={item.thumb}
        />

        {/* Overlay gradient */}
        <div className="vc-overlay" />

        {/* Brand watermark */}
        <span className="vc-watermark">MANROZ</span>

        {/* Mute button — only on active */}
        {isActive && (
          <button className="vc-mute-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 19l1.99 2L21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        )}

        {/* Discount badge */}
        {discount > 0 && isActive && (
          <span className="vc-discount">{discount}% OFF</span>
        )}
      </div>

      {/* Product info below card */}
      <div className="vc-info">
        <div className="vc-thumb">
          <img src={item.thumb} alt={item.title} />
        </div>
        <div className="vc-details">
          <p className="vc-title">{item.title}</p>
          <div className="vc-price-row">
            <span className="vc-price">₹{item.price.toLocaleString('en-IN')}</span>
            <span className="vc-compare">₹{item.compareAt.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <Link
          to={`/product/${item.handle}`}
          className="vc-shop-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Shop
        </Link>
      </div>
    </div>
  );
};

const VideoCarousel = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = videoData.length;

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  // Auto-advance every 3.5s
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, total]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') { setPaused(true); prev(); }
      if (e.key === 'ArrowRight') { setPaused(true); next(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  // Touch swipe support
  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setPaused(true);
      diff > 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  const getPos = (i) => {
    const diff = i - active;
    const n = total;
    // Normalize to -n/2 .. n/2
    let pos = ((diff % n) + n) % n;
    if (pos > n / 2) pos -= n;
    return pos;
  };

  return (
    <section className="vc-section">
      <div className="vc-header">
        <h2>Watch & Buy</h2>
        <p>See it in action, then make it yours</p>
      </div>

      <div className="vc-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {videoData.map((item, i) => {
          const pos = getPos(i);
          const isActive = pos === 0;
          const isPrev = pos === -1;
          const isNext = pos === 1;
          const isPrev2 = pos === -2;
          const isNext2 = pos === 2;
          const isAdjacent = Math.abs(pos) === 2;
          const isVisible = Math.abs(pos) <= 2;
          if (!isVisible) return null;

          return (
            <VideoCard
              key={item.id}
              item={item}
              isActive={isActive}
              isPrev={isPrev}
              isNext={isNext}
              isAdjacent={isAdjacent}
              isPrev2={isPrev2}
              isNext2={isNext2}
              onClick={() => {
                if (!isActive) { setPaused(true); setActive(i); }
              }}
            />
          );
        })}

        {/* Arrows */}
        <button className="vc-arrow vc-arrow-left" onClick={() => { setPaused(true); prev(); }} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="vc-arrow vc-arrow-right" onClick={() => { setPaused(true); next(); }} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="vc-dots">
        {videoData.map((_, i) => (
          <button
            key={i}
            className={`vc-dot ${i === active ? 'active' : ''}`}
            onClick={() => { setPaused(true); setActive(i); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoCarousel;
