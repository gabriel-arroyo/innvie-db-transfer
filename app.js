const globalTunnel = require('global-tunnel-ng')
const firebase = require('firebase-admin')
const serviceAccount = require('./key.json')
const request = require('request')

// Initialize Global Tunnel with Proxy Settings
globalTunnel.initialize()

// Initialize Firebase with your configuration
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: 'https://innvie-6e09a.firebaseio.com', // Replace with your database URL
})

// Access the Firebase Realtime Database
const db = firebase.database()

// Set SSL options with the path to a certificate bundle file
const sslOptions = {
	ca: require('fs').readFileSync('cacert.pem'), // Replace with the path to your certificate bundle
}

// Initialize request with SSL options
const req = request.defaults(sslOptions)

// List all child nodes (or "tables") in the database
db.ref()
	.once('value', (snapshot) => {
		snapshot.forEach((childSnapshot) => {
			const childKey = childSnapshot.key
			console.log('Table:', childKey)
		})
	})
	.then(() => {
		// Exit the app
		process.exit(0)
	})
	.catch((error) => {
		console.error('Error:', error)
	})
