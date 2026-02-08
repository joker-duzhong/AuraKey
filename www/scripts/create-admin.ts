import bcrypt from 'bcryptjs';
import prisma from '../src/utils/prisma';

async function createAdmin() {
  try {
    const adminEmail = 'admin@aurakey.com';
    const adminPassword = 'Admin@123456';
    const adminUsername = 'Admin';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: adminEmail,
        deletedAt: null,
      },
    });

    if (existingAdmin) {
      console.log('✅ 管理员账户已存在');
      console.log(`   邮箱: ${adminEmail}`);
      console.log(`   账户: ${adminUsername}`);
      console.log(`   角色: ${existingAdmin.role}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✨ 管理员账户创建成功！');
    console.log('\n📋 账户信息:');
    console.log(`   邮箱: ${adminEmail}`);
    console.log(`   密码: ${adminPassword}`);
    console.log(`   账户: ${adminUsername}`);
    console.log(`   角色: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);
    console.log('\n⚠️  请妥善保管登录凭证，建议首次登录后修改密码');
  } catch (error) {
    console.error('❌ 创建管理员失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
