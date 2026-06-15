import { NextResponse } from 'next/server';

// Fallback Mock data when Public API is not configured or fails
const MOCK_PILLS = [
  {
    item_seq: '200808876',
    item_name: '타이레놀정500밀리그람(아세트아미노펜)',
    entp_name: '(주)한국얀센',
    chart: '흰색의 장방형 정제',
    item_image: 'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/147426403087300104',
    print_front: 'TYLENOL',
    print_back: '500',
    drug_shape: '장방형',
    color_class1: '하양',
    form_code_name: '정제',
  },
  {
    item_seq: '195900033',
    item_name: '아스피린프로텍트정100밀리그람(아세틸살리실산)',
    entp_name: '바이엘코리아(주)',
    chart: '흰색의 원형 장용성 피막정제',
    item_image: 'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/148709562725800171',
    print_front: 'Bayer Logo',
    print_back: '100',
    drug_shape: '원형',
    color_class1: '하양',
    form_code_name: '정제',
  },
  {
    item_seq: '201402287',
    item_name: '씨 roz 정 10밀리그람(하루이회)',
    entp_name: '한미약품(주)',
    chart: '노란색의 타원형 필름코팅정',
    item_image: '',
    print_front: 'HM',
    print_back: 'C10',
    drug_shape: '타원형',
    color_class1: '노랑',
    form_code_name: '정제',
  },
  {
    item_seq: '202001123',
    item_name: '리바이브 연질캡슐',
    entp_name: 'Medical Glow 제약',
    chart: '청록색의 장방형 연질캡슐',
    item_image: '',
    print_front: 'MG',
    print_back: 'GLOW',
    drug_shape: '장방형',
    color_class1: '청록',
    form_code_name: '연질캡슐',
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const printFront = searchParams.get('print_front') || '';
  const drugShape = searchParams.get('drug_shape') || '';
  const colorClass = searchParams.get('color_class') || '';
  const formCode = searchParams.get('form_code_name') || '';

  const serviceKey = process.env.DATA_PORTAL_SERVICE_KEY;

  // If serviceKey is not configured, directly return filtered mock data (Developer local mode)
  if (!serviceKey || serviceKey === 'your-service-key') {
    const filtered = MOCK_PILLS.filter(pill => {
      if (printFront && !pill.print_front.toLowerCase().includes(printFront.toLowerCase()) && !pill.print_back.toLowerCase().includes(printFront.toLowerCase())) return false;
      if (drugShape && drugShape !== 'all' && pill.drug_shape !== drugShape) return false;
      if (colorClass && colorClass !== 'all' && pill.color_class1 !== colorClass) return false;
      if (formCode && formCode !== 'all' && pill.form_code_name !== formCode) return false;
      return true;
    });

    return NextResponse.json({
      header: { resultCode: '00', resultMsg: 'NORMAL SERVICE (MOCK)' },
      body: { items: filtered, totalCount: filtered.length }
    });
  }

  try {
    // Call Public Data API (식약처 의약품 낱알식별정보)
    const url = new URL('http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01');
    url.searchParams.append('serviceKey', serviceKey);
    url.searchParams.append('type', 'json');
    if (printFront) url.searchParams.append('print_front', printFront);
    if (drugShape && drugShape !== 'all') url.searchParams.append('drug_shape', drugShape);
    if (colorClass && colorClass !== 'all') url.searchParams.append('color_class1', colorClass);
    if (formCode && formCode !== 'all') url.searchParams.append('form_code_name', formCode);

    const apiRes = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!apiRes.ok) throw new Error('API request failed');

    const json = await apiRes.json();
    const items = json.body?.items || [];

    return NextResponse.json({
      header: { resultCode: '00', resultMsg: 'NORMAL SERVICE' },
      body: { items, totalCount: json.body?.totalCount || 0 }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      header: { resultCode: '500', resultMsg: message },
      body: { items: [], totalCount: 0 }
    }, { status: 500 });
  }
}
