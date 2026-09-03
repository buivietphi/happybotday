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
      'Thổi nến, ước thật to, rồi bóc quà sinh nhật từ đứa bạn này nhé! 🎁',
  },
  wishes: [
    {
      text:
        'Chúc mừng sinh nhật Dẹo Dẹo! Chúc bạn tui thêm một tuổi mới luôn vui vẻ, rạng rỡ, tràn đầy năng lượng tích cực và ngày càng thành công nhé! 🎂🎉',
    },
    {
      text:
        'Chúc bạn tuổi mới tiền đầy túi, công việc hanh thông, mọi dự định đều thuận buồm xuôi gió. Lúc nào cần đồng bọn đi ăn đi quẩy cứ ới là có mặt ngay! 🛵💨',
    },
    {
      text:
        'Mong tuổi mới mang đến cho Dẹo Dẹo thật nhiều chuyến đi thú vị, những trải nghiệm tuyệt vời và ăn bao nhiêu món ngon cũng không sợ béo! 🍕🧋',
    },
    {
      text:
        'Cảm ơn vì đã luôn là một người bạn chí cốt cực kỳ tuyệt vời, luôn mang tiếng cười và sự ấm áp đến cho bạn bè xung quanh. Tình bạn của tụi mình mãi bền chặt nha! 🤝🌟',
    },
    {
      text:
        'Thêm tuổi mới bớt "dẹo" lại một xíu nha bạn hiền, cơ mà nếu không dẹo thì đâu còn là Dẹo Dẹo nữa! Cứ tự tin tỏa sáng theo cách riêng của mình nha! 😜💖',
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
