import { useState, useEffect, useCallback } from 'react';

interface VoiceInteractionProps {
  onSpeechInput: (text: string) => void;
  isListening?: boolean;
}

export default function VoiceInteraction({ 
  onSpeechInput, 
  isListening = false 
}: VoiceInteractionProps) {
  const [listening, setListening] = useState(isListening);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  // Check if speech recognition is supported
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!supported) return;
    
    setListening(prev => !prev);
  }, [supported]);

  useEffect(() => {
    if (!supported) return;

    // Use the appropriate speech recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setTranscript('');
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      
      if (finalTranscript) {
        onSpeechInput(finalTranscript);
      }
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
    };
    
    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }
    
    return () => {
      recognition.stop();
    };
  }, [listening, onSpeechInput, supported]);

  if (!supported) {
    return (
      <div className="voice-interaction p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg text-center">
        <p className="text-yellow-800 dark:text-yellow-200">
          Speech recognition is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="voice-interaction mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center">
        <button
          onClick={toggleListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            listening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            {listening ? (
              <>
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </>
            ) : (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </>
            )}
          </svg>
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {listening ? 'Tap to stop listening' : 'Tap to start listening'}
        </p>
      </div>
      
      {transcript && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium mb-1">Transcript:</p>
          <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
        </div>
      )}
    </div>
  );
}

// Add TypeScript declarations for the Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
