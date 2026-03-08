import PieView from '../../components/views/PieView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const PiePage = () => {
  const { isEmbed, viewState } = useViewShell();
  const { shape, style, fullScreen, decimals, inset, outerX, outerY } = viewState.pie;

  const mainClassName = isEmbed
    ? ''
    : fullScreen
      ? 'items-start pt-[4.5rem] sm:pt-[5rem]'
      : 'items-start px-4 pb-6 pt-[5.5rem] sm:px-6 sm:pb-8 sm:pt-[6.5rem]';

  return (
    <ViewLayout mainClassName={mainClassName} fullBleed={isEmbed || fullScreen}>
      <PieView
        shape={shape}
        style={style}
        fullScreen={fullScreen}
        decimals={decimals}
        inset={inset}
        outerX={outerX}
        outerY={outerY}
        primaryColor={viewState.pie.primary}
        alternateColor={viewState.pie.alternate}
      />
    </ViewLayout>
  );
};

export default PiePage;
