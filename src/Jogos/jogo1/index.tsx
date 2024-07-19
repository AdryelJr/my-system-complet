import React, { useEffect, useRef, useState } from "react";
import './style.scss'

type Platform = {
  x: number;
  w: number;
};

type Stick = {
  x: number;
  length: number;
  rotation: number;
};

type Tree = {
  x: number;
  color: string;
};

const StickHeroGame: React.FC = () => {
  const [phase, setPhase] = useState<"waiting" | "stretching" | "turning" | "walking" | "transitioning" | "falling">("waiting");
  const [lastTimestamp, setLastTimestamp] = useState<number | undefined>();
  const [heroX, setHeroX] = useState<number>(0);
  const [heroY, setHeroY] = useState<number>(0);
  const [sceneOffset, setSceneOffset] = useState<number>(0);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [sticks, setSticks] = useState<Stick[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [score, setScore] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = 375;
  const canvasHeight = 375;
  const platformHeight = 100;
  const heroDistanceFromEdge = 10;
  const paddingX = 100;
  const perfectAreaSize = 10;
  const backgroundSpeedMultiplier = 0.2;
  const hill1BaseHeight = 100;
  const hill1Amplitude = 10;
  const hill1Stretch = 1;
  const hill2BaseHeight = 70;
  const hill2Amplitude = 20;
  const hill2Stretch = 0.5;
  const stretchingSpeed = 4;
  const turningSpeed = 4;
  const walkingSpeed = 4;
  const transitioningSpeed = 2;
  const fallingSpeed = 2;
  const heroWidth = 17;
  const heroHeight = 30;

  const resetGame = () => {
    setPhase("waiting");
    setLastTimestamp(undefined);
    setSceneOffset(0);
    setScore(0);

    setPlatforms([{ x: 50, w: 50 }]);
    generatePlatform();
    generatePlatform();
    generatePlatform();
    generatePlatform();

    setSticks([{ x: 100, length: 0, rotation: 0 }]);

    setTrees([]);
    for (let i = 0; i < 10; i++) {
      generateTree();
    }

    setHeroX(90);
    setHeroY(0);

    draw();
  };

  const generateTree = () => {
    const minimumGap = 30;
    const maximumGap = 150;

    const lastTree = trees[trees.length - 1];
    let furthestX = lastTree ? lastTree.x : 0;

    const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
    const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
    const color = treeColors[Math.floor(Math.random() * 3)];

    setTrees((prevTrees) => [...prevTrees, { x, color }]);
  };

  const generatePlatform = () => {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform ? lastPlatform.x + lastPlatform.w : 0;

    const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
    const w = minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    setPlatforms((prevPlatforms) => [...prevPlatforms, { x, w }]);
  };

  const animate = (timestamp: number) => {
    if (!lastTimestamp) {
      setLastTimestamp(timestamp);
      requestAnimationFrame(animate);
      return;
    }

    switch (phase) {
      case "waiting":
        return;
      case "stretching":
        setSticks((prevSticks) => {
          const newSticks = [...prevSticks];
          newSticks[newSticks.length - 1].length += (timestamp - lastTimestamp) / stretchingSpeed;
          return newSticks;
        });
        break;
      case "turning":
        setSticks((prevSticks) => {
          const newSticks = [...prevSticks];
          newSticks[newSticks.length - 1].rotation += (timestamp - lastTimestamp) / turningSpeed;

          if (newSticks[newSticks.length - 1].rotation > 90) {
            newSticks[newSticks.length - 1].rotation = 90;
            const [nextPlatform, perfectHit] = thePlatformTheStickHits();
            if (nextPlatform) {
              setScore((prevScore) => prevScore + (perfectHit ? 2 : 1));
              if (perfectHit) {
                setTimeout(() => {}, 1000);
              }

              generatePlatform();
              generateTree();
              generateTree();
            }
            setPhase("walking");
          }
          return newSticks;
        });
        break;
      case "walking":
        setHeroX((prevHeroX) => prevHeroX + (timestamp - lastTimestamp) / walkingSpeed);
        const [nextPlatform] = thePlatformTheStickHits();
        if (nextPlatform) {
          const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
          if (heroX > maxHeroX) {
            setHeroX(maxHeroX);
            setPhase("transitioning");
          }
        } else {
          const maxHeroX = sticks[sticks.length - 1].x + sticks[sticks.length - 1].length + heroWidth;
          if (heroX > maxHeroX) {
            setHeroX(maxHeroX);
            setPhase("falling");
          }
        }
        break;
      case "transitioning":
        setSceneOffset((prevSceneOffset) => prevSceneOffset + (timestamp - lastTimestamp) / transitioningSpeed);
        const [nextPlat]: any = thePlatformTheStickHits();
        if (sceneOffset > nextPlat.x + nextPlat.w - paddingX) {
          setSticks((prevSticks) => [
            ...prevSticks,
            { x: nextPlat.x + nextPlat.w, length: 0, rotation: 0 },
          ]);
          setPhase("waiting");
        }
        break;
      case "falling":
        if (sticks[sticks.length - 1].rotation < 180) {
          setSticks((prevSticks) => {
            const newSticks = [...prevSticks];
            newSticks[newSticks.length - 1].rotation += (timestamp - lastTimestamp) / turningSpeed;
            return newSticks;
          });
        }

        setHeroY((prevHeroY) => prevHeroY + (timestamp - lastTimestamp) / fallingSpeed);
        const maxHeroY = platformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
        if (heroY > maxHeroY) {
          return;
        }
        break;
      default:
        throw Error("Wrong phase");
    }

    draw();
    setLastTimestamp(timestamp);
    requestAnimationFrame(animate);
  };

  const thePlatformTheStickHits = (): [Platform | undefined, boolean] => {
    if (sticks[sticks.length - 1].rotation !== 90) throw Error(`Stick is ${sticks[sticks.length - 1].rotation}°`);
    const stickFarX = sticks[sticks.length - 1].x + sticks[sticks.length - 1].length;

    const platformTheStickHits = platforms.find(
      (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
    );

    if (
      platformTheStickHits &&
      platformTheStickHits.x + platformTheStickHits.w / 2 - perfectAreaSize / 2 < stickFarX &&
      stickFarX < platformTheStickHits.x + platformTheStickHits.w / 2 + perfectAreaSize / 2
    ) {
      return [platformTheStickHits, true];
    }

    return [platformTheStickHits, false];
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawBackground(ctx);

    ctx.save();
    ctx.translate((window.innerWidth - canvasWidth) / 2 - sceneOffset, (window.innerHeight - canvasHeight) / 2);

    drawPlatforms(ctx);
    drawHero(ctx);
    drawSticks(ctx);

    ctx.restore();
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, "#BBD691");
    gradient.addColorStop(1, "#FEF1E1");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    drawHill(ctx, hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629");
    drawHill(ctx, hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C");

    trees.forEach(({ x, color }) => drawTree(ctx, x, color));
  };

  const drawHill = (
    ctx: CanvasRenderingContext2D,
    baseHeight: number,
    amplitude: number,
    stretch: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.moveTo(0, window.innerHeight);
    for (let i = 0; i < window.innerWidth; i++) {
      ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
    }
    ctx.lineTo(window.innerWidth, window.innerHeight);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const getHillY = (x: number, baseHeight: number, amplitude: number, stretch: number) => {
    return (
      Math.sin((x + sceneOffset * backgroundSpeedMultiplier) * stretch) * amplitude +
      (window.innerHeight - baseHeight)
    );
  };

  const drawTree = (ctx: CanvasRenderingContext2D, x: number, color: string) => {
    ctx.save();
    ctx.translate(
      ((x - sceneOffset * backgroundSpeedMultiplier) * window.innerWidth) / canvasWidth,
      (window.innerHeight - platformHeight - heroHeight - 10) * window.innerHeight / canvasHeight
    );

    const treeTrunkHeight = 5;
    const treeTrunkWidth = 5;
    const treeCrownHeight = 25;
    const treeCrownWidth = 10;

    ctx.fillStyle = "#734d26";
    ctx.fillRect(-treeTrunkWidth / 2, 0, treeTrunkWidth, treeTrunkHeight);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-treeCrownWidth / 2, 0);
    ctx.lineTo(0, -treeCrownHeight);
    ctx.lineTo(treeCrownWidth / 2, 0);
    ctx.fill();

    ctx.restore();
  };

  const drawPlatforms = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "black";
    platforms.forEach(({ x, w }) => {
      ctx.fillRect(x, canvasHeight - platformHeight, w, platformHeight);
    });
  };

  const drawHero = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(heroX - heroWidth / 2, heroY + canvasHeight - platformHeight - heroHeight / 2);
    ctx.fillStyle = "black";
    ctx.fillRect(-heroWidth / 2, -heroHeight / 2, heroWidth, heroHeight);
    ctx.restore();
  };

  const drawSticks = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    sticks.forEach((stick) => {
      ctx.save();
      ctx.translate(stick.x, canvasHeight - platformHeight);
      ctx.rotate((Math.PI / 180) * stick.rotation);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -stick.length);
      ctx.stroke();
      ctx.restore();
    });
  };

  useEffect(() => {
    window.addEventListener("resize", draw);
    resetGame();

    return () => {
      window.removeEventListener("resize", draw);
    };
  }, []);

  useEffect(() => {
    if (phase !== "waiting") {
      requestAnimationFrame(animate);
    }
  }, [phase]);

  return (
    <div
      onMouseDown={() => {
        if (phase === "waiting") {
          setPhase("stretching");
          setLastTimestamp(undefined);
          requestAnimationFrame(animate);
        }
      }}
      onMouseUp={() => {
        if (phase === "stretching") {
          setPhase("turning");
        }
      }}
    >
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
      <div>{score}</div>
    </div>
  );
};

export default StickHeroGame;
