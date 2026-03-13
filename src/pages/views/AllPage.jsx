import AllView from '../../components/views/AllView';
import useViewShell from '../../hooks/useViewShell';
import ViewLayout from '../../layouts/ViewLayout/ViewLayout';

const AllPage = () => {
  const { isEmbed, resolvedTextTone, viewState } = useViewShell();

  return (
    <ViewLayout mainClassName={isEmbed ? '' : 'items-start pt-[4.5rem] sm:pt-[5rem]'}>
      <AllView
        dotsMode={viewState.all.dotsMode}
        dotsCount={viewState.all.dotsCount}
        showDays={viewState.all.showDays}
        showPercentBox={viewState.all.showPercentBox}
        showPerimeter={viewState.all.showPerimeter}
        timezone={viewState.all.timezone}
        shape={viewState.all.shape}
        triangleMode={viewState.all.triangleMode}
        triangleAngle={viewState.all.triangleAngle}
        gapX={viewState.all.gapX}
        gapY={viewState.all.gapY}
        inactiveOpacity={viewState.all.inactiveOpacity}
        daysFontSize={viewState.all.daysFontSize}
        daysLabel={viewState.all.daysLabel}
        decimals={viewState.all.decimals}
        summaryLayout={viewState.all.summaryLayout}
        summaryHeight={viewState.all.summaryHeight}
        summaryGap={viewState.all.summaryGap}
        percentBoxSize={viewState.all.percentBoxSize}
        percentFontSize={viewState.all.percentFontSize}
        percentGap={viewState.all.percentGap}
        progressBarHeight={viewState.all.progressBarHeight}
        perimeterThickness={viewState.all.perimeterThickness}
        spaceTop={viewState.all.spaceTop}
        spaceRight={viewState.all.spaceRight}
        spaceBottom={viewState.all.spaceBottom}
        spaceLeft={viewState.all.spaceLeft}
        primaryColor={viewState.all.primary}
        alternateColor={viewState.all.alternate}
        textTone={resolvedTextTone}
      />
    </ViewLayout>
  );
};

export default AllPage;
