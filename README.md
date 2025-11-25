
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
