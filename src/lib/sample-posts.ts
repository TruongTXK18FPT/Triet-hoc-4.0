import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Post = {
  slug: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  date: string;
  imageUrl: string;
  imageHint: string;
  content: string; // Markdown content
};

export const samplePosts: Post[] = [
  {
    slug: 'giai-thich-ve-phep-bien-chung-duy-vat',
    title: 'Giải thích về Phép biện chứng duy vật',
    description: 'Một cái nhìn sâu sắc về một trong những trụ cột của triết học Mác-Lênin, khám phá các quy luật và nguyên tắc cốt lõi của nó.',
    author: 'Karl Marx',
    authorAvatar: '/avatars/marx.png',
    date: '15 Tháng 6, 2024',
    imageUrl: PlaceHolderImages.find(p => p.id === 'blog-post-1')?.imageUrl ?? 'https://picsum.photos/seed/blog1/1200/800',
    imageHint: 'Karl Marx statue',
    content: `
Phép biện chứng duy vật là "trái tim và linh hồn" của chủ nghĩa Mác. Không giống như phép biện chứng duy tâm của Hegel, vốn coi ý niệm là động lực của sự phát triển, Marx và Engels đã đặt phép biện chứng trên một nền tảng vật chất.

### Hai Nguyên lý Cơ bản
1.  **Nguyên lý về mối liên hệ phổ biến:** Mọi sự vật, hiện tượng trong thế giới đều tồn tại trong một mối liên hệ chặt chẽ, tác động và chuyển hóa lẫn nhau. Không có gì tồn tại một cách cô lập.
2.  **Nguyên lý về sự phát triển:** Sự phát triển là một quá trình tự thân, diễn ra không ngừng từ thấp đến cao, từ đơn giản đến phức tạp.

### Ba Quy luật Cơ bản
*   **Quy luật mâu thuẫn (Thống nhất và đấu tranh của các mặt đối lập):** Đây là "hạt nhân" của phép biện chứng, giải thích nguồn gốc, động lực của sự phát triển.
*   **Quy luật lượng - chất (Sự thay đổi về lượng dẫn đến sự thay đổi về chất và ngược lại):** Giải thích cách thức của sự phát triển.
*   **Quy luật phủ định của phủ định:** Giải thích xu hướng của sự phát triển, theo hình "xoáy ốc".

Hiểu được phép biện chứng duy vật là chìa khóa để phân tích các vấn đề xã hội, lịch sử và tự nhiên một cách khoa học.
`
  },
  {
    slug: 'su-tha-hoa-cua-lao-dong-trong-chu-nghia-tu-ban',
    title: 'Sự Tha hóa của Lao động trong Chủ nghĩa Tư bản',
    description: 'Phân tích của Marx về việc người lao động bị tách rời khỏi sản phẩm, quá trình lao động, bản chất và đồng loại của họ.',
    author: 'Friedrich Engels',
    authorAvatar: '/avatars/engels.png',
    date: '22 Tháng 6, 2024',
    imageUrl: PlaceHolderImages.find(p => p.id === 'blog-post-2')?.imageUrl ?? 'https://picsum.photos/seed/blog2/1200/800',
    imageHint: 'philosophy book',
    content: `
Trong *Bản thảo kinh tế-triết học năm 1844*, Karl Marx đã đưa ra một trong những khái niệm sâu sắc nhất của mình: **sự tha hóa của lao động**. Dưới chủ nghĩa tư bản, lao động không còn là sự thể hiện bản chất sáng tạo của con người mà trở thành một hoạt động xa lạ và áp bức.

Sự tha hóa này biểu hiện ở bốn khía cạnh:
1.  **Tha hóa khỏi sản phẩm lao động:** Người công nhân tạo ra sản phẩm nhưng nó không thuộc về họ, mà thuộc về nhà tư bản. Sản phẩm trở thành một thế lực xa lạ, thống trị chính người tạo ra nó.
2.  **Tha hóa khỏi hoạt động lao động:** Lao động không phải là tự nguyện mà là bắt buộc. Nó không mang lại sự hài lòng mà chỉ là phương tiện để tồn tại. Con người chỉ cảm thấy mình là chính mình khi không lao động.
3.  **Tha hóa khỏi bản chất con người:** Lao động sáng tạo là bản chất của loài người. Khi lao động bị tha hóa, con người cũng bị tha hóa khỏi chính bản chất của mình.
4.  **Tha hóa khỏi con người (đồng loại):** Mối quan hệ giữa người với người bị thay thế bằng quan hệ hàng-tiền, cạnh tranh và thù địch.

Sự tha hóa lao động là một phê phán mạnh mẽ đối với chủ nghĩa tư bản, cho thấy nó không chỉ gây ra bất công kinh tế mà còn làm tổn hại đến phẩm giá và tinh thần của con người.
`
  },
   {
    slug: 'vai-tro-cua-dau-tranh-giai-cap-trong-lich-su',
    title: 'Vai trò của Đấu tranh Giai cấp trong Lịch sử',
    description: 'Lịch sử của tất cả các xã hội tồn tại từ trước đến nay đều là lịch sử của các cuộc đấu tranh giai cấp. Cùng tìm hiểu câu nói nổi tiếng này.',
    author: 'Vladimir Lenin',
    authorAvatar: '/avatars/lenin.png',
    date: '01 Tháng 7, 2024',
    imageUrl: PlaceHolderImages.find(p => p.id === 'blog-post-3')?.imageUrl ?? 'https://picsum.photos/seed/blog3/1200/800',
    imageHint: 'social movement',
    content: `
Mở đầu *Tuyên ngôn của Đảng Cộng sản*, Marx và Engels đã khẳng định một câu nói kinh điển: "Lịch sử của tất cả các xã hội tồn tại từ trước đến nay đều là lịch sử của các cuộc đấu tranh giai cấp."

Câu nói này là nền tảng của **chủ nghĩa duy vật lịch sử**. Nó cho rằng động lực chính của sự thay đổi lịch sử không phải là ý chí của các vị vua, các nhà lãnh đạo hay các ý tưởng, mà là cuộc đấu tranh giữa các giai cấp xã hội có lợi ích kinh tế đối kháng nhau.

*   **Chủ nô và nô lệ** trong thời kỳ cổ đại.
*   **Chúa đất và nông nô** trong thời kỳ phong kiến.
*   **Giai cấp tư sản và giai cấp vô sản** trong thời kỳ tư bản.

Mỗi cuộc đấu tranh này đều kết thúc, hoặc bằng một cuộc cải tạo cách mạng toàn bộ xã hội, hoặc bằng sự diệt vong của các giai cấp đấu tranh với nhau. Đối với chủ nghĩa tư bản, cuộc đấu tranh giữa giai cấp tư sản và giai cấp vô sản được dự đoán sẽ dẫn đến một cuộc cách mạng vô sản, thiết lập một xã hội không còn giai cấp - xã hội cộng sản.
`
  }
];
