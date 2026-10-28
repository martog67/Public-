import { Composition, Still } from "remotion";
import { Capa } from "./Capa";
import { DURACAO_TOTAL, FPS } from "./theme";
import { UrnasZeradas } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Urnas-Zeradas"
        component={UrnasZeradas}
        durationInFrames={DURACAO_TOTAL}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Still id="Capa" component={Capa} width={1080} height={1920} />
    </>
  );
};
