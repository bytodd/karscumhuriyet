// Vercel Serverless Function — Yönetim Paneli Sunucu Taraflı Şifre Doğrulama
module.exports = function handler(req, res) {
  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, mesaj: 'Geçersiz istek yöntemi.' });
  }

  try {
    // İstek gövdesini güvenli şekilde ayrıştır
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { rol, sifre } = body;

    // Şifreler kaynak kodda değil, Vercel Environment Variables ayarlarında saklanır
    const adminSifre = process.env.ADMIN_SIFRE;
    const editorSifre = process.env.EDITOR_SIFRE;

    if (!adminSifre || !editorSifre) {
      return res.status(500).json({
        ok: false,
        mesaj: 'Vercel Environment Variables ayarlarında ADMIN_SIFRE veya EDITOR_SIFRE tanımlı değil.'
      });
    }

    // Yönetici (Tam Yetki) kontrolü
    if (rol === 'admin' && sifre === adminSifre) {
      return res.status(200).json({ ok: true, rol: 'admin' });
    }

    // Alt Kullanıcı / Editör (Sadece Odalar) kontrolü
    if (rol === 'editor' && sifre === editorSifre) {
      return res.status(200).json({ ok: true, rol: 'editor' });
    }

    return res.status(401).json({ ok: false, mesaj: 'Girilen şifre hatalı.' });
  } catch (error) {
    return res.status(400).json({ ok: false, mesaj: 'İstek verisi işlenemedi.' });
  }
};
