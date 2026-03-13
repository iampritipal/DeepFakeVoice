# AI Voice Detection Improvements

## Overview
The deepfake detection system has been upgraded from a mock/simulation to a real audio analysis engine that examines actual audio features to detect AI-generated voices.

## Key Changes

### 1. Real Audio Analysis (audioAnalysis.ts)
The system now performs actual audio signal processing:

#### Audio Features Analyzed:
- **Spectral Centroid**: Measures the "brightness" of sound. AI voices often have unnatural frequency distributions.
- **Zero Crossing Rate**: Tracks how often the audio signal crosses zero. AI voices typically have irregular patterns.
- **Pitch Variation**: Calculates pitch changes over time. AI voices often have too consistent or erratic pitch.
- **Harmonic Ratio**: Analyzes the ratio of harmonic to noise energy. AI voices show unnatural harmonic structures.
- **Spectral Contrast**: Measures frequency band contrasts. AI voices often have flatter spectral profiles.
- **MFCC (Mel-Frequency Cepstral Coefficients)**: Standard audio fingerprinting technique.
- **Chroma Features**: Analyzes pitch class distribution.

#### Detection Indicators:
1. **Pitch Consistency** (High Severity)
   - Detects: Pitch variation < 15 Hz or > 120 Hz
   - AI voices often have unnaturally consistent or erratic pitch

2. **Harmonic Pattern** (Medium Severity)
   - Detects: Harmonic ratio > 0.85 or < 0.25
   - AI voices show abnormal harmonic structures

3. **Speech Artifacts** (High Severity)
   - Detects: Zero crossing rate < 0.01 or > 0.15
   - Identifies synthetic speech artifacts in waveform

4. **Frequency Spikes** (Medium Severity)
   - Detects: Spectral centroid < 500 Hz or > 4500 Hz
   - Abnormal frequency distributions

5. **Breath Pattern** (Low Severity)
   - Detects: Missing low-frequency energy
   - AI voices often lack natural breathing patterns

6. **Formant Transition** (Medium Severity)
   - Detects: Low spectral contrast variation
   - AI voices have unnatural formant transitions

### 2. Risk Scoring Algorithm
The system calculates risk scores based on:
- Number of detected anomalies
- Severity weighting (High: +15, Medium: +8, Low: +5)
- Base detection rate

**Classification:**
- Risk Score ≥ 60: "Deepfake Detected" (70-95% confidence)
- Risk Score 35-59: "Suspicious" (50-70% confidence)
- Risk Score < 35: "Real Voice" (85-95% confidence)

### 3. Real-time Audio Processing
- Decodes uploaded audio files to AudioBuffer
- Processes recorded audio in real-time
- Generates actual spectrograms from audio data
- Performs FFT (Fast Fourier Transform) analysis

## How It Works

1. **Audio Upload/Recording**: User provides audio file or records voice
2. **Audio Decoding**: File is decoded to AudioBuffer using Web Audio API
3. **Feature Extraction**: System extracts multiple audio features
4. **Anomaly Detection**: Each feature is checked against normal human voice ranges
5. **Risk Calculation**: Detected anomalies are weighted and scored
6. **Classification**: Final verdict based on risk score and confidence

## Detection Accuracy

The system uses multiple complementary detection methods:
- Frequency domain analysis (FFT, spectral features)
- Time domain analysis (zero crossings, pitch)
- Statistical analysis (variance, distribution)
- Pattern recognition (harmonics, formants)

This multi-layered approach significantly improves detection accuracy for:
- Text-to-Speech (TTS) AI voices
- Voice cloning/deepfakes
- Voice conversion systems
- Synthetic speech generators

## Limitations

While significantly improved, the system has some limitations:
- Very high-quality AI voices may still evade detection
- Short audio clips (< 2 seconds) may not provide enough data
- Background noise can affect accuracy
- Some natural voices with unusual characteristics may trigger false positives

## Future Improvements

Potential enhancements:
1. Machine learning model integration
2. Deep learning neural network for pattern recognition
3. Database of known AI voice signatures
4. Temporal analysis across longer audio segments
5. Speaker verification and voice biometrics
6. Integration with external deepfake detection APIs

## Technical Stack

- Web Audio API for audio processing
- FFT for frequency analysis
- Autocorrelation for pitch detection
- Statistical analysis for feature extraction
- Real-time spectrogram generation
