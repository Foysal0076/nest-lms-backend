import { PrismaClient, TableAccess } from '@prisma/client'
import * as argon from 'argon2'

const prisma = new PrismaClient()

type SchemaTable = {
  table_name: string
}

const blogCategories = [
  {
    title: 'Web Design',
    slug: 'web-design',
    icon: '',
    featuredImage: '',
    createdById: 1,
    description:
      'Explore the world of web design, including UI/UX, responsive design, and best practices for creating visually appealing and user-friendly websites.',
  },
  {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: '',
    featuredImage: '',
    createdById: 1,
    description:
      'Discover effective strategies and tactics for promoting products or services online, including SEO, social media marketing, content marketing, and email marketing.',
  },
  {
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: '',
    featuredImage: '',
    createdById: 1,
    description:
      'Learn about the latest trends and techniques in mobile app development, including iOS and Android platforms, app design, user experience, and mobile app monetization.',
  },
  {
    title: 'Technology News',
    slug: 'technology-news',
    icon: '',
    featuredImage: '',
    createdById: 1,
    description:
      'Stay updated with the latest news and trends in the world of technology, including innovations, product releases, industry updates, and emerging technologies.',
  },
  {
    title: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    icon: '',
    featuredImage: '',
    createdById: 3,
    description:
      'Dive into the fascinating field of artificial intelligence, machine learning, and deep learning. Explore applications, algorithms, and the impact of AI on various industries.',
  },
  {
    title: 'E-commerce',
    slug: 'e-commerce',
    icon: '',
    featuredImage: '',
    createdById: 3,
    description:
      'Discover strategies for building and growing successful online stores, including e-commerce platforms, payment gateways, conversion optimization, and customer retention techniques.',
  },
  {
    title: 'Content Writing',
    slug: 'content-writing',
    icon: '',
    featuredImage: '',
    createdById: 3,
    description:
      'Learn the art of creating engaging and persuasive content, including blog writing, copywriting, storytelling, SEO writing, and tips for developing a unique writing style.',
  },
  {
    title: 'Social Media',
    slug: 'social-media',
    icon: '',
    featuredImage: '',
    createdById: 1,
    description:
      'Explore the world of social media marketing, including platform-specific strategies, community management, influencer marketing, and leveraging social media for business growth.',
  },
  {
    title: 'Graphic Design',
    slug: 'graphic-design',
    icon: '',
    featuredImage: '',
    createdById: 2,
    description:
      'Expand your skills in graphic design, including typography, layout design, branding, illustration, and using industry-standard software and tools.',
  },
  {
    title: 'Photography',
    slug: 'photography',
    icon: '',
    featuredImage: '',
    createdById: 2,
    description:
      'Capture moments, enhance your photography skills, and learn about techniques, equipment, editing, composition, and various genres of photography.',
  },
  {
    title: 'Health & Fitness',
    slug: 'health',
    icon: '',
    featuredImage: '',
    createdById: 2,
    description:
      'Explore topics related to health, wellness, and personal well-being, including physical and mental health, fitness, nutrition, and self-care practices.',
  },
]

//add slug in the below posts please
const blogPosts = [
  {
    title: 'A Guide on Writing an Engaging Blog Post',
    slug: 'a-guide-on-writing-an-engaging-blog-post',
    content:
      "<h1>A Guide on Writing an Engaging Blog Post</h1><h2>Introduction</h2><p>Writing a compelling blog post requires careful planning, thoughtful content creation, and effective communication with your target audience. In this guide, we will explore the key steps and best practices to help you craft an engaging and impactful blog post that resonates with your readers.</p><h2>1. Understand Your Audience</h2><p>Before you begin writing, take the time to understand your target audience. Consider their interests, needs, and preferences. Conduct research to identify the topics and themes that are relevant to your audience. This understanding will guide you in creating content that captivates and adds value to their lives.</p><h2>2. Choose an Engaging Topic</h2><p>Selecting a captivating topic is crucial to grabbing your readers' attention. Look for ideas that are informative, entertaining, or thought-provoking. Brainstorm a list of potential topics and choose one that aligns with your audience's interests and your expertise. Consider conducting keyword research to optimize your post for search engines and increase its discoverability.</p><h2>3. Plan Your Content</h2><p>Organize your thoughts and create an outline for your blog post. This will help you structure your content effectively and ensure a logical flow. Divide your post into sections or headings and outline the main points you want to cover in each section.</p><h2>4. Write Engaging Content</h2><p>When writing your blog post, aim for clarity, conciseness, and readability. Use a conversational tone to connect with your readers and make your content relatable. Incorporate storytelling, examples, or anecdotes to make your points more engaging. Break up your content into shorter paragraphs, use subheadings, and include bullet points or numbered lists to improve readability.</p><h2>5. Add Visuals and Media</h2><p>Enhance your blog post with relevant visuals and media. Images, infographics, videos, or embedded social media posts can make your content more visually appealing and interactive. Visuals can help illustrate your points, break up text-heavy sections, and keep your readers engaged.</p><h2>6. Edit and Proofread</h2><p>After writing your initial draft, take the time to review, edit, and proofread your blog post. Check for grammar and spelling errors, ensure proper formatting, and improve the clarity and coherence of your writing. Consider seeking feedback from others to get different perspectives and make necessary revisions.</p><h2>Conclusion</h2><p>By following these steps and incorporating best practices, you can write an engaging blog post that resonates with your readers. Remember to continue learning, experimenting, and refining your writing skills to consistently produce high-quality content that captivates your audience.</p>",
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [7],
    isPublished: true,
  },
  {
    title: 'The Importance of User Experience in Web Design',
    slug: 'the-importance-of-user-experience-in-web-design',
    content:
      '<h1>The Importance of User Experience in Web Design</h1><p>User experience (UX) plays a crucial role in web design. It focuses on creating a positive and seamless experience for website visitors. In this blog post, we will explore the significance of UX in web design, discuss key principles, and provide tips for enhancing the user experience on your website.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [1],
    isPublished: true,
  },
  {
    title: 'Effective Strategies for Social Media Marketing',
    slug: 'effective-strategies-for-social-media-marketing',
    content:
      '<h1>Effective Strategies for Social Media Marketing</h1><p>Social media marketing is a powerful tool for businesses to reach and engage their target audience. In this blog post, we will discuss proven strategies and tactics for running successful social media campaigns, building brand awareness, and driving customer engagement.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [8],
    isPublished: true,
  },
  {
    title: 'Creating Engaging Mobile Apps: Best Practices and Trends',
    slug: 'creating-engaging-mobile-apps-best-practices-and-trends',
    content:
      '<h1>Creating Engaging Mobile Apps: Best Practices and Trends</h1><p>Mobile app development is an ever-evolving field with new trends and best practices emerging regularly. In this blog post, we will explore the latest techniques and trends in mobile app development, including user interface design, performance optimization, and user engagement strategies.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [3],
    isPublished: false,
  },
  {
    title: 'Latest Technological Innovations and Their Impact',
    slug: 'latest-technological-innovations-and-their-impact',
    content:
      '<h1>Latest Technological Innovations and Their Impact</h1><p>Technology is constantly evolving, shaping our lives and industries. In this blog post, we will delve into the latest technological innovations across various fields and discuss their impact on society, businesses, and everyday life.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [4],
    isPublished: true,
  },
  {
    title: 'The Future of Artificial Intelligence and Its Applications',
    slug: 'the-future-of-artificial-intelligence-and-its-applications',
    content:
      '<h1>The Future of Artificial Intelligence and Its Applications</h1><p>Artificial Intelligence (AI) has transformative potential in various industries. In this blog post, we will explore the future of AI, its current applications, and its potential to revolutionize fields such as healthcare, finance, transportation, and more.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [5],
    isPublished: true,
  },
  {
    title: 'Building a Successful E-commerce Business: Tips and Strategies',
    slug: 'building-a-successful-e-commerce-business-tips-and-strategies',
    content:
      '<h1>Building a Successful E-commerce Business: Tips and Strategies</h1><p>Starting an e-commerce business requires careful planning and effective execution. In this blog post, we will discuss essential tips and strategies for launching and growing a successful online store, including product selection, website design, customer acquisition, and retention techniques.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [6],
    isPublished: false,
  },
  {
    title: 'Mastering the Art of Content Writing: Tips and Techniques',
    slug: 'mastering-the-art-of-content-writing-tips-and-techniques',
    content:
      "<h1>Mastering the Art of Content Writing: Tips and Techniques</h1><p>Content writing is a vital skill for effective communication and engagement. In this blog post, we will provide tips, techniques, and best practices for creating engaging and persuasive content, capturing readers' attention, and delivering your message effectively.</p>",
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [7],
    isPublished: true,
  },
  {
    title: 'Harnessing the Power of Social Media for Business Growth',
    slug: 'harnessing-the-power-of-social-media-for-business-growth',
    content:
      '<h1>Harnessing the Power of Social Media for Business Growth</h1><p>Social media has become a game-changer for businesses to connect with their audience and drive growth. In this blog post, we will explore effective social media strategies, platform-specific tactics, and ways to leverage social media for brand building, customer engagement, and business expansion.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [8],
    isPublished: true,
  },
  {
    title: 'Designing Memorable Logos: Principles and Examples',
    slug: 'designing-memorable-logos-principles-and-examples',
    content:
      '<h1>Designing Memorable Logos: Principles and Examples</h1><p>A logo is a visual representation of a brand and plays a crucial role in establishing brand identity. In this blog post, we will discuss the principles of effective logo design and showcase examples of memorable logos that have made a lasting impact.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [9],
    isPublished: true,
  },
  {
    title: "The Art of Landscape Photography: Capturing Nature's Beauty",
    slug: 'the-art-of-landscape-photography-capturing-natures-beauty',
    content:
      "<h1>The Art of Landscape Photography: Capturing Nature's Beauty</h1><p>Landscape photography allows us to capture the breathtaking beauty of the natural world. In this blog post, we will explore the techniques, equipment, and composition principles for capturing stunning landscape photos that evoke emotions and showcase the wonders of nature.</p>",
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [10],
    isPublished: false,
  },
  {
    title: 'Website Optimization for Better Performance and User Experience',
    slug: 'website-optimization-for-better-performance-and-user-experience',
    content:
      '<h1>Website Optimization for Better Performance and User Experience</h1><p>A well-optimized website delivers a seamless user experience and improves search engine rankings. In this blog post, we will discuss techniques for optimizing website performance, including image optimization, caching, minification, and other best practices to enhance user satisfaction.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [1],
    isPublished: true,
  },
  {
    title: 'Content Marketing Strategies for Lead Generation and Conversion',
    slug: 'content-marketing-strategies-for-lead-generation-and-conversion',
    content:
      '<h1>Content Marketing Strategies for Lead Generation and Conversion</h1><p>Content marketing is a powerful approach to attract and convert potential customers. In this blog post, we will explore effective content marketing strategies, including creating valuable content, building customer trust, and optimizing your content to generate leads and drive conversions.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [2],
    isPublished: true,
  },
  {
    title:
      'Creating Engaging User Interfaces: Design Principles and Techniques',
    slug: 'creating-engaging-user-interfaces-design-principles-and-techniques',
    content:
      '<h1>Creating Engaging User Interfaces: Design Principles and Techniques</h1><p>A well-designed user interface (UI) is essential for delivering a positive user experience. In this blog post, we will explore design principles and techniques for creating engaging UIs that are intuitive, visually appealing, and enhance user interaction.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [1],
    isPublished: true,
  },
  {
    title: 'The Power of Email Marketing: Effective Strategies and Campaigns',
    slug: 'the-power-of-email-marketing-effective-strategies-and-campaigns',
    content:
      '<h1>The Power of Email Marketing: Effective Strategies and Campaigns</h1><p>Email marketing remains a highly effective tool for engaging with your audience and driving conversions. In this blog post, we will discuss proven strategies, best practices, and examples of successful email marketing campaigns to help you optimize your email marketing efforts.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [2],
    isPublished: true,
  },
  {
    title:
      'Exploring the World of Virtual Reality: Applications and Future Possibilities',
    slug: 'exploring-the-world-of-virtual-reality-applications-and-future-possibilities',
    content:
      '<h1>Exploring the World of Virtual Reality: Applications and Future Possibilities</h1><p>Virtual Reality (VR) technology has opened up new possibilities in various industries. In this blog post, we will delve into the applications of VR across fields such as gaming, education, healthcare, and architecture, and discuss the future possibilities and potential impact of VR on our lives.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [4],
    isPublished: true,
  },
  {
    title:
      'Unlocking the Potential of Data Science: Techniques and Applications',
    slug: 'unlocking-the-potential-of-data-science-techniques-and-applications',
    content:
      '<h1>Unlocking the Potential of Data Science: Techniques and Applications</h1><p>Data science is revolutionizing the way businesses make informed decisions and gain valuable insights. In this blog post, we will explore data science techniques, including data analysis, machine learning, and predictive modeling, and discuss real-world applications of data science across various industries.</p>',
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [5],
    isPublished: true,
  },
  {
    title: 'The Power of Social Media in E-commerce: Strategies for Success',
    slug: 'the-power-of-social-media-in-e-commerce-strategies-for-success',
    content:
      "<h1>The Power of Social Media in E-commerce: Strategies for Success</h1><p>Social media has become an integral part of the e-commerce landscape, offering businesses unprecedented opportunities to reach and engage with their target audience. In this blog post, we will explore the symbiotic relationship between social media and e-commerce and discuss effective strategies for leveraging social media platforms to drive success in online retail.</p><h2>Understanding the Impact of Social Media on E-commerce</h2><p>Social media has revolutionized the way consumers discover products, interact with brands, and make purchasing decisions. Platforms like Facebook, Instagram, and Pinterest have become virtual marketplaces, where users can explore and shop for products directly within the app. The seamless integration of e-commerce features within social media platforms has transformed the traditional buyer's journey and provided businesses with new avenues for growth.</p><h2>Key Strategies for Harnessing Social Media in E-commerce</h2><p>1. Building a Strong Brand Presence: Establishing a compelling brand presence on social media is essential for gaining visibility and building trust with your target audience. Create consistent branding across your social media profiles, share engaging content, and interact with your followers to foster a sense of community and loyalty.</p><p>2. Influencer Marketing: Collaborating with influencers who align with your brand values and target audience can amplify your reach and generate product awareness. Identify relevant influencers in your industry, forge partnerships, and leverage their influence to showcase your products and drive sales.</p><p>3. Social Listening and Customer Engagement: Monitor social media platforms to understand customer sentiments, feedback, and preferences. Actively engage with your audience, respond to comments and messages promptly, and provide personalized support. Utilize social listening tools to identify trends, pain points, and opportunities for improvement.</p><p>4. User-Generated Content Campaigns: Encourage your customers to create and share content featuring your products. User-generated content not only provides social proof but also generates buzz and fosters a sense of authenticity. Run contests, offer incentives, and create hashtags to encourage user participation.</p><h2>Measuring Success and ROI</h2><p>Tracking the effectiveness of your social media efforts is crucial to optimizing your strategies and measuring return on investment. Define relevant metrics such as engagement rates, click-through rates, conversion rates, and revenue generated. Utilize social media analytics tools to gain insights and make data-driven decisions.</p><h2>Conclusion</h2><p>Social media has emerged as a powerful tool for e-commerce businesses to connect with their target audience, drive brand awareness, and boost sales. By implementing effective strategies, leveraging user-generated content, and staying attuned to customer feedback, businesses can harness the power of social media to achieve success in the competitive e-commerce landscape.</p>",
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [6, 8],
    isPublished: true,
  },
  {
    title: 'The Benefits of Meditation: Enhancing Mindfulness and Well-being',
    slug: 'the-benefits-of-meditation-enhancing-mindfulness-and-well-being',
    content:
      "<h1>The Benefits of Meditation: Enhancing Mindfulness and Well-being</h1><p>Meditation is a practice that has been embraced for centuries, offering numerous benefits for the mind, body, and spirit. In this blog post, we will explore the transformative effects of meditation and how it can enhance mindfulness and overall well-being.</p><h2>1. Stress Reduction</h2><p>Meditation is an effective tool for managing stress. By focusing the mind and practicing deep breathing techniques, meditation helps activate the body's relaxation response, reducing stress hormone levels and promoting a sense of calm and inner peace.</p><h2>2. Improved Mental Clarity</h2><p>Regular meditation practice enhances mental clarity and improves cognitive function. It helps quiet the mind, reduce mental chatter, and increase focus and concentration. This heightened clarity allows for better decision-making and problem-solving abilities.</p><h2>3. Emotional Well-being</h2><p>Meditation cultivates emotional resilience and promotes a positive outlook. It helps individuals develop a greater sense of self-awareness, allowing them to observe and acknowledge their emotions without judgment. This increased emotional intelligence leads to better emotional regulation and a greater capacity for happiness and contentment.</p><h2>4. Physical Health Benefits</h2><p>Meditation is not only beneficial for mental and emotional well-being but also for physical health. Research suggests that regular meditation practice can reduce blood pressure, improve cardiovascular health, boost the immune system, and enhance overall physical well-being.</p><h2>5. Enhanced Mindfulness</h2><p>Meditation is an effective way to cultivate mindfulness, which involves paying attention to the present moment without judgment. By practicing mindfulness through meditation, individuals can develop a greater sense of awareness and appreciation for each moment, leading to a more fulfilling and meaningful life.</p><h2>Conclusion</h2><p>Incorporating meditation into your daily routine can have profound effects on your overall well-being. By reducing stress, improving mental clarity, enhancing emotional well-being, promoting physical health, and cultivating mindfulness, meditation empowers individuals to live more balanced, fulfilling lives.</p>",
    featuredImage: 'https://picsum.photos/1200/628',
    categories: [7, 11],
    isPublished: true,
  },
]

const STUDENT_DATA = {
  email: 'student@nestlms.com',
  password: 'password',
  firstName: 'Student',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const ADMIN_DATA = {
  email: 'admin@nestlms.com',
  password: 'password',
  firstName: 'Admin',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const INSTRUCTOR_DATA = {
  email: 'instructor@nestlms.com',
  password: 'password',
  firstName: 'Instructor',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const studentForbiddenPermissions = [
  {
    table: 'Role',
    title: TableAccess.READ,
  },
  {
    table: 'Role',
    title: TableAccess.DELETE,
  },
  {
    table: 'Role',
    title: TableAccess.WRITE,
  },
  {
    table: 'Permission',
    title: TableAccess.READ,
  },
  {
    table: 'Permission',
    title: TableAccess.DELETE,
  },
  {
    table: 'Permission',
    title: TableAccess.WRITE,
  },
  {
    table: 'User',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.WRITE,
  },
  {
    table: 'Course',
    title: TableAccess.WRITE,
  },
  {
    table: 'Course',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseCategory',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseCategory',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseLevel',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseLevel',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.READ,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseTag',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseTag',
    title: TableAccess.DELETE,
  },
  {
    table: 'Login',
    title: TableAccess.DELETE,
  },
  {
    table: 'Module',
    title: TableAccess.WRITE,
  },
  {
    table: 'Module',
    title: TableAccess.DELETE,
  },
  {
    table: 'Quiz',
    title: TableAccess.WRITE,
  },
  {
    table: 'Quiz',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestion',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizQuestion',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestionOption',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizQuestionOption',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestionType',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizQuestionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Resource',
    title: TableAccess.WRITE,
  },
  {
    table: 'Resource',
    title: TableAccess.DELETE,
  },
  {
    table: 'ResourceType',
    title: TableAccess.WRITE,
  },
  {
    table: 'ResourceType',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizType',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Subscription',
    title: TableAccess.WRITE,
  },
  {
    table: 'Subscription',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Unit',
    title: TableAccess.WRITE,
  },
  {
    table: 'Unit',
    title: TableAccess.DELETE,
  },
  {
    table: 'UnitType',
    title: TableAccess.WRITE,
  },
  {
    table: 'UnitType',
    title: TableAccess.DELETE,
  },
  {
    table: 'VerificationRequest',
    title: TableAccess.DELETE,
  },
  {
    table: 'BlogCategory',
    title: TableAccess.DELETE,
  },
]

const instructorForbiddenPermissions = [
  {
    table: 'Role',
    title: TableAccess.READ,
  },
  {
    table: 'Role',
    title: TableAccess.DELETE,
  },
  {
    table: 'Role',
    title: TableAccess.WRITE,
  },
  {
    table: 'Permission',
    title: TableAccess.READ,
  },
  {
    table: 'Permission',
    title: TableAccess.DELETE,
  },
  {
    table: 'Permission',
    title: TableAccess.WRITE,
  },
  {
    table: 'User',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseCategory',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseLevel',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseTag',
    title: TableAccess.DELETE,
  },
  {
    table: 'Login',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'ResourceType',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizType',
    title: TableAccess.WRITE,
  },
  {
    table: 'Subscription',
    title: TableAccess.WRITE,
  },
  {
    table: 'Subscription',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.READ,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Unit',
    title: TableAccess.WRITE,
  },
  {
    table: 'Unit',
    title: TableAccess.DELETE,
  },
  {
    table: 'UnitType',
    title: TableAccess.WRITE,
  },
  {
    table: 'UnitType',
    title: TableAccess.DELETE,
  },
  {
    table: 'VerificationRequest',
    title: TableAccess.DELETE,
  },
  {
    table: 'BlogCategory',
    title: TableAccess.DELETE,
  },
]

async function main() {
  let allTables: SchemaTable[] =
    await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

  allTables = allTables.filter((table) => table.table_name.at(0) !== '_')

  const tableNames = allTables.map((table) => table.table_name)

  //delete all the data in the database
  for await (const tableName of tableNames) {
    await prisma[tableName].deleteMany()
  }

  const permissionIds: number[] = []
  const instructorPermissionIds: number[] = []
  const studentPermissionIds: number[] = []

  const adminRole = await prisma.role.upsert({
    where: { title: 'Admin' },
    update: {},
    create: {
      title: 'Admin',
      description: 'This is the admin role',
    },
  })

  const studentRole = await prisma.role.upsert({
    where: { title: 'Student' },
    update: {},
    create: {
      title: 'Student',
      description: 'This is the general and default role of a user',
    },
  })

  const instructorRole = await prisma.role.upsert({
    where: { title: 'Instructor' },
    update: {},
    create: {
      title: 'Instructor',
      description: 'An instructor can create courses and lessons',
    },
  })

  const developerRole = await prisma.role.upsert({
    where: { title: 'Developer' },
    update: {},
    create: {
      title: 'Developer',
      description: 'A developer has access to all the tables',
    },
  })

  // create and assign permission to admin for each table
  for (const tableName of tableNames) {
    const writePermission = await prisma.permission.create({
      data: {
        title: TableAccess.WRITE,
        table: tableName,
        description: `This permission allows WRITE access to the ${tableName} table`,
      },
    })
    permissionIds.push(writePermission.id)
    if (
      !instructorForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.WRITE
      )
    ) {
      instructorPermissionIds.push(writePermission.id)
    }
    if (
      !studentForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.WRITE
      )
    ) {
      studentPermissionIds.push(writePermission.id)
    }

    const readPermission = await prisma.permission.create({
      data: {
        title: TableAccess.READ,
        table: tableName,
        description: `This permission allows READ access to the ${tableName} table`,
      },
    })
    permissionIds.push(readPermission.id)
    if (
      !instructorForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.READ
      )
    ) {
      instructorPermissionIds.push(readPermission.id)
    }
    if (
      !studentForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.READ
      )
    ) {
      studentPermissionIds.push(readPermission.id)
    }

    const deletePermission = await prisma.permission.create({
      data: {
        title: TableAccess.DELETE,
        table: tableName,
        description: `This permission allows DELETE access to the ${tableName} table`,
      },
    })

    permissionIds.push(deletePermission.id)
    if (
      !instructorForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.DELETE
      )
    ) {
      instructorPermissionIds.push(deletePermission.id)
    }
    if (
      !studentForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.DELETE
      )
    ) {
      studentPermissionIds.push(deletePermission.id)
    }
  }

  // assign permissions to admin role
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: permissionIds.map((id) => ({ id })),
      },
    },
  })

  // assign permissions to instructor role
  await prisma.role.update({
    where: { id: instructorRole.id },
    data: {
      permissions: {
        connect: instructorPermissionIds.map((id) => ({ id })),
      },
    },
  })

  // assign permissions to student role
  await prisma.role.update({
    where: { id: studentRole.id },
    data: {
      permissions: {
        connect: studentPermissionIds.map((id) => ({ id })),
      },
    },
  })

  // assign permissions to developer role
  await prisma.role.update({
    where: { id: developerRole.id },
    data: {
      permissions: {
        connect: permissionIds.map((id) => ({ id })),
      },
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_DATA.email },
    update: {},
    create: {
      email: ADMIN_DATA.email,
      password: await argon.hash(ADMIN_DATA.password),
      phone: ADMIN_DATA.phone,
      isVerified: ADMIN_DATA.isVerified,
      roles: {
        connect: {
          id: adminRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: ADMIN_DATA.firstName,
          lastName: ADMIN_DATA.lastName,
        },
      },
    },
  })

  const studentUser = await prisma.user.upsert({
    where: { email: STUDENT_DATA.email },
    update: {},
    create: {
      email: STUDENT_DATA.email,
      password: await argon.hash(STUDENT_DATA.password),
      phone: STUDENT_DATA.phone,
      roles: {
        connect: {
          id: studentRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: STUDENT_DATA.firstName,
          lastName: STUDENT_DATA.lastName,
        },
      },
    },
  })

  const instructorUser = await prisma.user.upsert({
    where: { email: INSTRUCTOR_DATA.email },
    update: {},
    create: {
      email: INSTRUCTOR_DATA.email,
      password: await argon.hash(INSTRUCTOR_DATA.password),
      phone: INSTRUCTOR_DATA.phone,
      roles: {
        connect: {
          id: instructorRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: INSTRUCTOR_DATA.firstName,
          lastName: INSTRUCTOR_DATA.lastName,
        },
      },
    },
  })

  //create all the categories
  await prisma.blogCategory.createMany({
    data: blogCategories,
    skipDuplicates: true,
  })

  const firstCategory = await prisma.blogCategory.findFirst()
  const firstCategoryId = firstCategory.id - 1 // to match with the static ids

  //create all the blog posts using loop
  blogPosts.slice(0, 5).forEach(async (blogPost) => {
    await prisma.blog.create({
      data: {
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        featuredImage: blogPost.featuredImage,
        isPublished: blogPost.isPublished,
        publishedAt: blogPost.isPublished ? new Date() : null,
        categories: {
          connect: blogPost.categories.map((categoryId) => ({
            id: categoryId + firstCategoryId,
          })),
        },
        author: {
          connect: {
            id: adminUser.id,
          },
        },
      },
    })
  })

  blogPosts.slice(5, 10).forEach(async (blogPost) => {
    await prisma.blog.create({
      data: {
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        featuredImage: blogPost.featuredImage,
        isPublished: blogPost.isPublished,
        publishedAt: blogPost.isPublished ? new Date() : null,
        categories: {
          connect: blogPost.categories.map((categoryId) => ({
            id: categoryId + firstCategoryId,
          })),
        },
        author: {
          connect: {
            id: adminUser.id,
          },
        },
      },
    })
  })

  blogPosts.slice(10, 15).forEach(async (blogPost) => {
    await prisma.blog.create({
      data: {
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        featuredImage: blogPost.featuredImage,
        isPublished: blogPost.isPublished,
        publishedAt: blogPost.isPublished ? new Date() : null,
        categories: {
          connect: blogPost.categories.map((categoryId) => ({
            id: categoryId + firstCategoryId,
          })),
        },
        author: {
          connect: {
            id: adminUser.id,
          },
        },
      },
    })
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })
