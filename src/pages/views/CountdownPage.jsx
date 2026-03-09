import CountdownView from '../../components/views/CountdownView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';
import { getToneColor } from '../../lib/viewColors';

const CountdownPage = () => {
  const { isEmbed, resolvedTextTone, viewState } = useViewShell();

  return (
    <ViewLayout mainClassName={isEmbed ? '' : 'pt-[4.5rem] sm:pt-[5rem]'}>
      <CountdownView
        mode={viewState.countdown.mode}
        frame={viewState.countdown.frame}
        labels={viewState.countdown.labels}
        primaryColor={viewState.countdown.primary}
        alternateColor={viewState.countdown.alternate}
        textToneColor={getToneColor(resolvedTextTone)}
      />
    </ViewLayout>
  );
};

export default CountdownPage;
