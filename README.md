# Sayso

React Native demo for the upcoming survey-taking app

## Stack

- Expo SDK 55, React Native 0.83, React 19.2, TypeScript strict
- Expo Router 55 (file-based routing)
- Zustand with AsyncStorage persistence
- `expo-glass-effect` (iOS 26 Liquid Glass)
- React Native Paper (Material 3 on Android)
- Custom `NetworkImage` Expo Module: Kingfisher 8 (iOS, via SPM) and Coil 3 (Android)
- iOS deployment target 26.0, Android `compileSdk` / `targetSdk` 36, `minSdk` 26

## Architecture

Lightweight and feature-first:

- **Screens** (`app/`) read stores directly with selectors and call `router.push()` inline. No viewmodel or coordinator wrapper layers
- **Stores** (`src/features/<name>/store/`) — one Zustand slice per domain. Async actions catch their own errors and expose an `error: string \| null` field
- **Cross-feature workflows** live as plain async functions in `src/features/<name>/actions/` (eg. `claimSurveyReward` awards balance + marks survey completed + clears runner state). They reach into peer stores via `useStore.getState()`, so they stay outside React and are trivial to test

Repositories in `src/core/repositories/` throw domain errors (eg. `SurveyNotFoundError`) instead of returning nullable results. Small reusable hooks (eg. `useSurveyPreview`) live next to the feature they serve under `src/features/<name>/hooks/` only when they own real logic — passthrough hooks are deliberately avoided

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

## AI Setup
In claude code run
`/plugin marketplace add expo/skills`
to add the marketplace and
`/plugin install expo`
to intall the plugin that comes with the skills

For anything else (eg. Codex, etc) run
`npx skills add expo/skills`

## Run

```bash
npm install
npx expo prebuild --clean
npm run ios       # or
npm run android
```

Demo credentials: `test@user.com` / `testpass` or triple-tap the hero icon in the auth screen
