import DotsView from '../../components/views/DotsView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const DotsPage = () => {
  const { isEmbed, viewState } = useViewShell();

  return (
    <ViewLayout mainClassName={isEmbed ? '' : 'items-start px-2 pb-3 pt-[4.5rem] sm:px-3 sm:pb-4 sm:pt-[5rem]'}>
      <DotsView
        shape={viewState.dots.shape}
        triangleMode={viewState.dots.triangleMode}
        triangleAngle={viewState.dots.triangleAngle}
        gapX={viewState.dots.gapX}
        gapY={viewState.dots.gapY}
        inset={viewState.dots.inset}
        outerX={viewState.dots.outerX}
        outerY={viewState.dots.outerY}
        primaryColor={viewState.dots.primary}
        alternateColor={viewState.dots.alternate}
      />
    </ViewLayout>
  );
};

export default DotsPage;
