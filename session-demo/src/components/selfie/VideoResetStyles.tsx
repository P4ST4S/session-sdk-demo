import { useEffect } from "react";

/**
 * Composant qui injecte des styles CSS globaux pour réinitialiser
 * tous les styles potentiellement problématiques du VideoRecorder
 */
const VideoResetStyles = () => {
  useEffect(() => {
    // Créer un élément style pour les styles de réinitialisation globaux
    const resetStyle = document.createElement("style");
    resetStyle.id = "video-reset-global-styles";

    // Réinitialiser tous les styles potentiellement problématiques
    resetStyle.textContent = `
      /* Réinitialiser les styles globaux qui pourraient affecter l'affichage de la vidéo */
      .selfie {
        --uni-primary-color: #11e5c5;
        --uni-secondary-color: #0a9983;
        --uni-primary-color-lighter: #37a998;
        --uni-secondary-color-lighter: #1cbeaa;
        --uni-alt-color: #086e5f;
        --uni-alt-color-lighter: #0d9485;
        --uni-light-color-variant-1: #d0f7f2;
        --uni-light-color-variant-2: #b2ece5;
        --uni-light-color: #fff;
        --uni-dark-color: #202020;
        --uni-error-color: #f44336;

        --uni-btn-padding: 10px 15px;
        --uni-btn-border: solid 0px;
        --uni-btn-border-radius: 0px;
        --uni-btn-font-size: 16px;
        --uni-btn-text-transform: normal;
        --uni-btn-border-outlined: solid 1px;
        --uni-btn-label-margin: 10px 0px;
        --uni-btn-disabled-bg-color: #eee;

        --uni-card-bg-color: transparent;
      }
      
      /* Forcer tous les éléments vidéo à avoir le bon style */
      uni-video-recorder,
      uni-video-recorder::shadow-root *,
      uni-video-recorder::part(*),
      video-js,
      .video-js,
      .vjs-default-skin,
      .vjs-big-play-button,
      .vjs-control-bar {
        border-radius: 0 !important;
        background-color: transparent !important;
        overflow: hidden !important;
      }
      
      /* Cibler spécifiquement le conteneur vidéo */
      .video-container video,
      .video-container canvas {
        border-radius: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      
      /* Forcer l'élimination de tous les fonds noirs */
      .selfie * {
        background-color: transparent !important;
      }
      
      /* S'assurer que le composant VideoRecorder prend tout l'espace */
      .selfie .video-container uni-video-recorder {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
      }
    `;

    // Ajouter l'élément style au head du document
    document.head.appendChild(resetStyle);

    // Nettoyer en supprimant l'élément style lors du démontage du composant
    return () => {
      const existingStyle = document.getElementById(
        "video-reset-global-styles"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Ce composant ne rend rien dans le DOM
  return null;
};

export default VideoResetStyles;
