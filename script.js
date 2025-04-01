document.addEventListener('DOMContentLoaded', function () {
    let trackingInterval;
    let isTracking = false;
    let userLocation = { lat: 0, lng: 0 };

    let emergencyContacts = JSON.parse(localStorage.getItem('trustedContacts')) || [];

    const map = L.map('safetyMap').setView([0, 0], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const userMarker = L.marker([0, 0]).addTo(map).bindPopup("Your Location");

    function updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation.lat = position.coords.latitude;
                    userLocation.lng = position.coords.longitude;
                    userMarker.setLatLng(userLocation);
                    map.setView(userLocation);
                },
                () => {
                    alert("⚠️ Location access denied. Please enable GPS.");
                }
            );
        } else {
            alert("⚠️ Geolocation is not supported by your browser.");
        }
    }

    updateLocation();
    setInterval(updateLocation, 10000); 

    function sendWhatsAppSOS() {
        if (emergencyContacts.length === 0) {
            alert("⚠️ No trusted contacts added. Please add contacts first.");
            return;
        }

        let message = `🚨 SOS! I need help! My live location: https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;

        emergencyContacts.forEach(contact => {
            let whatsappUrl = `https://api.whatsapp.com/send?phone=${contact.phone}&text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank"); 
        });

        alert("📍 Live location sent to emergency contacts via WhatsApp!");
    }

    function startSOS() {
        if (!isTracking) {
            isTracking = true;
            alert("🚨 SOS Activated! Live location will be shared every 30 seconds.");
            sendWhatsAppSOS(); 
            trackingInterval = setInterval(sendWhatsAppSOS, 30000); 
            document.getElementById('stopSosButton').style.display = 'block'; 
        }
    }

    function stopSOS() {
        if (isTracking) {
            clearInterval(trackingInterval);
            isTracking = false;
            alert("✅ You are marked safe. Location sharing stopped.");
            document.getElementById('stopSosButton').style.display = 'none'; 
        }
    }

    document.getElementById('addContactForm').addEventListener('submit', function (e) {
        e.preventDefault();

        let contactName = document.getElementById('contactName').value.trim();
        let contactPhone = document.getElementById('contactPhone').value.trim();

        if (contactName === "" || contactPhone === "") {
            alert("⚠️ Please fill out both fields.");
            return;
        }

        let newContact = { name: contactName, phone: contactPhone };
        emergencyContacts.push(newContact);
        localStorage.setItem('trustedContacts', JSON.stringify(emergencyContacts));

        document.getElementById('addContactForm').reset();
        closeModal(document.getElementById('addContactModal'));
        loadContacts();
    });

    const alarmButton = document.getElementById('soundAlarmButton');
    const alarmSound = new Audio('alarm.wav'); 

    alarmSound.volume = 1.0; 
    alarmSound.loop = true; 

    let isPlaying = false;

    const originalHTML = alarmButton.innerHTML;
    const originalStyles = {
    backgroundColor: getComputedStyle(alarmButton).backgroundColor,
    color: getComputedStyle(alarmButton).color,
    boxShadow: getComputedStyle(alarmButton).boxShadow,
    border: getComputedStyle(alarmButton).border
    };

    alarmButton.addEventListener('click', function () {
        if (isPlaying) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            
            alarmButton.style.backgroundColor = originalStyles.backgroundColor;
            alarmButton.style.color = originalStyles.color;
            alarmButton.style.boxShadow = originalStyles.boxShadow;
            alarmButton.style.border = originalStyles.border;
            
            alarmButton.innerHTML = originalHTML;
        } else {
            alarmSound.play();
            
            alarmButton.style.backgroundColor = 'red';
            alarmButton.textContent = 'Stop Alarm';
        }
        
        isPlaying = !isPlaying;
    });

    function loadContacts() {
        let contactsList = document.querySelector('.contacts-list');
        contactsList.innerHTML = "";

        emergencyContacts = JSON.parse(localStorage.getItem('trustedContacts')) || [];

        emergencyContacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';
            contactCard.innerHTML = `
                <div class="contact-avatar"><i class="fas fa-user"></i></div>
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p>${contact.phone}</p>
                </div>
                <div class="contact-actions">
                    <button class="contact-btn delete" data-phone="${contact.phone}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            contactsList.appendChild(contactCard);
        });

        document.querySelectorAll('.contact-btn.delete').forEach(button => {
            button.addEventListener('click', function () {
                deleteContact(this.getAttribute('data-phone'));
            });
        });
    }

    function deleteContact(phone) {
        emergencyContacts = emergencyContacts.filter(contact => contact.phone !== phone);
        localStorage.setItem('trustedContacts', JSON.stringify(emergencyContacts));
        loadContacts();
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    document.getElementById('sosButton').addEventListener('click', startSOS);
    document.getElementById('stopSosButton').addEventListener('click', stopSOS); // STOP SOS Button
    document.querySelector('.add-contact-btn').addEventListener('click', function () {
        document.getElementById('addContactModal').style.display = 'flex';
    });

    loadContacts();
});


const alertContactsButton = document.getElementById('alertContactsButton');
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
    alert('Your browser does not support video recording. Please use Chrome or Firefox.');
} else {
    alertContactsButton.addEventListener('click', async () => {
        if (!isRecording) {
            console.log('Starting recording...'); 
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                console.log('Camera access successful!'); 

                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
                    sendVideoToContacts(videoBlob); 
                    recordedChunks = []; 
                };

                mediaRecorder.start();
                isRecording = true;
                alertContactsButton.innerHTML = '<i class="fas fa-users"></i><span>Stop Recording</span>'; 
                console.log('Recording started...'); 
            } catch (error) {
                console.error('Error accessing camera:', error);
                if (error.name === 'NotAllowedError') {
                    alert('Camera access denied. Please allow camera access to use this feature.');
                } else {
                    alert('Unable to access camera. Please check your device settings.');
                }
            }
        } else {
            console.log('Stopping recording...'); 
            mediaRecorder.stop();
            isRecording = false;
            alertContactsButton.innerHTML = '<i class="fas fa-users"></i><span>Alert Contacts</span>'; 
            console.log('Recording stopped.'); 
        }
    });
}

function sendVideoToContacts(videoBlob) {
    const emergencyContacts = JSON.parse(localStorage.getItem('trustedContacts')) || [];
    if (emergencyContacts.length === 0) {
        alert('⚠️ No trusted contacts added. Please add contacts first.');
        return;
    }

    const videoUrl = URL.createObjectURL(videoBlob);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const liveLocation = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

            emergencyContacts.forEach(contact => {
                const message = `🚨 Emergency Alert! I need help!\n\nLive Location: ${liveLocation}\n\nVideo:\n${videoUrl}`;
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${contact.phone}&text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });

            alert('Video alert and live location sent to trusted contacts!');
        },
        (error) => {
            console.error('Error getting location:', error);
            alert('⚠️ Unable to fetch live location. Please ensure location services are enabled.');
        }
    );
}



document.addEventListener('DOMContentLoaded', function () {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const addContactModal = document.getElementById('addContactModal');

    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');

    const closeButtons = document.querySelectorAll('.close-modal');

    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }

    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    showSignup.addEventListener('click', () => {
        closeModal(loginModal);
        openModal(signupModal);
    });
    showLogin.addEventListener('click', () => {
        closeModal(signupModal);
        openModal(loginModal);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        console.log('Login with:', email, password);
        alert('Login functionality to be implemented.');
        closeModal(loginModal);
    });

    document.getElementById('signupForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        console.log('Signup with:', name, email, phone, password);
        alert('Signup functionality to be implemented.');
        closeModal(signupModal);
    });
});





