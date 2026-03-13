import DotsView from '../../components/views/DotsView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const DotsPage = () => {
  const { isEmbed, viewState } = useViewShell();

  return (
    <ViewLayout mainClassName={isEmbed ? '' : 'items-start pt-[4.5rem] sm:pt-[5rem]'}>
      <DotsView
        shape={viewState.dots.shape}
        triangleMode={viewState.dots.triangleMode}
        triangleAngle={viewState.dots.triangleAngle}
        timezone={viewState.dots.timezone}
        gapX={viewState.dots.gapX}
        gapY={viewState.dots.gapY}
        inactiveOpacity={viewState.dots.inactiveOpacity}
        spaceTop={viewState.dots.spaceTop}
        spaceRight={viewState.dots.spaceRight}
        spaceBottom={viewState.dots.spaceBottom}
        spaceLeft={viewState.dots.spaceLeft}
        primaryColor={viewState.dots.primary}
        alternateColor={viewState.dots.alternate}
      />
    </ViewLayout>
  );
};

export default DotsPage;
