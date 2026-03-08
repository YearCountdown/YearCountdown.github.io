import DotsView from '../../components/views/DotsView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const DotsPage = () => {
  const { viewState } = useViewShell();

  return (
    <ViewLayout>
      <DotsView
        shape={viewState.dots.shape}
        triangleMode={viewState.dots.triangleMode}
        triangleAngle={viewState.dots.triangleAngle}
        gap={viewState.dots.gap}
        inset={viewState.dots.inset}
      />
    </ViewLayout>
  );
};

export default DotsPage;
