import prisma from '../src/utils/prisma';

// Mock gallery data
const mockGalleryItems = [
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
  },
];

// Mock artist data
const mockArtists = [
  { name: 'Ilya Kuvshinov', previewUrl: 'https://images.unsplash.com/photo-1578632738908-482404df9790?w=800&q=80', tags: ['插画', '日系', '女性'] },
  { name: 'Greg Rutkowski', previewUrl: 'https://images.unsplash.com/photo-1583244532610-2ca27017246c?w=800&q=80', tags: ['奇幻', '油画', '史诗'] },
  { name: 'WLOP', previewUrl: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe5?w=800&q=80', tags: ['数码', '唯美', '光影'] },
  { name: 'Artgerm', previewUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80', tags: ['漫画', '角色', '写实'] },
  { name: 'Loish', previewUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80', tags: ['风格化', '色彩', '数码'] },
  { name: 'Alphonse Mucha', previewUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', tags: ['新艺术', '复古', '花卉'] },
  { name: 'Makoto Shinkai', previewUrl: 'https://images.unsplash.com/photo-1576770149142-6469d701ee5d?w=800&q=80', tags: ['背景', '光影', '电影感'] },
  { name: 'Hayao Miyazaki', previewUrl: 'https://images.unsplash.com/photo-1551728510-9b378f88801d?w=800&q=80', tags: ['吉卜力', '童话', '自然'] },
  { name: 'Zdzisław Beksiński', previewUrl: 'https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800&q=80', tags: ['超现实', '哥特', '黑暗'] },
  { name: 'HR Giger', previewUrl: 'https://images.unsplash.com/photo-1508898578281-774ad7093858?w=800&q=80', tags: ['生化机械', '异形', '黑暗'] },
];

async function main() {
  console.log('🌱 开始初始化数据库...\n');

  try {
    // Clear existing data
    await prisma.galleryItem.deleteMany();
    await prisma.artist.deleteMany();
    await prisma.category.deleteMany();
    await prisma.sref.deleteMany();
    console.log('🗑️  已清空现有数据\n');

    // Seed gallery items
    console.log('📸 导入画廊数据...');
    for (const item of mockGalleryItems) {
      await prisma.galleryItem.create({
        data: item,
      });
    }
    console.log(`✅ 成功导入 ${mockGalleryItems.length} 个画廊项目\n`);

    // Seed artists
    console.log('🎨 导入艺术家数据...');
    for (const artist of mockArtists) {
      await prisma.artist.create({
        data: artist,
      });
    }
    console.log(`✅ 成功导入 ${mockArtists.length} 个艺术家\n`);

    // Seed categories
    console.log('📚 导入分类数据...');
    const categories = [
      {
        mainCategory: '主体 (Subject)',
        subCategories: [
          {
            name: '人物 (Character)',
            phrases: ['Q版古典女神', 'BJD人偶', '女主角', '男性', '帅哥', '美女'],
            items: [
              { id: '1', name: 'Q版古典女神', tags: ['Q版', '古典'], cover: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' },
              { id: '2', name: 'BJD人偶', tags: ['人偶', '二次元'], cover: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5' },
              { id: '3', name: '女主角', tags: ['主角', '女性'], cover: 'https://images.unsplash.com/photo-1554151228-14d9def656e4' },
            ],
          },
          {
            name: '风景 (Landscape)',
            phrases: ['森林', '海滩', '山峰', '城市', '沙漠'],
            items: [
              { id: '4', name: '森林', tags: ['自然', '绿色'], cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' },
              { id: '5', name: '海滩', tags: ['海洋', '度假'], cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
            ],
          },
        ],
      },
      {
        mainCategory: '风格 (Style)',
        subCategories: [
          {
            name: '艺术风格 (Art Style)',
            phrases: ['油画', '水彩', '插画', '摄影', 'CG渲染'],
            items: [
              { id: '6', name: '油画', tags: ['艺术', '古典'], cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5' },
              { id: '7', name: '水彩', tags: ['艺术', '清新'], cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab' },
            ],
          },
        ],
      },
      {
        mainCategory: '构图 (Composition)',
        subCategories: [
          {
            name: '视角 (Perspective)',
            phrases: ['俯视', '仰视', '全景', '特写', '侧面'],
            items: [
              { id: '8', name: '全景', tags: ['宽阔', '远景'] },
              { id: '9', name: '特写', tags: ['细节', '近景'] },
            ],
          },
        ],
      },
    ];

    for (const cat of categories) {
      await prisma.category.create({
        data: {
          mainCategory: cat.mainCategory,
          subCategories: cat.subCategories as any,
        },
      });
    }
    console.log(`✅ 成功导入 ${categories.length} 个分类\n`);

    // Seed srefs
    console.log('🎯 导入Sref风格码...');
    const srefs = [
      { code: '--sref 2589833958', previewUrl: 'https://explore.promptsref.com/2589833958-img-1-7c278ee1', tags: ['Comic book', 'Flat vector', 'Cartoon'] },
      { code: '--sref 1792769083', previewUrl: 'https://explore.promptsref.com/1792769083-img-1-7983bde7', tags: ['Dark fantasy', 'Line art', 'Vintage'] },
      { code: '--sref 1062086682', previewUrl: 'https://explore.promptsref.com/1062086682-img-1-ece58748', tags: ['Anime', 'Dark fantasy', 'Illustration'] },
      { code: '--sref 3375027477', previewUrl: 'https://explore.promptsref.com/3375027477-img-1-d98f83c9', tags: ['Illustration', 'Flat vector', 'Line art'] },
      { code: '--sref 2296227149', previewUrl: 'https://explore.promptsref.com/2296227149-img-1-d97b83bc', tags: ['Ukiyo-e', 'Dark fantasy', 'Illustration'] },
      { code: '--sref 3039995348', previewUrl: 'https://explore.promptsref.com/3039995348-img-1-c95fd13f', tags: ['Anime', 'Golden', 'Dark fantasy'] },
      { code: '--sref 525536268', previewUrl: 'https://explore.promptsref.com/525536268-img-1-9500cca0', tags: ['Illustration', 'Comic book', 'Line art'] },
      { code: '--sref 1470170', previewUrl: 'https://explore.promptsref.com/1470170-img-1-6e1e1c55', tags: ['Illustration', 'Children\'s book', 'Cute'] },
      { code: '--sref 92842409', previewUrl: 'https://explore.promptsref.com/92842409-img-1-577a7a3a', tags: ['Manga art', 'Anime', 'Pink'] },
      { code: '--sref 461507035', previewUrl: 'https://explore.promptsref.com/461507035-img-1-0157c5a1', tags: ['Illustration', 'Vintage', 'Pop', 'Blue'] },
    ];

    for (const sref of srefs) {
      await prisma.sref.create({
        data: sref,
      });
    }
    console.log(`✅ 成功导入 ${srefs.length} 个Sref风格码\n`);

    console.log('✨ 数据库初始化完成！');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
