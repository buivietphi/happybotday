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
    name: 'KIỀU LEE',
    headline: 'Chúc mừng sinh nhật, KIỀU LEE!',
    outroWish:
      'Thổi nến, ước thật to, rồi cùng đón mừng món quà này nhé',
  },
  wishes: [
    {
      text:
        'Chúc mừng sinh nhật KIỀU LEE! Thêm một tuổi — thế giới thêm một phiên bản dễ thương hơn của em.',
    },
    {
      text:
        'Ước gì từng điều em thầm nói hôm nay đều thành hiện thực. Còn nếu chưa thành — anh sẽ cùng em làm cho nó thành.',
    },
    {
      text:
        'Cảm ơn em đã luôn kiên định, luôn ấm áp, luôn là phiên bản tốt nhất của chính mình. Hôm nay là ngày của em — tận hưởng nhé.',
    },
    {
      text:
        'Một tuổi mới đầy sức khỏe, đầy khoảnh khắc đáng nhớ, và đầy những bữa cơm ngon bên người thương.',
    },
    {
      text:
        'Em xứng đáng được hạnh phúc — không phải vì ai đó nói vậy, mà vì em đã nỗ lực cả năm qua. Giữ nguyên như thế nhé.',
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
  ],
  theme: {
    primary: '#e34d8c',    // hot magenta
    background: '#fff7e8', // cream
    textColor: '#1a0b2e',  // midnight plum
  },
};

export default validateSiteConfig(config);
