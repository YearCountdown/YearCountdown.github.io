import CountdownView from '../../components/views/CountdownView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const CountdownPage = () => {
  const { viewState } = useViewShell();

  return (
    <ViewLayout>
      <CountdownView
        mode={viewState.countdown.mode}
        frame={viewState.countdown.frame}
        labels={viewState.countdown.labels}
      />
    </ViewLayout>
  );
};

export default CountdownPage;
