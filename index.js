// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDgKAvvD5dNP45Q0lZrGua3596Dqcc3LSc",
  authDomain: "sih2024-3783e.firebaseapp.com",
  projectId: "sih2024-3783e",
  storageBucket: "sih2024-3783e.appspot.com",
  messagingSenderId: "538221346862",
  appId: "1:538221346862:web:27eac96b068b911e935fbf"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Climate tracking script
const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=YOUR_CITY&appid=' + apiKey + '&units=metric';

function fetchWeather() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const condition = data.weather[0].description;
            const temperature = data.main.temp;
            document.getElementById('condition').textContent = `Condition: ${condition}`;
            document.getElementById('temperature').textContent = `Temperature: ${temperature} °C`;
            checkAlerts(condition, temperature);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('condition').textContent = 'Condition: Error';
            document.getElementById('temperature').textContent = 'Temperature: Error';
        });
}

function checkAlerts(condition, temperature) {
    let alertMessage = '';
    if (condition.includes('rain')) {
        alertMessage = 'Heavy rain detected!';
    } else if (condition.includes('clear') && temperature > 30) {
        alertMessage = 'Heavy sun detected!';
    }
    document.getElementById('alert').textContent = alertMessage;
}

// Set up our register function
function register() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value;
    const Domain = document.getElementById('Domain').value;
    const State = document.getElementById('State').value;

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is Outta Line!!');
        return;
    }
    if (!validate_field(full_name) || !validate_field(Domain) || !validate_field(State)) {
        alert('One or More Extra Fields is Outta Line!!');
        return;
    }

    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
        // Declare user variable
        const user = auth.currentUser;

        // Add this user to Firebase Database
        const database_ref = database.ref();

        // Create User data
        const user_data = {
            email: email,
            full_name: full_name,
            Domain: Domain,
            State: State,
            last_login: Date.now()
        };

        // Push to Firebase Database
        database_ref.child('users/' + user.uid).set(user_data);

        // Done
        alert('User Created!!');
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        alert(error.message);
    });
}

// Set up our login function
function login() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is Outta Line!!');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
        // Declare user variable
        const user = auth.currentUser;

        // Add this user to Firebase Database
        const database_ref = database.ref();

        // Create User data
        const user_data = {
            last_login: Date.now()
        };

        // Push to Firebase Database
        database_ref.child('users/' + user.uid).update(user_data);

        // Redirect to homepage.html
        window.location.href = 'homepage.html';
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        alert(error.message);
    });
}

// Validate Functions
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validate_password(password) {
    return password.length >= 6; // Firebase only accepts lengths greater than 6
}

function validate_field(field) {
    return field && field.length > 0;
}

// Initialize weather data on page load
document.addEventListener('DOMContentLoaded', fetchWeather);
