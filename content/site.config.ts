import type { SiteConfig } from '@/lib/types';
import { validateSiteConfig } from '@/lib/validate-config';

/**
 * Birthday greeting for KIỀU LEE.
 *
 * Mood: celebratory, festive — NOT romantic. The page is a birthday party:
 * cake with candles, balloons, confetti, six warm wishes, and a confetti finale.
 *
 * Anti-romance rule from design research:
 *   "If a stranger screenshots the page and thinks wedding/anniversary,
 *    it's a romantic leak."
 * So no rose palette, no heart motif, no "Mặt trái son trái nho" type
 * metaphors — only poly-chromatic party energy.
 *
 * Music: /music/birthday.mp3 — public-domain "Happy Birthday to You"
 * melody (US public domain since 2015; Good Morning to You Productions v.
 * Warner/Chappell). Recorded performance is CC BY-SA 3.0 (Wikimedia Commons).
 */
const config: SiteConfig = {
  recipient: {
    name: 'Dẹo Dẹo',
    headline: 'Chúc mừng sinh nhật, Dẹo Dẹo!',
    outroWish:
      'Chúc chị tuổi mới công việc thăng tiến, sức khỏe dồi dào, cuộc sống viên mãn và luôn tươi cười rạng rỡ mỗi ngày! Từ em Phi 🐜🎂',
  },
  wishes: [
    {
      text:
        'Chúc mừng sinh nhật chị Dẹo Dẹo! Chúc chị thêm một tuổi mới tràn đầy sức khỏe, mọi dự án đều hanh thông, sự nghiệp ngày càng thăng tiến rực rỡ nhé! 🎂🎉',
    },
    {
      text:
        'Chúc chị tuổi mới tiền đầy túi, KPI đạt vượt chỉ tiêu, sếp thưởng tấp nập! Làm việc cùng chị là một điều may mắn của em đó nha! 🚀💪',
    },
    {
      text:
        'Mong tuổi mới mang đến cho chị thật nhiều niềm vui, những chuyến đi thú vị và những bữa ăn trưa team ngon lành không kém. Chị xứng đáng được hưởng điều tốt nhất! 🍕☕',
    },
    {
      text:
        'Cảm ơn chị đã luôn hỗ trợ và chia sẻ nhiều kinh nghiệm quý giá. Làm việc có chị em cảm thấy yên tâm và học hỏi được nhiều lắm. Sinh nhật chị vui vẻ nhé! 🌟🤝',
    },
    {
      text:
        'Chị Dẹo Dẹo ơi — tuổi mới chúc chị vẫn giữ nguyên cái sự "dẹo" đáng yêu đó nha! Cứ tự tin là chính mình, tỏa sáng theo cách riêng của chị là đủ rồi! 😄✨',
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
    { label: '1 Ly Cà Phê Thơm Lừng', emoji: '☕' },
    { label: '1 Thỏi Son Môi Xinh Xắn', emoji: '💄' },
    { label: '1 Chiếc Đầm Xinh Tự Chọn', emoji: '👗' },
    { label: '1 Chiếc Áo Mới Tự Chọn', emoji: '👚' },
    { label: 'Vật phẩm Shopee tự chọn dưới 200k', emoji: '🛍️' },
    { label: 'Vật phẩm Shopee tự chọn dưới 500k', emoji: '🎁' },
    { label: 'Quà 200k Tiền Mặt', emoji: '💵' },
    { label: 'Ăn Tối Cùng Nhau', emoji: '🍽️' },
    { label: 'Được Đi Du Lịch Sài Gòn', emoji: '✈️' },
    { label: 'Vé Xem Phim Couple & Bắp Nước', emoji: '🎬' },
    { label: '1 Buổi Gội Đầu Dưỡng Sinh Thư Giãn', emoji: '💆‍♀️' },
    { label: '1 Bó Hoa Tươi Thơm Ngát', emoji: '💐' },
    { label: 'Làm Bộ Móng Mới Dưới 300k', emoji: '💅' },
  ],
  theme: {
    primary: '#e34d8c',    // hot magenta
    background: '#fff7e8', // cream
    textColor: '#1a0b2e',  // midnight plum
  },
};

export default validateSiteConfig(config);
