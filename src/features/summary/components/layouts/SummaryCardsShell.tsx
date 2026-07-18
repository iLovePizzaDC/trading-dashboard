import TabButton from '@/features/summary/components/atoms/TabButton';
import { SUMMARY_TABS, type TabType } from '@/features/summary/types/tab';

interface ISummaryCardsShell {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

function SummaryCardsShell({ activeTab, handleTabChange, children }: ISummaryCardsShell) {
  return (
    <>
      <div className='relative flex border-b border-white/10'>
        <TabButton
          tab='overview'
          label='Overview'
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        <TabButton
          tab='capital'
          label='Capital'
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        <TabButton
          tab='performance'
          label='Performance'
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />

        <div
          className='absolute bottom-0 h-0.5 bg-purple-500 transition-transform duration-300'
          style={{
            width: `${100 / SUMMARY_TABS.length}%`,
            transform: `translateX(${SUMMARY_TABS.indexOf(activeTab) * 100}%)`,
          }}
          data-testid='summary-indicator'
        />
      </div>

      {children}
    </>
  );
}

export default SummaryCardsShell;
