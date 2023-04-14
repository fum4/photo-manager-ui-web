# 📸 Photo Manager UI
## Angular

<hr/>

### Commands

#### ``pnpm start`` - Run with cloud API
#### ``pnpm start:dev`` - Run with local API

### Or check out the demo - https://photo-manager-ui.vercel.app

<hr />

### ✨ Features

- Sign in with Google (OIDC)
- JWT Authorization (without `roles` / `permissions`)
- Upload and tag images
- UI state change observer (action buttons are disabled if no action can be taken)
- Responsive (web & mobile)
- Revert changes functionality
- System tag correction on API side (e.g. `jpg` might be wrongly inferred as MIME type instead of `jpeg`)
- Tags validation (cannot be duplicated)

### ⚠️ JWT is very short-lived (10 secs) in order to be easy to test

<hr />

### ✋ Limitations

- JWT interceptor will fire multiple refresh token requests if several parallel requests fail at the sime time with `401 Unauthorized`
