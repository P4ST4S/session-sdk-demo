/**
 * Utilitaire pour appliquer des styles aux éléments de la vidéo, y compris les éléments shadow DOM
 * du composant VideoRecorder d'Unissey.
 */

/**
 * Applique les styles nécessaires pour éliminer les bords arrondis et le fond noir
 * à tous les éléments shadow DOM du VideoRecorder.
 */
export const applyStylesToVideoElements = () => {
  // Cibler tous les éléments uni-video-recorder
  const videoRecorders = document.querySelectorAll("uni-video-recorder");

  if (videoRecorders.length === 0) {
    return;
  }

  // Pour chaque VideoRecorder, essayer d'accéder à son shadow DOM
  videoRecorders.forEach((recorder, index) => {
    // Appliquer des styles directs au conteneur
    (recorder as HTMLElement).style.borderRadius = "0";
    (recorder as HTMLElement).style.background = "transparent";
    (recorder as HTMLElement).style.overflow = "hidden";

    // Essayer d'accéder au shadow DOM (si accessible)
    // Note: cela peut ne pas fonctionner sur tous les navigateurs en fonction des restrictions CORS
    try {
      // Utiliser une assertion de type pour accéder au shadowRoot
      const shadowRoot = (recorder as Element & { shadowRoot?: ShadowRoot })
        .shadowRoot;

      if (shadowRoot) {
        // Injecter des styles dans le shadow DOM
        const styleElement = document.createElement("style");
        styleElement.textContent = `
          * {
            border-radius: 0 !important;
            background-color: transparent !important;
            overflow: hidden !important;
          }
          
          video, canvas {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 0 !important;
          }
        `;

        shadowRoot.appendChild(styleElement);

        // Appliquer des styles directs aux éléments vidéo et canvas dans le shadow DOM
        const videoElements = shadowRoot.querySelectorAll("video, canvas");
        videoElements.forEach((element) => {
          (element as HTMLElement).style.borderRadius = "0";
          (element as HTMLElement).style.width = "100%";
          (element as HTMLElement).style.height = "100%";
          (element as HTMLElement).style.objectFit = "cover";
        });
      } else {
        console.log(`Pas de shadow DOM pour l'élément ${index}`);
      }
    } catch (error) {
      console.log(`Erreur lors de l'accès au shadow DOM: ${error}`);
    }
  });
};

/**
 * Configure un observateur de mutations pour détecter l'ajout de VideoRecorder
 * et leur appliquer les styles nécessaires.
 */
export const setupVideoElementsObserver = () => {
  // Appliquer les styles aux éléments déjà présents dans le DOM
  applyStylesToVideoElements();

  // Configurer un observateur pour détecter l'ajout de nouveaux éléments VideoRecorder
  const observer = new MutationObserver((mutations) => {
    let shouldApplyStyles = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Vérifier si l'élément est un VideoRecorder ou contient un VideoRecorder
            if (
              element.tagName.toLowerCase() === "uni-video-recorder" ||
              element.querySelector("uni-video-recorder")
            ) {
              shouldApplyStyles = true;
            }
          }
        });
      }
    });

    if (shouldApplyStyles) {
      // Attendre un court instant pour que les composants soient complètement montés
      setTimeout(() => {
        applyStylesToVideoElements();
      }, 100);
    }
  });

  // Observer tout le document pour détecter l'ajout de VideoRecorder
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
  };
};
