"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Heart,
  BookOpen,
  AlertCircle,
  Mail,
  Sparkles,
} from "lucide-react";

const commitments = [
  {
    icon: Heart,
    title: "1. Triết lý AI của chúng tôi",
    content: [
      "Tại Triết học 4.0, chúng tôi tin rằng trí tuệ nhân tạo không phải là sự thay thế con người, mà là một công cụ để mở rộng khả năng tư duy, sáng tạo và học hỏi của con người.",
      "AI không chỉ phản hồi – nó gợi mở tư duy, giúp người học tự khám phá bản chất của tri thức, giống như cách triết học dạy ta nhìn thế giới một cách toàn diện hơn.",
    ],
    quote:
      '"AI phục vụ tri thức – tri thức phục vụ con người." Đó là triết lý vận hành cốt lõi của Triết học 4.0.',
    color: "from-red-500 to-pink-600",
  },
  {
    icon: BookOpen,
    title: "2. Cam kết về tính trung thực học thuật",
    content: [
      "Chúng tôi cam kết rằng mọi hệ thống và mô-đun AI của Triết học 4.0:",
    ],
    points: [
      "🧠 Không thay thế hoạt động học tập và nghiên cứu của sinh viên, mà đóng vai trò trợ lý hướng dẫn, gợi ý và giải thích.",
      "📚 Tôn trọng giá trị khoa học và học thuật, đặc biệt với các môn như Triết học Mác–Lênin, Kinh tế chính trị, Chủ nghĩa xã hội khoa học.",
      "🔍 Nguồn tri thức được huấn luyện và chọn lọc từ các tài liệu học thuật, giáo trình chính thống và các nguồn mở đáng tin cậy.",
      "❌ Không tạo ra thông tin sai lệch, xuyên tạc hoặc có yếu tố chính trị, tôn giáo, định kiến.",
    ],
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "3. Cam kết về đạo đức và quyền riêng tư",
    content: ["Chúng tôi tuyệt đối tuân thủ các nguyên tắc đạo đức AI:"],
    points: [
      "🔒 Bảo vệ quyền riêng tư: Không lưu trữ, chia sẻ hay sử dụng dữ liệu cá nhân của người dùng cho bất kỳ mục đích thương mại nào.",
      "🪞 Minh bạch: Người dùng luôn biết khi nào họ đang tương tác với AI, và AI sẽ không giả dạng con người thật.",
      "⚙️ An toàn: Các mô hình AI được kiểm duyệt nội dung, loại bỏ các phản hồi mang tính xúc phạm, phân biệt đối xử hoặc sai lệch về giá trị.",
      "❤️ Nhân văn: Tất cả tương tác đều hướng đến xây dựng tư duy phản biện, nhân ái và hiểu biết.",
    ],
    color: "from-green-500 to-emerald-600",
  },
];

export default function AICommitmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-semibold">Cam kết AI</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-6 max-w-4xl mx-auto">
              Cam kết sử dụng Trí tuệ Nhân tạo một cách có trách nhiệm và nhân
              văn
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {commitments.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/95 backdrop-blur shadow-2xl border-2 border-slate-200"
                >
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`h-14 w-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                          🧭 {section.title}
                        </h2>
                        {section.content.map((text, i) => (
                          <p
                            key={i}
                            className="text-lg text-slate-700 leading-relaxed mb-3"
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>

                    {section.points && (
                      <div className="space-y-3 mt-6">
                        {section.points.map((point, i) => (
                          <div
                            key={i}
                            className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border-l-4 border-blue-400"
                          >
                            <p className="text-slate-800">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.quote && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300">
                        <p className="text-xl text-amber-900 italic font-medium">
                          {section.quote}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Additional Sections */}
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-slate-200">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-primary mb-6">
                  🔬 4. Cách chúng tôi sử dụng AI
                </h2>
                <p className="text-lg text-slate-700 mb-6">
                  Triết học 4.0 sử dụng AI trong các lĩnh vực:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "💬",
                      title: "Chatbot triết học",
                      desc: "Giúp người học đối thoại, thảo luận về triết học, kinh tế học, chủ nghĩa xã hội khoa học.",
                    },
                    {
                      icon: "📖",
                      title: "Tóm tắt tri thức",
                      desc: "Hỗ trợ tổng hợp nội dung, giải thích khái niệm phức tạp bằng ngôn ngữ dễ hiểu.",
                    },
                    {
                      icon: "🧩",
                      title: "Hỗ trợ học tập",
                      desc: "Gợi ý bài đọc, khái niệm liên quan, ví dụ thực tiễn, hoặc kết nối triết học với các lĩnh vực khác.",
                    },
                    {
                      icon: "✨",
                      title: "Truyền cảm hứng",
                      desc: "Giúp sinh viên tìm thấy niềm yêu thích trong việc học triết học và khoa học xã hội.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-700">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-purple-200">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <Sparkles className="h-10 w-10 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-primary mb-6">
                      🔍 4.1. Khả năng và chức năng của AI
                    </h2>
                    <p className="text-lg text-slate-700 mb-6">
                      Triết học 4.0 cung cấp các khả năng AI sau đây để hỗ trợ người học:
                    </p>

                    {/* 1.1 Tìm kiếm thông tin & tổng hợp kiến thức */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📚</span>{" "}
                        1.1. Tìm kiếm thông tin & tổng hợp kiến thức
                      </h3>
                      <div className="space-y-3 ml-8">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-slate-800 font-medium mb-2">
                            🔍 Tìm kiếm khái niệm triết học, kinh tế chính trị, CNXH khoa học
                          </p>
                          <p className="text-slate-700 text-sm">
                            AI có thể tìm kiếm và giải thích các khái niệm, thuật ngữ, lý thuyết trong các lĩnh vực Triết học Mác–Lênin, Kinh tế chính trị, và Chủ nghĩa xã hội khoa học.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-slate-800 font-medium mb-2">
                            📖 Tóm tắt tài liệu học thuật từ các nguồn chính thống
                          </p>
                          <p className="text-slate-700 text-sm">
                            Hỗ trợ tổng hợp và tóm tắt nội dung từ các giáo trình, tài liệu học thuật, nghiên cứu khoa học một cách chính xác và có hệ thống.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-slate-800 font-medium mb-2">
                            💡 Gợi ý nội dung liên quan để giúp người học mở rộng tri thức
                          </p>
                          <p className="text-slate-700 text-sm">
                            Đề xuất các chủ đề, khái niệm, tài liệu liên quan để người học có thể mở rộng và đào sâu kiến thức của mình.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 1.2 Hỗ trợ lên kế hoạch và phát triển ý tưởng */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">✍️</span>{" "}
                        1.2. Hỗ trợ lên kế hoạch và phát triển ý tưởng
                      </h3>
                      <div className="space-y-3 ml-8">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-slate-800 font-medium mb-2">
                            📋 Gợi ý cấu trúc bài thuyết trình, outline bài luận, câu hỏi thảo luận
                          </p>
                          <p className="text-slate-700 text-sm">
                            Hỗ trợ xây dựng khung nội dung, dàn ý chi tiết cho các bài thuyết trình, bài luận, và đề xuất câu hỏi thảo luận phù hợp với chủ đề.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-slate-800 font-medium mb-2">
                            🧠 Hỗ trợ brainstorm ý tưởng cho bài học, hoạt động nhóm, hoặc mô-đun hệ thống
                          </p>
                          <p className="text-slate-700 text-sm">
                            Gợi ý các ý tưởng sáng tạo cho việc thiết kế bài học, hoạt động nhóm, hoặc phát triển các tính năng mới cho hệ thống.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-slate-800 font-medium mb-2">
                            🎨 Đề xuất các phương pháp giảng dạy hoặc mô hình trực quan hóa nội dung triết học
                          </p>
                          <p className="text-slate-700 text-sm">
                            Gợi ý các cách thức trình bày, minh họa, và trực quan hóa các khái niệm triết học phức tạp để dễ hiểu hơn.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 1.3 Hỗ trợ kỹ thuật */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">⚙️</span>{" "}
                        1.3. Hỗ trợ kỹ thuật
                      </h3>
                      <div className="space-y-3 ml-8">
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-400">
                          <p className="text-slate-800 font-medium mb-2">
                            💻 Gợi ý giải pháp kỹ thuật cho lập trình hệ thống Triết học 4.0
                          </p>
                          <p className="text-slate-700 text-sm">
                            Đề xuất các giải pháp kỹ thuật, kiến trúc, và công nghệ phù hợp cho việc phát triển và cải tiến hệ thống.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-400">
                          <p className="text-slate-800 font-medium mb-2">
                            🔍 Hỗ trợ xem xét logic code, gợi ý cách xử lý lỗi hoặc cải tiến hiệu suất
                          </p>
                          <p className="text-slate-700 text-sm">
                            Giúp phân tích logic code, đề xuất cách xử lý lỗi, tối ưu hóa hiệu suất, và cải thiện chất lượng mã nguồn.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-400">
                          <p className="text-slate-800 font-medium mb-2">
                            📝 Tạo ví dụ code minh họa theo yêu cầu (không thay thế kỹ năng lập trình của sinh viên)
                          </p>
                          <p className="text-slate-700 text-sm">
                            Cung cấp các ví dụ code minh họa để hỗ trợ học tập, nhưng không thay thế quá trình học và thực hành lập trình của sinh viên.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 1.4 Gợi ý cách thức thực hiện nhiệm vụ */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🗺️</span>{" "}
                        1.4. Gợi ý cách thức thực hiện nhiệm vụ
                      </h3>
                      <div className="space-y-3 ml-8">
                        <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-l-4 border-pink-400">
                          <p className="text-slate-800 font-medium mb-2">
                            📌 Đưa ra hướng dẫn từng bước để triển khai tính năng, thực hiện nghiên cứu hoặc xây dựng nội dung
                          </p>
                          <p className="text-slate-700 text-sm">
                            Cung cấp hướng dẫn chi tiết, từng bước một để thực hiện các nhiệm vụ như phát triển tính năng, nghiên cứu, hoặc tạo nội dung học tập.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-l-4 border-pink-400">
                          <p className="text-slate-800 font-medium mb-2">
                            📚 Giải thích quy trình và phương pháp học tập cho người dùng
                          </p>
                          <p className="text-slate-700 text-sm">
                            Hướng dẫn các phương pháp học tập hiệu quả, quy trình nghiên cứu, và cách tiếp cận các vấn đề triết học một cách có hệ thống.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-amber-200">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="h-10 w-10 text-amber-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-4">
                      🧠 5. Giới hạn của AI
                    </h2>
                    <p className="text-lg text-slate-700 font-semibold mb-4">
                      AI không phải là nhà triết học – nó là người bạn đồng hành
                      triết học.
                    </p>
                    <p className="text-lg text-slate-700 mb-4">
                      Vì vậy, chúng tôi luôn nhắc nhở người học rằng:
                    </p>
                    <div className="space-y-3">
                      {[
                        "AI có thể giải thích và tổng hợp, nhưng không thể thay thế tư duy phản biện của con người.",
                        "AI có thể đưa ra gợi ý, nhưng sự hiểu biết thực sự phải đến từ quá trình tự chiêm nghiệm và học tập.",
                        "Các phản hồi của Triết học 4.0 được thiết kế để gợi mở, chứ không áp đặt chân lý.",
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold mt-1">
                            •
                          </span>
                          <p className="text-slate-700">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <Sparkles className="h-12 w-12 mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  🌍 6. Hướng đến tương lai
                </h2>
                <p className="text-xl mb-6">
                  Chúng tôi không chỉ phát triển một công cụ, mà là một phong
                  trào giáo dục nhân văn trong kỷ nguyên trí tuệ nhân tạo.
                </p>
                <p className="text-lg mb-4">
                  Triết học 4.0 mong muốn cùng cộng đồng giáo dục, giảng viên,
                  sinh viên và nhà nghiên cứu:
                </p>
                <div className="space-y-2 text-lg">
                  <p>✓ Xây dựng chuẩn mực AI học thuật tại Việt Nam</p>
                  <p>✓ Gắn kết triết học – công nghệ – con người</p>
                  <p>
                    ✓ Tạo ra một thế hệ sinh viên vừa có lý trí, vừa có nhân
                    cách, vừa có kỹ năng công nghệ
                  </p>
                </div>
                <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
                  <p className="text-2xl italic font-semibold">
                    "AI không làm thay, AI giúp ta nghĩ tốt hơn."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-slate-200">
              <CardContent className="p-8 md:p-12 text-center">
                <Mail className="h-16 w-16 mx-auto mb-6 text-blue-600" />
                <h2 className="text-3xl font-bold text-primary mb-4">
                  📜 7. Liên hệ và góp ý
                </h2>
                <p className="text-lg text-slate-700 mb-6">
                  Nếu bạn phát hiện nội dung sai lệch, thiếu chuẩn mực, hoặc
                  muốn đóng góp ý tưởng để AI phục vụ tri thức tốt hơn,
                </p>
                <p className="text-xl font-semibold text-slate-900 mb-4">
                  👉 Hãy gửi phản hồi về
                </p>
                <a
                  href="mailto:tranxuantin1234@gmail.com"
                  className="inline-block text-2xl font-bold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4"
                >
                  tranxuantin1234@gmail.com
                </a>
                <p className="text-slate-600 mt-6">
                  Chúng tôi luôn trân trọng mọi đóng góp để làm cho Triết học
                  4.0 ngày càng hoàn thiện và nhân văn hơn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
