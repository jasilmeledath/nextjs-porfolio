
"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, useAnimation, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"

// CSS for holographic animation
const holographicStyles = `
  @keyframes holographicShift {
    0%, 100% { 
      background-position: 0% 0%, 30% 40%, 70% 60%;
      opacity: 0;
    }
    50% { 
      background-position: 100% 100%, 50% 60%, 90% 80%;
      opacity: 1;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = holographicStyles
  document.head.appendChild(styleSheet)
}

const HangingIDCard = ({ personalInfo = {}, isDark = true, className = "", physicsConfig = {} }) => {
  // Helper function to normalize image URL
  const normalizeImageUrl = (url) => {
    if (!url) return null;
    
    // Remove any extra spaces and ensure proper encoding
    const trimmedUrl = url.trim();
    
    try {
      // Test if URL is valid
      new URL(trimmedUrl);
      return trimmedUrl;
    } catch (e) {
      console.warn('Invalid avatar URL format:', trimmedUrl);
      return null;
    }
  };

  // Image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image states when personalInfo changes
  useEffect(() => {
    if (personalInfo?.avatar) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [personalInfo?.avatar]);

  // Responsive sizing based on viewport
  const [dimensions, setDimensions] = useState({
    cardWidth: 280,
    cardHeight: 497,
    stringLength: 120, // Adjusted for navbar connection
    containerHeight: 550, // Adjusted for navbar connection
  })

  // Enhanced physics configuration with more realistic parameters
  const defaultPhysicsConfig = {
    gravity: 0.8,
    stringLength: dimensions.stringLength,
    damping: 0.98,
    airResistance: 0.999,
    springStrength: 0.08,
    bounceReflection: 0.4,
    maxSwingAngle: 45,
    floorConstraint: 80,
    velocityScale: 0.008,
    maxVelocity: 15,
    elasticity: 0.6,
    tensionThreshold: 0.85,
    restLength: 1.0,
  }

  const physics = { ...defaultPhysicsConfig, ...physicsConfig }

  // Component state
  const [isDragging, setIsDragging] = useState(false)
  const [isSwinging, setIsSwinging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [staticId, setStaticId] = useState('123456') // Static ID to prevent hydration issues

  // Refs
  const cardRef = useRef(null)
  const containerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const physicsStateRef = useRef({
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    lastTime: 0,
    isAnimating: false,
  })

  const controls = useAnimation()

  // Responsive sizing effect
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const isMobileDevice = vw < 768

      setIsMobile(isMobileDevice)

      // Scale card based on viewport
      const scale = isMobileDevice ? Math.min(vw / 320, vh / 600, 0.8) : Math.min(vw / 1200, vh / 800, 1)

      setDimensions({
        cardWidth: Math.max(240, 280 * scale),
        cardHeight: Math.max(426, 497 * scale),
        stringLength: Math.max(100, 120 * scale), // Adjusted for navbar connection
        containerHeight: Math.max(500, 550 * scale), // Adjusted for navbar connection
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Set dynamic ID on client side to prevent hydration mismatch
  useEffect(() => {
    // Generate a dynamic ID only on client side
    setStaticId(String(Date.now()).slice(-6))
  }, [])

  // Enhanced motion values with smoother constraints
  const x = useMotionValue(0)
  const y = useMotionValue(-10) // Start slightly higher to stay connected to lanyard

  // Smooth constraint functions
  const constrainedX = useTransform(x, (latest) => {
    const maxX = Math.sin((physics.maxSwingAngle * Math.PI) / 180) * physics.stringLength
    return Math.max(-maxX, Math.min(maxX, latest))
  })

  const constrainedY = useTransform(y, (latest) => {
    return Math.max(-15, Math.min(physics.floorConstraint, latest)) // Adjusted range to keep card higher
  })

  // Enhanced rotation with smoother transitions
  const rotate = useTransform(
    constrainedX,
    [-physics.stringLength * 0.8, physics.stringLength * 0.8],
    [-physics.maxSwingAngle * 0.7, physics.maxSwingAngle * 0.7],
  )

  // Enhanced string physics with elastic tension
  const stringX = useTransform(constrainedX, (latest) => latest * 0.6)
  const stringRotate = useTransform(
    constrainedX,
    [-physics.stringLength * 0.9, physics.stringLength * 0.9],
    [physics.maxSwingAngle * 0.5, -physics.maxSwingAngle * 0.5],
  )

  // Elastic string length based on tension
  const stringLength = useTransform([constrainedX, constrainedY], ([xVal, yVal]) => {
    const distance = Math.sqrt(Math.pow(xVal * 0.6, 2) + Math.pow(yVal + physics.stringLength, 2))
    const tension = distance / physics.stringLength
    
    // Elastic stretching when under tension
    if (tension > physics.tensionThreshold) {
      const stretchFactor = 1 + (tension - physics.tensionThreshold) * physics.elasticity
      return physics.stringLength * Math.min(stretchFactor, 1.3) // Max 30% stretch
    }
    
    return Math.max(physics.stringLength * physics.restLength, distance)
  })

  // Enhanced string visual tension effects
  const stringTension = useTransform([constrainedX, constrainedY], ([xVal, yVal]) => {
    const distance = Math.sqrt(Math.pow(xVal * 0.6, 2) + Math.pow(yVal + physics.stringLength, 2))
    return Math.min(distance / physics.stringLength, 1.5)
  })

  // Optimized hover effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const hoverTiltX = useSpring(useTransform(mouseY, [-100, 100], [6, -6]), { stiffness: 150, damping: 25 })
  const hoverTiltY = useSpring(useTransform(mouseX, [-100, 100], [-4, 4]), { stiffness: 150, damping: 25 })

  // Optimized physics simulation
  const startSwinging = useCallback(
    (initialVelocity = { x: 0, y: 0 }) => {
      if (physicsStateRef.current.isAnimating) return

      setIsSwinging(true)
      physicsStateRef.current.isAnimating = true
      physicsStateRef.current.velocity = {
        x: Math.max(-physics.maxVelocity, Math.min(physics.maxVelocity, initialVelocity.x)),
        y: Math.max(-physics.maxVelocity * 0.7, Math.min(physics.maxVelocity * 0.7, initialVelocity.y)),
      }
      physicsStateRef.current.lastTime = performance.now()

      const animate = (currentTime) => {
        if (!physicsStateRef.current.isAnimating) return

        const deltaTime = Math.min((currentTime - physicsStateRef.current.lastTime) / 16.67, 2)
        physicsStateRef.current.lastTime = currentTime

        const state = physicsStateRef.current
        const currentX = x.get()
        const currentY = y.get()

        // Enhanced pendulum physics with elastic behavior
        const distance = Math.sqrt(
          currentX * currentX + (currentY + physics.stringLength) * (currentY + physics.stringLength),
        )
        const angle = Math.atan2(currentX, physics.stringLength + currentY)
        const tension = distance / physics.stringLength

        // Elastic string constraint forces with tension-based elasticity
        if (distance > physics.stringLength) {
          // Calculate elastic stretch factor
          const elasticStretch = tension > physics.tensionThreshold ? 
            1 + (tension - physics.tensionThreshold) * physics.elasticity : 1
          
          const constraintForce = (distance - physics.stringLength * elasticStretch) * physics.springStrength * 2
          const normalizedX = currentX / distance
          const normalizedY = (currentY + physics.stringLength) / distance

          // Enhanced forces with elastic dampening
          const elasticDampening = tension > physics.tensionThreshold ? 
            physics.elasticity * 0.8 : 1

          state.acceleration.x = -normalizedX * constraintForce * elasticDampening - Math.sin(angle) * physics.gravity
          state.acceleration.y = -normalizedY * constraintForce * elasticDampening + Math.cos(angle) * physics.gravity * 0.4
        } else {
          // Regular pendulum motion with enhanced gravity
          state.acceleration.x = -Math.sin(angle) * physics.gravity * physics.springStrength * 1.2
          state.acceleration.y = Math.cos(angle) * physics.gravity * physics.springStrength * 0.5
        }

        // Floor collision with enhanced elastic bounce
        if (currentY >= physics.floorConstraint) {
          const elasticBounce = physics.bounceReflection * (1 + physics.elasticity * 0.5)
          state.velocity.y = -Math.abs(state.velocity.y) * elasticBounce
          state.acceleration.y = 0
          y.set(physics.floorConstraint - 2)
        }

        // Enhanced angular constraints with elastic boundaries
        const currentAngle = Math.abs(angle) * (180 / Math.PI)
        if (currentAngle > physics.maxSwingAngle) {
          const overshoot = (currentAngle - physics.maxSwingAngle) / physics.maxSwingAngle
          const elasticConstraint = Math.max(0.1, 1 - overshoot * (1 + physics.elasticity))
          
          state.acceleration.x *= elasticConstraint
          // Add elastic rebound force
          if (overshoot > 0.1) {
            state.acceleration.x -= Math.sign(currentX) * physics.elasticity * overshoot * 0.5
          }
        }

        // Update velocity with enhanced frame-rate independent damping
        state.velocity.x += state.acceleration.x * deltaTime
        state.velocity.y += state.acceleration.y * deltaTime
        
        // Enhanced damping with air resistance and tension awareness
        const tensionDamping = tension > physics.tensionThreshold ? 
          physics.damping * (1 - physics.elasticity * 0.1) : physics.damping
        
        state.velocity.x *= Math.pow(tensionDamping * physics.airResistance, deltaTime)
        state.velocity.y *= Math.pow(tensionDamping * physics.airResistance, deltaTime)

        // Update position with smooth constraints
        const newX = currentX + state.velocity.x * deltaTime
        const newY = currentY + state.velocity.y * deltaTime

        x.set(newX)
        y.set(newY)

        // Continue or stop animation
        const velocityMagnitude = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2)
        if (velocityMagnitude > 0.08 && physicsStateRef.current.isAnimating) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          // Smooth settle to a position closer to the lanyard
          physicsStateRef.current.isAnimating = false
          setIsSwinging(false)
          controls.start({
            x: 0,
            y: -8, // Rest position closer to lanyard
            transition: {
              type: "spring",
              stiffness: 60,
              damping: 20,
              mass: 1,
            },
          })
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    },
    [x, y, controls],
  )

  // Optimized drag handling
  const handleDrag = useCallback(
    (event, info) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + physics.stringLength + 60

      const dragX = (event.clientX || event.touches?.[0]?.clientX || 0) - centerX
      const dragY = (event.clientY || event.touches?.[0]?.clientY || 0) - centerY

      // Smooth constraints during drag
      const maxDragX = physics.stringLength * 0.9
      const maxDragY = physics.floorConstraint

      const constrainedDragX = Math.max(-maxDragX, Math.min(maxDragX, dragX))
      const constrainedDragY = Math.max(-20, Math.min(maxDragY, dragY)) // Adjusted to allow dragging closer to lanyard

      x.set(constrainedDragX)
      y.set(constrainedDragY)
    },
    [x, y],
  )

  // Enhanced drag end with better velocity calculation
  const handleDragEnd = useCallback(
    (event, info) => {
      setIsDragging(false)

      // Stop any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        physicsStateRef.current.isAnimating = false
      }

      // Calculate velocity with improved scaling
      const velocity = {
        x: (info.velocity.x || 0) * physics.velocityScale,
        y: (info.velocity.y || 0) * physics.velocityScale,
      }

      // Add slight delay for smoother transition
      setTimeout(() => startSwinging(velocity), 50)
    },
    [startSwinging],
  )

  // Optimized mouse tracking
  const handleMouseMove = useCallback(
    (event) => {
      if (!cardRef.current || isDragging) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (event.clientX - centerX) / (isMobile ? 3 : 2)
      const deltaY = (event.clientY - centerY) / (isMobile ? 3 : 2)

      mouseX.set(deltaX)
      mouseY.set(deltaY)
    },
    [isDragging, isMobile, mouseX, mouseY],
  )

  // Enhanced keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDragging || isSwinging) return

      const nudgeAmount = isMobile ? 25 : 35
      let velocityX = 0
      let velocityY = 0

      switch (e.key) {
        case "ArrowLeft":
          velocityX = -nudgeAmount * 0.15
          break
        case "ArrowRight":
          velocityX = nudgeAmount * 0.15
          break
        case "ArrowUp":
          velocityY = -nudgeAmount * 0.1
          break
        case "ArrowDown":
          velocityY = nudgeAmount * 0.1
          break
        case " ":
          e.preventDefault()
          startSwinging({
            x: (Math.random() - 0.5) * 8,
            y: Math.random() * 2,
          })
          return
        default:
          return
      }

      startSwinging({ x: velocityX, y: velocityY })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDragging, isSwinging, isMobile, startSwinging])

  // Auto-swing initialization with subtle idle motion
  useEffect(() => {
    const timer = setTimeout(() => {
      startSwinging({ x: 1.5, y: 0.3 }) // Reduced initial swing
    }, 1200)

    return () => clearTimeout(timer)
  }, [startSwinging])

  // Idle animation - subtle breathing/swaying motion
  useEffect(() => {
    let idleAnimationFrame

    const createIdleMotion = () => {
      if (!isDragging && !isSwinging && !physicsStateRef.current.isAnimating) {
        const time = performance.now() * 0.001 // Use performance.now() for animation
        
        // Subtle breathing motion
        const breathingX = Math.sin(time * 0.5) * 0.8
        const breathingY = Math.sin(time * 0.3) * 0.5 - 8 // Keep card higher with breathing
        
        // Apply gentle idle motion only if not being manually controlled
        if (Math.abs(x.get()) < 5 && Math.abs(y.get() + 8) < 5) {
          x.set(breathingX)
          y.set(breathingY)
        }
      }
      
      idleAnimationFrame = requestAnimationFrame(createIdleMotion)
    }

    const startIdleTimer = setTimeout(() => {
      createIdleMotion()
    }, 3000) // Start idle motion after initial swing settles

    return () => {
      clearTimeout(startIdleTimer)
      if (idleAnimationFrame) {
        cancelAnimationFrame(idleAnimationFrame)
      }
    }
  }, [isDragging, isSwinging, x, y])

  // Cleanup animation frames
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      physicsStateRef.current.isAnimating = false
    }
  }, [])

  // Generate QR pattern with seeded randomness to avoid hydration issues
  const qrPattern = useMemo(() => {
    const size = isMobile ? 10 : 12
    const pattern = []
    
    // Create a simple seeded random function based on email hash
    const emailSeed = personalInfo?.email ? 
      personalInfo.email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0) : 12345
    
    let seedValue = Math.abs(emailSeed)
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280
      return seedValue / 233280
    }
    
    for (let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push(seededRandom() > 0.5)
      }
      pattern.push(row)
    }
    return pattern
  }, [personalInfo?.email, isMobile])

  // Responsive text sizes
  const textSizes = {
    name: isMobile ? "text-xl" : "text-2xl",
    title: isMobile ? "text-base" : "text-lg",
    details: isMobile ? "text-xs" : "text-sm",
    company: isMobile ? "text-sm" : "text-base",
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex justify-center items-start ${className}`}
      style={{ 
        height: `${dimensions.containerHeight}px`,
        paddingTop: '0px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
    >
      {/* Hanging Infrastructure - Connection point */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        {/* Connection Hook */}
        <div
          className={`w-16 h-6 rounded-lg shadow-2xl mb-2 ${
            isDark
              ? "bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600"
              : "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400"
          }`}
          style={{
            boxShadow: `
              0 4px 8px rgba(0,0,0,0.3),
              inset 0 2px 4px rgba(255,255,255,0.2),
              inset 0 -2px 4px rgba(0,0,0,0.2)
            `
          }}
        >
          <div className="flex justify-center items-center h-full">
            <div className={`w-2 h-2 rounded-full ${
              isDark ? "bg-gray-300" : "bg-gray-700"
            } shadow-inner`} />
          </div>
        </div>

        {/* Enhanced Cloth Lanyard - Main hanging string */}
        <motion.div
          className="absolute top-6 left-1/2 transform -translate-x-1/2 origin-top"
          style={{
            x: stringX,
            rotate: stringRotate,
            height: stringLength,
          }}
        >
          <div
            className={`w-6 shadow-2xl rounded-sm ${
              isDark
                ? "bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900"
                : "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800"
            }`}
            style={{
              height: "100%",
              // Enhanced textile pattern
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(0,0,0,0.15) 1px,
                  rgba(0,0,0,0.15) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.08) 2px,
                  rgba(255,255,255,0.08) 4px
                ),
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100% 3px, 4px 100%, 8px 8px',
              // 3D depth effect
              boxShadow: `
                inset 2px 0 4px rgba(0,0,0,0.2),
                inset -2px 0 4px rgba(0,0,0,0.2),
                0 0 8px rgba(0,0,0,0.3)
              `
            }}
          >
            {/* Reinforced stitched edges */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-900/80" />
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-amber-900/80" />
            
            {/* Textile weave pattern overlay */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(255,255,255,0.1) 2px,
                    rgba(255,255,255,0.1) 4px
                  ),
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 4px
                  )
                `,
                backgroundSize: '8px 8px'
              }}
            />

            {/* Lanyard clips/connectors */}
            <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-sm ${
              isDark ? 'bg-gray-500' : 'bg-gray-600'
            } shadow-sm`} />
            <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-sm ${
              isDark ? 'bg-gray-500' : 'bg-gray-600'
            } shadow-sm`} />
          </div>
        </motion.div>
      </div>

      {/* ID Card */}
      <motion.div
        ref={cardRef}
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          x: constrainedX,
          y: constrainedY,
          rotate,
          rotateX: isHovering && !isDragging ? hoverTiltX : 0,
          rotateY: isHovering && !isDragging ? hoverTiltY : 0,
          width: dimensions.cardWidth,
          height: dimensions.cardHeight,
          marginTop: physics.stringLength + 15, // Reduced margin to bring card closer to lanyard
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        className="cursor-grab active:cursor-grabbing select-none touch-none"
        whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* String connection bridge - visually connects lanyard to card hole */}
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 origin-bottom"
          style={{
            rotate: useTransform(constrainedX, [-50, 50], [2, -2]),
          }}
        >
          <div className={`w-full h-full ${
            isDark 
              ? "bg-gradient-to-b from-amber-700 to-amber-800" 
              : "bg-gradient-to-b from-amber-600 to-amber-700"
          } rounded-full shadow-sm opacity-90`} />
        </motion.div>
        
        {/* Enhanced Shadow System with Ground Shadow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-40"
          style={{
            background: "radial-gradient(ellipse 140% 100% at 50% 130%, rgba(0,0,0,0.5), transparent 70%)",
            y: useTransform(constrainedY, [0, physics.floorConstraint], [12, 35]),
            scale: useTransform(constrainedY, [0, physics.floorConstraint], [1, 1.4]),
            filter: useTransform(constrainedY, [0, physics.floorConstraint], ["blur(12px)", "blur(28px)"]),
          }}
        />

        {/* Ambient shadow from hanging */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: "linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
            y: useTransform(constrainedY, [0, physics.floorConstraint], [6, 18]),
            scale: useTransform(constrainedY, [0, physics.floorConstraint], [1, 1.2]),
            filter: "blur(4px)"
          }}
        />

        {/* Enhanced 3D Card Body with Realistic Textures */}
        <div
          className={`relative w-full h-full rounded-2xl overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
              : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          } shadow-2xl`}
          style={{
            transformStyle: "preserve-3d",
            // Enhanced plastic/laminated texture
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.08) 1px, transparent 1px),
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 1px,
                rgba(255,255,255,0.03) 1px,
                rgba(255,255,255,0.03) 2px
              ),
              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)
            `,
            backgroundSize: "8px 8px, 6px 6px, 4px 4px, 100% 100%",
            // Enhanced 3D depth
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.3),
              0 4px 16px rgba(0,0,0,0.2),
              inset 0 1px 2px rgba(255,255,255,0.1),
              inset 0 -1px 2px rgba(0,0,0,0.1)
            `
          }}
        >
          {/* Enhanced 3D Beveled Border with Realistic Depth */}
          <div className={`absolute inset-0 rounded-2xl ${
            isDark ? "border-2 border-slate-600/80" : "border-2 border-gray-300/80"
          }`}
          style={{
            // Enhanced 3D bevel effect
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.15),
              inset 0 -2px 4px rgba(0,0,0,0.15),
              inset 2px 0 4px rgba(255,255,255,0.08),
              inset -2px 0 4px rgba(0,0,0,0.08),
              0 0 0 1px rgba(255,255,255,0.1)
            `
          }}>
            <div className={`absolute inset-1 rounded-xl ${
              isDark ? "border border-slate-500/40" : "border border-gray-200/60"
            }`}
            style={{
              boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.1),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `
            }} />
          </div>

          {/* Enhanced Realistic Hanger Hole with Metal Grommet */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-8 h-8">
            {/* Outer hole with depth */}
            <div
              className={`w-full h-full rounded-full ${isDark ? "bg-slate-900" : "bg-gray-200"}`}
              style={{
                boxShadow: `
                  inset 0 4px 8px rgba(0,0,0,0.5),
                  inset 0 -2px 4px rgba(255,255,255,0.15),
                  0 1px 3px rgba(0,0,0,0.3)
                `,
              }}
            >
              {/* Metal grommet ring */}
              <div
                className={`absolute inset-1 rounded-full ${
                  isDark ? "bg-gradient-to-br from-gray-400 to-gray-600" : "bg-gradient-to-br from-gray-300 to-gray-500"
                }`}
                style={{
                  boxShadow: `
                    inset 0 2px 4px rgba(255,255,255,0.4),
                    inset 0 -2px 4px rgba(0,0,0,0.4),
                    0 0 2px rgba(0,0,0,0.2)
                  `
                }}
              >
                {/* Inner hole */}
                <div className={`absolute inset-2 rounded-full ${
                  isDark ? "bg-slate-900" : "bg-gray-800"
                }`}
                style={{
                  boxShadow: `
                    inset 0 2px 4px rgba(0,0,0,0.6),
                    inset 0 -1px 2px rgba(255,255,255,0.1)
                  `
                }} />
              </div>
              {/* Wear marks on grommet */}
              <div className="absolute inset-1 rounded-full opacity-30"
                   style={{
                     background: `
                       radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 20%, transparent 20%),
                       radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 15%, transparent 15%)
                     `
                   }} />
            </div>
          </div>

          {/* Enhanced Professional Header with 3D Embossing */}
          <div
            className={`h-20 mt-11 relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800"
                : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400"
            }`}
            style={{
              boxShadow: `
                inset 0 3px 6px rgba(255,255,255,0.15),
                inset 0 -3px 6px rgba(0,0,0,0.25),
                0 2px 4px rgba(0,0,0,0.15)
              `
            }}
          >
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                      : "bg-gradient-to-br from-cyan-500 to-blue-600"
                  } shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">🏢</span>
                </div>
                <div>
                  <div className={`font-bold ${textSizes.company} ${isDark ? "text-white" : "text-gray-900"}`}>
                    TECHCORP
                  </div>
                  <div className={`${textSizes.details} ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Professional ID
                  </div>
                </div>
              </div>
              <div className={`text-right ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                <div className={`${textSizes.details} font-mono`}>ID: {staticId}</div>
                <div className={textSizes.details}>Est. 2025</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Professional Avatar Frame */}
                <div
                  className={`${isMobile ? "w-32 h-40" : "w-36 h-44"} rounded-lg overflow-hidden shadow-2xl relative ${
                    isDark
                      ? "bg-gradient-to-br from-slate-600/50 to-slate-800/50"
                      : "bg-gradient-to-br from-gray-100/50 to-gray-300/50"
                  }`}
                  style={{
                    border: `3px solid ${isDark ? "#334155" : "#94a3b8"}`,
                    boxShadow: `
                      0 8px 25px rgba(0,0,0,0.3),
                      inset 0 2px 4px rgba(255,255,255,0.1),
                      inset 0 -2px 4px rgba(0,0,0,0.1)
                    `
                  }}
                >

                  {/* Inner frame with beveled edge */}
                  <div 
                    className="absolute inset-1 rounded-md overflow-hidden"
                    style={{
                      border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
                      boxShadow: `
                        inset 0 1px 2px rgba(255,255,255,0.15),
                        inset 0 -1px 2px rgba(0,0,0,0.15)
                      `
                    }}
                  >
                    {/* Avatar Image - With multiple fallback strategies */}
                    {normalizeImageUrl(personalInfo?.avatar) && (
                      <img
                        src={normalizeImageUrl(personalInfo.avatar)}
                        alt={`${personalInfo?.name || "Developer"} Professional Photo`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onLoad={() => {
                          setImageLoaded(true);
                          setImageError(false);
                        }}
                        onError={() => {
                          setImageError(true);
                          setImageLoaded(false);
                        }}
                        style={{
                          filter: "contrast(1.05) saturate(1.1)",
                          opacity: imageLoaded ? 1 : 0.8,
                          transition: "opacity 0.3s ease-in-out"
                        }}
                      />
                    )}
                    
                    {/* Loading state with professional spinner */}
                    {personalInfo?.avatar && !imageLoaded && !imageError && (
                      <div
                        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center ${
                          isDark ? "bg-slate-700/80" : "bg-gray-100/80"
                        }`}
                        style={{ zIndex: 1 }}
                      >
                        <div className={`${isMobile ? "text-2xl" : "text-3xl"} mb-2`}>
                          <div className="animate-spin">⚪</div>
                        </div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                          Loading...
                        </div>
                      </div>
                    )}
                    
                    {/* Professional fallback with gradient background */}
                    {(!personalInfo?.avatar || imageError) && (
                      <div
                        className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden ${
                          isDark ? "bg-gradient-to-br from-slate-600 to-slate-700" : "bg-gradient-to-br from-gray-200 to-gray-300"
                        }`}
                      >
                        {/* Subtle pattern overlay */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '12px 12px'
                          }}
                        />
                        
                        {/* Professional avatar placeholder */}
                        <div className={`${isMobile ? "text-4xl" : "text-5xl"} mb-2 filter drop-shadow-sm`}>
                          👤
                        </div>
                        <div className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                          Professional Photo
                        </div>
                        {imageError && (
                          <div className={`text-xs mt-1 ${isDark ? "text-red-400" : "text-red-600"}`}>
                            Image Load Error
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Professional photo overlay effects */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255,255,255,0.1) 0%, 
                            transparent 20%,
                            transparent 80%, 
                            rgba(0,0,0,0.05) 100%
                          )
                        `
                      }}
                    />
                  </div>
                  
                  {/* Photo frame gloss effect */}
                  <div 
                    className="absolute top-2 left-2 right-2 h-8 rounded-t-md pointer-events-none opacity-30"
                    style={{
                      background: `
                        linear-gradient(180deg, 
                          rgba(255,255,255,0.4) 0%, 
                          rgba(255,255,255,0.1) 50%,
                          transparent 100%
                        )
                      `
                    }}
                  />
                </div>
                
                {/* Professional photo badge */}
                <div 
                  className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                    imageLoaded && !imageError 
                      ? "bg-gradient-to-r from-green-400 to-green-500" 
                      : isDark ? "bg-slate-600" : "bg-gray-400"
                  }`}
                >
                  <span className="text-white text-xs">
                    {imageLoaded && !imageError ? "✓" : "📷"}
                  </span>
                </div>
                

              </div>
            </div>

            {/* Information */}
            <div className="text-center space-y-3">
              <h3 className={`font-bold ${textSizes.name} leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                {personalInfo?.name || "Loading..."}
              </h3>
              <p className={`${textSizes.title} font-semibold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                {personalInfo?.title || "Portfolio Loading..."}
              </p>

              {/* Details */}
              <div
                className={`space-y-2 ${textSizes.details} p-3 rounded-xl ${
                  isDark ? "bg-slate-800/50 border border-slate-600/30" : "bg-gray-100/50 border border-gray-300/30"
                }`}
              >
                <div
                  className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <span>📍</span>
                  <span>{personalInfo?.location || "Location Loading..."}</span>
                </div>
                <div
                  className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <span>✉️</span>
                  <span className="font-mono text-xs">{personalInfo?.email || "email@loading.com"}</span>
                </div>
                <div
                  className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <span>🏢</span>
                  <span>Software Development</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div
                className={`${isMobile ? "w-16 h-16" : "w-18 h-18"} rounded-xl p-2 ${
                  isDark ? "bg-white" : "bg-gray-900"
                }`}
              >
                <div
                  className={`w-full h-full grid gap-0 rounded-lg overflow-hidden`}
                  style={{ gridTemplateColumns: `repeat(${qrPattern.length}, 1fr)` }}
                >
                  {qrPattern.map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`w-full h-full ${
                          cell ? (isDark ? "bg-gray-900" : "bg-white") : isDark ? "bg-white" : "bg-gray-900"
                        }`}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-10 flex items-center justify-between px-4 ${
              isDark ? "bg-gradient-to-r from-slate-800 to-slate-700" : "bg-gradient-to-r from-gray-100 to-gray-200"
            }`}
          >
            <div className={`${textSizes.details} font-mono ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              AUTHORIZED • VERIFIED
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className={`${textSizes.details} font-mono ${isDark ? "text-green-400" : "text-green-600"}`}>
                ACTIVE
              </span>
            </div>
          </div>

          {/* Enhanced Holographic Security Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-cyan-400/15 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%),
                radial-gradient(circle at 30% 40%, rgba(0,255,255,0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(255,0,255,0.1) 0%, transparent 50%)
              `,
              // Animated holographic shift
              animation: 'holographicShift 3s ease-in-out infinite'
            }}
          />
          
          {/* Enhanced Realistic Gloss Reflection */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255,255,255,0.5) 0%, 
                  rgba(255,255,255,0.2) 15%,
                  transparent 30%, 
                  transparent 70%, 
                  rgba(255,255,255,0.1) 85%,
                  rgba(255,255,255,0.3) 100%
                ),
                radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 30%),
                radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 25%)
              `
            }}
          />

          {/* Enhanced Ambient Occlusion */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-25"
            style={{
              boxShadow: `
                inset 0 0 30px rgba(0,0,0,0.3),
                inset 0 0 60px rgba(0,0,0,0.15),
                inset 0 2px 4px rgba(0,0,0,0.1)
              `
            }}
          />
        </div>

        {/* Status Indicators */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0 rgba(34, 197, 94, 0.7)",
              "0 0 0 6px rgba(34, 197, 94, 0)",
              "0 0 0 0 rgba(34, 197, 94, 0)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>

        <motion.div
          className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <span className="text-white text-xs font-bold">★</span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HangingIDCard
