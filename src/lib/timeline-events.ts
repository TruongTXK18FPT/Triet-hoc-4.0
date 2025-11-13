export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export const timelineEvents: TimelineEvent[] = [
{
    year: '1776',
    title: 'Adam Smith xuất bản "Sự giàu có của các quốc gia"',
    description: 'Tác phẩm kinh điển đặt nền tảng cho kinh tế chính trị học tư sản cổ điển mà Marx sau này kế thừa và phê phán.',
  },
  {
    year: '1778',
    title: 'Jean-Jacques Rousseau qua đời',
    description: 'Tư tưởng của Rousseau về xã hội, bình đẳng và quyền con người ảnh hưởng sâu sắc đến chủ nghĩa xã hội không tưởng.',
  },
  {
    year: '1798',
    title: 'Thomas Malthus xuất bản "Luận về dân số"',
    description: 'Quan điểm bi quan về dân số của Malthus trở thành đối tượng phê phán trong các tác phẩm của Marx.',
  },

  // 👶 Thời kỳ Marx – Engels
  {
    year: '1818',
    title: 'Karl Marx ra đời',
    description: 'Karl Marx sinh ngày 5 tháng 5 tại Trier, Phổ (nay là Đức).',
  },
  {
    year: '1820',
    title: 'Friedrich Engels ra đời',
    description: 'Friedrich Engels sinh ngày 28 tháng 11 tại Barmen, Phổ (nay là Đức).',
  },
  {
    year: '1844',
    title: 'Bản thảo kinh tế – triết học 1844',
    description: 'Marx viết một trong những tác phẩm đầu tiên phân tích về sự tha hóa của lao động trong chủ nghĩa tư bản.',
  },
  {
    year: '1845',
    title: 'Luận cương về Feuerbach',
    description: 'Marx viết 11 luận cương ngắn gọn, nổi tiếng với câu "Các nhà triết học chỉ giải thích thế giới, song vấn đề là cải tạo thế giới."',
  },
  {
    year: '1848',
    title: 'Tuyên ngôn của Đảng Cộng sản',
    description: 'Marx và Engels công bố tác phẩm vĩ đại, kêu gọi giai cấp vô sản đoàn kết đấu tranh.',
  },
  {
    year: '1850',
    title: 'Phong trào cách mạng châu Âu thất bại',
    description: 'Sau làn sóng cách mạng 1848, Marx và Engels rút ra nhiều bài học về vai trò của giai cấp công nhân.',
  },
  {
    year: '1859',
    title: 'Góp phần phê phán khoa kinh tế chính trị',
    description: 'Marx nêu cơ sở duy vật lịch sử – cơ sở hạ tầng kinh tế quyết định kiến trúc thượng tầng xã hội.',
  },
  {
    year: '1864',
    title: 'Thành lập Quốc tế I',
    description: 'Hiệp hội công nhân quốc tế ra đời tại London, đánh dấu sự liên kết của giai cấp công nhân toàn cầu.',
  },
  {
    year: '1867',
    title: 'Tư bản – Quyển I',
    description: 'Marx xuất bản công trình phân tích sâu sắc về giá trị thặng dư và sự bóc lột trong sản xuất tư bản.',
  },
  {
    year: '1871',
    title: 'Công xã Paris',
    description: 'Chính quyền vô sản đầu tiên trong lịch sử nhân loại – bài học thực tiễn quý giá cho phong trào cộng sản quốc tế.',
  },
  {
    year: '1883',
    title: 'Karl Marx qua đời',
    description: 'Marx mất tại London, để lại di sản triết học và cách mạng đồ sộ.',
  },
  {
    year: '1885',
    title: 'Tư bản – Quyển II',
    description: 'Engels biên tập và xuất bản bản thảo về quá trình lưu thông của tư bản.',
  },
  {
    year: '1894',
    title: 'Tư bản – Quyển III',
    description: 'Engels hoàn thiện phần cuối cùng, trình bày tổng thể quá trình sản xuất tư bản chủ nghĩa.',
  },
  {
    year: '1895',
    title: 'Friedrich Engels qua đời',
    description: 'Kết thúc thời kỳ kinh điển của chủ nghĩa Marx.',
  },

  // 🌍 Thời Lenin
  {
    year: '1870',
    title: 'Vladimir Lenin ra đời',
    description: 'Lenin sinh ngày 22 tháng 4 tại Simbirsk, Nga.',
  },
  {
    year: '1902',
    title: '“Làm gì?”',
    description: 'Lenin viết về vai trò đảng tiên phong, đề cao tổ chức cách mạng chuyên nghiệp.',
  },
  {
    year: '1916',
    title: '“Chủ nghĩa đế quốc – giai đoạn tột cùng của chủ nghĩa tư bản”',
    description: 'Lenin phân tích bản chất kinh tế – chính trị của chủ nghĩa đế quốc.',
  },
  {
    year: '1917',
    title: '“Nhà nước và cách mạng”',
    description: 'Lenin phát triển lý luận về nhà nước vô sản và chuyên chính vô sản.',
  },
  {
    year: '1917',
    title: 'Cách mạng Tháng Mười Nga thành công',
    description: 'Lần đầu tiên giai cấp công nhân giành chính quyền và xây dựng nhà nước Xô viết.',
  },
  {
    year: '1920',
    title: '“Bệnh ấu trĩ tả” trong phong trào cộng sản',
    description: 'Lenin phê phán khuynh hướng giáo điều, kêu gọi linh hoạt chiến lược cách mạng.',
  },
  {
    year: '1924',
    title: 'Lenin qua đời',
    description: 'Để lại nền tảng cho chủ nghĩa Marx–Lenin.',
  },

  // 🏗 Thời Stalin và phát triển CNXH
  {
    year: '1936',
    title: 'Hiến pháp Xô viết mới',
    description: 'Stalin củng cố hệ thống chính trị XHCN đầu tiên trên thế giới.',
  },
  {
    year: '1945',
    title: 'Chiến thắng phát xít Đức',
    description: 'Liên Xô trở thành siêu cường và hình mẫu XHCN cho nhiều quốc gia.',
  },
  {
    year: '1953',
    title: 'Joseph Stalin qua đời',
    description: 'Mở đầu thời kỳ cải tổ trong phong trào cộng sản quốc tế.',
  },
  {
    year: '1959',
    title: 'Cách mạng Cuba thành công',
    description: 'Fidel Castro thiết lập nhà nước XHCN ở Tây bán cầu – bước lan tỏa mới của chủ nghĩa Marx–Lenin.',
  },

  // 🇻🇳 Phát triển tại Việt Nam
  {
    year: '1890',
    title: 'Hồ Chí Minh ra đời',
    description: 'Chủ tịch Hồ Chí Minh – người tiếp thu, phát triển sáng tạo chủ nghĩa Marx–Lenin vào thực tiễn Việt Nam.',
  },
  {
    year: '1930',
    title: 'Thành lập Đảng Cộng sản Việt Nam',
    description: 'Đánh dấu sự kết hợp giữa chủ nghĩa Marx–Lenin và phong trào công nhân – yêu nước Việt Nam.',
  },
  {
    year: '1945',
    title: 'Cách mạng Tháng Tám',
    description: 'Đảng Cộng sản Việt Nam lãnh đạo nhân dân giành độc lập, lập nên nước Việt Nam Dân chủ Cộng hòa.',
  },
  {
    year: '1954',
    title: 'Chiến thắng Điện Biên Phủ',
    description: 'Minh chứng cho sức mạnh của đường lối cách mạng vô sản và tinh thần độc lập dân tộc.',
  },
  {
    year: '1975',
    title: 'Thống nhất đất nước Việt Nam',
    description: 'Giải phóng miền Nam, hoàn thành cách mạng dân tộc dân chủ nhân dân, mở đường cho CNXH.',
  },
  {
    year: '1986',
    title: 'Công cuộc Đổi mới ở Việt Nam',
    description: 'Đảng ta vận dụng và phát triển sáng tạo chủ nghĩa Marx–Lenin trong điều kiện kinh tế thị trường định hướng XHCN.',
  },

  // 🌐 Thời kỳ quốc tế hóa – hiện đại hóa
  {
    year: '1991',
    title: 'Liên Xô tan rã',
    description: 'Biến cố lớn tác động đến phong trào cộng sản quốc tế, đặt ra yêu cầu nhìn lại lý luận và thực tiễn CNXH.',
  },
  {
    year: '2001',
    title: 'Việt Nam thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên CNXH',
    description: 'Khẳng định kiên định con đường xã hội chủ nghĩa và vận dụng sáng tạo chủ nghĩa Marx–Lenin.',
  },
  {
    year: '2011',
    title: 'Đại hội XI ĐCSVN',
    description: 'Tiếp tục khẳng định nền tảng tư tưởng của Đảng là chủ nghĩa Marx–Lenin và tư tưởng Hồ Chí Minh.',
  },
  {
    year: '2021',
    title: 'Đại hội XIII ĐCSVN',
    description: 'Phát triển tư duy lý luận về CNXH và con đường đi lên CNXH ở Việt Nam thời đại 4.0.',
  },
  {
    year: '2023',
    title: 'Kỷ niệm 175 năm "Tuyên ngôn của Đảng Cộng sản"',
    description: 'Các học giả quốc tế tái khẳng định giá trị trường tồn của chủ nghĩa Marx trong thế kỷ XXI.',
  },
  {
    year: '2025',
    title: 'Triết học 4.0 ra đời',
    description: 'Dự án số hóa tri thức triết học Mác–Lênin, kết hợp công nghệ AI và giáo dục, lan tỏa tư tưởng triết học đến thế hệ trẻ.',
  },
];
