import { useEffect, useRef, useState } from 'react';

interface AvatarSetupProps {
  apiKey: string;
  avatarId?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
}

export default function AvatarSetup({ 
  apiKey, 
  avatarId = 'default', 
  height = 400, 
  width = 400,
  backgroundColor = '#f0f0f0'
}: AvatarSetupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!containerRef.current || !apiKey) return;
    
    const initAvatar = async () => {
      try {
        // In a real implementation, this would initialize the Antispace avatar
        // For now, we'll simulate loading and display a placeholder
        setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
      } catch (err) {
        console.error('Failed to initialize avatar:', err);
        setError('Failed to load avatar. Please check your API key and try again.');
      }
    };
    
    initAvatar();
    
    return () => {
      // Cleanup if needed
    };
  }, [apiKey, avatarId]);
  
  return (
    <div className="antispace-avatar-container">
      <div 
        ref={containerRef} 
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          position: 'relative',
          backgroundColor,
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!isLoaded && !error && (
          <div className="loading-indicator" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            Loading Avatar...
          </div>
        )}
        
        {isLoaded && !error && (
          <>
            <h2 style={{ marginBottom: '12px' }}>AI Avatar</h2>
            <p style={{ marginBottom: '16px' }}>Avatar ID: {avatarId}</p>
            <div 
              style={{
                width: width - 80,
                height: height - 150,
                backgroundColor: '#ccc',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#666',
                overflow: 'hidden'
              }}
            >
              <img 
                src={`https://api.antispace.com/avatar/${avatarId}/preview?apiKey=${apiKey}`}
                alt="AI Avatar"
                onError={(e) => {
                  // If the image fails to load, show a placeholder
                  e.currentTarget.style.display = 'none';
                  setError('Could not load avatar image. Using placeholder.');
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {avatarId.charAt(0).toUpperCase()}
            </div>
          </>
        )}
        
        {error && (
          <div className="error-message" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'red',
            textAlign: 'center',
            padding: '20px'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
