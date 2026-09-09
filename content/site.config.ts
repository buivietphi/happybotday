import type { SiteConfig } from '@/lib/types';
import { validateSiteConfig } from '@/lib/validate-config';

/**
 * Birthday greeting for Mỹ Hương — from her anh Phi.
 *
 * Relationship: anh Phi (gửi) ↔ em Mỹ Hương, bạn bè thân thiết — không phải
 * người yêu. Tone: vui tươi, chân thành, hơi hài hước — như cách hai người
 * bạn thân hay trêu nhau. Anti-romance rule: không ảnh hồng, không trái tim,
 * không ví von kiểu "trái chín", chỉ có tiệc sinh nhật + vòng quay may mắn.
 */
const config: SiteConfig = {
  recipient: {
    name: 'Mỹ Hương',
    headline: 'Chúc mừng sinh nhật, Mỹ Hương!',
    outroWish:
      'Chúc em Mỹ Hương tuổi mới công việc hanh thông, sức khỏe dồi dào, mọi dự định đều thuận lợi và lúc nào cũng tươi cười rạng rỡ! Cảm ơn em vì đã là một người bạn tuyệt vời của anh! Từ Anh Phi 🐜🎂',
  },
  wishes: [
    {
      text:
        'Chúc em Mỹ Hương sinh nhật vui vẻ nha! Tuổi mới chúc em sức khỏe dồi dào, công việc hanh thông, mọi dự án đều xuôi chèo mát mái và ngày càng tỏa sáng theo cách riêng của mình! 🎂🎉',
    },
    {
      text:
        'Mỹ Hương ơi — tuổi mới chúc em tiền vào như nước, công việc thăng tiến, deadline nào cũng xong trước deadline! Làm bạn với em là cái duyên của anh đó nha, nhớ giữ gìn sức khỏe nhiều vào! 🚀💪',
    },
    {
      text:
        'Mong tuổi mới mang đến cho em thật nhiều niềm vui, những chuyến đi thú vị, mấy bữa lẩu nướng với hội bạn và đủ thứ trà sữa em thích. Em xứng đáng được hưởng những điều tốt đẹp nhất! 🍕☕',
    },
    {
      text:
        'Mỹ Hương ơi, tuổi mới chúc em deadline xong sớm, cơm trưa team luôn đông vui, và mình còn được đi ăn uống cùng hội bạn thật nhiều lần nữa nha! Cứ giữ cái sự vui tính và nhiệt tình đó nha, đừng đổi! 🍱🎯',
    },
    {
      text:
        'Mỹ Hương ơi — tuổi mới cứ giữ nguyên cái sự đáng yêu, tinh nghịch và năng lượng tích cực đó nha! Tự tin là chính mình, tỏa sáng theo cách riêng của em là đủ rồi, đừng nghe ai nói khác nữa! 😄✨',
    },
  ],
  music: {
    kind: 'file',
    src: '/music/birthday.mp3',
    volume: 0.5,
    loop: true,
  },
  wheelPrizes: [
    { label: '1 Ly Trà Sữa Full Topping', emoji: '🧋' },
    { label: '1 Ly Cà Phê Sữa Đá', emoji: '☕' },
    { label: 'Đi Nhậu Cùng Anh Phi 🍻', emoji: '🍺' },
    { label: '1 Bữa Lẩu Nướng Hội Bạn', emoji: '🍲' },
    { label: '1 Bữa BBQ + Bia Tự Chọn', emoji: '🍖' },
    { label: 'Ăn Vặt Vỉa Hè Cùng Nhau', emoji: '🌭' },
    { label: '1 Suất Bún Đậu Mắm Tôm', emoji: '🍜' },
    { label: 'Cơm Trưa Team 1 Tuần', emoji: '🍱' },
    { label: 'Trà Sữa Size L × 4 Buổi', emoji: '🧋' },
    { label: '1 Buổi Karaoke Cùng Hội Bạn', emoji: '🎤' },
    { label: 'Đi Ăn Đêm Cùng Nhau', emoji: '🌙' },
    { label: 'Cà Phê Cuối Tuần × 4', emoji: '☕' },
    { label: 'Được Chọn Quán Ăn Tự Do', emoji: '🍴' },
    { label: 'Bắp Rang + Nước Xem Phim Hội Bạn', emoji: '🍿' },
  ],
  theme: {
    primary: '#e34d8c',    // hot magenta
    background: '#fff7e8', // cream
    textColor: '#1a0b2e',  // midnight plum
  },
};

export default validateSiteConfig(config);
