# LIFEX — Windows setup

## Requirements
- Windows 10/11, 64-bit (x64)
- Node.js 22.12+ x64 (Node 24 x64 is also supported by the current Vite engine range)
- npm 10+
- Microsoft Visual C++ Redistributable 2015–2022 (x64)

## First-time setup
1. Install the Microsoft Visual C++ Redistributable (x64) from Microsoft's official page:
   https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist
2. Restart Windows if the installer requests it.
3. Open Command Prompt in this `LIFEX` folder.
4. Run:

   ```cmd
   npm install --include=optional
   npm run dev
   ```

5. Open the local URL printed by the app. The repository API runs on port 3001; Vite serves the frontend.

## If native modules fail to load
Close the dev server, then run these commands from the `LIFEX` folder:

```cmd
rmdir /s /q node_modules
npm cache clean --force
npm install --include=optional
npm run dev
```

Do not delete `package-lock.json`; it pins the tested dependency graph. Do not edit `vite.config.ts` to work around a missing native binary.

If Windows still reports `not a valid Win32 application`, verify that Node is x64 (`node -p "process.arch"` should print `x64`) and that the x64 Visual C++ Redistributable is installed.
