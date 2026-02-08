export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  width: number;
  height: number;
  category: string;
  prompt: string;
  model: string;
  ratio: string;
  resolution: string;
  createdAt: string;
  refImages?: string[];
}

const baseData: Omit<GalleryItem, 'id'>[] = [
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    title: '抽象流动色彩',
    author: '设计师-Ziv',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    likes: 1284,
    width: 400,
    height: 600,
    category: 'Newest',
    prompt: '抽象流动色彩, 极简主义, 3D渲染, 柔和的光影效果, 渐变紫色与蓝色, 高动态范围, 虚化的背景, 极简, 艺术感, 4k, 电影级光效, Honey@马丁, 概念艺术, Dribbble 风格, C4D 制作',
    model: 'Seeddream4.0',
    ratio: '2:3',
    resolution: '1024x1536',
    createdAt: '2024.03.20',
    refImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
      'https://images.unsplash.com/photo-1557683316-973673baf926'
    ]
  },
  {
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    title: '极光渐变背景',
    author: 'AI Artist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    likes: 856,
    width: 400,
    height: 400,
    category: 'Hot',
    prompt: '梦幻极光色彩渐变, 抽象背景, 极简主义, 高端质感',
    model: 'Seeddream4.0',
    ratio: '1:1',
    resolution: '1024x1024',
    createdAt: '2024.03.19'
  },
  {
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    title: '深色波浪纹理',
    author: 'Ocean Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    likes: 342,
    width: 400,
    height: 500,
    category: 'Newest',
    prompt: '深蓝色海洋波浪纹理, 丝绸质感, 微距摄影, 优雅律动',
    model: 'Seeddream4.0',
    ratio: '4:5',
    resolution: '1024x1280',
    createdAt: '2024.03.18'
  },
  {
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
    title: '黑白极简几何',
    author: 'Minimalist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    likes: 2470,
    width: 400,
    height: 300,
    category: 'Hot',
    prompt: '黑白抽象几何图形, 包豪斯风格, 极简构成, 平面设计',
    model: 'Seeddream4.0',
    ratio: '4:3',
    resolution: '1280x960',
    createdAt: '2024.03.17'
  },
  {
    url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    title: '多彩水彩飞溅',
    author: 'CreativeMind',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miki',
    likes: 567,
    width: 400,
    height: 600,
    category: 'Newest',
    prompt: '多彩水彩颜料飞溅, 艺术感, 动感十足, 白色背景',
    model: 'Seeddream4.0',
    ratio: '2:3',
    resolution: '1024x1536',
    createdAt: '2024.03.16'
  },
  {
    url: 'https://images.unsplash.com/photo-1550159930-4014eb114397',
    title: '霓虹都市掠影',
    author: 'CyberPunk',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    likes: 1230,
    width: 400,
    height: 550,
    category: 'Hot',
    prompt: '赛博朋克风格都市街道, 霓虹灯光, 下雨的夜晚, 电影质感',
    model: 'Seeddream4.0',
    ratio: '1:1.375',
    resolution: '800x1100',
    createdAt: '2024.03.15'
  },
  {
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    title: '流体金属质感',
    author: 'FutureLab',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    likes: 890,
    width: 400,
    height: 480,
    category: 'Illustration',
    prompt: '流动液态金属, 银色反光, 超写实质感, 未来感',
    model: 'Seeddream4.0',
    ratio: '5:6',
    resolution: '1000x1200',
    createdAt: '2024.03.14'
  },
  {
    url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43',
    title: '云端梦境',
    author: 'SkyWalker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sky',
    likes: 670,
    width: 400,
    height: 350,
    category: 'Newest',
    prompt: '梦幻粉色云朵, 黄昏柔光, 唯美意境, 超现实主义',
    model: 'Seeddream4.0',
    ratio: '8:7',
    resolution: '1200x1050',
    createdAt: '2024.03.13'
  },
  {
    url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae',
    title: '森之呼吸',
    author: 'NatureLover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Forest',
    likes: 450,
    width: 400,
    height: 520,
    category: 'Newest',
    prompt: '深林晨光, 丁达尔效应, 治愈系绿色, 宁静氛围',
    model: 'Seeddream4.0',
    ratio: '10:13',
    resolution: '1000x1300',
    createdAt: '2024.03.12'
  }
];

// 扩充数据到24条
export const galleryData: GalleryItem[] = Array.from({ length: 24 }).map((_, index) => {
  const baseIndex = index % baseData.length;
  const item = baseData[baseIndex];
  return {
    ...item,
    id: `gallery-${index + 1}`,
    title: `${item.title} #${index + 1}`,
    // 稍微随机化点赞数，看起来更真实
    likes: Math.floor(item.likes * (0.8 + Math.random() * 0.4))
  };
});
