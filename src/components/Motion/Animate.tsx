import { motion } from "framer-motion";

const Animate = ({ children, customIndex }: { children: any, customIndex: any }) => {
  const variants = {
    default: {
      x: -1000,
      opacity: 0,
    },
    visible: (custom: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        x: {
          duration: 0.6, ease: [0.34, 1.26, 0.64, 1]
        },
        opacity: {
          duration: 0.5, delay: custom * 0.15,
        }
      }
    }),
  };

  return (
    <motion.div
      variants={variants}
      viewport={{ once: false }}
      custom={customIndex}
    >
      {children}
    </motion.div>
  );
};

export default Animate;