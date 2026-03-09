import ProgressView from '../../components/views/ProgressView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';
import { getToneColor } from '../../lib/viewColors';

const ProgressPage = () => {
  const { isEmbed, resolvedTextTone, viewState } = useViewShell();
  const { mode, fullScreen, decimals, fontSize, lineWidth, inset, outerX, outerY } = viewState.progress;

  const mainClassName = isEmbed
    ? ''
    : fullScreen
      ? 'items-start pt-[4.5rem] sm:pt-[5rem]'
      : 'items-start pt-[5.5rem] sm:pt-[6.5rem]';

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
        primaryColor={viewState.progress.primary}
        alternateColor={viewState.progress.alternate}
        textToneColor={getToneColor(resolvedTextTone)}
      />
    </ViewLayout>
  );
};

export default ProgressPage;
