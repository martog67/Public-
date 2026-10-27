import { Composition } from "remotion";
import { Comparativo } from "./Comparativo";
import { DURACAO_TOTAL, FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MS-x-Bahia"
      component={Comparativo}
      durationInFrames={DURACAO_TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
