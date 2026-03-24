import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const SplitText = ({ 
  text = "", 
  className = "", 
  delay = 0, 
  animation = { y: 0, opacity: 1 }, 
  initial = { y: '100%', opacity: 0 } 
}) => {
  const words = text.split(" ");
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  };

  const childVariants = {
    hidden: initial,
    visible: {
      ...animation,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap overflow-hidden py-1">
          <motion.span variants={childVariants} className="inline-block mr-2">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default SplitText;
