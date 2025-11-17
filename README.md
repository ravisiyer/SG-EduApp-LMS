# Slightly Modified Version of Simon Grimm's Tutorial: React Native LMS with Strapi, Clerk & RevenueCat

This is a slightly modified version of the frontend repository of Simon Grimm's tutorial project on React Native LMS with Strapi, Clerk & RevenueCat.  

Here is [the original app frontend code published by Simon Grimm](https://github.com/Galaxies-dev/lms-react-native).  

The tutorial video: [Simon Grimm: Build Your Own MASTERCLASS clone in React Native](https://www.youtube.com/watch?v=fO3D8lNs10c), 4 hrs. 42 mins, Mar. 2025.  

 I found the tutorial very helpful to learn the topics covered in it. Many thanks to Simon Grimm for creating such a detailed learning resource.  

The Readme of the above repo has a [Demo section](https://github.com/Galaxies-dev/lms-react-native?tab=readme-ov-file#demo) with animated demos of the mobile app, followed by mobile app screenshots and web app screenshots. That's followed by Strapi screenshots showing how the course content is organized and specified at the Strapi backend using Strapi admin panel. 

Simon Grimm kindly permitted me (over email on 13 Nov. 2025) to publish this slightly modified version of his app frontend code. 

I think this modified repository's code should work with the same Strapi backend used by Simon Grimm's original repo. I made some minor superficial changes to the original backend project but I think those changes do not affect functionality of the backend. 

## Tutorial App Features
This tutorial app teaches how to develop a small LMS app which:
- Allows easy creation of course overviews and lessons (with images and rich text) using the Strapi admin panel
- Supports associating a video with each lesson
- Implements Google and Apple SSO authentication using Clerk
- Hides course content from unauthenticated users
- Renders course overview and lessons along with a video player on mobile and web
- Supports multiple courses, each with multiple lessons
- Allows courses to be free or premium
- Uses RevenueCat for in-app purchases of premium courses
- Tracks user progress through a course
- Includes attractive UI elements such as animations and parallax effects
- Lets users access the app interchangeably from mobile and web

The tutorial app is a Yoga courses app with two courses - one free and one premium. The course overview pages have images and rich text content. But the course lesson pages are essentially placeholder pages with only one sentence and one video. The same short cartoon video clip is used for all lessons in both courses. 

## About This Modified Version of the Tutorial App
In [the tutorial video](https://www.youtube.com/watch?v=fO3D8lNs10c), Simon Grimm (SG) develops and demos the LMS  (Learning Management System) app for iOS and web. However, he does not demonstrate it on Android. I did my code-along of this project for Android and web, and I encountered several issues on Android that required fixes. I also made a few small improvements to the web app. 

IFIRC, I faced some issues in getting a successful install and run using the original tutorial repo. So this project repository was created using create-expo-app. I later copied code from SG's original repo, as and when needed during my code-along. Also, to reduce size of the git repo, sometime after I had created this project with create-expo-app, I deleted the .git folder and recreated the git repo. I added assets to .gitignore before making first commit to this new git repo thus reducing this git repo size. 

To access assets, visit SG's original repo linked above. You will need to have those assets in the project assets folder for the frontend to run properly. 

I removed the Apple login as I don't use Apple devices. So the app currently supports Google login only. 

## Modified Tutorial App APK and Web Deployment
The modified tutorial app's Android version is shared as an APK and the web version is deployed on expo.dev. They are only intended as demonstration apps to showcase learning outcomes and the potential of such small LMS-style apps.  

I am using Strapi cloud free tier for hosting the API backend whose runtime behavior is 'Cold start'. This causes the first Strapi data request for both the web app and Android app to often take as long as around a minute to complete. Subsequent requests don't take so long. In a production app whose API backend is hosted on paid Strapi cloud or AWS/Azure, the runtime behaviour would be 'Always on' and so even the first Strapi data request will complete quickly.

Modified tutorial [Android release APK on Google Drive](https://drive.google.com/file/d/1b5ebQVpJsc10Ao0cUMczhgHv5Kcty1ky/view?usp=drive_link) *[Note: 'Start Course' in production Android app is not working; Debugging issue now.]* (123 MB).  

- This release APK has been scanned using VirusTotal. [The scan reported the APK file to be clean](https://www.virustotal.com/gui/file/f0006aced02b31bdcc33630882f927fcdfabcb502bf1d3bf20f54da20ea780bf) i.e. "No security vendors flagged this file as malicious".

- I tested it both on my Android mobile and on Android emulator on my PC (downloaded APK from above link on emulator).  

Modified tutorial web app is hosted on expo.dev: https://sg-eduapp-lms.expo.app/ .  

- The web app can be viewed on mobile too, though the Android app on mobile has better UI/UX. Some of my mods improved web app rendering on mobile. 

### About payments for premium course
The modified version Android app does not support in-app purchases as [RevenueCat supports Android in-app payments only via Google Play Billing](https://raviswdev.blogspot.com/2025/09/revenuecat-supports-android-in-app.html). I do not have a Google Play developer account as of now and so my modified version Android app does not support in-app purchases.

The modified version web app supports 'SANDBOX' in-app purchases. The payment screen in it is connected to a Stripe test mode setup through RevenueCat. You will see a yellow bar at the top of the payment screen with “SANDBOX” displayed in the center, indicating that the payment screen is a test-mode screen and not a real financial transaction screen. The test cards that can be used to simulate various payment cases like success and declined are given on [Stripe docs: Try it out](https://docs.stripe.com/checkout/quickstart#testing). 

Please don't use real credit/debit card numbers. I presume that even if real credit/debit card numbers are used, as Stripe test mode is being used in the web app, real debit transactions will not happen. There is no bank account associated with this Stripe test mode.

## Tutorial App Notes Posts
As notes for myself—and perhaps helpful to others—I have published several posts on the tutorial app. The latest post is [Notes on learning stage of developing my own React Native education app using Expo Framework - Part 6](https://raviswdev.blogspot.com/2025/11/notes-on-learning-stage-of-developing.html). These posts link to their previous and next posts.
