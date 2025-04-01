# SakhiSuraksha - Women's Safety Application

## 📱 Overview

SakhiSuraksha is a comprehensive web application designed to enhance women's safety through real-time location tracking, emergency alerts, and safety resources. The platform provides users with tools to quickly alert trusted contacts during emergencies, access safety resources, and navigate through potentially unsafe areas.

## 🔐 Key Features

### Emergency Response
- **SOS Button**: Trigger immediate alerts to all trusted contacts
- **Real-time Location Sharing**: Automatically shares your location with emergency contacts
- **Emergency Recording**: Record and send video evidence to trusted contacts
- **Sound Alarm**: Activate a loud alarm to deter attackers and draw attention

### Safety Tools
- **Location Tracking**: Real-time GPS location tracking and sharing
- **Safety Map**: View safe zones, police stations, hospitals, and reported unsafe areas
- **Trusted Contacts Management**: Add and manage emergency contacts who receive alerts
- **Safe Route Planning**: Get suggestions for safer routes based on safety ratings

### Resources
- **Safety Tips**: Access to essential safety guidelines for various situations
- **Support Services**: Directory of helplines and support organizations
- **Self-Defense Resources**: Basic self-defense techniques and classes information
- **Legal Information**: Resources to help women know their rights and legal options

## 🖥️ Technical Implementation

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design for mobile and desktop compatibility
- Interactive maps using Leaflet.js
- Font Awesome for icons
- Google Fonts for typography

### Key Components
- **Real-time Location Tracking**: Uses browser geolocation API
- **Emergency Alerts**: Integrates with WhatsApp via web API
- **Media Recording**: Utilizes MediaRecorder API for video capture
- **Local Storage**: Stores trusted contacts information
- **Interactive Maps**: Implements Leaflet.js for safety mapping

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Location services enabled
- Camera and microphone permissions (for emergency recording)

### Installation
1. Clone the repository:
   ```sh
     git clone https://github.com/yourusername/sakhisuraksha.git
2. Navigate to the project directory:
   ```sh
   cd sakhisuraksha
3. Open `index.html` in your browser or set up a local server.

4. Access the application at `http://localhost:8000`

## 📋 Usage Guide

### Setting Up Your Profile
1. Sign up for a new account with your email and phone number
2. Add trusted emergency contacts who will be notified during emergencies
3. Enable location services when prompted

### Using Emergency Features
1. **SOS Alert**: Press the SOS button to immediately share your location with trusted contacts
2. **Sound Alarm**: Click the alarm button to activate a loud deterrent sound
3. **Alert Contacts**: Use this feature to record and send video evidence to your trusted contacts

### Managing Trusted Contacts
1. Navigate to the Trusted Contacts section
2. Click "Add New Contact" to add emergency contacts
3. Include their name, phone number, and relationship

### Using the Safety Map
1. Enable location services to view your current position
2. Use the map controls to toggle visibility of safe zones, police stations, and reported areas

## 🔧 Configuration

### Location Settings
- Location updates every 10 seconds by default
- SOS mode shares location every 30 seconds

### Emergency Contacts
- Contacts are stored locally in the browser
- No limit to the number of emergency contacts

## 🎯 Future Enhancements

* **Backend integration for user authentication and product management**
* **Payment gateway integration**
* **Personalized recommendations based on user preferences**
* **Offline functionality for emergency situations**
* **Community reporting system for unsafe areas**
* **Integration with local emergency services**
* **Multi-language support**
* **Dark mode for better visibility at night**

## 🔒 Privacy and Security

SakhiSuraksha prioritizes user privacy and data security:
- Location data is only shared during emergencies or with explicit user consent
- Contact information is stored locally on the device
- No personal data is transmitted to external servers without user permission

© 2025 SakhiSuraksha. All rights reserved.
   
