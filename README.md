# Slightly Modified Version of Simon Grimm's Tutorial: React Native LMS with Strapi, Clerk & RevenueCat

This is a slightly modified version of Simon Grimm's React Native LMS with Strapi, Clerk & RevenueCat Tutorial App frontend code. Here is [the original app frontend code published by Simon Grimm](https://github.com/Galaxies-dev/lms-react-native). The Readme of the above repo has a [Demo section](https://github.com/Galaxies-dev/lms-react-native?tab=readme-ov-file#demo) with animated demos of the mobile app, followed by mobile app screenshots and web app screenshots. That's followed by Strapi screenshots showing how the course content is organized and specified at the Strapi backend using Strapi admin panel. 

Simon Grimm kindly permitted me (over email on 13 Nov. 2025) to publish this slightly modified version of his app frontend code. 

I think this modified repository's code should work with the same Strapi backend used by Simon Grimm's original repo. I made some minor superficial changes to the original backend code but I think those changes do not affect functionality of the backend. 

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

## Deployment of Modified Tutorial App
I am using Strapi cloud free tier for hosting the API backend whose runtime behavior is 'Cold start'. This causes the first Strapi data request for both the web app and Android app to often take as long as around a minute to complete. Subsequent requests don't take so long. In a production app whose API backend is hosted on paid Strapi cloud or AWS/Azure, the runtime behaviour would be 'Always on' and so even the first Strapi data request will complete quickly.

Modified tutorial web app is hosted on expo.dev: https://sg-eduapp-lms--excmsr0i6w.expo.app/ . The web app can be viewed on mobile too, though the Android app on mobile has better UI/UX. Some of my mods improved web app rendering on mobile. 

I plan to do a production build of the Android app and share the APK on Google Drive.

### About payments for premium course
The payment screen in the above deployed modified tutorial web app is connected to a Stripe test mode setup through RevenueCat. You will see a yellow bar at the top of the payment screen with “SANDBOX” displayed in the center, indicating that the payment screen is a test-mode screen and not a real financial transaction screen. The test cards that can be used to simulate various payment cases like success and declined are given on [Stripe docs: Try it out](https://docs.stripe.com/checkout/quickstart#testing). 

Please don't use real credit/debit card numbers. I presume that even if real credit/debit card numbers are used, as Stripe test mode is being used in the web app, real debit transactions will not happen. There is no bank account associated with this Stripe test mode.

## Tutorial App Notes Posts
As notes for myself—and perhaps helpful to others—I have published several posts on the tutorial app. The latest post is [Notes on learning stage of developing my own React Native education app using Expo Framework - Part 6](https://raviswdev.blogspot.com/2025/11/notes-on-learning-stage-of-developing.html). These posts link to their previous and next posts.
