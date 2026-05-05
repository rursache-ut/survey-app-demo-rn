# Sayso

React Native demo for the upcoming survey-taking app

## Stack

- Expo SDK 55, React Native 0.83, React 19.2, TypeScript strict
- Expo Router 55 (file-based routing)
- Zustand with AsyncStorage persistence
- `expo-glass-effect` (iOS 26 Liquid Glass)
- React Native Paper (Material 3 on Android)
- Custom `NetworkImage` Expo Module: Kingfisher 8 (iOS, via SPM) and Coil 3 (Android)
- React Native framework implementation: 
- iOS deployment target 26.0, Android `compileSdk` / `targetSdk` 36, `minSdk` 26

## Architecture

MVVM-C adapted for Expo Router.

- **View** — route screen under `app/`. Renders state from a viewmodel and forwards user input to it. Never touches stores, the router, or repositories directly
- **ViewModel** — `useXxxViewModel` hook in `src/features/<feature>/viewmodels/`. Subscribes to one or more Zustand stores, derives display state, and exposes the actions the view can call. Workflow actions that span features (eg. claim reward = award balance + mark survey completed + clear runner state) live here so the screen stays declarative
- **Coordinator** — `useXxxCoordinator` hook in `src/features/<feature>/navigation/`. Wraps `useRouter()` and any one-shot side effects tied to navigation (eg. sign-out-and-exit). The view calls `coordinator.someAction()` instead of `router.push(...)`
- **Store** — Zustand slice in `src/features/<feature>/store/`. Holds feature-local state and the actions that mutate it. Async actions handle their own errors and expose an `error: string \| null` field for the view
- **Repository** — interface in `src/core/repositories/` with a mock implementation backed by JSON in `src/core/data/`. Throws domain-specific errors (eg. `SurveyNotFoundError`) instead of returning nullable results, so callers do not have to remember to null-check

Cross-feature side effects flow through viewmodels via `store.getState()` so the action callbacks stay referentially stable and screens can use them in `useEffect` without re-firing

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

Demo credentials: `test@user.com` / `testpass`

## Layout

```
app/               file-based routes (auth, main, settings modal, runner)
src/core/          models, repositories, mock JSON, storage helpers, utils
src/features/      auth, surveys, survey-runner, settings (store/viewmodels/navigation)
src/ui/            components, theme, question renderers
modules/           local Expo Modules (network-image)
plugins/           config plugins (Kingfisher SPM injection)
```
