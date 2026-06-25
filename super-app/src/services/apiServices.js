import axios from "axios";

// ── Curated Mock Movies Database (matches Figma reference images) ───────────

const MOVIES_DB = {
  action: [
    {
      id: 'a1', title: 'Black Adam', year: '2022', rating: '6.3', runtime: '125 min',
      genre: 'Action, Adventure, Fantasy',
      plot: 'Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods, Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.',
      cast: 'Dwayne Johnson, Aldis Hodge, Pierce Brosnan, Noah Centineo',
      image: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
      fallback: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=280&fit=crop',
    },
    {
      id: 'a2', title: 'Eternals', year: '2021', rating: '6.8', runtime: '157 min',
      genre: 'Action, Adventure, Drama',
      plot: 'The saga of the Eternals, a race of immortal beings who lived on Earth and shaped its history and civilizations.',
      cast: 'Gemma Chan, Richard Madden, Angelina Jolie, Salma Hayek',
      image: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg',
      fallback: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500&h=280&fit=crop',
    },
    {
      id: 'a3', title: 'Top Gun: Maverick', year: '2022', rating: '8.3', runtime: '130 min',
      genre: 'Action, Drama',
      plot: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator. When he is called to train a detachment of graduates for a specialized mission, he must confront the ghosts of his past.',
      cast: 'Tom Cruise, Jennifer Connelly, Miles Teller, Jon Hamm',
      image: 'https://image.tmdb.org/t/p/w500/62HCnUTHOWT7g7huJnRi4BKWJ5K.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/62HCnUTHOWT7g7huJnRi4BKWJ5K.jpg',
      fallback: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=500&h=280&fit=crop',
    },
    {
      id: 'a4', title: 'Tenet', year: '2020', rating: '7.4', runtime: '150 min',
      genre: 'Action, Sci-Fi, Thriller',
      plot: 'Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.',
      cast: 'John David Washington, Robert Pattinson, Elizabeth Debicki',
      image: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijBlTh.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijBlTh.jpg',
      fallback: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=500&h=280&fit=crop',
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
      fallback: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&h=280&fit=crop',
    },
    {
      id: 't2', title: 'Smile', year: '2022', rating: '6.8', runtime: '115 min',
      genre: 'Horror, Thriller',
      plot: 'After witnessing a bizarre, traumatic incident involving a patient, a doctor begins experiencing frightening occurrences that she cannot explain.',
      cast: 'Sosie Bacon, Jessie T. Usher, Kyle Gallner',
      image: 'https://image.tmdb.org/t/p/w500/aPqcQwu4VGEewPhagqNNVn1fMGn.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/aPqcQwu4VGEewPhagqNNVn1fMGn.jpg',
      fallback: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=280&fit=crop',
    },
    {
      id: 't3', title: 'The Gray Man', year: '2022', rating: '6.5', runtime: '122 min',
      genre: 'Action, Thriller',
      plot: 'When the CIA top asset uncovers agency secrets, he triggers a global hunt by an international assassin hired to take him out.',
      cast: 'Ryan Gosling, Chris Evans, Ana de Armas',
      image: 'https://image.tmdb.org/t/p/w500/8MbCInRD0BQJZG4P3dFRYRVPsLh.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/8MbCInRD0BQJZG4P3dFRYRVPsLh.jpg',
      fallback: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500&h=280&fit=crop',
    },
    {
      id: 't4', title: 'The Menu', year: '2022', rating: '7.2', runtime: '107 min',
      genre: 'Comedy, Horror, Thriller',
      plot: 'A young couple travels to a remote island to eat at an exclusive restaurant where the chef has prepared shocking surprises for his high-profile guests.',
      cast: 'Ralph Fiennes, Anya Taylor-Joy, Nicholas Hoult',
      image: 'https://image.tmdb.org/t/p/w500/v3VwWHbBBgekzZFXfyMi6oHFGaT.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/v3VwWHbBBgekzZFXfyMi6oHFGaT.jpg',
      fallback: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=500&h=280&fit=crop',
    },
  ],
  horror: [
    {
      id: 'h1', title: 'M3GAN', year: '2022', rating: '6.4', runtime: '102 min',
      genre: 'Horror, Sci-Fi, Thriller',
      plot: 'A robotics engineer at a toy company builds a life-like AI doll that begins to take on a life of its own.',
      cast: 'Allison Williams, Violet McGraw, Amie Donald',
      image: 'https://image.tmdb.org/t/p/w500/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg',
      fallback: 'https://images.unsplash.com/photo-1601513237763-10aaaa60fbcf?w=500&h=280&fit=crop',
    },
    {
      id: 'h2', title: 'The Invitation', year: '2022', rating: '5.2', runtime: '105 min',
      genre: 'Horror, Mystery, Thriller',
      plot: 'After her mother dies, Evie meets her long-lost family who invite her to a lavish wedding in the English countryside. Sinister things begin to occur.',
      cast: 'Nathalie Emmanuel, Thomas Doherty, Stephanie Corneliussen',
      image: 'https://image.tmdb.org/t/p/w500/p7M9B2sEW4VjhLYI1VRWVnbVJhz.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/p7M9B2sEW4VjhLYI1VRWVnbVJhz.jpg',
      fallback: 'https://images.unsplash.com/photo-1627389887752-d59664d5ed75?w=500&h=280&fit=crop',
    },
    {
      id: 'h3', title: 'Orphan: First Kill', year: '2022', rating: '6.2', runtime: '99 min',
      genre: 'Horror, Thriller',
      plot: 'After escaping from a psychiatric facility in Estonia, Leena travels to America by assuming the identity of a missing girl and ingratiates herself with her unknowing family.',
      cast: 'Isabelle Fuhrman, Julia Stiles, Rossif Sutherland',
      image: 'https://image.tmdb.org/t/p/w500/sS7mAhBajEBUeOIwl4SXXQ4r7oA.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/sS7mAhBajEBUeOIwl4SXXQ4r7oA.jpg',
      fallback: 'https://images.unsplash.com/photo-1606103836293-0a063f78e5e0?w=500&h=280&fit=crop',
    },
    {
      id: 'h4', title: 'Ouija: Origin of Evil', year: '2016', rating: '6.1', runtime: '99 min',
      genre: 'Horror, Mystery, Thriller',
      plot: 'In 1967 Los Angeles, a widowed mother and her daughters add a new stunt to bolster their séance scam business and unwittingly invite authentic evil into their home.',
      cast: 'Elizabeth Reaser, Annalise Basso, Lulu Wilson',
      image: 'https://image.tmdb.org/t/p/w500/f5HNUm2OgVjsCJHztbVX7nS1EHg.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/f5HNUm2OgVjsCJHztbVX7nS1EHg.jpg',
      fallback: 'https://images.unsplash.com/photo-1551264986-a3c0bdbe5ef8?w=500&h=280&fit=crop',
    },
  ],
  drama: [
    {
      id: 'd1', title: 'The Shawshank Redemption', year: '1994', rating: '9.3', runtime: '142 min',
      genre: 'Drama',
      plot: 'Over the course of several years, two imprisoned men bond and find solace and eventual redemption through acts of common decency.',
      cast: 'Tim Robbins, Morgan Freeman, Bob Gunton',
      image: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      fallback: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=280&fit=crop',
    },
    {
      id: 'd2', title: 'The Godfather', year: '1972', rating: '9.2', runtime: '175 min',
      genre: 'Crime, Drama',
      plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      cast: 'Marlon Brando, Al Pacino, James Caan',
      image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLegHQr3gbwy.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLegHQr3gbwy.jpg',
      fallback: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=280&fit=crop',
    },
    {
      id: 'd3', title: 'CODA', year: '2021', rating: '8.0', runtime: '111 min',
      genre: 'Drama, Music',
      plot: 'As a CODA (Child of Deaf Adults), Ruby is the only hearing person in her family. When she discovers her passion for singing, she must choose between music school and home.',
      cast: 'Emilia Jones, Troy Kotsur, Marlee Matlin',
      image: 'https://image.tmdb.org/t/p/w500/4zMJcyMNfpKX9xhDdRzJTl7XCFJ.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/4zMJcyMNfpKX9xhDdRzJTl7XCFJ.jpg',
      fallback: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&h=280&fit=crop',
    },
    {
      id: 'd4', title: 'Belfast', year: '2021', rating: '7.3', runtime: '98 min',
      genre: 'Biography, Drama',
      plot: 'A young boy and his working-class Belfast family navigate the tumultuous political landscape of the late 1960s.',
      cast: 'Caitríona Balfe, Judi Dench, Jamie Dornan',
      image: 'https://image.tmdb.org/t/p/w500/9U4UVeDaFLuFoYkfGNdFR7AFXIV.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/9U4UVeDaFLuFoYkfGNdFR7AFXIV.jpg',
      fallback: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=500&h=280&fit=crop',
    },
  ],
  romance: [
    {
      id: 'r1', title: 'The Notebook', year: '2004', rating: '7.8', runtime: '123 min',
      genre: 'Drama, Romance',
      plot: 'A poor yet passionate young man falls in love with a rich young woman and gives her a sense of freedom. They soon discover that young love can have a lasting effect.',
      cast: 'Ryan Gosling, Rachel McAdams, James Garner',
      image: 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtLAGe8MS7.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtLAGe8MS7.jpg',
      fallback: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&h=280&fit=crop',
    },
    {
      id: 'r2', title: 'La La Land', year: '2016', rating: '8.0', runtime: '128 min',
      genre: 'Comedy, Drama, Music, Romance',
      plot: 'A pianist and an aspiring actress fall in love while struggling to make their dreams come true in Los Angeles.',
      cast: 'Ryan Gosling, Emma Stone, John Legend',
      image: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      fallback: 'https://images.unsplash.com/photo-1477064996609-b6b5d4c91f56?w=500&h=280&fit=crop',
    },
    {
      id: 'r3', title: 'Pride & Prejudice', year: '2005', rating: '7.8', runtime: '129 min',
      genre: 'Drama, Romance',
      plot: 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.',
      cast: 'Keira Knightley, Matthew Macfadyen, Brenda Blethyn',
      image: 'https://image.tmdb.org/t/p/w500/bXJheFOVTBDqj7LrKoVFqLHbFcG.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/bXJheFOVTBDqj7LrKoVFqLHbFcG.jpg',
      fallback: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500&h=280&fit=crop',
    },
    {
      id: 'r4', title: 'Me Before You', year: '2016', rating: '7.4', runtime: '110 min',
      genre: 'Drama, Romance',
      plot: 'A small-town woman falls into an unlikely romance with a recently paralyzed man she is hired to care for.',
      cast: 'Emilia Clarke, Sam Claflin, Janet McTeer',
      image: 'https://image.tmdb.org/t/p/w500/5pkHDrCa8EhpO8VBw2nZp9SXXOH.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/5pkHDrCa8EhpO8VBw2nZp9SXXOH.jpg',
      fallback: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=500&h=280&fit=crop',
    },
  ],
  fantasy: [
    {
      id: 'f1', title: 'The Lord of the Rings', year: '2001', rating: '8.8', runtime: '178 min',
      genre: 'Action, Adventure, Drama',
      plot: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      cast: 'Elijah Wood, Ian McKellen, Orlando Bloom',
      image: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      fallback: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=280&fit=crop',
    },
    {
      id: 'f2', title: 'Doctor Strange: Multiverse of Madness', year: '2022', rating: '6.9', runtime: '126 min',
      genre: 'Action, Adventure, Fantasy',
      plot: 'Doctor Strange teams with a mysterious Scarlet Witch to protect America Chavez as she travels the multiverse to escape a powerful adversary.',
      cast: 'Benedict Cumberbatch, Elizabeth Olsen, Xochitl Gomez',
      image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
      fallback: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=500&h=280&fit=crop',
    },
    {
      id: 'f3', title: 'Dune', year: '2021', rating: '7.9', runtime: '155 min',
      genre: 'Action, Adventure, Drama',
      plot: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
      cast: 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac',
      image: 'https://image.tmdb.org/t/p/w500/d5NXSklpcKqIKDjOdGaBARGFTyb.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/d5NXSklpcKqIKDjOdGaBARGFTyb.jpg',
      fallback: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=500&h=280&fit=crop',
    },
    {
      id: 'f4', title: 'Avatar', year: '2009', rating: '7.8', runtime: '162 min',
      genre: 'Action, Adventure, Fantasy',
      plot: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the alien world he feels is his home.',
      cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
      image: 'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg',
      fallback: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=280&fit=crop',
    },
  ],
  music: [
    {
      id: 'm1', title: 'Bohemian Rhapsody', year: '2018', rating: '7.9', runtime: '134 min',
      genre: 'Biography, Drama, Music',
      plot: 'The story of the legendary rock band Queen and lead singer Freddie Mercury, leading up to their iconic performance at Live Aid.',
      cast: 'Rami Malek, Lucy Boynton, Gwilym Lee',
      image: 'https://image.tmdb.org/t/p/w500/5tmP6tLHbRCN3cSPCAvbwjXBYuC.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/5tmP6tLHbRCN3cSPCAvbwjXBYuC.jpg',
      fallback: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=280&fit=crop',
    },
    {
      id: 'm2', title: 'Whiplash', year: '2014', rating: '8.5', runtime: '106 min',
      genre: 'Drama, Music',
      plot: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are either made or broken by his instructor.',
      cast: 'Miles Teller, J.K. Simmons, Paul Reiser',
      image: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
      fallback: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=280&fit=crop',
    },
    {
      id: 'm3', title: 'A Star Is Born', year: '2018', rating: '7.6', runtime: '136 min',
      genre: 'Drama, Music, Romance',
      plot: 'A musician helps a young singer find fame, even as age and alcoholism send his own career into a downward spiral.',
      cast: 'Lady Gaga, Bradley Cooper, Sam Elliott',
      image: 'https://image.tmdb.org/t/p/w500/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg',
      fallback: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=500&h=280&fit=crop',
    },
    {
      id: 'm4', title: 'Yesterday', year: '2019', rating: '6.8', runtime: '116 min',
      genre: 'Comedy, Drama, Fantasy, Music, Romance',
      plot: 'A struggling musician realizes he\'s the only person on Earth who can remember The Beatles after waking up in an alternate reality.',
      cast: 'Himesh Patel, Lily James, Kate McKinnon',
      image: 'https://image.tmdb.org/t/p/w500/l9Mb3QoVdDzw6a2MLVRrWLO4GJF.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/l9Mb3QoVdDzw6a2MLVRrWLO4GJF.jpg',
      fallback: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=280&fit=crop',
    },
  ],
  western: [
    {
      id: 'w1', title: 'No Country for Old Men', year: '2007', rating: '8.1', runtime: '122 min',
      genre: 'Crime, Drama, Thriller',
      plot: 'Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.',
      cast: 'Tommy Lee Jones, Javier Bardem, Josh Brolin',
      image: 'https://image.tmdb.org/t/p/w500/1X7vow16X7CnCoexXh4H4F2yDJv.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/1X7vow16X7CnCoexXh4H4F2yDJv.jpg',
      fallback: 'https://images.unsplash.com/photo-1548199569-3e1c6aa8f949?w=500&h=280&fit=crop',
    },
    {
      id: 'w2', title: 'Tombstone', year: '1993', rating: '7.8', runtime: '130 min',
      genre: 'Action, Drama, Western',
      plot: 'Legendary marshal Wyatt Earp, now a weary gunfighter, joins his brothers and Doc Holliday in Tombstone, but pitted against the Cowboy gang.',
      cast: 'Kurt Russell, Val Kilmer, Sam Elliott',
      image: 'https://image.tmdb.org/t/p/w500/rBb9ToAHE7Iu5KJ4T3zOnHCiTio.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/rBb9ToAHE7Iu5KJ4T3zOnHCiTio.jpg',
      fallback: 'https://images.unsplash.com/photo-1548199569-3e1c6aa8f949?w=500&h=280&fit=crop',
    },
    {
      id: 'w3', title: 'Django Unchained', year: '2012', rating: '8.4', runtime: '165 min',
      genre: 'Drama, Western',
      plot: 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.',
      cast: 'Jamie Foxx, Christoph Waltz, Leonardo DiCaprio',
      image: 'https://image.tmdb.org/t/p/w500/5WJnFLbqDtRp7lNrTzKRxPNLEcg.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/5WJnFLbqDtRp7lNrTzKRxPNLEcg.jpg',
      fallback: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=500&h=280&fit=crop',
    },
    {
      id: 'w4', title: 'True Grit', year: '2010', rating: '7.6', runtime: '110 min',
      genre: 'Adventure, Drama, Western',
      plot: 'A tough U.S. Marshal helps a stubborn young woman track down her father\'s murderer in the Indian Territory.',
      cast: 'Jeff Bridges, Matt Damon, Hailee Steinfeld',
      image: 'https://image.tmdb.org/t/p/w500/9A7dHvgLIAVIbE7RsAnFJmknIpG.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/9A7dHvgLIAVIbE7RsAnFJmknIpG.jpg',
      fallback: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=500&h=280&fit=crop',
    },
  ],
  fiction: [
    {
      id: 's1', title: 'Interstellar', year: '2014', rating: '8.6', runtime: '169 min',
      genre: 'Adventure, Drama, Sci-Fi',
      plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth faces ecological collapse.',
      cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIE.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIE.jpg',
      fallback: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=280&fit=crop',
    },
    {
      id: 's2', title: 'The Martian', year: '2015', rating: '8.0', runtime: '144 min',
      genre: 'Adventure, Drama, Sci-Fi',
      plot: 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.',
      cast: 'Matt Damon, Jessica Chastain, Kristen Wiig',
      image: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
      fallback: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=280&fit=crop',
    },
    {
      id: 's3', title: 'Arrival', year: '2016', rating: '7.9', runtime: '116 min',
      genre: 'Drama, Mystery, Sci-Fi',
      plot: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
      cast: 'Amy Adams, Jeremy Renner, Forest Whitaker',
      image: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
      fallback: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=280&fit=crop',
    },
    {
      id: 's4', title: 'Blade Runner 2049', year: '2017', rating: '8.0', runtime: '164 min',
      genre: 'Drama, Mystery, Sci-Fi',
      plot: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who has been missing for thirty years.',
      cast: 'Ryan Gosling, Harrison Ford, Ana de Armas',
      image: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
      poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
      fallback: 'https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?w=500&h=280&fit=crop',
    },
  ],
};

// Fallback for categories without curated data
const genericMovies = (category) =>
  Array(4).fill(null).map((_, i) => ({
    id: `${category}-${i}`,
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Film ${i + 1}`,
    year: String(2019 + i),
    rating: (7 + Math.random()).toFixed(1),
    runtime: `${90 + Math.floor(Math.random() * 60)} min`,
    genre: category.charAt(0).toUpperCase() + category.slice(1),
    plot: `An extraordinary ${category} story that takes viewers on an unforgettable journey through breathtaking cinematography and compelling characters.`,
    cast: 'John Doe, Jane Smith, Alex Johnson',
    image: `https://picsum.photos/seed/${category}${i + 100}/500/280`,
    poster: `https://picsum.photos/seed/${category}${i + 200}/300/450`,
    fallback: `https://picsum.photos/seed/${category}${i}/500/280`,
  }));

// Mock API that returns curated movie lists
export const mockMoviesAPI = async (category) => {
  await new Promise(r => setTimeout(r, 100)); // simulate async
  return MOVIES_DB[category] || genericMovies(category);
};

// Mock weather data (matches Figma design)
export const mockWeatherAPI = async () => ({
  date: '2-20-2023',
  time: '07:35 PM',
  temp: 24,
  condition: 'Heavy rain',
  wind: '3.7 km/h',
  pressure: '1010 mbar',
  humidity: '83%',
});

// Mock news data (matches Figma design)
export const mockNewsAPI = async () => [
  {
    title: 'Want to climb Mount Everest?',
    content: 'In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world\'s highest mountain has changed dramatically. Today, hundreds of mountaineers manage the feat each year thanks to improvements in knowledge, technology, and the significant infrastructure provided by commercially guided expeditions that provide a veritable highway up the mountain for those willing to accept both the......',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1000&auto=format&fit=crop',
    publishedAt: '2023-02-20T19:35:00Z',
  },
  {
    title: 'New Horizons in Space Exploration',
    content: 'NASA\'s latest probe sends back stunning high-resolution images from the Martian surface, revealing geological features never seen before. Scientists worldwide are thrilled by the new discoveries that could rewrite what we know about the solar system\'s history and the potential for life beyond Earth. The mission represents a landmark achievement in interplanetary exploration......',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    publishedAt: '2023-02-21T10:00:00Z',
  },
  {
    title: 'The Future of Renewable Energy',
    content: 'Solar and wind energy are reaching new efficiency milestones, making them increasingly competitive with traditional fossil fuels. Governments worldwide are ramping up investment in green infrastructure as climate goals become more urgent. New battery storage technologies promise to solve the intermittency problem that has long plagued renewables......',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000&auto=format&fit=crop',
    publishedAt: '2023-02-22T08:15:00Z',
  },
];

// ── Live API Clients (with automatic mock fallback when no API key) ────────────

const weatherClient = axios.create({ baseURL: 'https://api.openweathermap.org/data/2.5' });
const newsClient    = axios.create({ baseURL: 'https://newsapi.org/v2' });
const movieClient   = axios.create({ baseURL: 'https://www.omdbapi.com/' });

export const fetchCurrentWeather = async (city = 'London', apiKey = '') => {
  if (!apiKey) return mockWeatherAPI();
  try {
    const { data } = await weatherClient.get(`/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    return {
      date:      new Date().toLocaleDateString('en-US'),
      time:      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temp:      Math.round(data.main?.temp),
      condition: data.weather?.[0]?.description || 'Clear',
      wind:      `${data.wind?.speed} km/h`,
      pressure:  `${data.main?.pressure} mbar`,
      humidity:  `${data.main?.humidity}%`,
    };
  } catch { return mockWeatherAPI(); }
};

export const fetchTopHeadlines = async (category = 'general', apiKey = '') => {
  if (!apiKey) return mockNewsAPI();
  try {
    const { data } = await newsClient.get(`/top-headlines?category=${category}&language=en&apiKey=${apiKey}`);
    return data.articles?.length ? data.articles : mockNewsAPI();
  } catch { return mockNewsAPI(); }
};

export const searchMovieByGenre = async (query, apiKey = '') => {
  if (!apiKey) return mockMoviesAPI(query);
  try {
    const { data } = await movieClient.get(`/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`);
    return data.Search?.length ? data.Search : mockMoviesAPI(query);
  } catch { return mockMoviesAPI(query); }
};

export const fetchMovieDetails = async (imdbID, apiKey = '') => {
  if (!apiKey) return (await mockMoviesAPI('action'))[0];
  try {
    const { data } = await movieClient.get(`/?i=${imdbID}&plot=full&apikey=${apiKey}`);
    return data;
  } catch { return (await mockMoviesAPI('action'))[0]; }
};
