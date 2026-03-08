import { useEffect, useMemo, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getTier = ({ width, height, aspectRatio }) => {
  const minDimension = Math.min(width, height);

  if (minDimension <= 260 || width <= 280 || height <= 250) {
    return 'micro';
  }

  if (width <= 420 || height <= 320 || aspectRatio <= 0.82) {
    return 'compact';
  }

  if (width >= 1100 && height >= 560 && aspectRatio >= 1.25) {
    return 'wide';
  }

  return 'balanced';
};

const getAllModeColumns = ({ tier, width, height, aspectRatio }) => {
  if (tier === 'micro') {
    if (width <= 170 || aspectRatio < 0.72) {
      return 1;
    }

    return height <= 230 ? 2 : 1;
  }

  if (tier === 'compact') {
    return width >= 360 && height >= 260 && aspectRatio >= 0.7 ? 2 : 1;
  }

  if (tier === 'wide') {
    return 4;
  }

  if (aspectRatio >= 1.2 && width >= 680) {
    return 4;
  }

  return 2;
};

const getFramePadding = (tier, minDimension) => {
  switch (tier) {
    case 'micro':
      return {
        x: clamp(minDimension * 0.045, 6, 10),
        y: clamp(minDimension * 0.05, 6, 10),
        radius: clamp(minDimension * 0.065, 10, 14),
      };
    case 'compact':
      return {
        x: clamp(minDimension * 0.075, 14, 20),
        y: clamp(minDimension * 0.085, 14, 22),
        radius: clamp(minDimension * 0.085, 18, 24),
      };
    case 'wide':
      return {
        x: clamp(minDimension * 0.085, 22, 44),
        y: clamp(minDimension * 0.1, 22, 52),
        radius: clamp(minDimension * 0.09, 24, 34),
      };
    default:
      return {
        x: clamp(minDimension * 0.08, 18, 28),
        y: clamp(minDimension * 0.09, 18, 32),
        radius: clamp(minDimension * 0.085, 20, 28),
      };
  }
};

const getCountdownTokens = ({ width, height, mode, labels }) => {
  const safeWidth = Math.max(width, 120);
  const safeHeight = Math.max(height, 120);
  const minDimension = Math.min(safeWidth, safeHeight);
  const aspectRatio = safeWidth / safeHeight;
  const tier = getTier({ width: safeWidth, height: safeHeight, aspectRatio });
  const frame = getFramePadding(tier, minDimension);
  const subtitleSize = clamp(minDimension * 0.034, tier === 'micro' ? 6.5 : 9, tier === 'wide' ? 13 : 12);
  const subtitleTracking = tier === 'micro' ? 0.12 : tier === 'compact' ? 0.22 : 0.3;

  if (mode !== 'all') {
    const numberSize = clamp(
      Math.min(safeWidth * 0.48, safeHeight * (labels ? 0.34 : 0.44)),
      tier === 'micro' ? 24 : 42,
      tier === 'wide' ? 250 : 190,
    );

    return {
      tier,
      width: safeWidth,
      height: safeHeight,
      aspectRatio,
      frame,
      subtitleSize,
      subtitleTracking,
      stackGap: clamp(minDimension * 0.03, tier === 'micro' ? 4 : 8, tier === 'wide' ? 26 : 18),
      numberSize,
      numberTracking: tier === 'micro' ? 0.015 : tier === 'compact' ? 0.045 : 0.08,
      labelSize: clamp(minDimension * 0.03, tier === 'micro' ? 6.5 : 9, 13),
      labelTracking: tier === 'micro' ? 0.08 : 0.22,
      useShortLabels: tier === 'micro',
    };
  }

  const columns = getAllModeColumns({ tier, width: safeWidth, height: safeHeight, aspectRatio });
  const rows = Math.ceil(4 / columns);
  const gap = clamp(
    minDimension * (tier === 'micro' ? 0.025 : tier === 'compact' ? 0.04 : 0.05),
    tier === 'micro' ? 4 : 8,
    tier === 'wide' ? 28 : 20,
  );
  const cellWidth = (safeWidth - gap * (columns - 1)) / columns;
  const cellHeight = (safeHeight - subtitleSize * (tier === 'micro' ? 1.5 : 2.4) - gap * (rows - 1)) / rows;
  const numberSize = clamp(
    Math.min(cellWidth * (tier === 'micro' ? 0.42 : 0.5), cellHeight * (labels ? (tier === 'micro' ? 0.44 : 0.5) : 0.68)),
    tier === 'micro' ? 16 : 36,
    tier === 'wide' ? 126 : 90,
  );

  return {
    tier,
    width: safeWidth,
    height: safeHeight,
    aspectRatio,
    columns,
    rows,
    frame,
    gap,
    subtitleSize,
    subtitleTracking,
    stackGap: gap,
    numberSize,
    numberTracking: tier === 'micro' ? 0.012 : tier === 'compact' ? 0.05 : 0.08,
    labelSize: clamp(minDimension * 0.026, tier === 'micro' ? 6 : 9, 12),
    labelTracking: tier === 'micro' ? 0.06 : tier === 'compact' ? 0.18 : 0.24,
    useShortLabels: tier === 'micro',
  };
};

const useResponsiveCountdown = ({ mode, labels }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const element = containerRef.current;

    const updateSize = () => {
      const nextWidth = element.clientWidth;
      const nextHeight = element.clientHeight;

      setSize((current) => {
        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const tokens = useMemo(() => {
    return getCountdownTokens({
      width: size.width,
      height: size.height,
      mode,
      labels,
    });
  }, [labels, mode, size.height, size.width]);

  return {
    containerRef,
    tokens,
  };
};

export default useResponsiveCountdown;
