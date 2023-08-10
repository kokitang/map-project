# Simple Map

This application allows users to search for locations, view them on a map, and manage a list of searched locations.

## Features

- Acquire user's current location with a click of a button.
- Search for a location using Google Maps API.
- View searched locations on a map with markers.
- Manage a list of searched locations in a table format.
- Select and delete multiple locations from the list.
- View the time zone and local time of the latest searched location.

## Prerequisites

- Node.js
- Vue.js 3
- Vite
- Google Maps JavaScript API Key

## Setup and Installation

1. Clone the repository:

   ``` bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ``` bash
   cd simple-map
   ```

3. Install the dependencies:

   ``` bash
   pnpm install
   ```

4. Create a `.env` file in the root directory and add your Google Maps API key:

   ``` bash
   VUE_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

5. Run the application in development mode:

   ``` bash
   pnpm dev
   ```

The application will start, and you can access it at `http://localhost:5173`.

## Built With

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Vite](https://vitejs.dev/) - A build tool that aims to provide a faster and leaner development experience for modern web projects.
- [Ant Design Vue](https://2x.antdv.com/) - An enterprise-class UI design language and Vue-based implementation.

## Author

- Kelvin Tang

## License

This project is licensed under the MIT License.
