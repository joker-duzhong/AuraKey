/**
 * API 连接测试脚本
 * 在浏览器控制台中运行，测试所有 API 端点
 */

// 测试 Gallery API
async function testGalleryAPI() {
  console.log('=== 测试 Gallery API ===\n');

  try {
    // 1. 获取所有项目
    console.log('1️⃣ 获取所有画廊项目...');
    const response = await fetch('http://localhost:3000/api/gallery');
    const data = await response.json();
    console.log('✅ 成功:', data);

    if (data.data && data.data.length > 0) {
      const firstItem = data.data[0];
      console.log(`   找到 ${data.data.length} 个项目`);

      // 2. 获取单个项目
      console.log(`\n2️⃣ 获取单个项目 (ID: ${firstItem.id})...`);
      const itemResponse = await fetch(`http://localhost:3000/api/gallery/${firstItem.id}`);
      const itemData = await itemResponse.json();
      console.log('✅ 成功:', itemData);

      // 3. 点赞项目
      console.log(`\n3️⃣ 点赞项目 (ID: ${firstItem.id})...`);
      const likeResponse = await fetch(`http://localhost:3000/api/gallery/${firstItem.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const likeData = await likeResponse.json();
      console.log('✅ 成功:', likeData);
    }
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// 测试 Artist API
async function testArtistAPI() {
  console.log('\n=== 测试 Artist API ===\n');

  try {
    // 1. 获取所有艺术家
    console.log('1️⃣ 获取所有艺术家...');
    const response = await fetch('http://localhost:3000/api/artists');
    const data = await response.json();
    console.log('✅ 成功:', data);

    if (data.data && data.data.length > 0) {
      const firstArtist = data.data[0];
      console.log(`   找到 ${data.data.length} 个艺术家`);

      // 2. 获取单个艺术家
      console.log(`\n2️⃣ 获取单个艺术家 (ID: ${firstArtist.id})...`);
      const artistResponse = await fetch(`http://localhost:3000/api/artists/${firstArtist.id}`);
      const artistData = await artistResponse.json();
      console.log('✅ 成功:', artistData);

      // 3. 按名称搜索
      console.log(`\n3️⃣ 按名称搜索艺术家 (名称: ${firstArtist.name})...`);
      const searchResponse = await fetch(
        `http://localhost:3000/api/artists/search/by-name?name=${encodeURIComponent(firstArtist.name)}`
      );
      const searchData = await searchResponse.json();
      console.log('✅ 成功:', searchData);
    }
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// 测试前端 Service
async function testFrontendServices() {
  console.log('\n=== 测试前端 Service ===\n');

  try {
    // 动态导入 service（需要在 React 应用中运行）
    console.log('1️⃣ 测试 Gallery Service...');
    
    // 在浏览器控制台中，您可以直接测试已加载的模块
    // 这需要在您的应用中暴露这些函数，或在开发工具中使用

    console.log(`
    为了完整测试，请在应用中运行以下代码：

    import { getAllGalleryItems } from '@/services/gallery.service';
    import { getAllArtists } from '@/services/artist.service';

    // 测试
    const items = await getAllGalleryItems();
    console.log('Gallery items:', items);

    const artists = await getAllArtists();
    console.log('Artists:', artists);
    `);
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始 API 连接测试...\n');
  
  await testGalleryAPI();
  await testArtistAPI();
  await testFrontendServices();

  console.log('\n✨ 测试完成！');
}

// 导出供使用
window.apiTests = {
  testGalleryAPI,
  testArtistAPI,
  testFrontendServices,
  runAllTests
};

console.log(`
📝 API 测试工具已加载！

使用以下命令进行测试：
- window.apiTests.runAllTests()          # 运行所有测试
- window.apiTests.testGalleryAPI()       # 测试 Gallery API
- window.apiTests.testArtistAPI()        # 测试 Artist API
- window.apiTests.testFrontendServices() # 测试前端 Service
`);
