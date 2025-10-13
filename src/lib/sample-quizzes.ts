export type Quiz = {
    slug: string;
    title: string;
    description: string;
    questions: {
        id: string;
        text: string;
        options: {
            id: string;
            text: string;
        }[];
        correctOptionId: string;
    }[];
};

export const sampleQuizzes: Quiz[] = [
  {
    slug: 'phep-bien-chung-duy-vat',
    title: 'Phép biện chứng duy vật',
    description: 'Kiểm tra kiến thức của bạn về các nguyên lý, quy luật và phạm trù cơ bản của phép biện chứng duy vật.',
    questions: [
      {
        id: 'q1',
        text: 'Theo chủ nghĩa Mác-Lênin, hai nguyên lý cơ bản của phép biện chứng duy vật là gì?',
        options: [
          { id: 'o1', text: 'Nguyên lý về mối liên hệ phổ biến và nguyên lý về sự phát triển.' },
          { id: 'o2', text: 'Nguyên lý về vật chất và ý thức.' },
          { id: 'o3', text: 'Nguyên lý về tồn tại xã hội và ý thức xã hội.' },
          { id: 'o4', text: 'Nguyên lý về đấu tranh giai cấp và cách mạng xã hội.' },
        ],
        correctOptionId: 'o1',
      },
      {
        id: 'q2',
        text: 'Quy luật nào được Lênin coi là "hạt nhân" của phép biện chứng?',
        options: [
          { id: 'o1', text: 'Quy luật từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại.' },
          { id: 'o2', text: 'Quy luật thống nhất và đấu tranh của các mặt đối lập.' },
          { id: 'o3', text: 'Quy luật phủ định của phủ định.' },
          { id: 'o4', text: 'Quy luật về sự phù hợp của quan hệ sản xuất với tính chất và trình độ của lực lượng sản xuất.' },
        ],
        correctOptionId: 'o2',
      },
      {
        id: 'q3',
        text: 'Cặp phạm trù nào sau đây thể hiện mối quan hệ giữa cái riêng và cái chung?',
        options: [
          { id: 'o1', text: 'Nguyên nhân và kết quả' },
          { id: 'o2', text: 'Bản chất và hiện tượng' },
          { id: 'o3', text: 'Tất nhiên và ngẫu nhiên' },
          { id: 'o4', text: 'Cái đơn nhất và cái phổ biến' },
        ],
        correctOptionId: 'o4',
      },
    ],
  },
  {
    slug: 'chu-nghia-duy-vat-lich-su',
    title: 'Chủ nghĩa duy vật lịch sử',
    description: 'Kiến thức về các khái niệm cơ bản của chủ nghĩa duy vật lịch sử như sản xuất vật chất, lực lượng sản xuất, và hình thái kinh tế - xã hội.',
    questions: [
        {
            id: 'q1',
            text: 'Yếu tố nào được coi là cơ bản nhất, quyết định sự tồn tại và phát triển của xã hội?',
            options: [
                {id: 'o1', text: 'Sản xuất vật chất'},
                {id: 'o2', text: 'Yếu tố địa lý'},
                {id: 'o3', text: 'Yếu tố dân số'},
                {id: 'o4', text: 'Ý thức xã hội'},
            ],
            correctOptionId: 'o1',
        },
        {
            id: 'q2',
            text: 'Lực lượng sản xuất bao gồm những yếu tố nào?',
            options: [
                {id: 'o1', text: 'Người lao động và công cụ lao động'},
                {id: 'o2', text: 'Tư liệu sản xuất và quan hệ sản xuất'},
                {id: 'o3', text: 'Cơ sở hạ tầng và kiến trúc thượng tầng'},
                {id: 'o4', text: 'Giai cấp và nhà nước'},
            ],
            correctOptionId: 'o1'
        }
    ],
  },
];
