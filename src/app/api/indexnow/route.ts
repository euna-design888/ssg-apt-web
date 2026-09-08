import { NextResponse } from 'next/server';
import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';

export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = '9b8e7c6d5a4f3e2b1a0f9e8d7c6b5a4f';
const HOST = 'fundmoney8.com';
const BASE_URL = `https://${HOST}`;

export async function GET() {
  return handlePing();
}

export async function POST() {
  return handlePing();
}

async function handlePing() {
  try {
    const apartments = rawApartments as Apartment[];
    const urlList = [
      `${BASE_URL}/`,
      ...apartments.map((apt) => `${BASE_URL}/apt/${encodeURIComponent(apt.id)}`),
    ];

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urlList,
    };

    // IndexNow API sends to Bing/Naver/IndexNow shared network
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const isSuccess = response.status === 200 || response.status === 202;

    return NextResponse.json({
      success: isSuccess,
      status: response.status,
      statusText: response.statusText,
      pingsSent: urlList.length,
      urlList,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
