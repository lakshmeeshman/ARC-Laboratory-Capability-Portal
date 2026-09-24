# SharePoint Deployment Guide — Archroma Lab Capability Finder

Comprehensive step-by-step guide for IT Administrators to deploy the **Archroma Global Laboratory Capability Finder** into Microsoft SharePoint Online or SharePoint Server.

---

## 🏗️ Architecture Overview

The application supports **two deployment options**:

```
                                  ┌──────────────────────────────────────────────────┐
                                  │            Microsoft SharePoint Online           │
                                  └────────────────────────┬─────────────────────────┘
                                                           │
                        ┌──────────────────────────────────┴──────────────────────────────────┐
                        ▼                                                                     ▼
      PATH A: SharePoint Embed Web Part                                     PATH B: Native SPFx Web Part Package
  (Hosts Next.js with ?embedded=true URL)                        (React Web Part in spfx/src/webparts/labCapabilityFinder)
                        │                                                                     │
                        └──────────────────────────────────┬──────────────────────────────────┘
                                                           │
                                                           ▼
                                            HTTPS REST API (Next.js Server API)
                                           /api/search  |  /api/labs  |  /api/stats
                                                           │
                                                           ▼
                                                SQLite FTS5 Search Engine
                                                (web/data/archroma.db)
```

---

## 🌐 PATH A — Fastest Deployment via Hosted App & Embed Web Part (5 Minutes)

In Path A, the Next.js application runs on your internal web server, Docker container, or Azure App Service, and is embedded into SharePoint pages using the built-in **SharePoint Embed Web Part**.

### Step 1: Deploy Next.js Server & API
Deploy the `./web` folder to your corporate hosting environment (e.g., Azure App Service, Docker, or IIS/Linux Node.js server):

```bash
cd web
npm install
npm run build
npm run start
```
Ensure the application is accessible via HTTPS (e.g., `https://lab-finder.archroma.internal`).

### Step 2: Configure CORS Headers in `web/next.config.ts`
The application automatically allows requests from your SharePoint domain (`*.sharepoint.com`). Verify `next.config.ts` contains:

```typescript
{
  key: "Access-Control-Allow-Origin", 
  value: "https://your-tenant.sharepoint.com" 
}
```

### Step 3: Embed in SharePoint Page
1. Open your target SharePoint page and click **Edit** (top right).
2. Click **+** to add a new web part and select **Embed**.
3. In the Embed properties pane on the right, enter the iframe embed code:

```html
<iframe 
  src="https://lab-finder.archroma.internal/?embedded=true" 
  width="100%" 
  height="800px" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```
4. Click **Publish**. The full capability finder interface will load seamlessly without showing the standalone sidebar navigation.

---

## 📦 PATH B — Native SharePoint Framework (SPFx) Web Part Package

In Path B, the application is packaged as a native SharePoint Framework (`.sppkg`) web part and deployed through your organization's **SharePoint Tenant App Catalog**.

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **Gulp CLI**: Installed globally (`npm install -g gulp-cli`)
- **SPFx Version**: `1.18.2`
- **SharePoint Permissions**: Tenant Application Administrator / SharePoint Administrator

### Step 1: Build the SPFx Package
Open terminal in the `./spfx` directory:

```bash
cd spfx
npm install
gulp bundle --ship
gulp package-solution --ship
```

This generates the SharePoint solution package at:
`spfx/sharepoint/solution/archroma-lab-capability-finder.sppkg`

### Step 2: Upload Package to SharePoint App Catalog
1. Navigate to your SharePoint Admin Center:
   `https://yourtenant-admin.sharepoint.com`
2. Open **More features** &rarr; **Apps** &rarr; **App Catalog** (or `https://yourtenant.sharepoint.com/sites/appcatalog/AppCatalog`).
3. Click **Upload** and select `archroma-lab-capability-finder.sppkg`.
4. Check **"Enable this app and add it to all sites"** (or make available for individual sites).
5. Click **Enable app**.

### Step 3: Approve Web API Permissions (Entra ID)
1. Go to **SharePoint Admin Center** &rarr; **API access**.
2. Under **Pending requests**, approve the requested API permissions for `Archroma Lab Capability Finder API` to enable Entra ID SSO token exchange.

### Step 4: Add Web Part to SharePoint Page
1. Go to any SharePoint site page and click **Edit**.
2. Click **+** to add a web part.
3. Search for **Archroma Lab Capability Finder** under *Under Development* / *Custom*.
4. Edit Web Part properties to set `apiBaseUrl` (e.g. `https://lab-finder.archroma.internal`).
5. Click **Republish**.

---

## 🔐 Microsoft Entra ID (Azure AD) Authentication Configuration

To restrict API access strictly to company employees signed into Microsoft 365:

1. **Register App in Azure Portal**:
   - Go to **Azure Portal** &rarr; **Microsoft Entra ID** &rarr; **App Registrations** &rarr; **New Registration**.
   - Name: `Archroma Lab Capability Finder Backend API`.
   - Supported Account Types: *Accounts in this organizational directory only (Single tenant)*.
2. **Expose an API**:
   - Under **Expose an API**, set Application ID URI: `api://<app-id>`.
   - Add a scope named `user_impersonation`.
3. **Configure API Token Validation**:
   - The backend module `web/lib/auth.ts` decodes and verifies incoming Bearer tokens issued by `https://login.microsoftonline.com/<tenant-id>/v2.0`.

---

## 🛠️ Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error in Browser Console** | `next.config.ts` origin headers missing | Set `Access-Control-Allow-Origin` to your SharePoint tenant domain in `web/next.config.ts`. |
| **Iframe Blocked in SharePoint** | HTML Field Security blocking domain | In SharePoint Admin &rarr; Site Settings &rarr; **HTML Field Security**, add your hosted API domain to allowed list. |
| **Gulp Build Error on SPFx** | Incompatible Node version | Ensure Node.js version is between `v18.0.0` and `v20.9.0`. |
| **401 Unauthorized API Response** | Expired Entra ID token | Verify user is signed into Microsoft 365 and token scope `user_impersonation` is approved. |
