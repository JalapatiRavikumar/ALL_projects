import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'action',
    name: 'Action',
    color: '#FF5209',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=220&fit=crop',
  },
  {
    id: 'drama',
    name: 'Drama',
    color: '#D7A4FF',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=220&fit=crop',
  },
  {
    id: 'romance',
    name: 'Romance',
    color: '#148A08',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=220&fit=crop',
  },
  {
    id: 'thriller',
    name: 'Thriller',
    color: '#84C2FF',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=220&fit=crop',
  },
  {
    id: 'western',
    name: 'Western',
    color: '#902500',
    image: 'https://images.unsplash.com/photo-1548199569-3e1c6aa8f949?w=400&h=220&fit=crop',
  },
  {
    id: 'horror',
    name: 'Horror',
    color: '#7358FF',
    image: 'https://images.unsplash.com/photo-1601513237763-10aaaa60fbcf?w=400&h=220&fit=crop',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    color: '#FF4ADE',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=220&fit=crop',
  },
  {
    id: 'music',
    name: 'Music',
    color: '#E61E32',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=220&fit=crop',
  },
  {
    id: 'fiction',
    name: 'Fiction',
    color: '#6AE0D9',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=220&fit=crop',
  },
];

// ─── Mock movie database keyed by category ────────────────────────────────────
export const MOVIES_DB: Record<string, Array<{
  id: string; title: string; year: string; rating: string;
  runtime: string; genre: string; plot: string; cast: string;
  image: string; poster: string;
}>> = {
  action: [
    {
      id: 'a1', title: 'Black Adam', year: '2022', rating: '6.3', runtime: '125 min',
      genre: 'Action, Adventure, Fantasy',
      plot: 'Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods, Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.',
      cast: 'Dwayne Johnson, Aldis Hodge, Pierce Brosnan, Noah Centineo',
      image: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
    },
    {
      id: 'a2', title: 'Eternals', year: '2021', rating: '6.8', runtime: '157 min',
      genre: 'Action, Adventure, Drama',
      plot: 'The saga of the Eternals, a race of immortal beings who lived on Earth and shaped its history and civilizations.',
      cast: 'Gemma Chan, Richard Madden, Angelina Jolie, Salma Hayek',
      image: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg',
    },
    {
      id: 'a3', title: 'Top Gun: Maverick', year: '2022', rating: '8.3', runtime: '130 min',
      genre: 'Action, Drama',
      plot: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, confronting ghosts of his past.',
      cast: 'Tom Cruise, Jennifer Connelly, Miles Teller, Jon Hamm',
      image: 'https://image.tmdb.org/t/p/w500/62HCnUTHOWT7g7huJnRi4BKWJ5K.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/62HCnUTHOWT7g7huJnRi4BKWJ5K.jpg',
    },
    {
      id: 'a4', title: 'Tenet', year: '2020', rating: '7.4', runtime: '150 min',
      genre: 'Action, Sci-Fi, Thriller',
      plot: 'Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through international espionage on a mission beyond real time.',
      cast: 'John David Washington, Robert Pattinson, Elizabeth Debicki',
      image: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijBlTh.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijBlTh.jpg',
    },
  ],
  thriller: [
    {
      id: 't1', title: 'Oxygen', year: '2021', rating: '6.5', runtime: '100 min',
      genre: 'Sci-Fi, Thriller',
      plot: 'A woman wakes in a cryogenic unit with no memory of who she is. As she tries to piece together her past, she finds herself running out of oxygen.',
      cast: 'Mélanie Laurent, Mathieu Amalric',
      image: 'https://image.tmdb.org/t/p/w500/aTovumsQHCRRJcA9sOGgJrHSxX1.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/aTovumsQHCRRJcA9sOGgJrHSxX1.jpg',
    },
    {
      id: 't2', title: 'Smile', year: '2022', rating: '6.8', runtime: '115 min',
      genre: 'Horror, Thriller',
      plot: 'After witnessing a bizarre incident involving a patient, a doctor begins experiencing frightening occurrences she cannot explain.',
      cast: 'Sosie Bacon, Jessie T. Usher, Kyle Gallner',
      image: 'https://image.tmdb.org/t/p/w500/aPqcQwu4VGEewPhagqNNVn1fMGn.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/aPqcQwu4VGEewPhagqNNVn1fMGn.jpg',
    },
    {
      id: 't3', title: 'The Gray Man', year: '2022', rating: '6.5', runtime: '122 min',
      genre: 'Action, Thriller',
      plot: 'When the CIA top asset uncovers agency secrets, he triggers a global hunt by an international assassin hired to take him out.',
      cast: 'Ryan Gosling, Chris Evans, Ana de Armas',
      image: 'https://image.tmdb.org/t/p/w500/8MbCInRD0BQJZG4P3dFRYRVPsLh.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/8MbCInRD0BQJZG4P3dFRYRVPsLh.jpg',
    },
    {
      id: 't4', title: 'The Menu', year: '2022', rating: '7.2', runtime: '107 min',
      genre: 'Comedy, Horror, Thriller',
      plot: 'A young couple travels to a remote island to eat at an exclusive restaurant where the chef has prepared shocking surprises.',
      cast: 'Ralph Fiennes, Anya Taylor-Joy, Nicholas Hoult',
      image: 'https://image.tmdb.org/t/p/w500/v3VwWHbBBgekzZFXfyMi6oHFGaT.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/v3VwWHbBBgekzZFXfyMi6oHFGaT.jpg',
    },
  ],
  horror: [
    {
      id: 'h1', title: 'M3GAN', year: '2022', rating: '6.4', runtime: '102 min',
      genre: 'Horror, Sci-Fi, Thriller',
      plot: 'A robotics engineer at a toy company builds a life-like doll that develops a dangerously overprotective personality.',
      cast: 'Allison Williams, Violet McGraw, Ronny Chieng',
      image: 'https://image.tmdb.org/t/p/w500/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg',
    },
    {
      id: 'h2', title: 'The Invitation', year: '2022', rating: '5.8', runtime: '105 min',
      genre: 'Horror, Mystery, Thriller',
      plot: 'After her mother dies, a young woman discovers she has a long-lost family. But a weekend at their estate reveals dark secrets.',
      cast: 'Nathalie Emmanuel, Thomas Doherty, Stephanie Corneliussen',
      image: 'https://image.tmdb.org/t/p/w500/lfRkUr7DYdHldAqi3PwdQGBRBnq.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/lfRkUr7DYdHldAqi3PwdQGBRBnq.jpg',
    },
    {
      id: 'h3', title: "Orphan: First Kill", year: '2022', rating: '6.3', runtime: '99 min',
      genre: 'Horror, Thriller',
      plot: "Esther's terrifying saga continues in this chilling prequel to the original film.",
      cast: 'Isabelle Fuhrman, Julia Stiles, Rossif Sutherland',
      image: 'https://image.tmdb.org/t/p/w500/pHkKbud8A04rDhtnInYR3rHfmOR.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/pHkKbud8A04rDhtnInYR3rHfmOR.jpg',
    },
    {
      id: 'h4', title: 'Ouija: Origin of Evil', year: '2016', rating: '6.1', runtime: '99 min',
      genre: 'Horror, Mystery',
      plot: 'A widowed mother and her daughters add a ouija board to their phony seance business, but things go very wrong.',
      cast: 'Elizabeth Reaser, Annalise Basso, Lulu Wilson',
      image: 'https://image.tmdb.org/t/p/w500/uPQsEwNsWNmVqqBWOe3vwAoxhFM.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/uPQsEwNsWNmVqqBWOe3vwAoxhFM.jpg',
    },
  ],
  drama: [
    {
      id: 'd1', title: 'The Power of the Dog', year: '2021', rating: '6.9', runtime: '126 min',
      genre: 'Drama, Western',
      plot: 'Charismatic rancher Phil Burbank inspires fear and awe in those around him. When his brother brings home a new wife and her son, Phil torments them until he finds himself taken with the boy.',
      cast: 'Benedict Cumberbatch, Kirsten Dunst, Jesse Plemons',
      image: 'https://image.tmdb.org/t/p/w500/kEy7GNixI5jbKMPZBaRFQEqKn6z.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/kEy7GNixI5jbKMPZBaRFQEqKn6z.jpg',
    },
    {
      id: 'd2', title: 'Belfast', year: '2021', rating: '7.3', runtime: '98 min',
      genre: 'Drama, History',
      plot: "A young boy's life is turned upside down when his idyllic childhood in Belfast is disrupted by the onset of the Troubles.",
      cast: 'Jude Hill, Caitríona Balfe, Jamie Dornan, Judi Dench',
      image: 'https://image.tmdb.org/t/p/w500/vD4PbueFZVSMIiRfYFNLABQVYIC.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/vD4PbueFZVSMIiRfYFNLABQVYIC.jpg',
    },
    {
      id: 'd3', title: 'CODA', year: '2021', rating: '8.0', runtime: '112 min',
      genre: 'Drama, Music',
      plot: 'Ruby is the only hearing child in a deaf family. When she joins her high school choir, she discovers a passion for singing and finds herself torn between her family and her own voice.',
      cast: 'Emilia Jones, Troy Kotsur, Marlee Matlin',
      image: 'https://image.tmdb.org/t/p/w500/4RplSZFBsNFHekK0tqNTvVxKPJF.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/4RplSZFBsNFHekK0tqNTvVxKPJF.jpg',
    },
  ],
  romance: [
    {
      id: 'r1', title: 'The Notebook', year: '2004', rating: '7.8', runtime: '123 min',
      genre: 'Drama, Romance',
      plot: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
      cast: 'Ryan Gosling, Rachel McAdams, James Garner',
      image: 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtLAGBs5zW.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtLAGBs5zW.jpg',
    },
    {
      id: 'r2', title: 'La La Land', year: '2016', rating: '8.0', runtime: '128 min',
      genre: 'Drama, Music, Romance',
      plot: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
      cast: 'Ryan Gosling, Emma Stone, John Legend',
      image: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    },
    {
      id: 'r3', title: 'Crazy Rich Asians', year: '2018', rating: '6.9', runtime: '120 min',
      genre: 'Comedy, Drama, Romance',
      plot: 'This contemporary romantic comedy follows native New Yorker Rachel Chu to Singapore to meet her boyfriend\'s family.',
      cast: 'Constance Wu, Henry Golding, Michelle Yeoh',
      image: 'https://image.tmdb.org/t/p/w500/osBRSAEBLbAJIPoJIJsUqKepzr6.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/osBRSAEBLbAJIPoJIJsUqKepzr6.jpg',
    },
  ],
  fantasy: [
    {
      id: 'f1', title: 'Doctor Strange in the Multiverse of Madness', year: '2022', rating: '6.9', runtime: '126 min',
      genre: 'Action, Adventure, Fantasy',
      plot: 'Doctor Strange teams with a mysterious teenager who can travel between multiverses, crossing into danger from powerful enemies.',
      cast: 'Benedict Cumberbatch, Elizabeth Olsen, Chiwetel Ejiofor',
      image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzbZmadhvAs2oLNe4t4Ekh.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzbZmadhvAs2oLNe4t4Ekh.jpg',
    },
    {
      id: 'f2', title: 'Avatar: The Way of Water', year: '2022', rating: '7.6', runtime: '192 min',
      genre: 'Action, Adventure, Fantasy',
      plot: "Jake Sully lives with his newfound family formed on the planet of Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race.",
      cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
      image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    },
  ],
  music: [
    {
      id: 'm1', title: 'Bohemian Rhapsody', year: '2018', rating: '8.0', runtime: '134 min',
      genre: 'Biography, Drama, Music',
      plot: "The story of the legendary British rock band Queen and lead singer Freddie Mercury, leading up to their famous performance at Live Aid.",
      cast: 'Rami Malek, Lucy Boynton, Gwilym Lee, Ben Hardy',
      image: 'https://image.tmdb.org/t/p/w500/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg',
    },
    {
      id: 'm2', title: 'A Star Is Born', year: '2018', rating: '7.6', runtime: '135 min',
      genre: 'Drama, Music, Romance',
      plot: 'A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.',
      cast: 'Lady Gaga, Bradley Cooper, Andrew Dice Clay',
      image: 'https://image.tmdb.org/t/p/w500/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg',
    },
    {
      id: 'm3', title: 'Elvis', year: '2022', rating: '7.3', runtime: '159 min',
      genre: 'Biography, Drama, Music',
      plot: "The life and music of Elvis Presley, seen through the complicated relationship with his enigmatic manager, Colonel Tom Parker.",
      cast: 'Austin Butler, Tom Hanks, Olivia DeJonge',
      image: 'https://image.tmdb.org/t/p/w500/6ApDtO7xaWAfPqfi2IARXIzj8QS.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/6ApDtO7xaWAfPqfi2IARXIzj8QS.jpg',
    },
  ],
  fiction: [
    {
      id: 'sf1', title: 'Dune', year: '2021', rating: '8.0', runtime: '155 min',
      genre: 'Adventure, Drama, Sci-Fi',
      plot: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
      cast: 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac',
      image: 'https://image.tmdb.org/t/p/w500/d5NXSklpcvkikFkPdG6F1LKpAKR.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/d5NXSklpcvkikFkPdG6F1LKpAKR.jpg',
    },
    {
      id: 'sf2', title: 'The Martian', year: '2015', rating: '8.0', runtime: '144 min',
      genre: 'Adventure, Drama, Sci-Fi',
      plot: 'An astronaut becomes stranded on Mars after his team assumes him dead, and he must rely on his ingenuity to survive.',
      cast: 'Matt Damon, Jessica Chastain, Kristen Wiig',
      image: 'https://image.tmdb.org/t/p/w500/5aGhaIHYuQbqlHWvWYqMCnj40y2.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/5aGhaIHYuQbqlHWvWYqMCnj40y2.jpg',
    },
    {
      id: 'sf3', title: 'Inception', year: '2010', rating: '8.8', runtime: '148 min',
      genre: 'Action, Adventure, Sci-Fi',
      plot: 'A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
      image: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    },
  ],
  western: [
    {
      id: 'w1', title: 'No Country for Old Men', year: '2007', rating: '8.2', runtime: '122 min',
      genre: 'Crime, Drama, Thriller',
      plot: 'Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and a cache of money in the desert.',
      cast: 'Tommy Lee Jones, Javier Bardem, Josh Brolin',
      image: 'https://image.tmdb.org/t/p/w500/6d1msEBMEOZoXlLJxHHoOH2Vhc6.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/6d1msEBMEOZoXlLJxHHoOH2Vhc6.jpg',
    },
    {
      id: 'w2', title: 'The Hateful Eight', year: '2015', rating: '7.8', runtime: '187 min',
      genre: 'Crime, Drama, Mystery',
      plot: 'In the dead of a Wyoming winter, a bounty hunter and his prisoner find shelter in a cabin currently occupied by a collection of nefarious characters.',
      cast: 'Samuel L. Jackson, Kurt Russell, Jennifer Jason Leigh',
      image: 'https://image.tmdb.org/t/p/w500/tEcTBVhAkXrSJ4EF2kRMlG9fDh2.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/tEcTBVhAkXrSJ4EF2kRMlG9fDh2.jpg',
    },
  ],
};

// ─── Mock News ────────────────────────────────────────────────────────────────
export const NEWS_DATA = [
  {
    id: 'n1',
    title: 'Want to climb Mount Everest?',
    content: 'In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world\'s highest mountain has changed dramatically. Today, hundreds of mountaineers manage the feat each year thanks to improvements in knowledge, technology, and the significant infrastructure provided by commercially guided expeditions that provide a veritable highway up the mountain for those willing to accept both the......',
    image: 'https://images.unsplash.com/photo-1521150932951-303a95503ed3?w=800&h=400&fit=crop',
    date: '2-20-2023 | 07:35 PM',
  },
  {
    id: 'n2',
    title: 'The Future of Artificial Intelligence',
    content: 'Artificial intelligence is transforming industries at an unprecedented pace. From healthcare diagnostics to autonomous vehicles, AI systems are becoming increasingly capable of performing tasks that once required human intelligence. Researchers continue to push the boundaries of what machines can accomplish, raising both exciting possibilities and important ethical questions about the role of AI in society......',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop',
    date: '3-15-2023 | 10:00 AM',
  },
  {
    id: 'n3',
    title: 'Ocean Exploration: The Final Frontier',
    content: 'Scientists have explored less than 20% of the Earth\'s oceans, making them one of the last great frontiers of discovery. New deep-sea expeditions are uncovering extraordinary creatures and geological formations that challenge our understanding of life on Earth. Advanced submersibles equipped with AI-driven cameras are capturing footage of bioluminescent organisms at depths never before accessible to researchers......',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&h=400&fit=crop',
    date: '4-02-2023 | 03:45 PM',
  },
  {
    id: 'n4',
    title: 'Space Tourism: A New Era Begins',
    content: 'The dream of space travel is becoming a reality for civilians, with several private companies offering suborbital and orbital flights to paying customers. SpaceX, Blue Origin, and Virgin Galactic are competing in a new space race driven by commercial interests rather than governmental mandates. This democratization of space access promises to accelerate scientific research and inspire a new generation of explorers......',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=400&fit=crop',
    date: '5-10-2023 | 08:20 AM',
  },
  {
    id: 'n5',
    title: 'Renewable Energy Revolution',
    content: 'Solar and wind energy are now the cheapest sources of electricity in history, driving a global transition away from fossil fuels. Countries around the world are investing in massive renewable energy projects, with some nations already achieving 100% clean energy on their national grids. Battery storage technology is advancing rapidly, solving the intermittency problems that once limited renewable adoption......',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop',
    date: '6-18-2023 | 02:15 PM',
  },
];

// ─── Mock Weather ─────────────────────────────────────────────────────────────
export const WEATHER_DATA = {
  condition: 'Heavy rain',
  temp: 24,
  pressure: '1010 mbar',
  wind: '3.7 km/h',
  humidity: '83%',
  icon: 'rain',
};
