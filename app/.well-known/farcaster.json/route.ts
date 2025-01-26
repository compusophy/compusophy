/* eslint-disable sort-keys-fix/sort-keys-fix */
import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjM1MDkxMSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJGREVmM0Y0NzBlQ2QyQmM5YTk3NzU2OEM0M0FEMzg2MGMxNjExRDgifQ",
      payload: "eyJkb21haW4iOiJjb21wdXNvcGh5LnZlcmNlbC5hcHAifQ",
      signature:
        "MHgzNzNjNzc0YTJhZGRmMzk5ZDBiZDY5ZDI3NjNmYTdhOGE3ZmUwZDIxOTAwZGMxZjQwZmI2M2M2YWE1M2ZhMDcyMjBlOGNkMDAyNGMyOGQ3NmQ3ODMwODAxMjIyZjE3MTc5ZDllNzM4YTg5YWU0ZWVhNzM1NmQ0ZjFhNjAyMDkwODFj",
    },
    frame: {
      version: "1",
      name: "compusophy",
      iconUrl: "https://compusophy.vercel.app/icon.png",
      homeUrl: "https://compusophy.vercel.app",
      imageUrl: "https://compusophy.vercel.app/image.png",
      buttonTitle: "launch",
      splashImageUrl: "https://compusophy.vercel.app/splash.png",
      splashBackgroundColor: "#000000",
      webhookUrl: "https://compusophy.vercel.app/api/webhook",
    },
  };

  return NextResponse.json(config);
}
