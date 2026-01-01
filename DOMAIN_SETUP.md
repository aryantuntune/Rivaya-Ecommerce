# Domain & DNS Setup Guide

This guide explains how to connect your GoDaddy domain to your Hostinger VPS using Cloudflare.

**Why Cloudflare?**
- **Security**: Hides your VPS IP address and provides DDoS protection.
- **Speed**: Caches your static content (frontend) globally.
- **SSL**: Provides free automatic SSL certificates.

## Phase 1: Cloudflare Setup (Part 1)
> [!TIP]
> **Account Recommendation**: It is highly recommended to create the Cloudflare account using your **Client's Email**.
> This ensures they own their infrastructure. You can add your personal account as a "Member" later if needed.

1.  **Create Account**: Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up with the **Client's email**.
2.  **Add Site**: Click **"Add a Site"** and enter your domain: `rivayaonline.in`.
3.  **Select Plan**: Choose the **Free** plan at the bottom.
4.  **DNS Scan**: Cloudflare will scan for existing records.
5.  **Get Nameservers**: Cloudflare will designate two nameservers for you (e.g., `max.ns.cloudflare.com` and `lola.ns.cloudflare.com`). **Copy these.**

## Phase 2: GoDaddy Configuration
1.  **Login**: Go to GoDaddy and log in.
2.  **My Products**: Find your domain in the "My Products" list.
3.  **DNS Management**: Click on **DNS** or **Manage DNS**.
4.  **Nameservers**:
    - Find the **Nameservers** section.
    - Click **Change**.
    - Select **I'll use my own nameservers**.
    - Paste the two nameservers provided by Cloudflare.
    - Click **Save**.
5.  **Wait**: It may take a few minutes (up to an hour) for GoDaddy to update.

## Phase 3: Cloudflare Setup (Part 2)
1.  **Verify**: Go back to Cloudflare and click **"Check Nameservers"**. It will confirm once active (you'll get an email).
2.  **Add 'A' Record (Pointing to VPS)**:
    - Go to **DNS** > **Records** in Cloudflare sidebar.
    - Click **Add record**.
    - **Type**: `A`
    - **Name**: `@` (root)
    - **IPv4 address**: `[YOUR_HOSTINGER_VPS_IP]` (copy this from Hostinger dashboard).
    - **Proxy status**: **Proxied (Orange Cloud)** (Recommended for security).
    - Click **Save**.
3.  **Add 'CNAME' Record (for 'www')**:
    - Click **Add record**.
    - **Type**: `CNAME`
    - **Name**: `www`
    - **Target**: `@` (or your domain name).
    - **Proxy status**: **Proxied**.
    - Click **Save**.

## Phase 4: Encryption Mode (Important)
1.  In Cloudflare sidebar, go to **SSL/TLS**.
2.  Set encryption mode to **Full (Strict)** or **Full**.
    - **Full**: Encrypts between Cloudflare and your VPS. Requires a self-signed or valid cert on VPS.
    - **Full (Strict)**: Requires a valid cert on VPS (We will use Certbot on the VPS to generate this).
    - *Recommendation*: Start with **Full**.

## Phase 5: Finalize VPS Config
Now that the domain points to the VPS, you can finish the Nginx setup on the server.

1.  **Update Nginx Config**:
    - Edit your config: `nano /etc/nginx/sites-available/rivaya`
    - Ensure `server_name` matches your domain:
      ```nginx
      server_name yourdomain.com www.yourdomain.com;
      ```
    - Restart Nginx: `systemctl restart nginx`

2.  **Generate SSL (Certbot)**:
    - Run: `certbot --nginx -d yourdomain.com -d www.yourdomain.com`
    - If configured correctly, Certbot will talk to Cloudflare/LetsEncrypt and secure your site.
