## Tempo App

Welcome to Tempo! Tempo is an app that allows you to use Spotify to enjoy the best music for your runs. Follow the instructions below to access our landing site or run the app code locally.

### Accessing the Landing Site

To access our landing site, click the link below:
- [Tempo Landing Site](https://tempo-szyi.onrender.com)

### Running the App Locally

To run the app locally on your machine, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo-url.git
   cd tempo-app
   ```

2. **Setup Spotify Account**
   - Make sure you have a Spotify account and know your login credentials.

3. **Create a Spotify Developer Account**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com).
   - Create an account with the following settings:
     - Name: Anything
     - Description: Anything
     - Redirect URIs: Use the Expo URI that appears in your console when you run the simulator and append `/--/spotify-auth-callback` to it. For example, if your Expo URI is `exp://172.26.101.3:8081`, your redirect URI will be `exp://172.26.101.3:8081/--/spotify-auth-callback`.
     - APIs used: iOS

4. **Update Spotify Credentials**
   - Once your account is created, locate your Spotify `clientId` and `clientSecret` in your dashboard.
   - Substitute these values located in `screens/Credentials.js` with your own credentials.

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Run the App**
   - Launch the iOS simulator with:
     ```bash
     npm run ios
     ```
     Note: There have been some issues reported with running this using Expo Go, but the iOS simulator should work fine.

7. **Authenticate with Spotify**
   - Authenticate using your Spotify credentials within the app.

8. **Enjoy Tempo!**
   - You can now use Tempo to discover and enjoy music from Spotify.
