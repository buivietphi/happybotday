'use client';

import { useCallback, useState } from 'react';
import config from '@/content/site.config';
import BlowCandles from '@/components/BlowCandles/BlowCandles';
import WishesStack from '@/components/WishesStack/WishesStack';
import Celebration from '@/components/Celebration/Celebration';
import MusicToggle from '@/components/MusicToggle/MusicToggle';

type Section = 'blow' | 'wishes' | 'celebration';

const SECTION_ORDER: Section[] = ['blow', 'wishes', 'celebration'];

/**
 * Section orchestrator. Holds the section index + replay key.
 *
 * Starts directly on the `blow` phase so the 30s wish-countdown begins
 * the moment the page loads — no "start" button. Replay from the
 * celebration section bumps the `runId` to force a full re-mount.
 */
export default function HomePage() {
  const [section, setSection] = useState<Section>('blow');
  const [runId, setRunId] = useState(0);

  const goTo = useCallback((next: Section) => {
    setSection(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  const replay = useCallback(() => {
    setSection('blow');
    setRunId((n) => n + 1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  const renderSection = () => {
    switch (section) {
      case 'blow':
        return <BlowCandles onComplete={() => goTo('wishes')} />;
      case 'wishes':
        return (
          <WishesStack
            wishes={config.wishes}
            onComplete={() => goTo('celebration')}
          />
        );
      case 'celebration':
        return (
          <Celebration
            name={config.recipient.name}
            outroWish={config.recipient.outroWish}
            prizes={config.wheelPrizes ?? []}
            onReplay={replay}
          />
        );
    }
  };

  return (
    <main key={runId} aria-live="polite">
      {renderSection()}
      {config.music ? <MusicToggle track={config.music} /> : null}
    </main>
  );
}

export { SECTION_ORDER };
