function App() {
  // Fonction de test temporaire
  const testSentry = () => {
    console.log("Test Sentry en cours...");
    // Lance une erreur de test
    throw new Error("Ceci est un test Sentry depuis GlycAmed !");
  };

  return (
    <div>
      {/* Votre contenu existant */}
      
      {/* Bouton de test TEMPORAIRE - à supprimer après */}
      <button 
        onClick={testSentry}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: '#ff4757',
          color: 'white',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 10000
        }}
      >
        Test Sentry
      </button>
    </div>
  );
}