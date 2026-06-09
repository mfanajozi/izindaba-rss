import { RSSFeed, FeedItem } from '../types';

const MOCK_ARTICLES: Record<string, { title: string; description: string }[]> = {
  'South African Stats': [
    { title: 'Consumer Price Index changes for October 2024', description: 'The annual inflation rate edged higher to 3.4% in October, with food and transport costs being the main contributors.' },
    { title: 'Quarterly Labour Force Survey Q3 2024', description: 'South Africa\'s unemployment rate decreased slightly to 32.6% in the third quarter, showing signs of economic recovery.' },
    { title: 'GDP growth accelerates in Q2 2024', description: 'The economy expanded by 1.2% quarter-on-quarter, driven by manufacturing and finance sectors.' },
    { title: 'Population estimates mid-year 2024', description: 'South Africa\'s population is estimated at 63.02 million, with Gauteng remaining the most populous province.' },
    { title: 'Mining production increases year-on-year', description: 'Mining output rose by 2.8% in September, with platinum group metals leading the growth.' },
    { title: 'Retail trade sales show positive growth', description: 'Retail sales increased by 3.1% year-on-year, indicating improved consumer confidence.' },
    { title: 'Tourism statistics show recovery', description: 'International arrivals reached 85% of pre-pandemic levels, with European markets showing strong growth.' },
    { title: 'Electricity generation statistics for September', description: 'Eskom reports improved plant performance with energy availability factor reaching 60%.' },
  ],
  'Technology': [
    { title: 'The Future of Artificial Intelligence in 2024', description: 'Exploring the latest breakthroughs in AI technology and how they are reshaping industries from healthcare to finance.' },
    { title: 'New JavaScript Framework Released', description: 'A new contender in the JavaScript framework wars promises better performance and simpler syntax for developers.' },
    { title: 'Breakthrough in Quantum Computing', description: 'Scientists achieve quantum supremacy with a new 1000-qubit processor, opening doors to previously impossible calculations.' },
    { title: 'The Rise of Remote Work Culture', description: 'How companies are adapting to a permanent remote work model and the tools making it possible.' },
    { title: 'Cybersecurity Threats on the Rise', description: 'Experts warn of increasingly sophisticated cyber attacks targeting critical infrastructure.' },
  ],
  'default': [
    { title: 'Global Markets Rally After Policy Announcement', description: 'Stock markets around the world saw significant gains following the central banks new economic policy announcement.' },
    { title: 'Climate Summit Reaches Historic Agreement', description: 'World leaders commit to ambitious new carbon reduction targets in a landmark climate agreement.' },
    { title: 'Space Tourism: A New Era Begins', description: 'The first commercial space hotel welcomes its inaugural guests, marking a new chapter in space exploration.' },
    { title: 'Advances in Renewable Energy Storage', description: 'New battery technology promises to solve the intermittency problem of solar and wind power.' },
  ],
};

export const mockFetcher = {
  fetchFeed: (feed: RSSFeed): FeedItem[] => {
    const articles = MOCK_ARTICLES[feed.category] || MOCK_ARTICLES['default'];
    const itemCount = Math.min(Math.floor(Math.random() * 5) + 3, articles.length);
    const items: FeedItem[] = [];
    
    const shuffled = [...articles].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < itemCount; i++) {
      const article = shuffled[i];
      const uniqueId = `${feed.id}-${Date.now()}-${i}`;
      
      items.push({
        id: uniqueId,
        feedId: feed.id,
        title: article.title,
        link: `https://example.com/article/${uniqueId}`,
        description: article.description,
        pubDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        fetchedAt: Date.now(),
        category: feed.category,
        feedTitle: feed.title,
      });
    }
    
    return items;
  },
};