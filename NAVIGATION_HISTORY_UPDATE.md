# LIFEX navigation and approved workflow update

This update keeps the approved employee journey focused on the pages discussed:

1. Dashboard / Engineering Repository selection
2. Select Project
3. Auto-filled Project Details
4. Rear Suspension Component Selection
5. Component Workspace
6. Component Repository (documents + Manual Entry)
7. Manual Entry workflow selection and the selected form/report
8. Global Repository pages remain available from the repository selection screen.

## Navigation behavior
- All in-app navigation now uses a shared history-aware handler in `src/App.tsx`.
- Back buttons and breadcrumbs that target a page already visited return to that point in the actual visit history instead of creating a new route.
- `Alt + Left` also returns to the previous visited page.
- A short fade/slide transition runs whenever the page changes. It respects `prefers-reduced-motion`.
- The old vehicle configuration / architecture stepper is hidden in the approved Project Repository flow. Project Details now displays the simplified three-stage flow: Project Details -> Rear Suspension Components -> Component Workspace.
- The Rear Suspension selection sidebar no longer links to unrelated Reports & Insights or Help & Support pages.

Legacy page source files are retained in the project to avoid deleting unrelated code or breaking data dependencies; they are not part of the approved Project Repository navigation path.
