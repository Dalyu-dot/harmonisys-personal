export const PHILIPPINE_REGIONS = [
    'NCR',
    'CAR',
    'Region I',
    'Region II',
    'Region III',
    'Region IV-A',
    'Region IV-B',
    'Region V',
    'Region VI',
    'Region VII',
    'Region VIII',
    'Region IX',
    'Region X',
    'Region XI',
    'Region XII',
    'Region XIII',
    'BARMM',
] as const;

export const REGION_ALIASES: Record<string, string> = {
    ncr: 'NCR',
    'national capital region': 'NCR',
    'metro manila': 'NCR',

    car: 'CAR',
    'cordillera administrative region': 'CAR',

    'region i': 'Region I',
    'ilocos region': 'Region I',

    'region ii': 'Region II',
    'cagayan valley': 'Region II',

    'region iii': 'Region III',
    'central luzon': 'Region III',

    'region iv-a': 'Region IV-A',
    calabarzon: 'Region IV-A',

    'region iv-b': 'Region IV-B',
    mimaropa: 'Region IV-B',

    'region v': 'Region V',
    bicol: 'Region V',
    'bicol region': 'Region V',

    'region vi': 'Region VI',
    'western visayas': 'Region VI',

    'region vii': 'Region VII',
    'central visayas': 'Region VII',

    'region viii': 'Region VIII',
    'eastern visayas': 'Region VIII',

    'region ix': 'Region IX',
    'zamboanga peninsula': 'Region IX',

    'region x': 'Region X',
    'northern mindanao': 'Region X',

    'region xi': 'Region XI',
    'davao region': 'Region XI',

    'region xii': 'Region XII',
    soccsksargen: 'Region XII',

    'region xiii': 'Region XIII',
    caraga: 'Region XIII',

    armm: 'BARMM',
    barmm: 'BARMM',
    'bangsamoro autonomous region in muslim mindanao': 'BARMM',
};

export const CITY_TO_REGION: Record<string, string> = {
    // NCR
    manila: 'NCR',
    quezon: 'NCR',
    'quezon city': 'NCR',
    caloocan: 'NCR',
    'las piñas': 'NCR',
    'las pinas': 'NCR',
    makati: 'NCR',
    malabon: 'NCR',
    mandaluyong: 'NCR',
    marikina: 'NCR',
    muntinlupa: 'NCR',
    navotas: 'NCR',
    parañaque: 'NCR',
    paranaque: 'NCR',
    pasay: 'NCR',
    pasig: 'NCR',
    'san juan': 'NCR',
    taguig: 'NCR',
    valenzuela: 'NCR',
    pateros: 'NCR',

    // CAR
    baguio: 'CAR',
    tabuk: 'CAR',

    // Region I
    laoag: 'Region I',
    batac: 'Region I',
    candon: 'Region I',
    vigan: 'Region I',
    alaminos: 'Region I',
    dagupan: 'Region I',
    urdaneta: 'Region I',
    'san carlos': 'Region I',
    'san carlos pangasinan': 'Region I',
    'san fernando la union': 'Region I',

    // Region II
    tuguegarao: 'Region II',
    cauayan: 'Region II',
    ilagan: 'Region II',
    santiago: 'Region II',
    bayombong: 'Region II',
    solano: 'Region II',
    cabarroguis: 'Region II',

    // Region III
    angeles: 'Region III',
    'san fernando pampanga': 'Region III',
    mabalacat: 'Region III',
    tarlac: 'Region III',
    olongapo: 'Region III',
    balanga: 'Region III',
    meycauayan: 'Region III',
    'san jose del monte': 'Region III',
    malolos: 'Region III',
    baliwag: 'Region III',
    marilao: 'Region III',
    'san miguel': 'Region III',
    cabanatuan: 'Region III',
    gapan: 'Region III',

    // Region IV-A
    antipolo: 'Region IV-A',
    bacoor: 'Region IV-A',
    calamba: 'Region IV-A',
    dasmariñas: 'Region IV-A',
    dasmarinas: 'Region IV-A',
    'general trias': 'Region IV-A',
    imus: 'Region IV-A',
    tagaytay: 'Region IV-A',
    'trece martires': 'Region IV-A',
    biñan: 'Region IV-A',
    binan: 'Region IV-A',
    cabuyao: 'Region IV-A',
    'san pablo': 'Region IV-A',
    'san pedro': 'Region IV-A',
    'santa rosa': 'Region IV-A',
    batangas: 'Region IV-A',
    lipa: 'Region IV-A',
    tanauan: 'Region IV-A',
    'santo tomas': 'Region IV-A',
    lucena: 'Region IV-A',
    tayabas: 'Region IV-A',

    // Region IV-B
    calapan: 'Region IV-B',
    'puerto princesa': 'Region IV-B',
    'san jose occidental mindoro': 'Region IV-B',

    // Region V
    legazpi: 'Region V',
    tabaco: 'Region V',
    ligao: 'Region V',
    iriga: 'Region V',
    naga: 'Region V',
    masbate: 'Region V',
    sorsogon: 'Region V',

    // Region VI
    iloilo: 'Region VI',
    passi: 'Region VI',
    bacolod: 'Region VI',
    bago: 'Region VI',
    cadiz: 'Region VI',
    escalante: 'Region VI',
    himamaylan: 'Region VI',
    kabankalan: 'Region VI',
    'la carlota': 'Region VI',
    sagay: 'Region VI',
    'san carlos negros occidental': 'Region VI',
    silay: 'Region VI',
    sipalay: 'Region VI',
    'talisay negros occidental': 'Region VI',
    victorias: 'Region VI',
    roxas: 'Region VI',

    // Region VII
    cebu: 'Region VII',
    'lapu-lapu': 'Region VII',
    'lapu lapu': 'Region VII',
    mandaue: 'Region VII',
    'talisay cebu': 'Region VII',
    danao: 'Region VII',
    toledo: 'Region VII',
    carcar: 'Region VII',
    'naga cebu': 'Region VII',
    bogo: 'Region VII',
    tagbilaran: 'Region VII',
    bais: 'Region VII',
    bayawan: 'Region VII',
    canlaon: 'Region VII',
    dumaguete: 'Region VII',
    guihulngan: 'Region VII',
    tanjay: 'Region VII',

    // Region VIII
    tacloban: 'Region VIII',
    ormoc: 'Region VIII',
    baybay: 'Region VIII',
    borongan: 'Region VIII',
    catbalogan: 'Region VIII',
    calbayog: 'Region VIII',
    maasin: 'Region VIII',
    naval: 'Region VIII',
    catarman: 'Region VIII',
    laoang: 'Region VIII',
    allen: 'Region VIII',
    palompon: 'Region VIII',
    carigara: 'Region VIII',

    // Region IX
    zamboanga: 'Region IX',
    dapitan: 'Region IX',
    dipolog: 'Region IX',
    isabela: 'Region IX',
    'isabela city': 'Region IX',
    pagadian: 'Region IX',

    // Region X
    'cagayan de oro': 'Region X',
    'el salvador': 'Region X',
    gingoog: 'Region X',
    iligan: 'Region X',
    malaybalay: 'Region X',
    valencia: 'Region X',
    oroquieta: 'Region X',
    ozamiz: 'Region X',
    tangub: 'Region X',

    // Region XI
    davao: 'Region XI',
    digos: 'Region XI',
    mati: 'Region XI',
    panabo: 'Region XI',
    samal: 'Region XI',
    tagum: 'Region XI',

    // Region XII
    'general santos': 'Region XII',
    koronadal: 'Region XII',
    kidapawan: 'Region XII',
    tacurong: 'Region XII',
    cotabato: 'BARMM',
    'cotabato city': 'BARMM',

    // Region XIII
    butuan: 'Region XIII',
    cabadbaran: 'Region XIII',
    bayugan: 'Region XIII',
    surigao: 'Region XIII',
    bislig: 'Region XIII',
    tandag: 'Region XIII',

    // BARMM
    lamitan: 'BARMM',
    marawi: 'BARMM',
};
