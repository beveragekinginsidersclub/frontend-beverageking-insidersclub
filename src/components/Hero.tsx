import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Bell, Instagram, GlassWater } from "lucide-react";
import bkLogo from "@/assets/bk-logo.jpg";
import "./Hero.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSources, setVideoSources] = useState<Array<{ src: string; type: string }>>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const orientationMq = window.matchMedia("(orientation: portrait)");
    let mounted = true;

    const headExists = async (url: string) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        return res && res.ok;
      } catch (e) {
        return false;
      }
    };

    const update = async () => {
      const isMobile = mq.matches;
      const isPortrait = orientationMq.matches;

      // If portrait mobile, prefer a vertical mobile file if it exists
      if (isMobile && isPortrait) {
        const vMp4 = "/videos/hero-background-mobile-vertical.mp4";
        const vWebm = "/videos/hero-background-mobile-vertical.webm";
        if (await headExists(vMp4)) {
          if (!mounted) return;
          setVideoSources([{ src: vMp4, type: "video/mp4" }]);
          return;
        }
        if (await headExists(vWebm)) {
          if (!mounted) return;
          setVideoSources([{ src: vWebm, type: "video/webm" }]);
          return;
        }
      }

      // Fallback: select mobile or desktop sources as before
      if (isMobile) {
        if (!mounted) return;
        setVideoSources([
          { src: "/videos/hero-background-mobile.webm", type: "video/webm" },
          { src: "/videos/hero-background-mobile.mp4", type: "video/mp4" },
        ]);
      } else {
        if (!mounted) return;
        setVideoSources([
          { src: "/videos/hero-background-desktop.webm", type: "video/webm" },
          { src: "/videos/hero-background-desktop.mp4", type: "video/mp4" },
          { src: "/videos/Dec_31__1410_16s_202512311424_nv6f2.mp4", type: "video/mp4" },
        ]);
      }
    };

    // Call update and listen for changes in width and orientation
    update();
    const handler = () => { update(); };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    if (orientationMq.addEventListener) orientationMq.addEventListener("change", handler);
    else orientationMq.addListener(handler);

    return () => {
      mounted = false;
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
      if (orientationMq.removeEventListener) orientationMq.removeEventListener("change", handler);
      else orientationMq.removeListener(handler);
    };
  }, []);

  // Attempt to autoplay when possible and handle errors silently
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      if (v && !v.paused && !v.ended) return;
      try {
        await v.play();
      } catch (e) {
        // autoplay blocked or other error - leave poster visible
      }
    };

    // Try playing once sources are set
    if (videoSources.length > 0) tryPlay();
  }, [videoSources]);

  // Respect reduced-motion preference
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="flex flex-col">

      {/* Top video block */}
      <div className="w-full h-screen overflow-hidden bg-black hero-video-container flex items-center justify-center">
        <video
          ref={videoRef}
          // Full-bleed video that stays in the document flow
          className={`w-auto h-full object-contain object-center z-0 filter contrast-105 saturate-105 transition-opacity duration-700 ease-out ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          poster="/images/hero-poster.svg"
          muted
          autoPlay={!prefersReducedMotion}
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          role="img"
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoLoaded(false)}
          onClick={() => {
            // allow tapping to toggle play/pause (useful on mobile if autoplay is blocked)
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) v.play();
            else v.pause();
          }}
        >
          {videoSources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
          {/* Safe fallback */}
          <source src="/videos/Dec_31__1410_16s_202512311424_nv6f2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Text/content below the video */}
      <div className="container relative z-20 px-4 py-12 mx-auto">
        <div className="max-w-4xl mx-auto text-center">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src={bkLogo}
              alt="Beverage King Insiders Club"
              className="w-48 h-48 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Main heading */}
          <h1 className="mb-8 text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl">
            <span className="hidden md:inline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Insiders Club
            </span>
            <span className="md:hidden">Insiders Club</span>
          </h1>

          {/* Subheading */}
          <p className="mb-10 text-lg md:text-xl text-black/95 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            This isn't your typical rewards or loyalty program — no points, no punches, no complicated rules.
            We're not asking you to prove your loyalty. All we're asking is that you show up, sign up, and get in on the good stuff before anyone else.
          </p>

          {/* VIP Message */}
          <p className="mb-10 text-lg md:text-xl text-black/95 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Get exclusive early access to barrel drops, first looks at special releases, and behind-the-scenes updates
            on what we're working on. This is your VIP pass to everything happening at the crown jewel of spirits.
          </p>

          {/* Pre-registration form section */}
          <div className="mt-16 flex flex-col items-center text-center relative">

            {/* Floating sparkles */}
            <div className="absolute -top-6 flex gap-4">
              <Sparkles
                className="w-6 h-6 text-purple-400 opacity-70 animate-[floatSparkle_3s_infinite_ease-in-out]"
              />
              <Sparkles
                className="w-5 h-5 text-primary opacity-60 animate-[floatSparkle_2.5s_infinite_ease-in-out]"
              />
              <Sparkles
                className="w-4 h-4 text-pink-400 opacity-70 animate-[floatSparkle_4s_infinite_ease-in-out]"
              />
            </div>

            {/* Animated shimmer + glow text */}
            <p
              className="
    mb-6 text-2xl font-bold 
    bg-gradient-to-r from-primary via-purple-400 to-pink-500
    bg-clip-text text-transparent
    max-w-3xl
  "
            >
              ✨ Become a Valued Member of the Beverage King Insider Club — Tap Below to Get Started! ✨
            </p>



            {/* Premium glowing animated button */}
            <a
              href="https://docs.google.com/forms/d/1a_ULcBtE65z9YqTBD0HqXLEHN6nTcsiU5aqqSPErv2s/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="
    px-12 py-4 rounded-2xl font-bold text-white
    bg-gradient-to-r from-primary via-purple-500 to-pink-600
    shadow-xl
    transition-all duration-300
    hover:scale-110 hover:shadow-2xl
  "
            >
              SIGN UP NOW
            </a>


            {/* Ambient glow behind button */}
            <div className="absolute bottom-2 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl -z-10"></div>

          </div>


          {/* Feature highlights */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">

  {/* Single Barrels */}
  <a
    href="https://beveragekingct.com/shop/?tags=single%20barrels"
    target="_blank"
    rel="noopener noreferrer"
    className="relative h-[320px] rounded-xl overflow-hidden group cursor-pointer"
  >
    {/* Background Image */}
    <img
      src="https://res.cloudinary.com/disrdtslz/image/upload/v1767145118/single_bzmsjh.jpg"
      alt="Single Barrels"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

    {/* Content */}
   <div className="relative z-10 h-full flex flex-col items-start justify-end text-left p-6 pb-8 text-white">

     
      <h3 className="text-2xl font-semibold mb-2">Single Barrels</h3>
      <p className="text-sm text-white/90 max-w-xs">
        Uniquely crafted expressions drawn from one exceptional cask.
      </p>
    </div>
  </a>

  {/* Special Releases */}
  <a
    href="https://beveragekingct.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="relative h-[320px] rounded-xl overflow-hidden group cursor-pointer"
  >
    <img
      src="https://res.cloudinary.com/disrdtslz/image/upload/v1767205935/Screenshot_31-12-2025_133144_liquorstars.com_kz20fx.jpg"
      alt="Special Releases"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

   <div className="relative z-10 h-full flex flex-col items-start justify-end text-left p-6 pb-8 text-white">

      
      <h3 className="text-2xl font-semibold mb-2">Special Releases</h3>
      <p className="text-sm text-white/90 max-w-xs">
        Limited bottles and rare finds, available while they last.
      </p>
    </div>
  </a>

  {/* New Arrivals */}
  <a
    href="https://beveragekingct.com/shop/?category=our_new_arrivals&title=New%20Arrivals"
    target="_blank"
    rel="noopener noreferrer"
    className="relative h-[320px] rounded-xl overflow-hidden group cursor-pointer"
  >
    <img
      src="https://res.cloudinary.com/disrdtslz/image/upload/v1767206256/Screenshot_31-12-2025_133723_www.thebarreltap.com_fzbmwo.jpg"
      alt="New Arrivals"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

    <div className="relative z-10 h-full flex flex-col items-start justify-end text-left p-6 pb-8 text-white">

      
      <h3 className="text-2xl font-semibold mb-2">New Arrivals</h3>
      <p className="text-sm text-white/90 max-w-xs">
        Fresh selections showcasing the latest additions.
      </p>
    </div>
  </a>

  {/* Tasting & Events */}
  <a
    href="https://beveragekingct.com/events"
    target="_blank"
    rel="noopener noreferrer"
    className="relative h-[320px] rounded-xl overflow-hidden group cursor-pointer"
  >
    <img
      src="https://res.cloudinary.com/disrdtslz/image/upload/v1767145690/Screenshot_30-12-2025_204759_www.bing.com_ngpvcx.jpg"
      alt="Tasting & Events"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

    <div className="relative z-10 h-full flex flex-col items-start justify-end text-left p-6 pb-8 text-white">
     
      <h3 className="text-2xl font-semibold mb-2">Tasting & Events</h3>
      <p className="text-sm text-white/90 max-w-xs">
        Immersive tastings and events guided by experts.
      </p>
    </div>
  </a>

</div>


          {/* Instagram section */}
          <div className="mt-16 -mb-5 flex flex-col items-center text-center">
            <a
              href="https://www.instagram.com/beverage_king?igsh=bGlmcHp1NWM1NWVi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
               px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <Instagram className="w-6 h-6" />
              <span>Follow us on Instagram for all the latest details!</span>
            </a>
          </div>



        </div>
      </div>
    </div>
  );
};