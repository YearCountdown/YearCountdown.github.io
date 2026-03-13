import PieView from '../../components/views/PieView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';
import { getToneColor } from '../../lib/viewColors';

const PiePage = () => {
  const { isEmbed, resolvedTextTone, viewState } = useViewShell();
  const { shape, style, fullScreen, decimals, spaceTop, spaceRight, spaceBottom, spaceLeft } = viewState.pie;

  const mainClassName = isEmbed
    ? ''
    : fullScreen
      ? 'items-start pt-[4.5rem] sm:pt-[5rem]'
      : 'items-start pt-[5.5rem] sm:pt-[6.5rem]';

  return (
    <ViewLayout mainClassName={mainClassName} fullBleed={isEmbed || fullScreen}>
      <PieView
        shape={shape}
        style={style}
        fullScreen={fullScreen}
        decimals={decimals}
        timezone={viewState.pie.timezone}
        spaceTop={spaceTop}
        spaceRight={spaceRight}
        spaceBottom={spaceBottom}
        spaceLeft={spaceLeft}
        primaryColor={viewState.pie.primary}
        alternateColor={viewState.pie.alternate}
        textToneColor={getToneColor(resolvedTextTone)}
      />
    </ViewLayout>
  );
};

export default PiePage;
