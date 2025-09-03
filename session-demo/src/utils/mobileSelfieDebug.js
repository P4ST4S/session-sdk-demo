/**
 * Script de test pour le debugging mobile du selfie
 * À utiliser dans la console du navigateur mobile
 */

// Fonction de test de l'environnement mobile
window.debugMobileSelfie = () => {
  console.log("🔍 Mobile Selfie Debug Report");
  console.log("============================");
  
  // Détection de plateforme
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  console.log("📱 Platform Detection:", { isMobile, isIOS, isAndroid });
  console.log("🌐 User Agent:", navigator.userAgent);
  
  // Test de support des formats vidéo
  const video = document.createElement('video');
  const formats = {
    'mp4': video.canPlayType('video/mp4'),
    'webm': video.canPlayType('video/webm'),
    'quicktime': video.canPlayType('video/quicktime'),
    'x-msvideo': video.canPlayType('video/x-msvideo')
  };
  
  console.log("🎥 Video Format Support:", formats);
  
  // Test d'accès à la caméra
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("📷 Camera API: Available");
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        console.log("✅ Camera Access: Granted");
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(error => {
        console.error("❌ Camera Access: Denied", error);
      });
  } else {
    console.log("❌ Camera API: Not Available");
  }
  
  // Test du canvas
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      console.log("✅ Canvas 2D: Available");
    } else {
      console.log("❌ Canvas 2D: Not Available");
    }
  } catch (error) {
    console.log("❌ Canvas Error:", error);
  }
  
  // Test de localStorage
  try {
    const sessionId = localStorage.getItem('sessionId');
    console.log("💾 Session ID:", sessionId || "Not found");
  } catch (error) {
    console.log("❌ LocalStorage Error:", error);
  }
  
  // Informations réseau
  if ('connection' in navigator) {
    // @ts-ignore
    const connection = navigator.connection;
    console.log("🌐 Network Info:", {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    });
  }
  
  console.log("============================");
  console.log("🔍 Debug report completed");
};

// Auto-run if on mobile
if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  console.log("📱 Mobile device detected - run 'debugMobileSelfie()' for detailed report");
}
