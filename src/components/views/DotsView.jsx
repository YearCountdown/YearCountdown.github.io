import useDotsGrid from '../../hooks/useDotsGrid';
import { withAlpha } from '../../lib/viewColors';

const getTriangleRotation = ({ triangleMode, triangleAngle, row, column }) => {
  if (triangleMode === 'angle') {
    return triangleAngle;
  }

  if (triangleMode === 'inverted') {
    return 180;
  }

  if (triangleMode === 'alternating') {
    return (row + column) % 2 === 0 ? 0 : 180;
  }

  return 0;
};

const getDotStyle = ({
  status,
  shape,
  size,
  rotation,
  primaryColor,
  inactiveOpacity,
}) => {
  if (status === 'filler') {
    return {
      visibility: 'hidden',
      width: `${size}px`,
      height: `${size}px`,
    };
  }

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: status === 'future' ? withAlpha(primaryColor, inactiveOpacity / 100) : primaryColor,
    opacity: 1,
    transform: `rotate(${rotation}deg) scale(1)`,
    transition: 'transform 200ms ease, opacity 200ms ease',
  };

  if (shape === 'circle') {
    return {
      ...baseStyle,
      borderRadius: '9999px',
      boxShadow: 'none',
    };
  }

  if (shape === 'square') {
    return {
      ...baseStyle,
      borderRadius: '12%',
      boxShadow: 'none',
    };
  }

  return {
    ...baseStyle,
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    boxShadow: 'none',
  };
};

const DotsView = ({
  shape = 'circle',
  triangleMode = 'upright',
  triangleAngle = 0,
  gapX = 0.5,
  gapY = 0.5,
  spaceTop = 0,
  spaceRight = 0,
  spaceBottom = 0,
  spaceLeft = 0,
  inactiveOpacity = 5,
  primaryColor,
  alternateColor,
}) => {
  const { containerRef, dots, grid } = useDotsGrid({
    gapXPercent: gapX,
    gapYPercent: gapY,
    spaceTopPercent: spaceTop,
    spaceRightPercent: spaceRight,
    spaceBottomPercent: spaceBottom,
    spaceLeftPercent: spaceLeft,
  });

  return (
    <section
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: alternateColor }}
    >
      <div
        className="absolute grid"
        style={{
          left: `${grid.leftPx}px`,
          top: `${grid.topPx}px`,
          width: `${grid.innerWidth}px`,
          height: `${grid.innerHeight}px`,
          gridTemplateColumns: `repeat(${grid.columns}, ${grid.dotSize}px)`,
          gridAutoRows: `${grid.dotSize}px`,
          columnGap: `${grid.gapXPx}px`,
          rowGap: `${grid.gapYPx}px`,
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        {dots.map((dot, index) => {
          const column = index % grid.columns;
          const row = Math.floor(index / grid.columns);

          return (
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
                        row,
                        column,
                      })
                    : 0,
                primaryColor,
                inactiveOpacity,
              })}
            />
          );
        })}
      </div>
    </section>
  );
};

export default DotsView;
