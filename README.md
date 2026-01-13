# My Linkki Tracker

---

## Overview

My Linkki Tracker is a Next.js web application that provides real-time public transport information for Jyväskylä, Finland.

The application uses the official Linkki Open Data API to display upcoming buses for selected bus stops along with live vehicle details such as location, speed, and license plate number.

This project focuses on making everyday bus travel easier by offering fast and clear access to real-time data.

---

## Features

### Bus Stop Selection

- Dropdown list containing all Linkki bus stops in Jyväskylä
- Users can search and select any stop
- Selecting a stop fetches live arrival data

### Favorite Stops

- Three predefined favorite bus stops
- Favorite stops can be accessed instantly
- No need to search the dropdown for commonly used stops

### Real-Time Bus Information

For the selected bus stop, the application displays:

- Bus number
- Destination
- Scheduled departure time from the stop

### Bus Details View

Each bus item can be opened in a detailed modal view showing:

- Current live location of the bus
- Link to view the bus location in Google Maps
- Current speed of the bus
- License plate number

---

## Demo
<img width="1670" height="903" alt="home" src="https://github.com/user-attachments/assets/69acddf3-4f5f-4806-b50b-0b3a4bb5443e" />
<img width="1571" height="898" alt="bus-dropdown" src="https://github.com/user-attachments/assets/e3551588-3df5-4ea6-8ec7-a6796baa4f82" />
<img width="1777" height="901" alt="bus-list" src="https://github.com/user-attachments/assets/65844d09-c90a-4afa-923b-78d6926fd0e8" />
<img width="1225" height="877" alt="bus-details" src="https://github.com/user-attachments/assets/0d89ff67-c067-44f6-8145-f0af5b741e6f" />

---

## Tech Stack

- Next.js
- React
- JavaScript or TypeScript
- Linkki Open Data API
- Google Maps
- CSS / Tailwind CSS / Styled Components

---

## APIs Used

### Linkki Open Data API

The application uses the Linkki Open Data API to fetch:

- Bus stop data for Jyväskylä
- Real-time arrival and departure times
- Vehicle location data
- Vehicle speed
- License plate information

API documentation is available on the official Linkki open data website.

---

## Installation and Setup

- Clone the repository:

```bash
git clone https://github.com/your-username/my-linkki-tracker.git
### Install dependencies

```bash
cd your-repo-name
npm install
```

### Environment variables

Create a `.env.local` file and add:

```env
WALTTI_CLIENT_ID=your_api_key_here
WALTTI_CLIENT_SECRET=your_secret_here
```

### Run locally

```bash
npm run dev
```

Open:
```
http://localhost:3000
```

---

## Future Improvements

- Allow users to add and remove their own favorite stops
- Persist favorite stops using local storage
- Add a map view showing multiple buses at once
- Improve mobile responsiveness
- Improve loading and error handling states

---

## Motivation
This project demonstrates:
- Integration with real-time public transport APIs
- Working with live location and vehicle data
- Building a user-focused application for a real-world use case
- Structuring and scaling a Next.js application



