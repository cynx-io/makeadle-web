"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TestDropAnimation() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow((v) => !v)}>Toggle</button>

      <AnimatePresence>
        {show && (
          <motion.div
            key="box"
            initial={{ opacity: 0, y: -20, maxHeight: 0 }}
            animate={{ opacity: 1, y: 0, maxHeight: 200 }}
            exit={{ opacity: 0, y: -20, maxHeight: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              background: "lightblue",
              padding: "1rem",
            }}
          >
            Animated content
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
