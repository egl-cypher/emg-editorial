/**
 * All EMG website copy lives here, taken verbatim from
 * "EXCLUSIVE MULTIMEDIA GROUP_CONTENT FOR WEBSITE 2026.doc" and
 * "EMG_Corporate_Website_Menu_Structure.docx".
 *
 * Content accuracy rule from the brief: publish only verified client names,
 * project results, testimonials, team credentials, partnerships and offices.
 */

export const BRAND = {
  short: 'EMG',
  name: 'Exclusive Multimedia Group',
  full: 'Exclusive Multimedia Group (EMG)',
  tagline: ['Create', 'Capture', 'Connect'] as const,
  positioning: ['Multimedia', 'Digital Solutions', 'Creative Communications', 'Events', 'Technology'],
  footerLine: 'Professional multimedia, digital technology and creative solutions from Liberia to the wider West African region.',
};

/**
 * ⚠ CONFIRM BEFORE LAUNCH
 * - The content doc lists two different phone sets (Contact page vs Footer). Both kept below.
 * - Official email address has not been supplied yet.
 * - WhatsApp number: set the number EMG uses for WhatsApp (digits only, with country code).
 */
export const CONTACT = {
  addressLines: ['Jallah Town, Russell Avenue', 'Monrovia, Liberia'],
  phones: ['+231 772 350 783', '+231 776 921 583'], // Contact page section
  footerPhones: ['+231 777 019 200', '+231 776 921 583'], // Footer section — differs from above
  email: '', // [Insert official EMG email address]
  whatsapp: '', // e.g. '231772350783'
  formEndpoint: '', // POST endpoint for enquiry/proposal forms (e.g. Formspree, your CMS or API)
};

export const NETWORK = [
  { country: 'Liberia', city: 'Monrovia', hq: true, x: 118, y: 268 },
  { country: 'Sierra Leone', city: 'Freetown', x: 82, y: 222 },
  { country: 'Guinea', city: 'Conakry', x: 66, y: 178 },
  { country: "Côte d'Ivoire", city: 'Abidjan', x: 232, y: 278 },
  { country: 'Ghana', city: 'Accra', x: 318, y: 262 },
  { country: 'Nigeria', city: 'Lagos', x: 430, y: 238 },
];

/* ───────────────────────── Navigation ───────────────────────── */

export type NavItem = { label: string; to: string; children?: { label: string; to: string }[] };

export const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'About EMG',
    to: '/about',
    children: [
      { label: 'Who We Are', to: '/about#who-we-are' },
      { label: 'Our Mission & Vision', to: '/about#mission' },
      { label: 'Leadership & Team', to: '/about#team' },
      { label: 'Our Approach', to: '/about#approach' },
      { label: 'Partners & Clients', to: '/partnerships' },
      { label: 'Careers & Opportunities', to: '/careers' },
    ],
  },
  { label: 'Our Services', to: '/services' },
  { label: 'Our Work', to: '/work' },
  { label: 'Industries We Serve', to: '/industries' },
  { label: 'Insights & News', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

/* ───────────────────────── Services ───────────────────────── */

export type SubService = {
  slug: string;
  title: string;
  description: string;
  deliverables?: string[];
};

export type Division = {
  slug: string;
  index: string;
  title: string;
  short: string; // footer / compact label
  headline: string;
  summary: string; // home page one-liner
  intro: string;
  includes: string[];
  cta: string;
  subs: SubService[];
};

const d = (s: string) => s.split(', ').map((x) => x.replace(/^and /, '').trim());

export const DIVISIONS: Division[] = [
  {
    slug: 'events-experiences',
    index: '01',
    title: 'Events & Experiences',
    short: 'Events & Experiences',
    headline: 'We Make Every Event Count.',
    summary:
      'Professional planning, management and technical delivery for conferences, corporate events, summits, exhibitions and hybrid engagements.',
    intro:
      'We plan, coordinate and deliver professional events that bring people together, support meaningful engagement and achieve organizational objectives.',
    includes: [
      'Conference and event management',
      'Corporate events and executive meetings',
      'Summits, forums and workshops',
      'Hybrid and virtual event production',
      'Event registration and delegate management',
      'Exhibition and trade fair coordination',
      'Event logistics and protocol',
      'Technical production and audiovisual support',
      'Sponsorship and exhibition management',
      'Post-event reporting and documentation',
    ],
    cta: 'Plan Your Event',
    subs: [
      {
        slug: 'conference-event-management',
        title: 'Conference & Event Management',
        description:
          'End-to-end planning and coordination for conferences, workshops, summits, corporate functions and institutional events.',
        deliverables: d(
          'Event concept, planning schedule, venue coordination, registration, programme management, logistics, technical support, and post-event documentation',
        ),
      },
      {
        slug: 'corporate-events-summits',
        title: 'Corporate Events & Summits',
        description:
          'Professional delivery of executive meetings, product launches, corporate celebrations, stakeholder engagements and high-level gatherings.',
        deliverables: d('Event planning, branding, venue setup, protocol, guest management, and production support'),
      },
      {
        slug: 'hybrid-virtual-events',
        title: 'Hybrid & Virtual Events',
        description:
          'Technology-supported events that connect physical and online participants through reliable digital production.',
        deliverables: d(
          'Virtual platforms, livestreaming, online registration, speaker coordination, technical support, and recording',
        ),
      },
      {
        slug: 'event-registration-delegate-management',
        title: 'Event Registration & Delegate Management',
        description: 'Structured registration systems and on-site support that make participant management easier.',
        deliverables: d(
          'Online forms, registration databases, confirmation messages, badges, check-in desks, attendance records, and reporting',
        ),
      },
      {
        slug: 'exhibition-brand-activation',
        title: 'Exhibition & Brand Activation',
        description: 'Organized exhibition spaces and promotional experiences that help brands engage audiences.',
        deliverables: d(
          'Booth planning, display branding, promotional materials, staffing coordination, and activation support',
        ),
      },
      {
        slug: 'event-logistics-technical-production',
        title: 'Event Logistics & Technical Production',
        description:
          'Practical coordination of the equipment, personnel and technical requirements needed for successful events.',
        deliverables: d(
          'Sound, screens, projectors, lighting, staging, furniture, power coordination, and technical personnel',
        ),
      },
    ],
  },
  {
    slug: 'media-production',
    index: '02',
    title: 'Media Production',
    short: 'Media Production',
    headline: 'Professional Stories. Powerful Visuals.',
    summary: 'Photography, videography, documentaries, livestreaming, podcasts and corporate media production.',
    intro:
      'We produce high-quality visual and audio content that captures important moments, communicates ideas and strengthens organizational visibility.',
    includes: [
      'Professional event photography',
      'Corporate and commercial photography',
      'Videography and film production',
      'Documentary production',
      'Corporate and promotional videos',
      'Livestreaming and broadcast production',
      'Podcast production',
      'Interviews and media coverage',
      'Video editing and post-production',
      'Motion graphics and visual effects',
    ],
    cta: 'Request Media Production',
    subs: [
      {
        slug: 'professional-photography',
        title: 'Professional Photography',
        description: 'High-quality photography for events, corporate communications, campaigns, products and professional profiles.',
        deliverables: d('Edited photographs, curated galleries, and selected images for digital and print use'),
      },
      {
        slug: 'videography-film-production',
        title: 'Videography & Film Production',
        description: 'Professional video production for events, businesses, campaigns and institutional communications.',
        deliverables: d('Filming, editing, interviews, highlight videos, and final video files'),
      },
      {
        slug: 'documentary-corporate-films',
        title: 'Documentary & Corporate Films',
        description: 'Structured storytelling that presents organizational work, people, programmes and impact.',
        deliverables: d('Research and scripting support, filming, interviews, editing, narration, and final production'),
      },
      {
        slug: 'livestreaming-broadcast-production',
        title: 'Livestreaming & Broadcast Production',
        description: 'Live coverage for conferences, events, launches and public engagements.',
        deliverables: d('Camera coverage, live switching, audio coordination, streaming setup, and recordings'),
      },
      {
        slug: 'podcast-digital-media-production',
        title: 'Podcast & Digital Media Production',
        description: 'Production support for podcasts, interviews, digital shows and branded media programmes.',
        deliverables: d('Recording, studio coordination, editing, sound treatment, graphics, and publishing-ready content'),
      },
      {
        slug: 'video-editing-motion-graphics',
        title: 'Video Editing & Motion Graphics',
        description: 'Post-production services that improve the quality and presentation of video content.',
        deliverables: d(
          'Editing, colour correction, titles, subtitles, transitions, motion graphics, and social media formats',
        ),
      },
    ],
  },
  {
    slug: 'digital-solutions-technology',
    index: '03',
    title: 'Digital Solutions & Technology',
    short: 'Digital Solutions',
    headline: 'Build Better. Connect Smarter. Grow Digitally.',
    summary:
      'Website design, digital platforms, e-commerce, digital marketing and technology solutions that support business growth.',
    intro:
      'We develop digital solutions that help businesses and institutions establish their online presence, reach customers and improve how they operate.',
    includes: [
      'Website design and development',
      'Corporate and institutional websites',
      'E-commerce websites',
      'Landing pages and digital campaigns',
      'Online registration and booking platforms',
      'Business directories and digital portals',
      'Website maintenance and support',
      'Search engine optimization',
      'Digital marketing and social media management',
      'Digital transformation support',
      'IT solutions and technical assistance',
    ],
    cta: 'Discuss Your Digital Project',
    subs: [
      {
        slug: 'website-design-development',
        title: 'Website Design & Development',
        description:
          "Professional websites designed to communicate your organization's value and make it easier for customers and partners to engage.",
        deliverables: d(
          'Website strategy, page design, development, mobile responsiveness, content integration, enquiry forms, and launch support',
        ),
      },
      {
        slug: 'ecommerce-digital-platforms',
        title: 'E-commerce & Digital Platforms',
        description:
          'Digital platforms that support online product presentation, customer enquiries, transactions and business operations.',
        deliverables: d(
          'Product catalogues, shopping functions, payment integration where supported, order management, and administration tools',
        ),
      },
      {
        slug: 'mobile-friendly-web-solutions',
        title: 'Mobile-Friendly Web Solutions',
        description: 'Responsive digital experiences designed to work effectively across smartphones, tablets and computers.',
      },
      {
        slug: 'digital-marketing-social-media',
        title: 'Digital Marketing & Social Media',
        description: 'Strategic digital campaigns that improve visibility, audience engagement and customer acquisition.',
        deliverables: d(
          'Content planning, social media management, creative assets, campaign coordination, and performance reporting',
        ),
      },
      {
        slug: 'digital-transformation',
        title: 'Digital Transformation',
        description: 'Practical support for organizations seeking to improve services and workflows through digital tools.',
        deliverables: d('Needs assessment, digital strategy, platform recommendations, and implementation support'),
      },
      {
        slug: 'it-solutions-technical-support',
        title: 'IT Solutions & Technical Support',
        description: 'Technology support for business and institutional operations.',
        deliverables: [
          'Technical assessments',
          'Software configuration',
          'Troubleshooting',
          'Digital infrastructure support, based on project scope',
        ],
      },
    ],
  },
  {
    slug: 'branding-creative-communications',
    index: '04',
    title: 'Branding & Creative Communications',
    short: 'Branding & Communications',
    headline: 'Make Your Brand Recognizable.',
    summary: 'Brand identity, graphic design, corporate publications, advertising and strategic communications.',
    intro:
      'We help businesses and organizations build consistent identities and communicate their value through professional design and creative content.',
    includes: [
      'Brand strategy and identity development',
      'Logo design and brand guidelines',
      'Graphic design and visual communication',
      'Corporate profiles and brochures',
      'Annual reports and publications',
      'Presentations and pitch decks',
      'Advertising and promotional materials',
      'Marketing campaign design',
      'Public relations and media communications',
      'Event branding and exhibition displays',
      'Merchandise and packaging design',
    ],
    cta: 'Build Your Brand',
    subs: [
      {
        slug: 'brand-strategy-identity',
        title: 'Brand Strategy & Identity',
        description: "Development of a consistent brand identity that reflects your organization's purpose and positioning.",
      },
      {
        slug: 'graphic-design-visual-communication',
        title: 'Graphic Design & Visual Communication',
        description: 'Professional visual materials for digital platforms, campaigns, publications and print.',
      },
      {
        slug: 'corporate-profiles-publications',
        title: 'Corporate Profiles & Publications',
        description:
          "Well-structured corporate documents that communicate your organization's services, achievements and direction.",
      },
      {
        slug: 'marketing-campaigns',
        title: 'Marketing Campaigns',
        description:
          'Creative campaign development for product promotion, events, public awareness and organizational visibility.',
      },
      {
        slug: 'public-relations-media-communications',
        title: 'Public Relations & Media Communications',
        description: 'Support for media engagement, public announcements, press materials and organizational communications.',
      },
      {
        slug: 'advertising-promotional-materials',
        title: 'Advertising & Promotional Materials',
        description:
          'Design and production coordination for banners, posters, brochures, merchandise and promotional assets.',
      },
    ],
  },
  {
    slug: 'ai-automation-innovation',
    index: '05',
    title: 'AI, Automation & Innovation',
    short: 'AI & Innovation',
    headline: 'Practical Technology. Smarter Workflows.',
    summary: 'Practical AI integration, business automation, intelligent digital tools and AI capacity development.',
    intro:
      'We help organizations understand and apply artificial intelligence and automation to improve productivity, communication and business processes.',
    includes: [
      'AI integration for businesses',
      'AI-powered content solutions',
      'Business process automation',
      'AI chatbots and intelligent assistants',
      'Workflow automation',
      'AI productivity solutions',
      'AI training and capacity development',
      'AI readiness assessments',
      'Responsible AI advisory and awareness',
      'No-code and low-code solutions',
    ],
    cta: 'Explore AI Solutions',
    subs: [
      {
        slug: 'ai-integration-for-businesses',
        title: 'AI Integration for Businesses',
        description: 'Identify and implement practical AI tools that support business activities and improve productivity.',
      },
      {
        slug: 'ai-powered-content-solutions',
        title: 'AI-Powered Content Solutions',
        description:
          'Support for responsible use of AI in content planning, drafting, research assistance and creative workflows.',
      },
      {
        slug: 'business-process-automation',
        title: 'Business Process Automation',
        description: 'Reduce repetitive tasks through structured digital workflows and automation tools.',
      },
      {
        slug: 'ai-training-capacity-development',
        title: 'AI Training & Capacity Development',
        description: 'Practical training that helps teams understand AI tools, opportunities, limitations and responsible use.',
      },
      {
        slug: 'chatbots-intelligent-assistants',
        title: 'Chatbots & Intelligent Assistants',
        description:
          'Design and configuration of conversational tools for customer enquiries, information access and internal support.',
      },
      {
        slug: 'ai-readiness-advisory',
        title: 'AI Readiness & Advisory',
        description:
          'Assess organizational needs and identify appropriate AI adoption priorities, safeguards and implementation options.',
      },
    ],
  },
  {
    slug: 'training-professional-development',
    index: '06',
    title: 'Training & Professional Development',
    short: 'Training & Development',
    headline: 'Skills for a Changing World.',
    summary: 'Practical training in digital skills, media production, AI, marketing and professional development.',
    intro:
      'We design and deliver practical training programmes that strengthen digital capabilities, professional skills and organizational performance.',
    includes: [
      'Digital skills training',
      'Digital marketing and social media',
      'Photography and videography',
      'Content creation and media production',
      'Artificial intelligence and digital productivity',
      'Cybersecurity and digital safety awareness',
      'Corporate communications',
      'Public speaking and presentation skills',
      'Career development and employability',
      'Institutional and customized training',
    ],
    cta: 'Request Training',
    subs: [
      {
        slug: 'digital-skills-training',
        title: 'Digital Skills Training',
        description: 'Practical programmes covering essential digital tools, online collaboration and workplace technology.',
      },
      {
        slug: 'media-content-production-training',
        title: 'Media & Content Production Training',
        description: 'Hands-on learning in photography, videography, editing and digital storytelling.',
      },
      {
        slug: 'ai-digital-productivity',
        title: 'AI & Digital Productivity',
        description: 'Training on using AI and digital tools to support research, communication and everyday work.',
      },
      {
        slug: 'digital-marketing-training',
        title: 'Digital Marketing Training',
        description:
          'Skills development in social media, content strategy, online advertising and digital campaign management.',
      },
      {
        slug: 'corporate-institutional-training',
        title: 'Corporate & Institutional Training',
        description: 'Customized learning programmes designed around organizational requirements.',
      },
      {
        slug: 'career-development-services',
        title: 'Career Development Services',
        description: 'Professional support in CV development, LinkedIn profiles, job applications and employability skills.',
      },
    ],
  },
  {
    slug: 'corporate-business-support',
    index: '07',
    title: 'Corporate & Business Support',
    short: 'Corporate Support',
    headline: 'Reliable Support for Your Everyday Business Needs.',
    summary: 'Ongoing creative, media and operational support for organizations that need dependable professional services.',
    intro:
      'We provide ongoing creative, media and operational support to organizations that require dependable professional services.',
    includes: [
      'Corporate media subscriptions',
      'Photography and video retainers',
      'Social media and content management',
      'Corporate communications support',
      'Business digital starter packages',
      'Event support and venue coordination',
      'Promotional merchandise',
      'Creative consultancy',
      'Business presentations and publications',
      'Creator and influencer support',
    ],
    cta: 'Discuss a Corporate Partnership',
    subs: [
      {
        slug: 'corporate-media-retainers',
        title: 'Corporate Media Retainers',
        description: 'Ongoing photography, video and content services under an agreed monthly or annual arrangement.',
      },
      {
        slug: 'content-communications-support',
        title: 'Content & Communications Support',
        description:
          'Regular creative and communications assistance for organizations that need consistent public engagement.',
      },
      {
        slug: 'business-digital-starter-packages',
        title: 'Business Digital Starter Packages',
        description: 'A coordinated package covering essential brand and digital setup for new and growing businesses.',
      },
      {
        slug: 'event-support-services',
        title: 'Event Support Services',
        description: 'Practical event resources, coordination and technical assistance.',
      },
      {
        slug: 'creative-consultancy',
        title: 'Creative Consultancy',
        description: 'Professional advice and creative direction for communications, branding and media projects.',
      },
      {
        slug: 'merchandise-promotional-products',
        title: 'Merchandise & Promotional Products',
        description: 'Branded apparel, gifts, event materials and promotional merchandise.',
      },
    ],
  },
];

export const findDivision = (slug: string) => DIVISIONS.find((x) => x.slug === slug);

/* ───────────────────────── Home ───────────────────────── */

export const HOME = {
  hero: {
    title: ['Ideas Into Impact.', 'Creativity Into Results.'],
    lead:
      'Exclusive Multimedia Group (EMG) is a Liberian multimedia, digital technology and creative solutions company delivering professional services to businesses, institutions, organizations and individuals.',
    body:
      'From events and media production to digital platforms, branding, marketing and AI-powered solutions, we bring the expertise, technology and creativity to help you communicate, connect and grow.',
  },
  intro: {
    title: 'Your Partner in Media, Digital and Creative Solutions',
    paras: [
      "We bring together creative professionals, technical specialists and experienced project teams to deliver solutions that meet today's business and communication needs.",
      "Headquartered in Liberia, EMG works with a regional network of professionals and team members based in Ghana, Côte d'Ivoire, Sierra Leone, Guinea and Nigeria.",
      'Our multidisciplinary approach allows us to support projects across borders while maintaining a strong understanding of local markets and client needs.',
    ],
  },
  why: {
    badge: 'Why Work With EMG?',
    title: 'Professional Delivery. Regional Perspective. Practical Results.',
    items: [
      { title: 'Multidisciplinary expertise', body: 'Access to creative, technical, media and digital professionals.' },
      { title: 'Regional reach', body: 'A team network spanning Liberia and other West African markets.' },
      { title: 'Integrated services', body: 'Multiple project requirements coordinated through one service provider.' },
      { title: 'Client-focused delivery', body: 'Solutions shaped around your objectives, audience and budget.' },
      { title: 'Professional standards', body: 'Clear communication, structured project management and quality control.' },
      { title: 'Innovation-led approach', body: 'Modern production tools and practical technology solutions.' },
    ],
  },
  work: {
    title: 'Work That Speaks for Itself.',
    body: 'Explore selected projects across event management, photography, video production, digital solutions, branding and communications.',
  },
  final: {
    title: 'Have a Project in Mind?',
    body: 'Whether you are planning an event, developing a brand, producing media content or improving your digital presence, EMG is ready to help.',
  },
};

export const WHO_WE_SUPPORT = [
  'Government and public institutions',
  'NGOs and development organisations',
  'Corporate businesses and private companies',
  'International organisations',
  'Educational and research institutions',
  'Technology and telecommunications companies',
  'SMEs, startups and entrepreneurs',
  'Media, entertainment and creative professionals',
];

/* ───────────────────────── About ───────────────────────── */

export const ABOUT = {
  title: ['A Liberian Company.', 'A Regional Network.', 'A Wider Vision.'],
  paras: [
    'Exclusive Multimedia Group (EMG) is a Liberian multimedia, digital technology and creative solutions company providing integrated services to organizations, businesses, institutions and individuals.',
    'We operate across the intersection of media, events, digital technology, branding, communications and innovation.',
    'Our work is built around helping clients communicate effectively, strengthen their brands, deliver successful projects and take advantage of emerging digital opportunities.',
    "EMG is supported by a multidisciplinary team of experienced professionals and regional team members based in Liberia, Ghana, Côte d'Ivoire, Sierra Leone, Guinea and Nigeria.",
    'We combine local knowledge with regional experience to deliver solutions suited to different industries, audiences and markets.',
  ],
  mission:
    'To deliver professional multimedia, digital and creative solutions that help organizations communicate better, operate effectively and achieve meaningful results.',
  vision:
    'To become a trusted African multimedia and digital solutions group recognized for creativity, innovation, professional excellence and regional impact.',
  values: [
    { title: 'Professionalism', body: 'We uphold high standards in every client engagement.' },
    { title: 'Creativity', body: 'We develop original ideas and effective communication solutions.' },
    { title: 'Integrity', body: 'We value transparency, accountability and responsible business practices.' },
    { title: 'Innovation', body: 'We embrace useful technologies and new approaches.' },
    { title: 'Collaboration', body: 'We build strong working relationships with clients, partners and professionals.' },
    { title: 'Excellence', body: 'We focus on quality, reliability and continuous improvement.' },
  ],
  network: {
    title: 'Connected Across West Africa',
    body: 'This network strengthens our ability to coordinate projects, understand regional markets and work with clients across different locations.',
  },
  approach: [
    { title: 'Understand', body: 'We listen to your objectives, requirements and expectations.' },
    { title: 'Plan', body: 'We define the scope, deliverables, timeline and resources.' },
    { title: 'Create', body: 'Our team develops and implements the agreed solution.' },
    { title: 'Deliver', body: 'We manage quality, communication and project completion.' },
    { title: 'Improve', body: 'We review feedback and identify opportunities for continued support.' },
  ],
  team: {
    title: 'Experienced People. Shared Standards.',
    paras: [
      'EMG brings together professionals across media production, photography, videography, event management, digital development, branding, communications, marketing and technology.',
      'Our team structure is designed to match the right expertise to each project, supported by regional coordination and specialist collaborators.',
    ],
  },
  partners:
    'We welcome partnerships with agencies, technology providers, creative professionals, production teams, consultants and organizations seeking reliable delivery partners in Liberia and West Africa.',
  careers:
    'We welcome expressions of interest from talented professionals, creatives, technicians and digital specialists who want to contribute to quality work and regional growth.',
};

/* ───────────────────────── Work ───────────────────────── */

export const WORK = {
  title: 'Creativity, Delivery and Results.',
  body: 'Our portfolio presents selected projects delivered by EMG across events, media production, branding, digital solutions and communications.',
  categories: [
    'Featured Projects',
    'Events & Conferences',
    'Photography',
    'Videography & Film',
    'Digital & Website Projects',
    'Branding & Creative Design',
    'Marketing & Communications',
  ],
  caseStudyFields: [
    'Project title',
    'Client or organisation, where permission is granted',
    'Project location and date',
    'Background and objectives',
    "EMG's role and scope of work",
    'Key deliverables',
    'Project photographs or video',
    'Outcomes and client feedback, where available',
  ],
  testimonials: 'This section will feature verified client testimonials, approved quotations and references.',
};

/**
 * Add verified projects here. Leave empty until real, permission-cleared projects exist —
 * the Work page shows clearly labelled empty slots in the meantime.
 */
export type Project = {
  slug: string;
  title: string;
  category: string;
  client?: string;
  location: string;
  date: string;
  summary: string;
  image?: string;
};
export const PROJECTS: Project[] = [];

/* ───────────────────────── Industries ───────────────────────── */

export const INDUSTRIES = [
  {
    title: 'Government & Public Institutions',
    body: 'Media production, public communication, events, digital platforms and institutional support.',
  },
  {
    title: 'NGOs & Development Partners',
    body: 'Programme documentation, campaign communications, conferences, training, digital visibility and impact storytelling.',
  },
  {
    title: 'Corporate & Private Sector',
    body: 'Corporate branding, media production, digital marketing, websites, events and ongoing communications.',
  },
  {
    title: 'Education & Research Institutions',
    body: 'Institutional websites, event management, training, photography, video production and publications.',
  },
  {
    title: 'Technology & Telecommunications',
    body: 'Product communication, digital platforms, corporate media, campaigns and technology events.',
  },
  {
    title: 'Media, Entertainment & Creative Industries',
    body: 'Photography, video, podcast production, content development, creator support and branding.',
  },
  { title: 'SMEs & Startups', body: 'Business identity, websites, digital marketing, promotional content and business support.' },
  {
    title: 'International Organisations',
    body: 'Regional event coordination, communications, documentation, media coverage and digital engagement.',
  },
];

/* ───────────────────────── Insights ───────────────────────── */

export const INSIGHTS = {
  title: 'Knowledge. Ideas. Industry Perspectives.',
  body: 'Our Insights section shares company updates, professional perspectives and practical information across multimedia, digital technology, branding, events and innovation.',
  categories: [
    { title: 'Company News', body: 'Announcements, company developments, partnerships and project updates.' },
    { title: 'Industry Insights', body: 'Perspectives on emerging trends in media, digital communications, technology and creative business.' },
    { title: 'Articles & Perspectives', body: 'Practical articles and professional commentary from our team and contributors.' },
    { title: 'Case Studies', body: 'Selected project experiences, approaches and lessons from our work.' },
    { title: 'Media & Announcements', body: 'Official statements, media features and company announcements.' },
  ],
  cta: 'Follow EMG for updates and new insights.',
};

/** Add published articles here. */
export type Post = { slug: string; title: string; category: string; date: string; excerpt: string };
export const POSTS: Post[] = [];

/* ───────────────────────── Contact & forms ───────────────────────── */

export const CONTACT_PAGE = {
  title: "Let's Discuss Your Next Project.",
  body: 'Whether you need professional media production, event management, a new website, brand development, digital marketing or AI integration, our team is ready to discuss your requirements.',
  routes: [
    {
      title: 'General Enquiries',
      body: 'For questions about EMG, our services or company information, contact our team.',
      to: '/contact#enquiry',
    },
    {
      title: 'Request a Proposal',
      body: 'Tell us about your project and receive a response with the appropriate next steps.',
      to: '/request-a-proposal',
    },
    {
      title: 'Partnership Enquiries',
      body: 'We welcome collaboration with organizations, agencies, technology providers, consultants and creative professionals.',
      to: '/partnerships',
    },
    {
      title: 'Careers & Opportunities',
      body: 'Interested in joining our network of professionals? Send us your profile and area of expertise.',
      to: '/careers',
    },
  ],
  enquiryConfirm:
    'Thank you for contacting Exclusive Multimedia Group. Your enquiry has been received. Our team will review your request and get in touch.',
};

export const PROPOSAL = {
  title: ['Tell Us What You Need.', 'We Will Help You Plan It.'],
  body: 'Use this form to share your project requirements. The more detail you provide, the better we can understand the assignment and prepare an appropriate response.',
  confirm:
    'Thank you for considering EMG. Your project request has been submitted for review. Our team will contact you regarding the next steps.',
};

export const PARTNERSHIPS = {
  title: "Let's Create More Together.",
  body: 'EMG works with organizations, agencies, consultants, technology providers and creative professionals to deliver projects and develop new opportunities across West Africa.',
  areas: [
    'Media and production',
    'Digital technology',
    'Event management',
    'Branding and communications',
    'AI and innovation',
    'Training and capacity development',
    'Regional project delivery',
  ],
};

export const CAREERS = {
  title: 'Bring Your Expertise to EMG.',
  body: 'We welcome professionals and emerging talent interested in contributing to multimedia, technology, creative services and business development.',
  areas: [
    'Photography and videography',
    'Film and media production',
    'Event management',
    'Website and software development',
    'Digital marketing',
    'Graphic design',
    'AI and automation',
    'Corporate communications',
    'Project management',
    'Business development',
  ],
  note: 'Applicants should submit a CV or professional profile, portfolio where applicable and a brief introduction.',
};

export const COUNTRIES = ['Liberia', 'Ghana', "Côte d'Ivoire", 'Sierra Leone', 'Guinea', 'Nigeria', 'Other'];
