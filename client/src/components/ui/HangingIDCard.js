
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
    } else {
      // If no avatar, consider it "loaded" to avoid showing loader
      setImageLoaded(true);
    }
  }, [personalInfo?.avatar]);

  // Add a backup check to ensure loader doesn't get stuck
  useEffect(() => {
    if (personalInfo?.avatar && !imageError) {
      const timer = setTimeout(() => {
        // If image hasn't loaded after 10 seconds, assume it's loaded to hide loader
        const imgElement = document.querySelector(`img[src="${normalizeImageUrl(personalInfo.avatar)}"]`);
        if (imgElement && imgElement.complete) {
          setImageLoaded(true);
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [personalInfo?.avatar, imageError]);

  // Check if image is already cached/loaded immediately
  useEffect(() => {
    if (personalInfo?.avatar && normalizeImageUrl(personalInfo?.avatar)) {
      const imgElement = new Image();
      imgElement.src = normalizeImageUrl(personalInfo.avatar);
      
      // If already cached/loaded, set loaded state immediately
      if (imgElement.complete) {
        setImageLoaded(true);
        setImageError(false);
      } else {
        // Otherwise, wait for load/error events
        imgElement.onload = () => {
          setImageLoaded(true);
          setImageError(false);
        };
        imgElement.onerror = () => {
          setImageError(true);
          setImageLoaded(false);
        };
      }
    }
  }, [personalInfo?.avatar]);

  // Responsive sizing based on viewport
  const [dimensions, setDimensions] = useState({
    cardWidth: 280,
    cardHeight: 497,
    stringLength: 120, // Adjusted for navbar connection
    containerHeight: 550, // Adjusted for navbar connection
  })

  // Advanced realistic physics configuration with material properties
  const defaultPhysicsConfig = {
    // Enhanced core physics constants
    gravity: 1400, // Stronger gravity for more pronounced hanging
    mass: 0.08, // Increased mass for realistic weight feel
    cardMomentOfInertia: 0.0004, // Higher rotational inertia for card
    
    // Advanced strap physics with realistic material properties
    strapLength: dimensions.stringLength,
    strapMass: 0.002, // Mass of the strap itself
    strapSegments: 8, // Number of segments for realistic bending
    strapSpringConstant: 1200, // Higher spring constant for lanyard material
    strapBendingStiffness: 0.3, // Resistance to bending (lanyard flexibility)
    strapDamping: 0.88, // Realistic material damping
    strapMaxStretch: 0.12, // Maximum elastic stretch
    strapThickness: 6,
    strapElasticity: 0.98, // High elasticity for lanyard material
    strapTensileStrength: 2.8, // Maximum tension before permanent deformation
    
    // Enhanced air resistance and environmental physics
    airResistance: 0.992,
    linearDamping: 0.91, // More realistic damping
    angularDamping: 0.89, // Enhanced angular damping
    windResistance: 0.15, // Air current effects
    
    // Advanced environmental factors
    ambientForceStrength: 1.2,
    ambientFrequency: 0.6,
    temperatureEffect: 0.05, // Material properties change with temperature
    
    // Realistic constraints and limits
    maxSwingAngle: 55, // More realistic swing range
    maxVelocity: 800,
    maxAngularVelocity: 10,
    
    // Enhanced interaction parameters
    dragResponse: 0.45, // More resistance for realistic feel
    releaseEnergyTransfer: 0.95, // High energy conservation
    grabDamping: 0.7, // Damping when grabbed
    
    // Advanced behavioral parameters
    settleThreshold: 0.6,
    oscillationDecay: 0.985, // Slower decay for longer natural oscillation
    naturalFrequency: 1.8, // Natural pendulum frequency
    
    // Advanced elastic physics
    rubberBandTension: 3.2, // Higher tension for realistic lanyard
    rubberBandNonlinearity: 2.1, // Strong non-linear response
    elasticRestoration: 0.92, // How well material returns to shape
    plasticDeformation: 0.02, // Permanent deformation under extreme stress
    
    // Connection point physics
    hookConnectionStiffness: 1500, // Stiffness of hook connection
    hookDamping: 0.95, // Damping at connection point
    tagConnectionStiffness: 1000, // Stiffness of tag connection
  }

  const physics = { ...defaultPhysicsConfig, ...physicsConfig }

  // Component state - Enhanced physics state management
  const [isDragging, setIsDragging] = useState(false)
  const [isSwinging, setIsSwinging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [staticId, setStaticId] = useState('123456')
  const [isSettled, setIsSettled] = useState(false) // Track if card is at rest

  // Refs for advanced physics simulation
  const cardRef = useRef(null)
  const containerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastFrameTimeRef = useRef(0)
  
  // Advanced physics state with multi-segment strap simulation
  const physicsStateRef = useRef({
    // Position and velocity (Cartesian coordinates)
    position: { x: 0, y: -15 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    
    // Enhanced rotational physics
    angle: 0, // rotation angle in radians
    angularVelocity: 0, // radians/second
    angularAcceleration: 0,
    
    // Advanced multi-segment strap physics
    strapSegments: Array.from({ length: physics.strapSegments }, (_, i) => ({
      position: { x: 0, y: i * (physics.strapLength / physics.strapSegments) },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      angle: 0, // Local segment angle
      stress: 0, // Material stress level
      strain: 0, // Elastic strain
    })),
    
    // Enhanced strap physics
    strapLength: physics.strapLength,
    strapTension: 0,
    strapStretch: 0, // current stretch amount
    strapBendingMoment: 0, // Bending resistance
    strapCurvature: [], // Curvature at each segment
    totalStrapStress: 0, // Overall material stress
    
    // Connection point physics
    hookConnection: {
      position: { x: 0, y: 0 },
      force: { x: 0, y: 0 },
      torque: 0,
      isConnected: true,
    },
    tagConnection: {
      position: { x: 0, y: physics.strapLength },
      force: { x: 0, y: 0 },
      torque: 0,
      isConnected: true,
    },
    
    // Environmental forces with advanced modeling
    ambientForce: { x: 0, y: 0 },
    windForce: { x: 0, y: 0 },
    thermalExpansion: 0, // Material expansion due to temperature
    lastAmbientUpdate: 0,
    lastWindUpdate: 0,
    
    // Advanced material properties
    materialFatigue: 0, // Accumulated stress damage
    plasticDeformation: 0, // Permanent shape change
    elasticEnergy: 0, // Stored elastic energy
    dampingEnergy: 0, // Energy lost to damping
    
    // Animation and state control
    isAnimating: false,
    totalEnergy: 0, // for energy conservation tracking
    naturalPeriod: 0, // Natural oscillation period
    dampingRatio: 0, // Critical damping ratio
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

  // Enhanced motion values with realistic physics constraints
  const x = useMotionValue(0)
  const y = useMotionValue(-10)

  // Advanced constraint functions with realistic multi-segment strap physics
  const constrainedX = useTransform(x, (latest) => {
    const maxX = Math.sin((physics.maxSwingAngle * Math.PI) / 180) * physics.strapLength
    const constrained = Math.max(-maxX, Math.min(maxX, latest))
    
    // Enhanced rubber band effect with material fatigue
    const overshoot = Math.abs(latest) - maxX
    if (overshoot > 0) {
      const state = physicsStateRef.current
      const fatigueReduction = Math.max(0.7, 1 - state.materialFatigue * 0.3)
      const stressFactor = Math.pow(overshoot / (physics.strapLength * 0.15), physics.rubberBandNonlinearity)
      const elasticResponse = Math.exp(-stressFactor * fatigueReduction) * physics.elasticRestoration
      
      const direction = latest > 0 ? 1 : -1
      const maxOvershoot = physics.strapLength * 0.25 // Maximum realistic overshoot
      const clampedOvershoot = Math.min(overshoot, maxOvershoot)
      
      return maxX * direction + (clampedOvershoot * elasticResponse) * direction
    }
    
    return constrained
  })

  const constrainedY = useTransform(y, (latest) => {
    // Enhanced natural hanging with gravitational sag
    const naturalHang = physics.strapLength * 0.08 // Increased sag for realistic hanging
    const gravitationalSag = physics.mass * physics.gravity * 0.00001 // Gravity-induced sag
    const adjustedNaturalHang = naturalHang + gravitationalSag
    
    const maxDownward = physics.strapLength * (1 + physics.strapMaxStretch)
    const maxUpward = -physics.strapLength * 0.15 // Limited upward movement
    
    const baseConstrained = Math.max(maxUpward, Math.min(maxDownward, latest))
    
    // Advanced elastic constraint with material properties
    const stretchDistance = Math.max(0, baseConstrained - adjustedNaturalHang)
    if (stretchDistance > physics.strapLength * 0.4) {
      const state = physicsStateRef.current
      const excessStretch = stretchDistance - physics.strapLength * 0.4
      const materialStiffness = physics.strapSpringConstant * (1 + state.totalStrapStress * 0.2)
      const elasticReduction = Math.exp(-excessStretch / (physics.strapLength * 0.08))
      
      // Add permanent deformation for extreme stretching
      const permanentDeformation = Math.min(excessStretch * physics.plasticDeformation, physics.strapLength * 0.02)
      state.plasticDeformation = Math.max(state.plasticDeformation, permanentDeformation)
      
      return adjustedNaturalHang + physics.strapLength * 0.4 + excessStretch * elasticReduction + permanentDeformation
    }
    
    return baseConstrained
  })

  // Realistic rotation based on pendulum physics
  const cardRotation = useTransform(
    [constrainedX, constrainedY],
    ([xVal, yVal]) => {
      // Calculate angle based on strap position (realistic pendulum angle)
      const angle = Math.atan2(xVal, physics.strapLength + yVal)
      return (angle * 180) / Math.PI // Convert to degrees
    }
  )

  // Advanced multi-segment strap physics with realistic bending
  const strapX = useTransform(constrainedX, (latest) => {
    // Calculate strap curvature based on card position and wind forces
    const state = physicsStateRef.current
    const windInfluence = state.windForce.x * 0.001
    const bendingFactor = Math.abs(latest) / physics.strapLength
    
    // Multi-segment strap follows a natural catenary curve
    const strapCurvature = latest * 0.4 + windInfluence * (1 + bendingFactor)
    
    // Apply bending stiffness to resist extreme curvature
    const maxCurvature = physics.strapLength * 0.3
    return Math.max(-maxCurvature, Math.min(maxCurvature, strapCurvature))
  })
  
  const strapY = useTransform(constrainedY, (latest) => {
    // Enhanced strap sagging with gravitational effects
    const state = physicsStateRef.current
    const gravitationalSag = physics.strapMass * physics.gravity * 0.01
    const tensionSag = Math.max(0, latest * 0.05) + gravitationalSag
    
    // Add wind resistance effect on vertical position
    const windEffect = state.windForce.y * 0.0005
    
    return Math.max(0, tensionSag + windEffect)
  })

  // Advanced dynamic strap length with realistic material physics
  const dynamicStrapLength = useTransform([constrainedX, constrainedY], ([xVal, yVal]) => {
    const state = physicsStateRef.current
    
    // Calculate distance from hook to tag connection point
    const hookPoint = { x: 0, y: 0 }
    const tagPoint = { x: xVal, y: yVal + physics.strapLength }
    
    const actualDistance = Math.sqrt(
      Math.pow(tagPoint.x - hookPoint.x, 2) + 
      Math.pow(tagPoint.y - hookPoint.y, 2)
    )
    
    const naturalLength = physics.strapLength + state.plasticDeformation
    const stretchRatio = actualDistance / naturalLength
    
    if (stretchRatio > 1) {
      // Advanced non-linear elastic response with material fatigue
      const excessStretch = stretchRatio - 1
      const materialStiffness = 1 - state.materialFatigue * 0.15
      const stressFactor = Math.pow(excessStretch * physics.rubberBandTension, physics.rubberBandNonlinearity)
      
      // Calculate elastic response with hysteresis
      const elasticResponse = physics.elasticRestoration * materialStiffness * Math.exp(-stressFactor * 0.5)
      const stretchedLength = naturalLength * (1 + excessStretch * elasticResponse)
      
      // Apply maximum stretch limit with progressive stiffening
      const maxStretchedLength = naturalLength * (1 + physics.strapMaxStretch)
      const finalLength = Math.min(stretchedLength, maxStretchedLength)
      
      // Update material stress for fatigue calculation
      state.totalStrapStress = Math.min(1, excessStretch * 2)
      state.materialFatigue = Math.min(0.3, state.materialFatigue + excessStretch * 0.001)
      
      return finalLength
    }
    
    // Allow slight compression with buckling resistance
    const minLength = naturalLength * 0.95
    return Math.max(minLength, actualDistance)
  })

  // Advanced strap rotation with realistic bending physics
  const strapRotation = useTransform([constrainedX, constrainedY], ([xVal, yVal]) => {
    const state = physicsStateRef.current
    
    // Calculate angle from hook to tag connection with curvature
    const hookToTag = { x: xVal, y: yVal + physics.strapLength }
    const baseAngle = Math.atan2(hookToTag.x, hookToTag.y)
    
    // Add bending moment based on material properties
    const bendingMoment = state.strapBendingMoment * 0.01
    const windTorque = state.windForce.x * 0.0001
    
    // Calculate curvature-based rotation
    const curvatureEffect = Math.sin(baseAngle) * physics.strapBendingStiffness * 0.5
    const totalRotation = baseAngle + bendingMoment + windTorque + curvatureEffect
    
    // Apply realistic rotation limits based on material flexibility
    const maxRotation = 35 // degrees
    const rotationDegrees = (totalRotation * 180) / Math.PI
    
    // Add damping to prevent unrealistic oscillations
    const dampedRotation = rotationDegrees * 0.85
    
    return Math.max(-maxRotation, Math.min(maxRotation, dampedRotation))
  })

  // Advanced strap tension with multi-point stress analysis
  const strapTension = useTransform([constrainedX, constrainedY], ([xVal, yVal]) => {
    const state = physicsStateRef.current
    
    const hookPoint = { x: 0, y: 0 }
    const tagPoint = { x: xVal, y: yVal + physics.strapLength }
    
    const distance = Math.sqrt(
      Math.pow(tagPoint.x - hookPoint.x, 2) + 
      Math.pow(tagPoint.y - hookPoint.y, 2)
    )
    
    const naturalLength = physics.strapLength + state.plasticDeformation
    const tensionRatio = distance / naturalLength
    
    if (tensionRatio > 1) {
      const stretch = tensionRatio - 1
      const materialStiffness = 1 - state.materialFatigue * 0.2
      
      // Non-linear tension with progressive stiffening
      const baseTension = 1 + stretch * physics.rubberBandTension * materialStiffness
      const progressiveStiffening = Math.pow(stretch * 2, 1.5)
      
      // Add dynamic effects from card movement
      const velocityEffect = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2) * 0.001
      const dynamicTension = baseTension * (1 + progressiveStiffening) + velocityEffect
      
      // Apply material limits
      const maxTension = physics.strapTensileStrength * materialStiffness
      return Math.min(dynamicTension, maxTension)
    }
    
    // Minimum tension for visual consistency (gravity effect)
    const gravityTension = physics.mass * physics.gravity * 0.0001
    return Math.max(0.85, tensionRatio + gravityTension)
  })

  // Optimized hover effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const hoverTiltX = useSpring(useTransform(mouseY, [-100, 100], [6, -6]), { stiffness: 150, damping: 25 })
  const hoverTiltY = useSpring(useTransform(mouseX, [-100, 100], [-4, 4]), { stiffness: 150, damping: 25 })

  // Advanced realistic physics simulation engine with multi-segment strap
  const startRealisticPhysics = useCallback(
    (initialVelocity = { x: 0, y: 0 }, initialAngularVelocity = 0) => {
      if (physicsStateRef.current.isAnimating) return

      setIsSwinging(true)
      setIsSettled(false)
      physicsStateRef.current.isAnimating = true
      
      // Initialize enhanced physics state
      const state = physicsStateRef.current
      state.velocity = {
        x: Math.max(-physics.maxVelocity, Math.min(physics.maxVelocity, initialVelocity.x)),
        y: Math.max(-physics.maxVelocity, Math.min(physics.maxVelocity, initialVelocity.y))
      }
      state.angularVelocity = Math.max(-physics.maxAngularVelocity, Math.min(physics.maxAngularVelocity, initialAngularVelocity))

      // Initialize strap segments for realistic bending
      const segmentLength = physics.strapLength / physics.strapSegments
      for (let i = 0; i < physics.strapSegments; i++) {
        state.strapSegments[i].position = {
          x: 0,
          y: i * segmentLength
        }
        state.strapSegments[i].velocity = { x: 0, y: 0 }
        state.strapSegments[i].stress = 0
      }

      lastFrameTimeRef.current = performance.now()

      const advancedPhysicsLoop = (currentTime) => {
        if (!physicsStateRef.current.isAnimating) return

        const deltaTime = Math.min((currentTime - lastFrameTimeRef.current) / 1000, 1/30)
        lastFrameTimeRef.current = currentTime

        const state = physicsStateRef.current
        const currentPos = { x: x.get(), y: y.get() }

        // === ADVANCED FORCE CALCULATIONS ===
        
        // 1. Enhanced Gravitational force with realistic effects
        const gravityForce = { 
          x: 0, 
          y: physics.gravity * physics.mass * (1 + Math.abs(currentPos.x) / physics.strapLength * 0.15)
        }

        // 2. Advanced multi-segment strap constraint forces
        const hookPoint = { x: 0, y: -physics.strapLength }
        const strapVector = { 
          x: currentPos.x - hookPoint.x, 
          y: currentPos.y - hookPoint.y 
        }
        const strapDistance = Math.sqrt(strapVector.x ** 2 + strapVector.y ** 2)
        const naturalLength = physics.strapLength + state.plasticDeformation
        
        let constraintForce = { x: 0, y: 0 }
        let bendingForces = { x: 0, y: 0 }
        
        if (strapDistance > 0) {
          // Advanced spring force with material properties
          const stretch = Math.max(0, strapDistance - naturalLength)
          const stretchRatio = stretch / naturalLength
          const materialStiffness = physics.hookConnectionStiffness * (1 - state.materialFatigue * 0.2)
          
          // Multi-stage spring response (linear -> progressive -> exponential)
          let springForce = 0
          if (stretchRatio < 0.05) {
            // Linear elastic region
            springForce = materialStiffness * stretchRatio
          } else if (stretchRatio < physics.strapMaxStretch * 0.7) {
            // Progressive stiffening
            springForce = materialStiffness * (0.05 + Math.pow(stretchRatio - 0.05, 1.5) * 2)
          } else {
            // Exponential hardening near failure
            const hardening = Math.exp((stretchRatio - physics.strapMaxStretch * 0.7) * 8)
            springForce = materialStiffness * (0.05 + Math.pow(physics.strapMaxStretch * 0.65, 1.5) * 2) * hardening
          }
          
          // Unit vector pointing back to attachment
          const unitVector = { 
            x: strapVector.x / strapDistance, 
            y: strapVector.y / strapDistance 
          }
          
          constraintForce = {
            x: -unitVector.x * springForce,
            y: -unitVector.y * springForce
          }
          
          // Add bending resistance forces (realistic strap behavior)
          const bendingAngle = Math.atan2(strapVector.x, -strapVector.y)
          const bendingMoment = physics.strapBendingStiffness * Math.sin(bendingAngle * 2) * 100
          
          bendingForces = {
            x: -Math.sin(bendingAngle) * bendingMoment,
            y: Math.cos(bendingAngle) * bendingMoment * 0.5
          }
          
          // Update bending moment for visual feedback
          state.strapBendingMoment = bendingMoment
          
          // Material stress accumulation for fatigue
          if (stretchRatio > 0.02) {
            state.materialFatigue = Math.min(0.5, state.materialFatigue + stretchRatio * 0.0001)
          }
        }

        // 3. Advanced pendulum physics with realistic restoring force
        const pendulumAngle = Math.atan2(currentPos.x, -currentPos.y)
        const pendulumLength = Math.max(physics.strapLength * 0.8, strapDistance)
        const pendulumForce = physics.mass * physics.gravity * Math.sin(pendulumAngle) * 
                            (pendulumLength / physics.strapLength) * 1.8
        
        const pendulumRestoreForce = {
          x: -pendulumForce * Math.cos(pendulumAngle),
          y: -pendulumForce * Math.sin(pendulumAngle) * 0.3
        }

        // 4. Advanced air resistance with realistic drag
        const velocityMagnitude = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2)
        let airResistanceForce = { x: 0, y: 0 }
        if (velocityMagnitude > 0) {
          const dragCoefficient = (1 - physics.airResistance) * physics.mass * 200
          const cardArea = (dimensions.cardWidth * dimensions.cardHeight) / 1000000 // m²
          const dragMagnitude = dragCoefficient * velocityMagnitude * velocityMagnitude * cardArea
          
          airResistanceForce = {
            x: -(state.velocity.x / velocityMagnitude) * dragMagnitude,
            y: -(state.velocity.y / velocityMagnitude) * dragMagnitude
          }
        }

        // 5. Enhanced environmental forces with realistic wind simulation
        if (currentTime - state.lastWindUpdate > 800) {
          // Realistic wind patterns
          const windStrength = physics.ambientForceStrength * (0.7 + Math.random() * 0.6)
          const windDirection = Math.sin(currentTime * 0.001) * Math.PI * 0.3
          
          state.windForce = {
            x: Math.sin(windDirection) * windStrength,
            y: Math.cos(windDirection) * windStrength * 0.2
          }
          state.lastWindUpdate = currentTime
        }

        // 6. Thermal effects on material properties (subtle)
        const thermalEffect = Math.sin(currentTime * 0.0001) * physics.temperatureEffect
        const thermalExpansion = physics.strapLength * thermalEffect * 0.001
        state.thermalExpansion = thermalExpansion

        // === ADVANCED FORCE INTEGRATION ===
        const totalForce = {
          x: gravityForce.x + constraintForce.x + pendulumRestoreForce.x + 
             airResistanceForce.x + state.windForce.x + bendingForces.x,
          y: gravityForce.y + constraintForce.y + pendulumRestoreForce.y + 
             airResistanceForce.y + state.windForce.y + bendingForces.y
        }

        // Newton's second law with enhanced mass properties
        const effectiveMass = physics.mass * (1 + state.totalStrapStress * 0.05)
        state.acceleration = {
          x: totalForce.x / effectiveMass,
          y: totalForce.y / effectiveMass
        }

        // === ADVANCED ROTATIONAL PHYSICS ===
        // Multi-point torque calculation for realistic rotation
        const leverArm = currentPos.x
        const cardMomentArm = dimensions.cardHeight * 0.3 // Center of mass offset
        
        const gravitationalTorque = -leverArm * physics.mass * physics.gravity * 0.08
        const constraintTorque = -leverArm * constraintForce.y * 0.0008
        const windTorque = state.windForce.x * cardMomentArm * 0.00001
        const bendingTorque = state.strapBendingMoment * 0.0001
        
        const totalTorque = gravitationalTorque + constraintTorque + windTorque + bendingTorque
        
        // Enhanced moment of inertia with realistic distribution
        const effectiveInertia = physics.cardMomentOfInertia * (1 + Math.abs(state.angularVelocity) * 0.02)
        state.angularAcceleration = totalTorque / effectiveInertia

        // === ADVANCED INTEGRATION WITH STABILITY ===
        // Velocity Verlet integration for better stability
        const prevVelocity = { ...state.velocity }
        
        // Update velocity (first half-step)
        state.velocity.x += state.acceleration.x * deltaTime * 0.5
        state.velocity.y += state.acceleration.y * deltaTime * 0.5
        state.angularVelocity += state.angularAcceleration * deltaTime * 0.5

        // Enhanced damping with realistic material properties
        const materialDamping = physics.linearDamping * (1 - state.materialFatigue * 0.1)
        const velocityDamping = Math.pow(materialDamping, deltaTime * 60)
        
        state.velocity.x *= velocityDamping
        state.velocity.y *= velocityDamping
        state.angularVelocity *= Math.pow(physics.angularDamping, deltaTime * 60)

        // Update position with enhanced constraints
        const newPos = {
          x: currentPos.x + state.velocity.x * deltaTime,
          y: currentPos.y + state.velocity.y * deltaTime
        }
        state.angle += state.angularVelocity * deltaTime

        // Complete velocity update (second half-step)
        state.velocity.x += state.acceleration.x * deltaTime * 0.5
        state.velocity.y += state.acceleration.y * deltaTime * 0.5
        state.angularVelocity += state.angularAcceleration * deltaTime * 0.5

        // === ADVANCED CONSTRAINT HANDLING ===
        const maxX = Math.sin((physics.maxSwingAngle * Math.PI) / 180) * physics.strapLength
        
        // Enhanced X constraint with realistic collision response
        if (Math.abs(newPos.x) > maxX) {
          const overshoot = Math.abs(newPos.x) - maxX
          const restitution = physics.strapElasticity * (1 - state.materialFatigue * 0.2)
          const direction = newPos.x > 0 ? 1 : -1
          
          // Progressive constraint stiffening
          const constraintStiffness = 1 + Math.pow(overshoot / (physics.strapLength * 0.1), 1.5)
          const elasticReturn = Math.exp(-overshoot / (physics.strapLength * 0.06))
          
          newPos.x = (maxX + overshoot * elasticReturn * 0.2) * direction
          state.velocity.x *= -restitution / constraintStiffness
          
          // Add rotational coupling from constraint
          state.angularVelocity += direction * overshoot * 0.02
        }
        
        // Enhanced Y constraint with gravitational restoration
        const naturalHangY = physics.strapLength * 0.08 + state.thermalExpansion
        const maxY = physics.strapLength * (1 + physics.strapMaxStretch) + state.plasticDeformation
        const minY = -physics.strapLength * 0.18
        
        if (newPos.y > maxY) {
          const overshoot = newPos.y - maxY
          const elasticReturn = physics.elasticRestoration * Math.exp(-overshoot / (physics.strapLength * 0.03))
          newPos.y = maxY + overshoot * elasticReturn * 0.15
          state.velocity.y *= -physics.strapElasticity * 0.6
          
          // Material stress from excessive stretching
          state.totalStrapStress = Math.min(1, overshoot / (physics.strapLength * 0.1))
        } else if (newPos.y < minY) {
          newPos.y = minY
          state.velocity.y *= -0.3
        }

        // Gravitational restoration toward natural hanging position
        if (velocityMagnitude < physics.settleThreshold * 3) {
          const hangingForce = (naturalHangY - newPos.y) * 0.015
          newPos.y += hangingForce * deltaTime
          
          // Lateral stability enhancement
          const lateralRestoration = -newPos.x * 0.008
          newPos.x += lateralRestoration * deltaTime
        }

        // Update motion values with enhanced smoothing
        x.set(newPos.x)
        y.set(newPos.y)

        // === ADVANCED ENERGY CALCULATIONS ===
        const kineticEnergy = 0.5 * physics.mass * (state.velocity.x ** 2 + state.velocity.y ** 2)
        const rotationalEnergy = 0.5 * physics.cardMomentOfInertia * (state.angularVelocity ** 2)
        const potentialEnergy = physics.mass * physics.gravity * (-newPos.y)
        
        // Enhanced elastic energy with multi-segment calculation
        let elasticEnergy = 0
        if (strapDistance > naturalLength) {
          const stretch = strapDistance - naturalLength
          elasticEnergy = 0.5 * physics.hookConnectionStiffness * (stretch ** 2)
        }
        
        // Bending energy from strap curvature
        const bendingEnergy = 0.5 * physics.strapBendingStiffness * (state.strapBendingMoment ** 2) * 0.001
        
        state.totalEnergy = kineticEnergy + rotationalEnergy + potentialEnergy + elasticEnergy + bendingEnergy
        state.elasticEnergy = elasticEnergy
        
        // Store enhanced physics state
        state.position = newPos
        state.strapStretch = Math.max(0, strapDistance - naturalLength) / naturalLength
        state.strapTension = Math.min(state.strapStretch * physics.rubberBandTension * 2, physics.strapTensileStrength)

        // === ADVANCED SETTLING DETECTION ===
        const totalMotion = velocityMagnitude + Math.abs(state.angularVelocity) * 20
        const distanceFromNaturalHang = Math.abs(newPos.y - naturalHangY)
        const lateralOffset = Math.abs(newPos.x)
        
        // Multi-criteria settling with realistic thresholds
        if (totalMotion < physics.settleThreshold && 
            lateralOffset < 2 && 
            distanceFromNaturalHang < 8 &&
            state.totalStrapStress < 0.05) {
          
          // Progressive energy dissipation
          state.velocity.x *= physics.oscillationDecay
          state.velocity.y *= physics.oscillationDecay
          state.angularVelocity *= physics.oscillationDecay

          if (totalMotion < physics.settleThreshold * 0.12) {
            // Complete settling with realistic final position
            state.isAnimating = false
            setIsSwinging(false)
            setIsSettled(true)
            
            // Natural settling animation with enhanced physics
            controls.start({
              x: 0,
              y: naturalHangY,
              transition: {
                type: "spring",
                stiffness: physics.hookConnectionStiffness * 0.1,
                damping: physics.hookDamping * 50,
                mass: physics.mass * 20
              }
            })
            return
          }
        }

        // Continue advanced physics simulation
        animationFrameRef.current = requestAnimationFrame(advancedPhysicsLoop)
      }

      animationFrameRef.current = requestAnimationFrame(advancedPhysicsLoop)
    },
    [x, y, controls, physics, dimensions]
  )

  // Advanced drag handling with multi-point physics and realistic resistance
  const handleRealisticDrag = useCallback(
    (event, info) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + physics.strapLength + 40 // Adjusted for natural hanging

      // Get mouse/touch position with enhanced precision
      const clientX = event.clientX || event.touches?.[0]?.clientX || 0
      const clientY = event.clientY || event.touches?.[0]?.clientY || 0

      const rawDragX = clientX - centerX
      const rawDragY = clientY - centerY

      // Advanced drag response with realistic material resistance
      const state = physicsStateRef.current
      const distance = Math.sqrt(rawDragX ** 2 + rawDragY ** 2)
      
      // Multi-stage resistance based on material properties
      let resistanceFactor = 1
      if (distance < 50) {
        // Easy initial movement
        resistanceFactor = 1
      } else if (distance < 150) {
        // Progressive resistance as strap stretches
        resistanceFactor = 1 - (distance - 50) * 0.003
      } else {
        // High resistance near material limits
        const excessDistance = distance - 150
        resistanceFactor = 0.7 * Math.exp(-excessDistance * 0.005)
      }
      
      // Apply material fatigue effects
      const fatigueEffect = 1 - state.materialFatigue * 0.3
      resistanceFactor *= fatigueEffect
      
      let dragX = rawDragX * physics.dragResponse * resistanceFactor
      let dragY = rawDragY * physics.dragResponse * resistanceFactor

      // Enhanced multi-point constraint system
      const hookPoint = { x: 0, y: -physics.strapLength }
      const tagPoint = { x: dragX, y: dragY }
      
      // Calculate strap vector and constraints
      const strapVector = { 
        x: tagPoint.x - hookPoint.x, 
        y: tagPoint.y - hookPoint.y 
      }
      const strapDistance = Math.sqrt(strapVector.x ** 2 + strapVector.y ** 2)
      const naturalLength = physics.strapLength + state.plasticDeformation
      const maxDistance = naturalLength * (1 + physics.strapMaxStretch)

      // Advanced elastic constraint with progressive stiffening
      if (strapDistance > maxDistance) {
        const overshoot = strapDistance - maxDistance
        const stiffening = Math.exp(overshoot / (naturalLength * 0.05))
        const elasticReduction = physics.elasticRestoration / stiffening
        const constrainedDistance = maxDistance + overshoot * elasticReduction
        
        const scale = constrainedDistance / strapDistance
        dragX = hookPoint.x + strapVector.x * scale
        dragY = hookPoint.y + strapVector.y * scale
        
        // Add haptic feedback through increased resistance
        const hapticResistance = Math.min(0.8, overshoot / (naturalLength * 0.1))
        dragX *= (1 - hapticResistance)
        dragY *= (1 - hapticResistance)
      }

      // Enhanced swing angle constraints with realistic limits
      const swingAngle = Math.atan2(Math.abs(dragX), Math.abs(dragY + physics.strapLength)) * (180 / Math.PI)
      if (swingAngle > physics.maxSwingAngle) {
        const angleReduction = physics.maxSwingAngle / swingAngle
        const bendingResistance = physics.strapBendingStiffness * (swingAngle - physics.maxSwingAngle) * 0.01
        const totalReduction = angleReduction * (1 - bendingResistance)
        
        dragX *= totalReduction
        // Allow some Y compression when constrained laterally
        dragY *= Math.max(0.9, totalReduction)
      }

      // Advanced interpolation with realistic strap dynamics
      const currentX = x.get()
      const currentY = y.get()
      
      // Dynamic smoothing based on drag speed and material properties
      const dragVelocity = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2) || 0
      const baseSmoothingFactor = 0.06
      const velocitySmoothing = Math.min(0.2, dragVelocity * 0.0001)
      let smoothingFactor = baseSmoothingFactor + velocitySmoothing
      
      // Adjust smoothing based on material stress
      const stressReduction = state.totalStrapStress * 0.03
      smoothingFactor *= (1 - stressReduction)
      
      // Apply realistic strap lag and connection point behavior
      const strapLag = 0.95 - Math.abs(currentX) / physics.strapLength * 0.1
      const connectionStiffness = physics.tagConnectionStiffness / (physics.tagConnectionStiffness + 100)
      
      // Enhanced position update with connection point physics
      const targetX = currentX + (dragX - currentX) * smoothingFactor * strapLag * connectionStiffness
      const targetY = currentY + (dragY - currentY) * smoothingFactor * connectionStiffness
      
      x.set(targetX)
      y.set(targetY)

      // Update advanced physics state for realistic momentum
      const deltaTime = 0.016 // Assume 60fps
      state.velocity.x = (targetX - state.position.x) / deltaTime * 0.8
      state.velocity.y = (targetY - state.position.y) / deltaTime * 0.8
      state.position = { x: targetX, y: targetY }
      
      // Update strap stress and material properties
      const currentStrapDistance = Math.sqrt(targetX ** 2 + (targetY + physics.strapLength) ** 2)
      const stretchRatio = Math.max(0, currentStrapDistance - naturalLength) / naturalLength
      state.totalStrapStress = Math.min(1, stretchRatio * 1.5)
      
      // Calculate and store bending moment for visual feedback
      const bendingAngle = Math.atan2(targetX, targetY + physics.strapLength)
      state.strapBendingMoment = Math.sin(bendingAngle * 2) * Math.abs(targetX) * 0.1
      
      // Update connection point forces for realistic behavior
      state.hookConnection.force = {
        x: -strapVector.x * physics.hookConnectionStiffness * 0.0001,
        y: -strapVector.y * physics.hookConnectionStiffness * 0.0001
      }
      
      state.tagConnection.force = {
        x: strapVector.x * physics.tagConnectionStiffness * 0.0001,
        y: strapVector.y * physics.tagConnectionStiffness * 0.0001
      }
    },
    [x, y, physics]
  )

  // Enhanced drag end with realistic momentum transfer
  const handleRealisticDragEnd = useCallback(
    (event, info) => {
      setIsDragging(false)

      // Stop any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        physicsStateRef.current.isAnimating = false
      }

      // Calculate release velocity with realistic scaling
      const velocityScale = physics.releaseEnergyTransfer / 100 // Convert to realistic scale
      const releaseVelocity = {
        x: (info.velocity.x || 0) * velocityScale,
        y: (info.velocity.y || 0) * velocityScale
      }

      // Calculate angular velocity from drag motion
      const dragRadius = Math.sqrt(x.get() ** 2 + y.get() ** 2)
      const angularVelocity = dragRadius > 0 ? 
        ((info.velocity.x || 0) * -y.get() + (info.velocity.y || 0) * x.get()) / (dragRadius ** 2) * 0.01 : 0

      // Apply momentum conservation and start physics simulation
      setTimeout(() => {
        startRealisticPhysics(releaseVelocity, angularVelocity)
      }, 16) // Small delay for smooth transition
    },
    [x, y, startRealisticPhysics, physics]
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

  // Enhanced keyboard controls with realistic physics
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDragging || isSwinging) return

      const impulseStrength = isMobile ? 150 : 200 // Realistic impulse forces
      let velocityX = 0
      let velocityY = 0
      let angularVelocity = 0

      switch (e.key) {
        case "ArrowLeft":
          velocityX = -impulseStrength
          angularVelocity = -2
          break
        case "ArrowRight":
          velocityX = impulseStrength
          angularVelocity = 2
          break
        case "ArrowUp":
          velocityY = -impulseStrength * 0.7
          break
        case "ArrowDown":
          velocityY = impulseStrength * 0.5
          break
        case " ":
          e.preventDefault()
          // Random realistic impulse
          startRealisticPhysics({
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.3) * 150
          }, (Math.random() - 0.5) * 3)
          return
        default:
          return
      }

      startRealisticPhysics({ x: velocityX, y: velocityY }, angularVelocity)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDragging, isSwinging, isMobile, startRealisticPhysics])

  // Initial physics startup with natural hanging
  useEffect(() => {
    const timer = setTimeout(() => {
      // Start with very gentle initial swing from natural hanging position
      const naturalHang = physics.strapLength * 0.05
      y.set(naturalHang) // Set to natural hanging position first
      
      setTimeout(() => {
        startRealisticPhysics({ x: 15, y: 5 }, 0.1)
      }, 500)
    }, 1000)

    return () => clearTimeout(timer)
  }, [startRealisticPhysics, physics.strapLength, y])

  // Realistic idle environmental effects
  useEffect(() => {
    let environmentalTimer
    let microMovementTimer

    const createEnvironmentalEffects = () => {
      // Only apply environmental effects when settled
      if (isSettled && !isDragging && !isSwinging) {
        // Occasional gentle air currents
        if (Math.random() < 0.3) {
          const gentleForce = {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 8
          }
          startRealisticPhysics(gentleForce, (Math.random() - 0.5) * 0.1)
        }
      }
      
      // Schedule next environmental check
      environmentalTimer = setTimeout(createEnvironmentalEffects, 
        3000 + Math.random() * 7000) // Random interval 3-10 seconds
    }

    const createMicroMovements = () => {
      // Subtle micro-movements when idle
      if (isSettled && !isDragging && !isSwinging) {
        const time = performance.now() * 0.001
        
        // Very subtle breathing-like motion
        const microX = Math.sin(time * 0.7) * 0.3 + Math.sin(time * 0.3) * 0.2
        const microY = Math.cos(time * 0.5) * 0.2 - 3
        
        // Apply only if card is very close to rest position
        if (Math.abs(x.get()) < 5 && Math.abs(y.get() + 3) < 5) {
          const currentX = x.get()
          const currentY = y.get()
          
          // Smooth interpolation to micro-position
          x.set(currentX + (microX - currentX) * 0.02)
          y.set(currentY + (microY - currentY) * 0.02)
        }
      }
      
      microMovementTimer = requestAnimationFrame(createMicroMovements)
    }

    // Start environmental effects after initial settling
    const startTimer = setTimeout(() => {
      createEnvironmentalEffects()
      createMicroMovements()
    }, 5000)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(environmentalTimer)
      if (microMovementTimer) {
        cancelAnimationFrame(microMovementTimer)
      }
    }
  }, [isSettled, isDragging, isSwinging, x, y, startRealisticPhysics])

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

        {/* Advanced Multi-Segment Strap with Realistic Physics and Connection Points */}
        <motion.div
          className="absolute top-6 left-1/2 transform -translate-x-1/2 origin-top"
          style={{
            x: strapX,
            y: strapY,
            rotate: strapRotation,
            height: dynamicStrapLength,
            transformOrigin: "50% 0%", // Fixed hook attachment point
          }}
        >
          {/* Main strap body with advanced material physics */}
          <div
            className={`shadow-2xl rounded-sm relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900"
                : "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800"
            }`}
            style={{
              width: `${physics.strapThickness}px`,
              height: "100%",
              // Advanced textile pattern with dynamic stress response
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(0,0,0,${0.15 + strapTension.get() * 0.12}) 1px,
                  rgba(0,0,0,${0.15 + strapTension.get() * 0.12}) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,${0.08 + strapTension.get() * 0.06}) 2px,
                  rgba(255,255,255,${0.08 + strapTension.get() * 0.06}) 4px
                ),
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(
                  ${90 + strapRotation.get() * 0.5}deg,
                  transparent 40%,
                  rgba(255,255,255,${0.05 + strapTension.get() * 0.03}) 50%,
                  transparent 60%
                )
              `,
              backgroundSize: `
                100% ${2 + strapTension.get() * 3}px, 
                4px 100%, 
                8px 8px,
                100% ${20 + strapTension.get() * 10}px
              `,
              // Enhanced 3D depth with material stress visualization
              boxShadow: `
                inset ${1 + strapTension.get() * 3}px 0 6px rgba(0,0,0,${0.25 + strapTension.get() * 0.15}),
                inset -${1 + strapTension.get() * 3}px 0 6px rgba(0,0,0,${0.25 + strapTension.get() * 0.15}),
                0 0 ${8 + strapTension.get() * 6}px rgba(0,0,0,${0.35 + strapTension.get() * 0.25}),
                inset 0 ${1 + strapTension.get() * 2}px 4px rgba(255,255,255,${0.1 + strapTension.get() * 0.05}),
                inset 0 -${1 + strapTension.get() * 2}px 4px rgba(0,0,0,${0.2 + strapTension.get() * 0.1})
              `,
              // Advanced material response to stress
              filter: `
                brightness(${0.85 + strapTension.get() * 0.35}) 
                contrast(${1 + strapTension.get() * 0.6}) 
                saturate(${0.9 + strapTension.get() * 0.5})
                hue-rotate(${strapTension.get() * 5}deg)
              `,
              // Realistic material deformation under stress
              transform: `
                scaleX(${1 - strapTension.get() * 0.18}) 
                scaleY(${0.98 + strapTension.get() * 0.06})
                skewY(${strapRotation.get() * 0.1}deg)
              `,
              // Material properties visualization
              borderLeft: `0.5px solid rgba(139, 69, 19, ${0.6 + strapTension.get() * 0.4})`,
              borderRight: `0.5px solid rgba(139, 69, 19, ${0.6 + strapTension.get() * 0.4})`,
            }}
          >
            {/* Enhanced stitched edges with stress-responsive behavior */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-amber-900 transition-all duration-75" 
              style={{ 
                width: `${0.5 + strapTension.get() * 0.4}px`,
                opacity: 0.8 + strapTension.get() * 0.2,
                boxShadow: `inset 1px 0 2px rgba(0,0,0,${0.3 + strapTension.get() * 0.2})`
              }}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 bg-amber-900 transition-all duration-75" 
              style={{ 
                width: `${0.5 + strapTension.get() * 0.4}px`,
                opacity: 0.8 + strapTension.get() * 0.2,
                boxShadow: `inset -1px 0 2px rgba(0,0,0,${0.3 + strapTension.get() * 0.2})`
              }}
            />
            
            {/* Advanced multi-segment weave pattern with physics response */}
            <motion.div 
              className="absolute inset-0"
              style={{
                opacity: useTransform(strapTension, [0.85, 2.5], [0.25, 0.7]),
                backgroundImage: `
                  repeating-linear-gradient(
                    ${45 + strapRotation.get() * 0.2}deg,
                    transparent,
                    transparent ${2 - strapTension.get() * 0.3}px,
                    rgba(255,255,255,${0.1 + strapTension.get() * 0.06}) ${2 - strapTension.get() * 0.3}px,
                    rgba(255,255,255,${0.1 + strapTension.get() * 0.06}) ${4 - strapTension.get() * 0.5}px
                  ),
                  repeating-linear-gradient(
                    ${-45 - strapRotation.get() * 0.2}deg,
                    transparent,
                    transparent ${2 - strapTension.get() * 0.3}px,
                    rgba(0,0,0,${0.1 + strapTension.get() * 0.06}) ${2 - strapTension.get() * 0.3}px,
                    rgba(0,0,0,${0.1 + strapTension.get() * 0.06}) ${4 - strapTension.get() * 0.5}px
                  )
                `,
                backgroundSize: `${8 - strapTension.get() * 1.5}px ${8 - strapTension.get() * 1.5}px`,
                transform: `scaleY(${1 + strapTension.get() * 0.1})`
              }}
            />

            {/* Stress concentration indicators (realistic material behavior) */}
            {Array.from({ length: 5 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  top: `${20 + i * 15}%`,
                  width: `${1 + strapTension.get() * 0.5}px`,
                  height: `${0.5 + strapTension.get() * 0.3}px`,
                  backgroundColor: `rgba(139, 69, 19, ${0.4 + strapTension.get() * 0.3})`,
                  opacity: useTransform(strapTension, [1, 2.5], [0.3, 0.8]),
                  borderRadius: '50%',
                }}
              />
            ))}

            {/* Enhanced hook connection hardware (fixed attachment point) */}
            <div 
              className={`absolute top-1 left-1/2 transform -translate-x-1/2 rounded-sm shadow-lg transition-all duration-100 ${
                isDark ? 'bg-gray-400' : 'bg-gray-500'
              }`}
              style={{
                width: `${8 + strapTension.get() * 2.5}px`,
                height: `${3 + strapTension.get() * 0.8}px`,
                boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.4),
                  inset 0 -1px 2px rgba(0,0,0,0.4),
                  0 2px 4px rgba(0,0,0,0.3),
                  0 0 ${2 + strapTension.get()}px rgba(255,255,255,0.1)
                `,
                transform: `scaleY(${1 + strapTension.get() * 0.2})`
              }}
            >
              {/* Connection point detail */}
              <div 
                className="absolute inset-0.5 bg-gradient-to-b from-gray-300 to-gray-600 rounded-sm"
                style={{
                  boxShadow: `inset 0 0.5px 1px rgba(255,255,255,0.5)`
                }}
              />
            </div>
            
            {/* Enhanced tag connection hardware (dynamic response) */}
            <motion.div 
              className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 rounded-sm shadow-sm transition-all duration-100 ${
                isDark ? 'bg-gray-500' : 'bg-gray-600'
              }`}
              style={{
                width: useTransform(strapTension, [0.85, 2.5], [8, 14]),
                height: useTransform(strapTension, [0.85, 2.5], [3, 5]),
                boxShadow: `
                  inset 0 1px 1px rgba(255,255,255,0.3),
                  inset 0 -1px 1px rgba(0,0,0,0.3),
                  0 1px 2px rgba(0,0,0,0.4),
                  0 0 ${1 + strapTension.get() * 2}px rgba(255,255,255,0.1)
                `,
                transform: `scaleY(${1 + strapTension.get() * 0.15}) rotateX(${strapTension.get() * 2}deg)`
              }}
            >
              {/* Connection ring detail */}
              <motion.div 
                className="absolute inset-0.5 bg-gradient-to-b from-gray-400 to-gray-700 rounded-sm"
                style={{
                  opacity: useTransform(strapTension, [0.85, 2.5], [0.8, 1]),
                  boxShadow: `inset 0 0.5px 1px rgba(255,255,255,0.4)`
                }}
              />
            </motion.div>

            {/* Material fatigue indicators (appear under extreme stress) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: useTransform(strapTension, [2, 2.5], [0, 0.3]),
                backgroundImage: `
                  repeating-linear-gradient(
                    ${Math.random() * 360}deg,
                    transparent,
                    transparent 8px,
                    rgba(139, 69, 19, 0.4) 8px,
                    rgba(139, 69, 19, 0.4) 9px
                  )
                `,
                filter: 'blur(0.5px)',
              }}
            />

            {/* Advanced lighting effects for realism */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                background: `
                  linear-gradient(
                    ${90 + strapRotation.get()}deg,
                    rgba(255,255,255,${0.15 + strapTension.get() * 0.1}) 0%,
                    transparent 20%,
                    transparent 80%,
                    rgba(0,0,0,${0.1 + strapTension.get() * 0.05}) 100%
                  ),
                  radial-gradient(
                    ellipse 200% 100% at 50% 0%,
                    rgba(255,255,255,${0.2 + strapTension.get() * 0.1}) 0%,
                    transparent 30%
                  ),
                  radial-gradient(
                    ellipse 200% 100% at 50% 100%,
                    rgba(0,0,0,${0.15 + strapTension.get() * 0.08}) 0%,
                    transparent 40%
                  )
                `
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ID Card with Enhanced Realistic Physics */}
      <motion.div
        ref={cardRef}
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleRealisticDrag}
        onDragEnd={handleRealisticDragEnd}
        animate={controls}
        style={{
          x: constrainedX,
          y: constrainedY,
          rotate: cardRotation,
          rotateX: isHovering && !isDragging ? hoverTiltX : 0,
          rotateY: isHovering && !isDragging ? hoverTiltY : 0,
          width: dimensions.cardWidth,
          height: dimensions.cardHeight,
          marginTop: physics.strapLength + 15,
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
        
        {/* Enhanced Realistic Shadow System with Physics-Based Movement */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-40"
          style={{
            background: "radial-gradient(ellipse 140% 100% at 50% 130%, rgba(0,0,0,0.5), transparent 70%)",
            y: useTransform(constrainedY, [-physics.strapLength * 0.1, physics.strapLength * (1 + physics.strapMaxStretch)], [8, 45]),
            x: useTransform(constrainedX, [-physics.strapLength * 0.8, physics.strapLength * 0.8], [-15, 15]),
            scale: useTransform(constrainedY, [-physics.strapLength * 0.1, physics.strapLength * (1 + physics.strapMaxStretch)], [0.9, 1.6]),
            filter: useTransform(constrainedY, [-physics.strapLength * 0.1, physics.strapLength * (1 + physics.strapMaxStretch)], ["blur(10px)", "blur(35px)"]),
            skewX: useTransform(constrainedX, [-physics.strapLength * 0.8, physics.strapLength * 0.8], [8, -8]),
          }}
        />

        {/* Secondary shadow for depth */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-25"
          style={{
            background: "linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
            y: useTransform(constrainedY, [-physics.strapLength * 0.1, physics.strapLength * (1 + physics.strapMaxStretch)], [4, 25]),
            x: useTransform(constrainedX, [-physics.strapLength * 0.8, physics.strapLength * 0.8], [-8, 8]),
            scale: useTransform(constrainedY, [-physics.strapLength * 0.1, physics.strapLength * (1 + physics.strapMaxStretch)], [0.95, 1.3]),
            filter: "blur(6px)",
            rotate: useTransform(cardRotation, [-physics.maxSwingAngle, physics.maxSwingAngle], [3, -3])
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
          <div className="p-4 space-y-4 pb-14"> {/* Added bottom padding to prevent footer overlap */}
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
                    {normalizeImageUrl(personalInfo?.avatar) && !imageError && (
                      <img
                        src={normalizeImageUrl(personalInfo.avatar)}
                        alt={`${personalInfo?.name || "Developer"} Professional Photo`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onLoad={(e) => {
                          setImageLoaded(true);
                          setImageError(false);
                        }}
                        onError={(e) => {
                          setImageError(true);
                          setImageLoaded(false);
                        }}
                        onLoadStart={() => {
                          setImageLoaded(false);
                        }}
                        style={{
                          filter: "contrast(1.05) saturate(1.1)",
                          opacity: 1,
                          transition: "opacity 0.3s ease-in-out",
                          zIndex: 2
                        }}
                      />
                    )}
                    
                    {/* Loading state - Only show when we have avatar URL, no error, AND image hasn't loaded yet */}
                    {personalInfo?.avatar && normalizeImageUrl(personalInfo?.avatar) && !imageError && !imageLoaded && (
                      <div
                        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center ${
                          isDark ? "bg-slate-700/40" : "bg-gray-100/40"
                        }`}
                        style={{ zIndex: 1 }}
                      >
                        <div className={`${isMobile ? "text-lg" : "text-xl"} mb-1 opacity-60`}>
                          <div className="animate-spin">⚪</div>
                        </div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"} opacity-60`}>
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
            <div className="text-center space-y-2"> {/* Reduced space-y from 3 to 2 */}
              <h3 className={`font-bold ${textSizes.name} leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                {personalInfo?.name || "Loading..."}
              </h3>
              <p className={`${textSizes.title} font-semibold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                {personalInfo?.title || "Portfolio Loading..."}
              </p>

              {/* Enhanced Details Section with better spacing */}
              <div
                className={`space-y-1.5 ${textSizes.details} p-3 mx-1 rounded-xl ${
                  isDark ? "bg-slate-800/50 border border-slate-600/30" : "bg-gray-100/50 border border-gray-300/30"
                }`}
                style={{
                  boxShadow: `
                    inset 0 1px 3px rgba(0,0,0,0.1),
                    0 1px 2px rgba(0,0,0,0.05)
                  `
                }}
              >
                <div
                  className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <span className="flex-shrink-0">📍</span>
                  <span className="truncate">{personalInfo?.location || "Location Loading..."}</span>
                </div>
                <div
                  className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <span className="flex-shrink-0">✉️</span>
                  <span className="font-mono text-xs truncate">{personalInfo?.email || "email@loading.com"}</span>
                </div>
                <div
                  className={`flex items-center justify-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <span className="flex-shrink-0">🏢</span>
                  <span className="truncate">Software Development</span>
                </div>
              </div>
            </div>

            {/* Compact QR Code */}
            <div className="flex justify-center">
              <div
                className={`${isMobile ? "w-14 h-14" : "w-16 h-16"} rounded-lg p-1.5 ${
                  isDark ? "bg-white" : "bg-gray-900"
                }`}
                style={{
                  boxShadow: `
                    0 2px 8px rgba(0,0,0,0.15),
                    inset 0 1px 2px rgba(255,255,255,0.1)
                  `
                }}
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

          {/* Enhanced Footer with better positioning */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-4 ${
              isDark ? "bg-gradient-to-r from-slate-800 to-slate-700" : "bg-gradient-to-r from-gray-100 to-gray-200"
            }`}
            style={{
              borderTop: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
              boxShadow: `
                inset 0 1px 3px rgba(255,255,255,0.1),
                0 -2px 4px rgba(0,0,0,0.1)
              `
            }}
          >
            <div className={`${textSizes.details} font-mono font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              AUTHORIZED • VERIFIED
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm" />
              <span className={`${textSizes.details} font-mono font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
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
