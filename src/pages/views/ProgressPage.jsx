import ProgressView from '../../components/views/ProgressView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const ProgressPage = () => {
  const { isEmbed, viewState } = useViewShell();
  const { mode, fullScreen, decimals, fontSize, lineWidth, inset, outerX, outerY } = viewState.progress;

  const mainClassName = isEmbed
    ? ''
    : fullScreen
      ? 'items-start pt-[4.5rem] sm:pt-[5rem]'
      : 'items-start px-4 pb-6 pt-[5.5rem] sm:px-6 sm:pb-8 sm:pt-[6.5rem]';

  return (
    <ViewLayout mainClassName={mainClassName} fullBleed={isEmbed || fullScreen}>
      <ProgressView
        mode={mode}
        fullScreen={fullScreen}
        decimals={decimals}
        fontSize={fontSize}
        lineWidth={lineWidth}
        inset={inset}
        outerX={outerX}
        outerY={outerY}
      />
    </ViewLayout>
  );
};

export default ProgressPage;
