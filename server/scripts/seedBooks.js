// scripts/seedBooks.js
// Run once to populate the books collection with sample data:
//   node scripts/seedBooks.js

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Book = require('../src/models/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mini_hakathon_test';

const BOOKS = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    description: 'A novel about the American Dream set in the Jazz Age of the 1920s. Nick Carraway narrates the story of the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.',
    price: 12.99,
    stock: 24,
    coverImage: 'https://covers.openlibrary.org/b/id/8432472-L.jpg',
    isbn: '978-0-7432-7356-5',
    publisher: 'Scribner',
    publishedYear: 1925,
    language: 'English',
    pages: 180,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    description: 'Set in the American Deep South during the 1930s, this Pulitzer Prize-winning novel explores racial injustice and moral growth through the eyes of young Scout Finch.',
    price: 14.99,
    stock: 18,
    coverImage: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    isbn: '978-0-06-112008-4',
    publisher: 'HarperCollins',
    publishedYear: 1960,
    language: 'English',
    pages: 281,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    description: "A sweeping narrative of humanity's creation and evolution examining the most crucial breakthroughs in our existence — from the Cognitive Revolution to the Agricultural Revolution.",
    price: 17.99,
    stock: 31,
    coverImage: 'https://covers.openlibrary.org/b/id/10462238-L.jpg',
    isbn: '978-0-06-231609-7',
    publisher: 'Harper',
    publishedYear: 2011,
    language: 'English',
    pages: 443,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    description: 'An easy and proven way to build good habits and break bad ones. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones.',
    price: 16.99,
    stock: 45,
    coverImage: 'https://covers.openlibrary.org/b/id/10309922-L.jpg',
    isbn: '978-0-7352-1129-2',
    publisher: 'Avery',
    publishedYear: 2018,
    language: 'English',
    pages: 320,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    description: 'A handbook of agile software craftsmanship. Martin has teamed up with his colleagues to distil their best agile practice of cleaning code on the fly into a book.',
    price: 39.99,
    stock: 12,
    coverImage: 'https://covers.openlibrary.org/b/id/8621137-L.jpg',
    isbn: '978-0-13-235088-4',
    publisher: 'Prentice Hall',
    publishedYear: 2008,
    language: 'English',
    pages: 431,
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    description: 'A magical story about Santiago, an Andalusian shepherd boy who yearns to travel the world and discover a treasure. A global phenomenon that has sold over 150 million copies worldwide.',
    price: 13.99,
    stock: 0,
    coverImage: 'https://covers.openlibrary.org/b/id/8746091-L.jpg',
    isbn: '978-0-06-231500-7',
    publisher: 'HarperOne',
    publishedYear: 1988,
    language: 'English',
    pages: 208,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Fantasy',
    description: 'Set in the far future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, heir to a noble family tasked with ruling an inhospitable desert planet.',
    price: 18.99,
    stock: 9,
    coverImage: 'https://covers.openlibrary.org/b/id/8225143-L.jpg',
    isbn: '978-0-441-17271-9',
    publisher: 'Ace Books',
    publishedYear: 1965,
    language: 'English',
    pages: 688,
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    category: 'Biography',
    description: 'The authorised biography of the co-founder of Apple Inc. Based on more than forty interviews over two years with Jobs, as well as interviews with more than one hundred family members and colleagues.',
    price: 19.99,
    stock: 7,
    coverImage: 'https://covers.openlibrary.org/b/id/7290802-L.jpg',
    isbn: '978-1-4516-4853-9',
    publisher: 'Simon & Schuster',
    publishedYear: 2011,
    language: 'English',
    pages: 656,
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    description: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses. A revolutionary approach being adopted across the globe.',
    price: 21.99,
    stock: 20,
    coverImage: 'https://covers.openlibrary.org/b/id/8571844-L.jpg',
    isbn: '978-0-307-88791-7',
    publisher: 'Crown Business',
    publishedYear: 2011,
    language: 'English',
    pages: 336,
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    description: 'From the Big Bang to Black Holes. Hawking takes the reader on a mind-expanding journey through distant galaxies, alternate dimensions, possible universes, and the very range of time.',
    price: 15.99,
    stock: 14,
    coverImage: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    isbn: '978-0-553-38016-3',
    publisher: 'Bantam Books',
    publishedYear: 1988,
    language: 'English',
    pages: 212,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    description: 'Bilbo Baggins, a hobbit who enjoys a comfortable, unambitious life, is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug.',
    price: 14.99,
    stock: 33,
    coverImage: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
    isbn: '978-0-547-92822-7',
    publisher: 'Houghton Mifflin',
    publishedYear: 1937,
    language: 'English',
    pages: 310,
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    category: 'Mystery',
    description: "On the morning of their fifth wedding anniversary, Nick Dunne's wife Amy goes missing. Under pressure from the police and scrutiny of the media, the secrets Nick has been keeping begin to unravel.",
    price: 13.99,
    stock: 0,
    coverImage: 'https://covers.openlibrary.org/b/id/8235090-L.jpg',
    isbn: '978-0-307-58836-4',
    publisher: 'Crown Publishing',
    publishedYear: 2012,
    language: 'English',
    pages: 422,
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    category: 'History',
    description: 'An ancient Chinese military treatise dating from the 5th century BC. Comprised of 13 chapters, each devoted to a different aspect of warfare, it is widely applied to business and management.',
    price: 8.99,
    stock: 50,
    coverImage: 'https://covers.openlibrary.org/b/id/8225580-L.jpg',
    isbn: '978-1-59030-963-7',
    publisher: 'Shambhala',
    publishedYear: 500,
    language: 'English',
    pages: 273,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    description: 'The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry.',
    price: 10.99,
    stock: 28,
    coverImage: 'https://covers.openlibrary.org/b/id/8479576-L.jpg',
    isbn: '978-0-14-143951-8',
    publisher: 'Penguin Classics',
    publishedYear: 1813,
    language: 'English',
    pages: 432,
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    category: 'Self-Help',
    description: 'A guide to spiritual enlightenment encouraging the reader to focus on the present moment. Named as one of the 100 most spiritually influential books of the 20th century.',
    price: 15.99,
    stock: 22,
    coverImage: 'https://covers.openlibrary.org/b/id/7894455-L.jpg',
    isbn: '978-1-57731-480-6',
    publisher: 'New World Library',
    publishedYear: 1997,
    language: 'English',
    pages: 229,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Book.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  ${existing} books already exist. Skipping seed.`);
      console.log('   To re-seed, run: node scripts/seedBooks.js --force');

      if (process.argv.includes('--force')) {
        await Book.deleteMany({});
        console.log('🗑  Cleared existing books (--force)');
      } else {
        await mongoose.disconnect();
        return;
      }
    }

    const inserted = await Book.insertMany(BOOKS);
    console.log(`🌱 Seeded ${inserted.length} books successfully`);

    const cats = [...new Set(inserted.map((b) => b.category))];
    console.log(`📚 Categories: ${cats.join(', ')}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
};

seed();
