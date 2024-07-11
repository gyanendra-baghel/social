# Social

Social is a simple chat application that allows users to engage in text conversations in real-time.

## Features

- **Text Conversations:** Users can send and receive text messages instantly.
- **User Authentication:** Secure user authentication system to ensure privacy and data security.
- **Real-Time Updates:** Messages are delivered instantly using WebSocket technology for a seamless chatting experience.
- **Responsive Design:** Support for desktop and mobile devices, ensuring usability across different screen sizes.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript (React.js)
- **Backend:** Node.js, Express.js, WebSocket (Socket.io)
- **Database:** MongoDB (with Mongoose for data modeling)

## Getting Started

To run ChatApp locally or deploy it on a server, follow these steps:

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally or accessible remotely

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gyanendra-baghel/social.git
   cd chatapp
   ```

2. Install dependencies of frontend and backend:

   ```bash
   cd ./frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
4. Start the server of frontend and backend:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.

## Usage

- **Sign Up:** Create a new account with a unique username and password.
- **Log In:** Log into your account to start chatting.
- **Send Messages:** Type messages in the chat input and press Enter to send.
- **Receive Messages:** Messages from other users appear in real-time.

## Contributing

Contributions are welcome! If you have suggestions for improvements, please fork the repository and create a pull request. Feel free to open issues if you encounter bugs or have feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.