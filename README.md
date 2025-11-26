
## What is an A-round?

A digital marketplace where users can buy and sell secondhand items within their own postal code. Just like local community markets, it connects people within the same area, making it easy to find and trade items with neighbors.


<img src="https://imgur.com/xDftHje.gif" alt="title" width="400"/>




## 📖 Contents
- [What is A-round?](#-what-is-a-round)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#%EF%B8%8F-environment-variables)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)


## ❓ What is A-round?

- A-round is a **local secondhand marketplace** where users trade items with people in the **same postal code area**.
- Find items nearby, chat with sellers, and meet easily.
- Provides a simple and safe way to **discover, upload, and manage local listings**.

## 📝 Project Overview

A-round is a **full-stack marketplace platform** built with:

- **React + TypeScript** for the client  
- **Node.js + Express + MongoDB** for backend  
- **Cloudinary** for image storage  
- **WebSocket** for real-time chat



## 🛠 Features

- **User Login & Registration** with JWT
<img src="https://imgur.com/c7cjOWQ.gif" alt="title" width="400"/>

- **Upload, edit, and delete items**
<img src="https://imgur.com/4BkjLQY.gif" alt="title" width="400"/>

- **Like items** to save favorites  
- **Real-time chat** between buyers and sellers  
- **Local-area item filtering** (postal code based)  
- **Cloud image uploading**  
- **Smooth UI animations with Framer Motion**


## 🧰 Tech Stack

### **Frontend**
- React (TypeScript)
- Redux Toolkit
- React Router
- Framer Motion

### **Backend**
- Node.js (TypeScript)
- Express.js
- MongoDB / Mongoose
- Passport + JWT
- Multer (for handling file uploads)
- Cloudinary
- bcrypt (for hashing passwords)
- WebSocket (for real time chat)

## 🏛 Architecture

```
Client (React + TypeScript)
↓
Backend (Node.js + Express)
↓
MongoDB Atlas (Database)

Auth: JWT + Passport
Images: Cloudinary
Real-time Chat: WebSocket
```


## 📂 Folder Structure

```
goDutch/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── functions/
│   │   ├── utils/
│   │   ├── @types/
│   │   ├── react-app-env.d.ts
│   │   └── App.tsx
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── index.js
    └── package.json
```


## 🚀 Quick Start

Follow the steps below to run **A-round** locally.

### 1. Clone the repository

```bash
git clone https://github.com/CodeArchiveSu/Second-Hand-Shop.git
cd Second-Hand-Shop
```

### 2. Install dependencies

#### Client
```bash
cd client
npm install
```

#### Server
```bash
cd ../server
npm install
```


### 3. Set up environment variables

#### 🟦 Client `.env`

Create:

```
client/.env
```

Add:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_KEY_LOCATION=<YOUR_IP_GEO_KEY>
```



#### 🟥 Server `.env`

Create:

```
server/.env
```

Add:

```env
MONGO_DB=mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/secondHandShop
PORT=5001
CLOUD_NAME=<YOUR_CLOUD_NAME>
CLOUD_API_KEY=<YOUR_CLOUD_API_KEY>
CLOUD_SECRET=<YOUR_CLOUD_SECRET>


```


### 4. Start the development servers

#### Backend
```bash
cd server
npx nodemon server.js
```

#### Frontend
```bash
cd ../client
npm start
```

Open the frontend:  
👉 http://localhost:3000




## 🚧 Future Improvements

-Add a “Login Failed” alert
-Add an alert when a new message arrives
-Product search 


## 🤝 Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests.



## 📄 License
This project is licensed under the MIT License.
