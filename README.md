# Noti

Noti is a full-stack social network application that allows users to set reminders to turn off parking apps and post updates on cleared parking spots. This application is built using Node.js, TypeScript, Express, Jest for testing, and React Native (Expo) for the front end.

## Features

- User authentication and authorization using JWT and Google login
- Setting reminders to turn off parking apps
- Posting updates on cleared parking spots
- Viewing updates from other users on parking
- Notifications to remind users to turn off the app
- Responsive UI

## Tech Stack

### Frontend

- React Native (Expo)
- TypeScript
- UI kitten

### Backend

- Node.js
- Express
- TypeScript
- Jest (for testing)

## Installation

### Prerequisites

- Node.js
- npm or yarn

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/shaiMatz/Noti.git
cd Noti
```

2. Install the backend dependencies:
```bash
cd backend
npm install
```

3. Create a .env file in the backend directory and add your environment variables:
```bash
PORT=<your_port>
MONGO_URI=<your_mongodb_uri>
ACCESS_TOKEN_LIFE=<your_access_token_life>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
TOKEN_EXPIRATION=<your_token_expiration>
GOOGLE_CLIENT_ID_WEB=<your_google_client_id_web>
GOOGLE_CLIENT_ID=<your_google_client_id>
```
4. Run the backend server:
```bash
npm start
```

### Frontend  Setup
1. Install the frontend dependencies:
```bash
npm start
```

2. Run the frontend app:
```bash
npm start
```

For detailed instructions, refer to the [Google Auth/Signin in React Native without Firebase article](https://dev.to/suyashdev/google-authsignin-in-react-native-without-firebase-43n).


## Running Tests
To run the tests, navigate to the backend directory and use the following command:
```bash
npm test
```

## Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
1. Create a new branch (git checkout -b feature/your-feature)
2. Commit your changes (git commit -m 'Add some feature')
3. Push to the branch (git push origin feature/your-feature)
4. Open a pull request

## Contact
For any inquiries, please contact Shai Matzliach at [shaimatz99@gmail.com](shaimatz99@gmail.com).
