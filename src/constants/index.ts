export const footerLinks = [
    // {
    //     title: 'Resources',
    //     links: [
    //         { title: 'FAQs', url: '/' },
    //         { title: 'Tutorials', url: '/' },
    //         { title: 'Case Studies', url: '/' },
    //     ],
    // },
    {
        title: 'Tools',
        links: [
            { title: 'Incident Reporting System', url: '/overview/irs' },
            { title: 'REDAS', url: '/overview/redas' },
            { title: 'Unahon', url: '/overview/unahon' },
            { title: 'Mi Salud', url: '/overview/misalud' },
            // { title: 'E-Ligtas', url: '/overview/e-ligtas' },
            { title: 'HazardHunter', url: '/overview/hazardhunter' },
        ],
    },
    {
        title: 'Support',
        links: [
            // { title: 'About the Project', url: '/' },
            // { title: 'Documentation', url: '/' },
            { title: 'Contact', url: '/contact' },
        ],
    },
];

export const overviewContent = {
    irs: {
        name: 'Incident Reporting System',
        subheading:
            'Cloud-based Disaster Recovery Planning and Decision Support Tool',
        description:
            'The HEAD Incident Reporting System (IRS) automates the reporting process during emergency drills by generating summaries, comparing data over time, and assisting users in real-time documentation. It is used to improve the Emergency Response Team’s skills and adherence to protocol.',
        subdescription: `
           The tool was developed under the Disaster Risk Reduction and Management in Health Center under the NICHE Centers in the Regions for R&D (NICER) program for the Disaster Risk Reduction and Management in Health Center of the University of the Philippines Manila, headed by Dr. Carlos Primero D. Gundran.
            `,
        imageUrl: '/iris_logo.png',
        url: ['/irs'],
    },

    redas: {
        name: 'REDAS',
        subheading:
            'Integrated Tool for Earthquake and Hydrometeorological Hazard Analysis',
        description: `The Rapid Earthquake Damage Assessment System (REDAS) is designed to provide rapid, near real-time estimates of the impacts of earthquakes, floods, severe wind, tsunamis, lahars, and assist in monitoring and warning earthquakes. The tool is primarily used by local government units (LGUs), disaster management agencies, and responders to enhance preparedness and decision-making during earthquake disasters.`,
        subdescription: `
            REDAS was developed by the Philippine Institute of Volcanology and Seismology (PHIVOLCS) under the Department of Science and Technology (DOST) initially in the years 2002-2004. 
        `,
        imageUrl: '/placeholder-image.webp',
        url: ['/redas', '/redas/gis'],
    },

    unahon: {
        name: 'Unahon',
        subheading:
            'Digital Guide for IDP Behavior/Environmental Interventions and Resource Allocation',
        description: `Unahon is a quick mental health screening tool designed for non-mental health professionals to assist camp management in prioritizing and allocating resources and services for internally displaced persons (IDPs) exhibiting signs of distress following a disaster.`,
        subdescription: `
            It was developed as part of the second project under the NICHE Centers in the Regions for R&D (NICER) program, implemented by the University of the Philippines Manila and led by Dr. Anna Cristina A. Tuazon.
        `,
        imageUrl: '/unahon.png',
        url: ['/unahon'],
    },

    misalud: {
        name: 'Mi Salud',
        subheading:
            'Responder Fitness Monitoring and Stress Management Mobile App',
        description: `Mi Salud is an application that monitors the fitness of responders' mental, emotional, and physical conditions before, during, and after rescuing or responding to victims involved in disasters or calamities, whether natural or man-made. Through this tool, disaster responders are given stress management recommendations based on their answers to screening questions.
        `,
        subdescription: `
            Mi Salud app is a product of a collaborative study of the University of the Philippines, Manila (UPM), Institute of Health Policy and Development Studies (IHPDS), University of the Philippines, UP Diliman Campus  (UPD), Western Mindanao State University (WMSU, Zamboanga City, and Zamboanga Peninsula Polytechnic State University ( ZPPSU ), Zamboanga City. It was funded by the Commission on Higher Education (CHED), under the Discovery Applied Research and Extension for Trans/Inter-disciplinary  Opportunities  (DARETO) project.
        `,
        imageUrl: '/misalud_logo.png',
        url: ['/misalud'],
    },

    hazardhunter: {
        name: 'HazardHunter',
        subheading:
            'Rapid Multi-Hazard Assessment Tool for Any Location in the Philippines',
        description: `
            HazardHunterPH is a tool that provides rapid hazard assessments for any location in the Philippines. It helps users determine if an area is prone to natural hazards such as earthquakes, volcanic eruptions, floods, rain-induced landslides, storm surges, and severe winds. The platform is designed to support disaster preparedness, land-use planning, and informed decision-making for individuals, communities, and organizations.​
            `,
        subdescription: `
            HazardHunterPH is a product of GeoRisk Philippines, a multi-agency initiative led by the Philippine Institute of Volcanology and Seismology (PHIVOLCS) and supported by various government agencies.
        `,
        imageUrl: '/hazardHunter_logo.png',
        url: ['/hazardhunter'],
    },
};

// export const socialMedia = [
//     {
//         id: 1,
//         img: '/facebook.svg',
//         link: 'https://www.facebook.com',
//         alt: 'Facebook',
//     },
//     {
//         id: 2,
//         img: '/linkedin.svg',
//         link: 'https://www.linkedin.com',
//         alt: 'LinkedIn',
//     },
// ];

export const headerLinks = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Tools', url: '/' },
    { title: 'Users', url: '/users' },
    { title: 'Contact', url: '/contact' },
];

export const carouselElements = [
    {
        type: 'Project',
        title: 'Incident Reporting System',
        description: `This is an application that can be used by the staff of UP Manila DRRM-H to improve the ERT skills and protocol. It automates reporting processes during emergency drills and helps generate structured summaries for better evaluation and continuous improvement.`,
        url: '/overview/irs',
        icon: 'file',
    },
    {
        type: 'Project',
        title: 'REDAS',
        description: `REDAS (Rapid Earthquake Damage Assessment System) is a tool designed to provide real-time data and simulations following an earthquake. It assists local government units and disaster responders in assessing hazard impacts and strengthening preparedness and response strategies.`,
        url: '/overview/redas',
        icon: 'waves',
    },
    {
        type: 'Project',
        title: 'Unahon',
        description: `Unahon, derived from the Bisaya word meaning “to prioritize,” is a tool that helps responders prioritize mental health support. It assists camp management in identifying and allocating resources to internally displaced persons (IDPs) showing signs of distress after disasters.`,
        url: '/overview/unahon',
        icon: 'heart',
    },
    {
        type: 'Project',
        title: 'Mi Salud',
        description: `A mobile phone (android) application that enables the different Responders' Teams to monitor the fitness of the Responders' mental, emotional, and physical conditions, before, during and after rescuing/ responding to the victims involved in disasters or calamities, natural or man- made.`,
        url: '/overview/misalud',
        icon: 'activity',
    },
    {
        type: 'Project',
        title: 'HazardHunter',
        description: `The HazardHunter Ready to Rebuild web app is an automated planning tool designed to enhance Disaster Risk Reduction and Management (DRRM) processes by helping government agencies, especially Local Government Units (LGUs), plan efficiently, work smarter, and rebuild faster.`,
        url: '/overview/hazardhunter',
        icon: 'map',
    },
];

export const features = [
    {
        icon: '/emoji-happy.svg',
        title: 'User-Friendly',
        description: 'Intuitive design for easy navigation',
        bgColor: 'bg-tertiary',
        alt: 'User Friendly Icon',
    },
    {
        icon: '/share.svg',
        title: 'Tool Integration',
        description: 'Seamlessly connect your favorite tools',
        bgColor: 'bg-white',
        alt: 'Tool Integration Icon',
    },
    {
        icon: '/verify.svg',
        title: 'Secure',
        description: 'Your data is safe with us',
        bgColor: 'bg-tertiary',
        alt: 'Secure Icon',
    },
];

export const steps = [
    {
        icon: '/chat.svg',
        alt: 'Chat Icon',
        text: 'Lorem Ipsum dolor et sitamet.',
    },
    {
        icon: '/knot.svg',
        alt: 'Knot Icon',
        text: 'Lorem Ipsum dolor et sitamet.',
    },
    {
        icon: '/copy.svg',
        alt: 'Copy Icon',
        text: 'Lorem Ipsum dolor et sitamet.',
    },
];

export * from './Unahon';
export * from './MiSalud';
export * from './Redas';
