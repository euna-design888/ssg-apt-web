// IndexNow Ping Runner
const INDEXNOW_KEY = '9b8e7c6d5a4f3e2b1a0f9e8d7c6b5a4f';
const HOST = 'fundmoney8.com';
const BASE_URL = `https://${HOST}`;

const apartmentIds = [
  '2026-seongnam-bokjeong-2-a1',
  '2026-dh-bangbae',
  '2026-jamsil-raemian-ipark',
  '2026-brownstone-wolgok-central',
  '2026-gwacheon-d-etre-perstige',
  '2026-hwaseo-lake-park-honors',
  '2026-incheon-gyeyang-a6',
  '2026-godeok-gangil-3',
];

const urlList = [
  `${BASE_URL}/`,
  ...apartmentIds.map((id) => `${BASE_URL}/apt/${id}`),
];

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
  urlList: urlList,
};

async function ping() {
  console.log(`[IndexNow] Sending ${urlList.length} URLs to api.indexnow.org...`);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    console.log(`[IndexNow Response] Status: ${res.status} (${res.statusText})`);
    if (res.status === 200 || res.status === 202) {
      console.log('[IndexNow] ✅ Success! Search engines notified successfully.');
    } else {
      console.log('[IndexNow] ⚠️ Non-200 response. Note: File must be deployed first for verification.');
    }
  } catch (err) {
    console.error('[IndexNow Error]', err);
  }
}

ping();
