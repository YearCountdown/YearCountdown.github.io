import CountdownView from '../../components/views/CountdownView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const CountdownPage = () => {
  const { isEmbed, viewState } = useViewShell();

  return (
    <ViewLayout mainClassName={isEmbed ? '' : 'px-2 pb-3 pt-[4.5rem] sm:px-3 sm:pb-4 sm:pt-[5rem]'}>
      <CountdownView
        mode={viewState.countdown.mode}
        frame={viewState.countdown.frame}
        labels={viewState.countdown.labels}
        primaryColor={viewState.countdown.primary}
        alternateColor={viewState.countdown.alternate}
      />
    </ViewLayout>
  );
};

export default CountdownPage;
