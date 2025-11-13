import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Danh sách họ Việt Nam phổ biến
const lastNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Đào', 'Trương', 'Mai',
  'Lâm', 'Tô', 'Cao', 'Thái', 'Hà', 'Lưu', 'Chu', 'Tạ', 'Vương', 'Đinh'
];

// Danh sách tên đệm và tên Việt Nam phổ biến
const middleNames = [
  'Văn', 'Thị', 'Đức', 'Minh', 'Quang', 'Thành', 'Hữu', 'Công', 'Đình', 'Xuân',
  'Hoàng', 'Thế', 'Bảo', 'Anh', 'Tuấn', 'Hải', 'Đăng', 'Việt', 'Trung', 'Phú'
];

const firstNames = [
  'An', 'Bình', 'Chi', 'Dũng', 'Đức', 'Giang', 'Hà', 'Hải', 'Hùng', 'Khang',
  'Lan', 'Linh', 'Long', 'Mai', 'Minh', 'Nam', 'Nga', 'Phong', 'Quang', 'Sơn',
  'Thảo', 'Thành', 'Thắng', 'Thi', 'Thu', 'Thư', 'Tiến', 'Trang', 'Trung', 'Tuấn',
  'Tùng', 'Việt', 'Vinh', 'Vy', 'Yến', 'Anh', 'Bảo', 'Cường', 'Dương', 'Hạnh',
  'Hiếu', 'Hoa', 'Huy', 'Khoa', 'Kiên', 'Lâm', 'Loan', 'My', 'Nghĩa', 'Phương',
  'Quân', 'Quyên', 'Sang', 'Tâm', 'Thanh', 'Thiện', 'Thủy', 'Trinh', 'Tú', 'Vân'
];

// Danh sách domain email phổ biến
const emailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'fpt.com', 'vnu.edu.vn', 'hust.edu.vn', 'hcmut.edu.vn', 'uit.edu.vn'
];

// Tạo tên đầy đủ Việt Nam
function generateVietnameseName(): string {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const middleName = Math.random() > 0.3 ? middleNames[Math.floor(Math.random() * middleNames.length)] + ' ' : '';
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${lastName} ${middleName}${firstName}`.trim();
}

// Tạo email hợp lệ
function generateEmail(name: string, index: number): string {
  const nameParts = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .split(' ')
    .filter(part => part.length > 0);
  
  const lastNamePart = nameParts[0];
  const firstNamePart = nameParts[nameParts.length - 1];
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  
  // Tạo email với nhiều format khác nhau
  const formats = [
    `${firstNamePart}.${lastNamePart}${index}`,
    `${lastNamePart}.${firstNamePart}${index}`,
    `${firstNamePart}${lastNamePart}${index}`,
    `${lastNamePart}${index}`,
    `${firstNamePart}${index}${Math.floor(Math.random() * 1000)}`
  ];
  
  const emailLocal = formats[Math.floor(Math.random() * formats.length)];
  return `${emailLocal}@${domain}`;
}

// Tạo avatar URL (sử dụng placeholder service)
function generateAvatarUrl(name: string): string {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`;
}

// Tạo ngày ngẫu nhiên trong khoảng
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🧹 Xóa dữ liệu users cũ (trừ admin)...\n');
  
  // Xóa users không có dữ liệu liên quan (posts, quizzes, comments)
  // Hoặc xóa users được tạo bởi seed (có email pattern từ seed)
  const usersToDelete = await prisma.user.findMany({
    where: {
      email: {
        not: 'admin@mln131.com'
      },
      posts: {
        none: {}
      },
      quizzes: {
        none: {}
      },
      comments: {
        none: {}
      }
    }
  });

  // Xóa từng user để tránh foreign key constraint
  let deletedCount = 0;
  for (const user of usersToDelete) {
    try {
      await prisma.user.delete({
        where: { id: user.id }
      });
      deletedCount++;
    } catch (error) {
      // Bỏ qua nếu không xóa được (có dữ liệu liên quan)
    }
  }
  
  console.log(`✅ Đã xóa ${deletedCount} users cũ (không có dữ liệu liên quan)\n`);

  console.log('🌱 Bắt đầu tạo 121 tài khoản người dùng...\n');

  const defaultPassword = 'Password123!'; // Password mặc định cho tất cả tài khoản
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const users = [];
  const startDate = new Date(2023, 0, 1); // 1/1/2023
  const endDate = new Date(); // Hiện tại

  for (let i = 1; i <= 121; i++) {
    const name = generateVietnameseName();
    const email = generateEmail(name, i);
    const image = generateAvatarUrl(name);
    
    // 70% tài khoản đã verify email
    const emailVerified = Math.random() > 0.3 
      ? randomDate(startDate, endDate) 
      : null;
    
    // 90% là USER, 8% là MOD, 2% là ADMIN
    let role: 'USER' | 'MOD' | 'ADMIN' = 'USER';
    const roleRand = Math.random();
    if (roleRand > 0.98) {
      role = 'ADMIN';
    } else if (roleRand > 0.90) {
      role = 'MOD';
    }

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          image,
          role,
          emailVerified,
          createdAt: randomDate(startDate, endDate),
        },
      });

      users.push(user);
      console.log(`✅ [${i}/121] Đã tạo: ${user.name} (${user.email}) - ${user.role}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Email đã tồn tại, thử lại với index khác
        console.log(`⚠️  Email ${email} đã tồn tại, bỏ qua...`);
      } else {
        console.error(`❌ Lỗi khi tạo user ${i}:`, error.message);
      }
    }
  }

  console.log(`\n🎉 Hoàn thành! Đã tạo ${users.length} tài khoản thành công.`);
  console.log(`\n📊 Thống kê:`);
  
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`   - USER: ${roleCounts.USER || 0}`);
  console.log(`   - MOD: ${roleCounts.MOD || 0}`);
  console.log(`   - ADMIN: ${roleCounts.ADMIN || 0}`);
  console.log(`   - Email verified: ${users.filter(u => u.emailVerified).length}`);
  console.log(`\n🔑 Password mặc định cho tất cả tài khoản: ${defaultPassword}`);
  console.log(`   (Vui lòng đổi password sau khi đăng nhập lần đầu)`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

