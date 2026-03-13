# Voice Sentinel - AI Audio Deepfake Detector

An advanced audio deepfake detection system that analyzes voice recordings to identify AI-generated or manipulated speech.

## Features

- **Real-time Audio Analysis**: Upload audio files or record live voice samples
- **AI Detection Engine**: Advanced algorithms to detect synthetic speech patterns
- **Visual Analytics**: Spectrograms, waveforms, and feature analysis
- **Risk Assessment**: Comprehensive risk scoring and confidence metrics
- **Detailed Reports**: Export analysis reports with technical details

## Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Audio Processing**: Web Audio API
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd voice-sentinel

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```sh
npm run build
```

## How It Works

The system analyzes multiple audio features to detect AI-generated voices:

1. **Spectral Analysis**: Examines frequency distributions and patterns
2. **Pitch Detection**: Analyzes pitch consistency and variation
3. **Harmonic Analysis**: Evaluates harmonic-to-noise ratios
4. **Temporal Features**: Studies zero-crossing rates and speech artifacts
5. **Pattern Recognition**: Identifies unnatural formant transitions

## Detection Indicators

- Pitch Consistency (High Severity)
- Harmonic Pattern (Medium Severity)
- Speech Artifacts (High Severity)
- Frequency Spikes (Medium Severity)
- Breath Pattern (Low Severity)
- Formant Transition (Medium Severity)

## Supported Audio Formats

- WAV
- MP3
- OGG
- FLAC
- WebM

## License

MIT License

## Author

Developed with passion for audio security and AI detection.
