import React, { useLayoutEffect, useRef, useState } from 'react';

// Data attributes let exports undo the scaling in html2canvas' cloned document
export const SCALE_OUTER_ATTR = 'data-scale-outer';
export const SCALE_INNER_ATTR = 'data-scale-inner';

// Renders children at a fixed width, shrunk to fit narrower containers (e.g. phones)
const ScaleToFit = ({ width, children }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      setScale(Math.min(1, outerRef.current.clientWidth / width));
      setHeight(innerRef.current.offsetHeight);
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(outerRef.current);
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={outerRef}
      {...{ [SCALE_OUTER_ATTR]: '' }}
      style={{ width: '100%', height: height ? height * scale : undefined, overflow: 'hidden' }}
    >
      <div
        ref={innerRef}
        {...{ [SCALE_INNER_ATTR]: '' }}
        style={{ width, margin: '0 auto', transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScaleToFit;
