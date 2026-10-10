import { useState, useCallback } from "react";
import HomeScreen from "@/components/HomeScreen";
import LevelMap from "@/components/LevelMap";
import Level1 from "@/components/levels/Level1";
import Level2 from "@/components/levels/Level2";
import Level3 from "@/components/levels/Level3";
import Level4 from "@/components/levels/Level4";
import Level5 from "@/components/levels/Level5";
import { useProgress } from "@/hooks/useProgress";
import { LevelId } from "@/types";

type Screen = "home" | "map" | "level";

export default function App() {
  const { progress, completeLevel, resetProgress } = useProgress();
  const [screen, setScreen] = useState<Screen>("home");
  const [activeLevel, setActiveLevel] = useState<LevelId>(1);

  const goHome = useCallback(() => setScreen("home"), []);
  const goMap = useCallback(() => setScreen("map"), []);

  const selectLevel = useCallback((id: LevelId) => {
    if (id > progress.unlockedLevels) return;
    setActiveLevel(id);
    setScreen("level");
  }, [progress.unlockedLevels]);

  const handlePlay = useCallback(() => {
    setScreen("map");
  }, []);

  const handleLevelComplete = useCallback(
    (levelId: LevelId, score: number, coins: number, stars: number) => {
      completeLevel(levelId, score, coins, stars);
    },
    [completeLevel]
  );

  const goNextLevel = useCallback(() => {
    const next = Math.min(activeLevel + 1, 5) as LevelId;
    setActiveLevel(next);
    setScreen("level");
  }, [activeLevel]);

  const renderLevel = () => {
    switch (activeLevel) {
      case 1:
        return (
          <Level1
            progress={progress}
            onHome={goMap}
            onComplete={handleLevelComplete}
            onNext={goNextLevel}
          />
        );
      case 2:
        return (
          <Level2
            progress={progress}
            onHome={goMap}
            onComplete={handleLevelComplete}
            onNext={goNextLevel}
          />
        );
      case 3:
        return (
          <Level3
            progress={progress}
            onHome={goMap}
            onComplete={handleLevelComplete}
            onNext={goNextLevel}
          />
        );
      case 4:
        return (
          <Level4
            progress={progress}
            onHome={goMap}
            onComplete={handleLevelComplete}
            onNext={goNextLevel}
          />
        );
      case 5:
        return (
          <Level5
            progress={progress}
            onHome={goMap}
            onComplete={handleLevelComplete}
            onNext={goHome}
          />
        );
    }
  };

  if (screen === "home") {
    return (
      <HomeScreen
        progress={progress}
        onPlay={handlePlay}
        onReset={resetProgress}
      />
    );
  }

  if (screen === "map") {
    return (
      <LevelMap
        progress={progress}
        onSelectLevel={selectLevel}
        onHome={goHome}
      />
    );
  }

  return <div key={activeLevel}>{renderLevel()}</div>;
}
