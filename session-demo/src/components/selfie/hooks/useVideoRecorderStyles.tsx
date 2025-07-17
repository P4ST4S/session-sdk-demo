import { useEffect } from "react";

/**
 * Hook personnalisé pour injecter des styles CSS globaux qui ciblent spécifiquement
 * le composant VideoRecorder d'Unissey et éliminent les bords arrondis et les fonds noirs.
 */
const useVideoRecorderStyles = () => {
  useEffect(() => {
    // Créer un élément style pour injecter des règles CSS
    const styleElement = document.createElement("style");
    styleElement.id = "video-recorder-custom-styles";

    // Définir les règles CSS nécessaires pour éliminer les bords arrondis et les fonds noirs
    styleElement.textContent = `
      /* Cibler le composant VideoRecorder et tous ses éléments internes */
      uni-video-recorder,
      uni-video-recorder::shadow-root,
      uni-video-recorder::part(*),
      uni-video-recorder *,
      uni-video-recorder video,
      uni-video-recorder canvas,
      uni-video-recorder div {
        border-radius: 0 !important;
        -webkit-border-radius: 0 !important;
        -moz-border-radius: 0 !important;
        background: transparent !important;
        overflow: hidden !important;
      }
      
      /* Assurer que la vidéo prend tout l'espace disponible */
      uni-video-recorder video,
      uni-video-recorder canvas {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        max-height: none !important;
      }
      
      /* Variables CSS globales que le composant pourrait utiliser */
      :root {
        --uni-video-border-radius: 0 !important;
        --uni-border-radius: 0 !important;
        --uni-component-border-radius: 0 !important;
        --uni-video-background: transparent !important;
        --uni-background: transparent !important;
      }
      
      /* Sélecteurs très spécifiques pour garantir que les styles s'appliquent */
      .video-container,
      .video-container > div,
      .video-container > div > uni-video-recorder,
      .video-container uni-video-recorder,
      .selfie .video-container,
      .selfie .video-container > div,
      .selfie .video-container uni-video-recorder {
        border-radius: 0 !important;
        background: transparent !important;
        overflow: hidden !important;
      }
      
      /* Préserver les styles des boutons */
      .selfie button.selfie-button,
      button.selfie-button,
      .selfie-button {
        background-color: #11E5C5 !important;
        color: #3C3C40 !important;
        border-radius: 12px !important;
      }
      
      .selfie button.selfie-button:hover,
      button.selfie-button:hover,
      .selfie-button:hover {
        background-color: #7dffeb !important;
      }
      
      .selfie button.selfie-button:disabled,
      button.selfie-button:disabled,
      .selfie-button:disabled {
        background-color: #e2e8f0 !important;
        opacity: 0.6 !important;
      }
    `;

    // Ajouter l'élément style au head du document
    document.head.appendChild(styleElement);

    // Nettoyer en supprimant l'élément style lors du démontage du composant
    return () => {
      const existingStyle = document.getElementById(
        "video-recorder-custom-styles"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
};

export default useVideoRecorderStyles;
