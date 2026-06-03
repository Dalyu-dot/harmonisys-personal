// headers
export const columns = [
    {
        key: 'empty',
        label: '',
    },
    {
        key: 'description',
        label: 'Mga kilos na obserbahan <span style="font-weight:normal"><i>(Observed Behavior)</i></span><br> Ang tao ay...<span style="font-weight:normal"> <i>(The person is...)</i></span>',
    },
    {
        key: 'agree',
        label: 'Oo<br><span style="font-weight:normal"><i>Yes</i></span>',
    },
    {
        key: 'disagree',
        label: 'Hindi<br><span style="font-weight:normal"><i>No</i></span>',
    },
    {
        key: 'intervention',
        label: 'Mga Interbensyon (Interventions)<br><span style="font-size:smaller;">* MHPSS na Kasanayan: <span style="font-weight:normal">Antas 1, 2, 3 at 4</span></span><br><span style="font-size: smaller; font-style: italic; font-weight: normal">(MHPSS Competencies: Level 1, 2, 3, and 4)</span>',
    },
];

// red category
export const redRows = [
    {
        number: 1,
        description:
            '<b>…nagdudulot ng pinsala o kapahamakan </b>(hal. nanununtok, naninipa, nambabato hawak ang sandata, nananampal o nananabunot, naghahagis o nambabasag ng mga bagay at iba pa) sa ibang tao. <i>(…causing injury or harm (i.e. punching, kicking, throwing a fit holding a weapon, slapping or pulling another person’s hair, throwing or breaking objects etc.) to others.)</i>',
        span: 2,
    },
    {
        number: 2,
        description:
            '<b>...nambabanta</b> (hal. may binabalak na masama at may paraan o sandata) ng kapahamakan ng iba. <i>(...threatening (i.e. with plan and means or weapon) to harm others.)</i>',
        span: 0,
    },
    {
        number: 3,
        description:
            '<b>...tinatangkang saktan ang sarili</b> na<b> maaaring magdulot ng kamatayan</b>. <i>(…attempting to inflict fatal harm to one’s self.)</i>',
        span: 3,
    },
    {
        number: 4,
        description:
            '<b>...nambabanta </b>(hal. may binabalak na masama at paraan o sandata) na saktan ang sarili. <i>(...threatening (i.e. with plan and means or weapon) to harm self.)</i>',
        span: 0,
    },
    {
        number: 5,
        description:
            '<b>...nagsasabi na nais niyang magpakamatay.</b><i> (...expressing suicidal thoughts.)</i>',
        span: 0,
    },
    {
        number: 6,
        description:
            '<b>...sinasabi na kasalanan niya ang trahedya.</b> <i>(...saying that the tragedy is their fault.)</i>',
        span: 1,
    },
    {
        number: 7,
        description:
            '<b>...sinasabing nasaktan siya, nagahasa, o naabuso.</b> <i>(...saying that they were hurt, raped, or abused.)</i>',
        span: 2,
    },
    {
        number: 8,
        description:
            '<b>...sinasabing may nagbabanta sa kanya o nakaranas siya ng di kanais-nais na pagtrato mula sa iba.</b> <i>(...saying that they were threatened or experienced unwelcome advances from others (i.e. being stalked).)</i>',
        span: 0,
    },
    {
        number: 9,
        description:
            '<b>...sinasabi na nakakarinig o nakakakita siya ng mga bagay na di naman naririnig o nakikita ng iba, o sinasabi ang mga bagay na hindi nakabatay sa totoong buhay.</b> <i>(...saying that they are hearing or seeing things that others cannot hear or see, or saying things that are not based on reality.)</i>',
        span: 3,
    },
    {
        number: 10,
        description:
            '<b>...walang oryentasyon </b>(hal. di masabi kanyang pangalan, di alam kung saan siya nanggaling, walang saysay ang sinasabi).<i> (...disoriented (i.e. not knowing their name and where they came from, not making sense).)</i>',
        span: 0,
    },
    {
        number: 11,
        description:
            '<b>...hindi makatulog o makakain o hindi nag-aalaga ng sarili</b> (hal. binabalewala ang pansariling kalinisan). <i>(...unable to sleep or eat, or not taking care of themselves (i.e. neglecting personal hygiene).)</i>',
        span: 0,
    },
];

export const redInterventions = [
    {
        number: 1,
        competencies: [
            [2, 3, 4],
            [2, 3, 4],
            [2, 3, 4],
            [1, 2, 3],
        ],
        checklist: [
            '<b>Alisin ang maaaring mahawakang sandata o matutulis na bagay.</b> <i>Remove access to any weapons or sharp objects.</i> (2, 3, 4)',
            '<b>Dalhin ang IDP sa isang ligtas na lugar kung saan hindi siya makapagpapahamak ng ibang tao.</b> <i>Put IDP in a safe space where he or she cannot harm other people.</i> (2, 3, 4)',
            '<b>Gawin ang de-escalation strategies.</b><i> Do de-escalation strategies.</i> (2, 3, 4)',
            '<b>Madaliang isangguni sa camp manager para sa mga special services. </b>(hal. MHSS Specialist, Medical Emergency Services at mga Nagpapatupad ng batas o law enforcement). Refer immediately to camp manager for specialist services (i.e. MHPSS specialist, medical emergency services, and law enforcement). (1, 2, 3)',
        ],
    },
    {
        number: 2,
        competencies: [
            [2, 3, 4],
            [2, 3, 4],
            [2, 3, 4],
            [1, 2, 3],
        ],
        checklist: [
            '<b>Makinig nang may pagmamalasakit.</b> <i>Do empathic listening. </i>(2, 3, 4)',
            '<b>Alisin ang maaaring mahawakang sandata o matutulis na bagay.</b><i> Remove access to any weapons or sharp objects.</i> (2, 3, 4)',
            '<b>Dalhin ang IDP sa isang ligtas na lugar kung saan hindi siya makapagpapahamak ng ibang tao. </b><i>Put IDP in a safe space where he or she cannot harm other people. </i>(2, 3, 4)',
            '<b>Madaliang isangguni sa camp manager para sa mga special services.</b> <i>Refer immediately to camp manager for specialist services.</i> (1, 2, 3)',
        ],
    },
    {
        number: 3,
        competencies: [[1, 2, 3]],
        checklist: [
            '<b>Madaliang isangguni sa camp manager para sa mga special services.</b><i> Refer immediately to camp manager for specialist services. </i>(1, 2, 3)',
        ],
    },
    {
        number: 4,
        competencies: [
            [1, 2, 3, 4],
            [2, 3, 4],
        ],
        checklist: [
            '<b>Madaliang isangguni sa camp manager para sa mga special services sa Violence Against Women and Children (VAWC). </b><i>Refer immediately to camp manager for specialist services Violence Against Women and Children (VAWC).</i> (1, 2, 3, 4)',
            '<b>Siguruhin ang kaligtasan ng IDP.</b> <i>Ensure safety of IDP. </i>(2, 3, 4)',
        ],
    },
    {
        number: 5,
        competencies: [
            [2, 3, 4],
            [2, 3, 4],
            [2, 3, 4],
            [1, 2, 3],
        ],
        checklist: [
            '<b>Makinig nang may pagmamalasakit.</b> <i>Do empathic listening.</i> (2, 3, 4)',
            '<b>Alisin ang maaaring mahawakang sandata o matutulis na bagay.</b> <i>Remove access to any weapons or sharp objects.</i> (2, 3, 4)',
            '<b>Dalhin ang IDP sa isang ligtas na lugar kung saan hindi siya makapagpapahamak ng ibang tao.</b><i> Put IDP in a safe space where he or she cannot harm other people. </i>(2, 3, 4)',
            '<b>Madaliang isangguni sa camp manager para sa mga special services. </b><i>Refer immediately to camp manager for specialist services. </i>(1, 2, 3)',
        ],
    },
];

// yellow category
export const yellowRows = [
    {
        number: 1,
        description: '<b>...nagmumura. </b><i>(...cursing.)</i>',
        span: 5,
    },
    {
        number: 2,
        description: '<b>...naninigaw.</b><i> (...shouting.)</i>',
        span: 0,
    },
    {
        number: 3,
        description:
            '<b>...nakatitig sa kawalan at hindi sumasagot sa mga tanong.</b> <i>(...staring blankly and not responding to questions.)</i>',
        span: 0,
    },
    {
        number: 4,
        description:
            '<b>...nagpapakita ng mga senyales ng di mapakali </b>(hal. naglalakad ng pabalik balik, kinukuha o hinihila ang buhok o damit, iniyuyugyog ang paa at iba pa).<i> (...showing any signs of agitation (i.e. pacing back and forth, picking or pulling at hair or clothes, shuffling feet, etc.).)</i>',
        span: 0,
    },
    {
        number: 5,
        description:
            '<b>...nagpapakita ng kahit na anong senyales ng distress</b> (hal. humahagulgol, yakap ang sarili, nanginging, at iba pa). <i>(...displaying any signs of distress (i.e. crying, holding one’s self, etc.).)</i>',
        span: 0,
    },
];

export const yellowInterventions = [
    {
        number: 1,
        competencies: [
            [2, 3, 4],
            [2, 3, 4],
            [2, 3, 4],
            [2, 3, 4],
            [3, 4],
            [1, 2, 3, 4],
        ],
        checklist: [
            '<b>Sigurihing ligtas ang kapaligiran.</b><i> Establish environmental safety.</i> (2, 3, 4)',
            '<b>Gawin ang de-escalation strategies. </b><i>Do de-escalation strategies. </i>(2, 3, 4)',
            '<b>Makinig nang may pagmamalasakit.</b><i> Do empathic listening. </i>(2, 3, 4)',
            '<b>Gawin ang mga hakbang na magbibigay solusyon sa mga suliranin. </b><i>Do problem-solving strategies.</i> (2, 3, 4)',
            '<b>Magbigay ng suportang pang-emosyonal.</b><i> Provide emotional support.</i> (3, 4)',
            '<b>Pagkatapos ng interbensyon, muling obserbahan gamit ang tseklist.</b> <i>After the intervention, re-assess using this checklist. </i>(1, 2, 3, 4)',
        ],
    },
];

// green category
export const greenRows = [
    {
        number: 1,
        description:
            '<b>...hindi nagpapakita ng kahit na anong kilos sa mga nabanggit sa itaas.</b> <i>(...not showing any behaviors stated above.)</i>',
        span: 1,
    },
];

export const greenInterventions = [
    {
        number: 1,
        competencies: [
            [1, 2],
            [3, 4],
        ],
        checklist: [
            '<b>Sumangguni sa PFA-trained person para mga iba pang kakailanganin. </b><i>Refer to PFA-trained person for further assessment of needs.</i> (1, 2)',
            '<b>Ipagpatuloy gamitin ang PFA para sa iba pang dagdag na kailangan.</b> <i>Continue with PFA for further assessment of needs.</i> (3, 4)',
        ],
    },
];

// wrapper for all sections
export const unahonSections = [
    {
        questions: greenRows,
        interventions: greenInterventions,
        color: 'green',
    },
    {
        questions: yellowRows,
        interventions: yellowInterventions,
        color: 'yellow',
    },

    {
        questions: redRows,
        interventions: redInterventions,
        color: 'red',
    },
];

export const unahonDashboardCols = [
    {
        key: 'client-id',
        name: 'Patient ID',
    },
    {
        key: 'responder-name',
        name: 'Responder',
    },
    {
        key: 'location',
        name: 'Location',
    },
    {
        key: 'date',
        name: 'Date',
    },
    {
        key: 'affiliation',
        name: 'Affiliation',
    },
    {
        key: 'assessment-type',
        name: 'Assessment Type',
    },
    {
        key: 'actions',
        name: 'Actions',
    },
];
