# Sayso

React Native demo for the upcoming survey-taking app

## Stack

- Expo SDK 55, React Native 0.83, React 19.2, TypeScript strict
- Expo Router 55 (file-based routing)
- Zustand + immer + AsyncStorage persistence
- `expo-glass-effect` (iOS 26 Liquid Glass)
- React Native Paper (Material 3 on Android)
- Custom `NetworkImage` Expo Module: Kingfisher 8 (iOS, via SPM) and Coil 3 (Android)
- React Native framework implementation: 
- iOS deployment target 26.0, Android `compileSdk` / `targetSdk` 36, `minSdk` 26

## Architecture

MVVM-C adapted for Expo Router.

- View: route screen under `app/`
- ViewModel: `useXxxViewModel` hook over a Zustand slice in `src/features/<feature>/store/`
- Coordinator: `useXxxCoordinator` hook wrapping `useRouter()` in `src/features/<feature>/navigation/`
- Repositories under `src/core/repositories/` read mock JSON from `src/core/data/`

Views never touch the router or store directly. May not be the best choice but i wanted to push this and see how it goes

## Logic

- Basic survey-taking app demo
- Supports different survey step types: single-select, multi-select, free-text, slider, top-X ordering
- Similar flow to internal app

## The good
- Shared codebase and resources between iOS and Android
- Hot-reload during development
- Supports UI elements that don't exist natively on iOS eg. dropdowns
- Not locked down to Xcode

## The bad
- Cocoapods instead of SPM
- Hard dependency on Expo SDK and its (slow) release cycle
- Even if we target iOS 26+, we still can't properly support liquid glass and the new native iOS UI design system. We are constrained by only what `expo-glass-effect` exposes and outside the liquid glass tabbar, the List style, buttons, nav bar items, etc are still rendering in a iOS 18 style, making the app look old. This will also conflict with the decisions the design team are making because they will no longer match our new limitations/look and feel. More effort will be needed to recreate these native looks on both platforms and make stuff look good in both dark/light mode
- Missing SwiftUI native modifiers for UI (eg `.toolbarTitleDisplayMode(.inlineLarge)`) even when 1:1 equivalents exists on Android side
- Tapping into existing native code is possible but not always easy; dependencies are tricky to integrate and feels fragile
- Navigation animations feel off on both platforms

## Run

```bash
npm install
npx expo prebuild --clean
npm run ios       # or
npm run android
```

Demo credentials: `radu_u@me.com` / `testpass`

## Layout

```
app/               file-based routes (auth, main, settings modal, runner)
src/core/          models, repositories, mock JSON, storage helpers
src/features/      auth, surveys, survey-runner, settings (store/viewmodels/navigation)
src/ui/            components, theme, question renderers
modules/           local Expo Modules (network-image)
plugins/           config plugins (Kingfisher SPM injection)
```
