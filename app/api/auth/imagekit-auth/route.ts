import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      console.error("ImageKit private key not found in environment variables");
      return NextResponse.json(
        { error: "ImageKit private key not configured" },
        { status: 500 }
      );
    }

    // Generate authentication parameters
    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 2400; // Valid for 40 minutes
    
    // Create signature
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    console.log("ImageKit auth generated successfully");

    return NextResponse.json({
      token,
      expire,
      signature,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication" },
      { status: 500 }
    );
  }
}
