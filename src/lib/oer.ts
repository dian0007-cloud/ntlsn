/**
 * Open Educational Resources data for #ntlsn-oer (Epic 1.2 PR-C) — the
 * ntlsn-oer-script patch's embedded lists, verbatim: the OER Commons search
 * fan-out (topic chips + search box that LINK OUT to oercommons.org — no
 * on-site index), the four "Browse the commons" cards, and the curated
 * six-category open directory.
 */

/** OER Commons search URL prefix — every search opens there, off-site. */
export const OER_SEARCH_URL = "https://oercommons.org/search?f.search=";

/** Topic chips — each runs an off-site OER Commons search, verbatim list. */
export const OER_TOPICS: readonly string[] = [
  "Assessment",
  "Universal Design for Learning",
  "Indigenous knowledges",
  "AI in teaching",
  "Work-integrated learning",
  "Academic integrity",
  "Inclusive teaching",
  "First-year transition",
  "Open textbooks",
  "Numeracy",
];

export interface OerBrowseCard {
  name: string;
  desc: string;
  url: string;
  colour: string;
}

/** "Browse the commons" cards — verbatim. */
export const OER_BROWSE: readonly OerBrowseCard[] = [
  {
    name: "OER Library",
    desc: "50,000+ openly-licensed resources",
    url: "https://oercommons.org/oer",
    colour: "#4ECDC4",
  },
  {
    name: "Curated Collections",
    desc: "Hand-picked sets by theme",
    url: "https://oercommons.org/curated-collections",
    colour: "#7C9CFF",
  },
  {
    name: "Providers",
    desc: "Browse by contributing institution",
    url: "https://oercommons.org/oer/providers",
    colour: "#C57BFF",
  },
  {
    name: "Hubs",
    desc: "Branded institutional collections",
    url: "https://oercommons.org/hubs/",
    colour: "#FFB448",
  },
];

export interface OerDirectoryItem {
  name: string;
  url: string;
  desc: string;
  licence: string;
}

export interface OerDirectoryCategory {
  name: string;
  colour: string;
  items: readonly OerDirectoryItem[];
}

/** The curated open directory — six categories, verbatim from the patch. */
export const OER_DIRECTORY: readonly OerDirectoryCategory[] = [
  {
    name: "Open textbooks",
    colour: "#4ECDC4",
    items: [
      {
        name: "UniSQ Open Textbooks",
        url: "https://usq.pressbooks.pub/",
        desc: "UniSQ’s own open-textbook catalogue",
        licence: "Mostly CC BY",
      },
      {
        name: "OER Collective (CAUL)",
        url: "https://oercollective.caul.edu.au/catalogue/",
        desc: "Australasian university-library open texts",
        licence: "Mostly CC BY",
      },
      {
        name: "OpenStax",
        url: "https://openstax.org/",
        desc: "Peer-reviewed introductory textbooks, free to adapt",
        licence: "CC BY-NC-SA",
      },
      {
        name: "Open Textbook Library",
        url: "https://open.umn.edu/opentextbooks",
        desc: "Peer-reviewed, openly-licensed texts",
        licence: "Mixed CC",
      },
      {
        name: "LibreTexts",
        url: "https://libretexts.org/",
        desc: "3,000+ adaptable texts with a remix tool",
        licence: "Mixed CC",
      },
      {
        name: "Pressbooks Directory",
        url: "https://pressbooks.directory/",
        desc: "Index of open books on Pressbooks",
        licence: "Mixed CC",
      },
      {
        name: "DOAB",
        url: "https://www.doabooks.org/",
        desc: "Peer-reviewed open-access books",
        licence: "Mixed CC",
      },
      {
        name: "OER Commons",
        url: "https://www.oercommons.org/",
        desc: "Open library and authoring platform",
        licence: "Mixed CC",
      },
    ],
  },
  {
    name: "Open journals & articles",
    colour: "#7C9CFF",
    items: [
      {
        name: "DOAJ",
        url: "https://doaj.org/",
        desc: "Vetted open-access journals",
        licence: "Mixed CC",
      },
      {
        name: "CORE",
        url: "https://core.ac.uk/",
        desc: "Largest aggregator of open-access papers",
        licence: "Mixed OA",
      },
      {
        name: "OpenDOAR",
        url: "https://v2.sherpa.ac.uk/opendoar/",
        desc: "Directory of open-access repositories",
        licence: "Mixed OA",
      },
      {
        name: "SpringerOpen",
        url: "https://www.springeropen.com/",
        desc: "Springer’s open-access journals",
        licence: "Mostly CC BY",
      },
      {
        name: "Wiley Open Access",
        url: "https://www.wiley.com/en-us/open-access",
        desc: "Wiley open-access journals and articles",
        licence: "Mostly CC BY",
      },
      {
        name: "Oxford Open",
        url: "https://academic.oup.com/journals/pages/open_access",
        desc: "OUP open-access journals",
        licence: "Mostly CC BY",
      },
      {
        name: "JSTOR Early Journal Content",
        url: "https://about.jstor.org/whats-in-jstor/early-journal-content/",
        desc: "Pre-1923 journal content, free",
        licence: "Public domain",
      },
    ],
  },
  {
    name: "Images & media",
    colour: "#C57BFF",
    items: [
      {
        name: "Openverse",
        url: "https://openverse.org/",
        desc: "800M+ openly-licensed images and audio",
        licence: "CC / public domain",
      },
      {
        name: "Wikimedia Commons",
        url: "https://commons.wikimedia.org/",
        desc: "140M+ freely usable media files",
        licence: "CC / public domain",
      },
      {
        name: "The Getty (Open Content)",
        url: "https://www.getty.edu/art/collection/",
        desc: "Open-content artwork images",
        licence: "CC0",
      },
      {
        name: "NASA Image & Video Library",
        url: "https://images.nasa.gov/",
        desc: "NASA imagery and video",
        licence: "Mostly public domain",
      },
      {
        name: "Wellcome Collection",
        url: "https://wellcomecollection.org/",
        desc: "Health and medical history images",
        licence: "Mostly CC BY",
      },
      {
        name: "Public Domain Review",
        url: "https://publicdomainreview.org/",
        desc: "Curated public-domain works",
        licence: "Public domain",
      },
      {
        name: "Trove (Pictures)",
        url: "https://trove.nla.gov.au/",
        desc: "Australian images and ephemera",
        licence: "Check per item",
      },
      {
        name: "NYPL Digital Collections",
        url: "https://digitalcollections.nypl.org/",
        desc: "Digitised library collections",
        licence: "Large PD subset",
      },
    ],
  },
  {
    name: "Audio",
    colour: "#FFB448",
    items: [
      {
        name: "Free Music Archive",
        url: "https://freemusicarchive.org/",
        desc: "Free, legal music downloads",
        licence: "Mixed CC",
      },
      {
        name: "Freesound",
        url: "https://freesound.org/",
        desc: "Openly-licensed sound effects and samples",
        licence: "CC0 / CC",
      },
      {
        name: "ccMixter",
        url: "http://ccmixter.org/",
        desc: "Creative Commons remixes and samples",
        licence: "CC",
      },
      {
        name: "Jamendo Music",
        url: "https://www.jamendo.com/",
        desc: "Independent music, free non-commercial tier",
        licence: "CC (free tier)",
      },
      {
        name: "BBC Sound Effects",
        url: "https://sound-effects.bbcrewind.co.uk/",
        desc: "BBC sound-effect archive",
        licence: "RemArc (non-commercial)",
      },
      {
        name: "Public Domain Review (Audio)",
        url: "https://publicdomainreview.org/collections/",
        desc: "Public-domain historical recordings",
        licence: "Public domain",
      },
    ],
  },
  {
    name: "Software & tools",
    colour: "#2DD4BF",
    items: [
      {
        name: "R and RStudio",
        url: "https://posit.co/download/rstudio-desktop/",
        desc: "Statistical computing and graphics",
        licence: "Open source (GPL)",
      },
      {
        name: "GIMP",
        url: "https://www.gimp.org/",
        desc: "Open-source image editor",
        licence: "Open source (GPL)",
      },
      {
        name: "Audacity",
        url: "https://www.audacityteam.org/",
        desc: "Open-source audio editor",
        licence: "Open source (GPL)",
      },
      {
        name: "OBS Studio",
        url: "https://obsproject.com/",
        desc: "Screen recording and streaming",
        licence: "Open source (GPL)",
      },
      {
        name: "LibreOffice",
        url: "https://www.libreoffice.org/",
        desc: "Open-source office suite",
        licence: "Open source (MPL)",
      },
      {
        name: "H5P",
        url: "https://h5p.org/",
        desc: "Interactive HTML5 learning content",
        licence: "Open source (MIT)",
      },
    ],
  },
  {
    name: "MOOCs & open courses",
    colour: "#FF9F7A",
    items: [
      {
        name: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/",
        desc: "2,500+ MIT courses, free",
        licence: "CC BY-NC-SA",
      },
      {
        name: "Class Central",
        url: "https://www.classcentral.com/",
        desc: "Search engine for online courses",
        licence: "Aggregator",
      },
      {
        name: "OEGlobal",
        url: "https://www.oeglobal.org/",
        desc: "Global open-education network",
        licence: "Mixed open",
      },
      {
        name: "OpenLearn (Open University)",
        url: "https://www.open.edu/openlearn/",
        desc: "The Open University’s free courses",
        licence: "Mostly CC BY-NC-SA",
      },
      {
        name: "Saylor Academy",
        url: "https://www.saylor.org/",
        desc: "Free self-paced college courses",
        licence: "Mostly CC BY",
      },
      {
        name: "Open Learning Initiative (CMU)",
        url: "https://oli.cmu.edu/",
        desc: "Research-based open courses",
        licence: "Mixed CC",
      },
      {
        name: "edX (free audit)",
        url: "https://www.edx.org/",
        desc: "University courses, free to audit",
        licence: "Free audit",
      },
      {
        name: "TU Delft OpenCourseWare",
        url: "https://ocw.tudelft.nl/",
        desc: "Engineering and applied-science courses",
        licence: "Mostly CC BY-NC-SA",
      },
    ],
  },
];

/**
 * Open an OER Commons search in a new tab — the patch's exact link-out
 * behaviour (searches never run on-site).
 */
export function openOerSearch(query: string): void {
  const q = query.trim();
  if (q === "") return;
  window.open(OER_SEARCH_URL + encodeURIComponent(q), "_blank", "noopener");
}
