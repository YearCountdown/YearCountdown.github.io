import useDotsGrid from '../../hooks/useDotsGrid';

const getTriangleRotation = ({ triangleMode, triangleAngle, index }) => {
  if (triangleMode === 'angle') {
    return triangleAngle;
  }

  if (triangleMode === 'inverted') {
    return 180;
  }

  if (triangleMode === 'alternating') {
    return index % 2 === 0 ? 0 : 180;
  }

  return 0;
};

const getDotStyle = ({ status, shape, size, rotation }) => {
  if (status === 'filler') {
    return {
      visibility: 'hidden',
      width: `${size}px`,
      height: `${size}px`,
    };
  }

  const opacityByStatus = {
    past: 0.6,
    current: 1,
    future: 0.14,
  };

  const scaleByStatus = {
    past: 1,
    current: 1.06,
    future: 1,
  };

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'currentColor',
    opacity: opacityByStatus[status],
    transform: `rotate(${rotation}deg) scale(${scaleByStatus[status]})`,
    transition: 'transform 200ms ease, opacity 200ms ease',
  };

  if (shape === 'circle') {
    return {
      ...baseStyle,
      borderRadius: '9999px',
      boxShadow: status === 'current' ? '0 0 0.75rem color-mix(in srgb, currentColor 28%, transparent)' : 'none',
    };
  }

  if (shape === 'square') {
    return {
      ...baseStyle,
      borderRadius: status === 'current' ? '22%' : '12%',
      boxShadow: status === 'current' ? '0 0 0.75rem color-mix(in srgb, currentColor 20%, transparent)' : 'none',
    };
  }

  return {
    ...baseStyle,
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    boxShadow: status === 'current' ? '0 0 0.85rem color-mix(in srgb, currentColor 24%, transparent)' : 'none',
  };
};

const DotsView = ({
  shape = 'circle',
  triangleMode = 'upright',
  triangleAngle = 0,
  gap = 0.5,
  inset = 0.5,
}) => {
  const { containerRef, dots, grid } = useDotsGrid({
    gapPercent: gap,
    insetPercent: inset,
  });

  return (
    <section ref={containerRef} className="flex h-full w-full items-center justify-center text-black dark:text-white">
      <div
        className="grid"
        style={{
          width: `${grid.innerWidth}px`,
          height: `${grid.innerHeight}px`,
          gridTemplateColumns: `repeat(${grid.columns}, ${grid.dotSize}px)`,
          gridAutoRows: `${grid.dotSize}px`,
          columnGap: `${grid.gapPx}px`,
          rowGap: `${grid.gapPx}px`,
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        {dots.map((dot, index) => (
          <div
            key={dot.key}
            aria-hidden="true"
            style={getDotStyle({
              status: dot.status,
              shape,
              size: grid.dotSize,
              rotation:
                shape === 'triangle'
                  ? getTriangleRotation({
                      triangleMode,
                      triangleAngle,
                      index,
                    })
                  : 0,
            })}
          />
        ))}
      </div>
    </section>
  );
};

export default DotsView;
