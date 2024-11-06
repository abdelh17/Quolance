"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
const FadeRight = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateX: 70 }}
      whileInView={{ opacity: 1, translateX: 0, transition: { duration: 0.8 } }}
    >
      {children}
    </motion.div>
  );
};
export default FadeRight;
