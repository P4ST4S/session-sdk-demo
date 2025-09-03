import { useEffect } from "react";
import { getOrderedWorkflowSteps } from "../services/sessionService";
import type { SessionData } from "../services/sessionService";

export const useStepCSS = (step: number, session: SessionData | null) => {
  useEffect(() => {
    const loadStepCSS = async () => {
      const { cssLoader } = await import("../utils/cssLoader");

      switch (step) {
        case 0:
          await cssLoader.loadRouteCSS("start", "css/routes/start.css");
          break;
        case 1:
        case 2:
          await cssLoader.loadRouteCSS(
            "user-input",
            "css/routes/user-input.css"
          );
          break;
        case 3:
          await cssLoader.loadRouteCSS(
            "contact-info",
            "css/routes/contact-info.css"
          );
          break;
        case 4:
          await cssLoader.loadRouteCSS("otp", "css/routes/otp.css");
          break;
        default:
          // For step 5+, load CSS based on template node type
          if (session?.template) {
            const templateNodes = getOrderedWorkflowSteps(session.template);
            const templateIndex = step - 5;
            if (templateIndex >= 0 && templateIndex < templateNodes.length) {
              const node = templateNodes[templateIndex];
              if (node?.type === "selfie-capture") {
                await cssLoader.loadRouteCSS("selfie", "css/routes/selfie.css");
                await cssLoader.loadRouteCSS(
                  "video-recorder",
                  "css/components/video-recorder.css"
                );
              } else if (node?.type === "document-selection") {
                await cssLoader.loadRouteCSS(
                  "document-check",
                  "css/routes/document-check.css"
                );
                await cssLoader.loadRouteCSS("jdi", "css/components/jdi.css");
              }
            } else if (templateIndex >= templateNodes.length) {
              await cssLoader.loadRouteCSS(
                "end-flow",
                "css/routes/end-flow.css"
              );
            }
          }
          break;
      }
    };

    loadStepCSS().catch(console.warn);
  }, [step, session]);
};
